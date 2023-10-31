/* eslint-disable */
<template>
  <div>

    <div>
      <h1>FundDAO: {{formattedFundSymbol}}({{formattedFundAddress.substring(0, 6)}}...{{formattedFundAddress.substring(38, 42)}})</h1>
    </div>



    <div class="section-big row mt-4 mx-3">

      <div class="col-md-9">
        <!------ Delegate Gov Tokens ------>
        <div class="section-big row mt-4 mx-3">
          <div class="col-md-12">
            <SetAddress :data="DelegateTo" />
            <span></span>
            <button @click="delegate" class="btn btn-success">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Delegate {{formattedFundSymbol}}
            </button>
          </div>
        </div>
        <span></span>
        <span></span>

        <FundDeposit :fund="getFundData" />

        <FundWithdraw :fund="getFundData" />
      </div>
    </div>

    <PrepRoleMod :fund="getFundData" />

    <MintFakeTokens v-if="getChainName === 'Kovan'" class="mb-5" />
    <MintFakeTokens v-if="getChainName === 'Mumbai'" class="mb-5" />
    <MintFakeTokens v-if="getChainName === 'Localhost'" class="mb-5" />
    <MintFakeTokens v-if="getChainName === 'Fuji'" class="mb-5" />
    <MintFakeTokens v-if="getChainName === 'Canto Testnet'" class="mb-5" />
    <MintFakeTokens v-if="getChainName === 'Goerli'" class="mb-5" />
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import SetAddress from '../components/gov/SetAddress.vue';
import MintFakeTokens from '../components/tokens/MintFakeTokens.vue';
import PrepRoleMod from '../components/gov/PrepRoleMod.vue';
import FundDeposit from '../components/fund/FundDeposit.vue';
import FundWithdraw from '../components/fund/FundWithdraw.vue';

export default {
  name: "ViewFund",

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("fundFactory", ["getFundFactoryContract", "getFunds"]),
    ...mapGetters("fund", ["getSelectedFundAddress", "getFundContract"]),

    getFundData(){
      console.log(this.getSelectedFundAddress);
      console.log(this.getFunds[fidx]);
      for (var fidx in this.getFunds){
        if (this.getFunds[fidx].fundAddress == this.getSelectedFundAddress) {
          this.fund = this.getFunds[fidx];
          return this.getFunds[fidx];
        }
      }
    },

    formattedFundSymbol() {
      if (this.fund.fundSymbol) {
        return this.fund.fundSymbol
      } else {
        return "N/A"
      }
    },

    formattedFundAddress() {
      if (this.fund.fundAddress) {
        return this.fund.fundAddress
      } else {
        return ""
      }
    },

    allowanceNeeded() {
      if (this.buyWith === "DAI") {
        return this.getFundDaiAllowance < this.getTotal;
      } else if (this.buyWith === "USDC") {
        return this.getFundUsdcAllowance < this.getTotal;
      } else if (this.buyWith === "BTC") {
        return this.getFundBtcAllowance < this.getTotal;
      } else if (this.buyWith === "ETH") {
        return this.getFundEthAllowance < this.getTotal;
      } else if (this.buyWith === "MATIC") {
        return this.getFundMaticAllowance < this.getTotal;
      } else if (this.buyWith === "AVAX") {
        return this.getFundAvaxAllowance < this.getTotal;
      }
      
      return false;
    },

    getTokenAddress() {
      if (this.buyWith === "DAI") {
        return this.getDaiAddress;
      } else if (this.buyWith === "USDC") {
        return this.getUsdcAddress;
      }
      return null;
    },

    getTotal() {
      return Number(this.selectedDepositAmount);
    },

    getUserTokenBalance() {
      if (this.buyWith === "DAI") {
        return this.getUserDaiBalance;
      } else if (this.buyWith === "USDC") {
        return this.getUserUsdcBalance;
      }
      return null;
    },

  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("fund/fetchContract");
  },

  components: {
    MintFakeTokens,
    PrepRoleMod,
    FundWithdraw,
    FundDeposit,
    SetAddress
  },

  data() {
    return {
      loading: false,
      fund: {},
      DelegateTo: {
        addr: null,
        desc: "Delegate Governance Token To Address"
      },
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),

    async delegate() {
      let component = this;
      if (component.fund.fundAddress != null) {
        component.loading = true;
        //  gov contract

        await component.getFundContract.methods.delegate(
          component.DelegateTo.addr
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("Delegation of Governance Tokens Succeeded");
          } else {
            component.$toast.error("The delegateTo tx has failed. Please contact the Rethink Finance support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the Rethink Finance support.");
        });
      }

    }

  }
}
</script>
