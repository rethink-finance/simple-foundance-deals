/* eslint-disable */
<template>
  <div>

    <div>
      <h1>FundDAO: {{formattedFundSymbol}}({{formattedFundAddress.substring(0, 6)}}...{{formattedFundAddress.substring(38, 42)}})</h1>
    </div>



    <div class="section-big row mt-4 mx-3">

      <div class="col-md-9">
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
import MintFakeTokens from '../components/tokens/MintFakeTokens.vue';
import PrepRoleMod from '../components/gov/PrepRoleMod.vue';
import FundDeposit from '../components/fund/FundDeposit.vue';
import FundWithdraw from '../components/fund/FundWithdraw.vue';

export default {
  name: "ViewFund",

  computed: {
    ...mapGetters("accounts", ["getWeb3", "getChainName", "isUserConnected"]),
    ...mapGetters("fundFactory", ["getFundFactoryContract", "getFunds"]),
    ...mapGetters("fund", ["getSelectedFundAddress"]),

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
  },

  components: {
    MintFakeTokens,
    PrepRoleMod,
    FundWithdraw,
    FundDeposit
  },

  data() {
    return {
      loading: false,
      fund: {}
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),

    async approveAllowance() {
      let component = this;
      component.loading = true;
      component.getOptionPrice(); // refresh the option price
      // define unit and token contract
      let unit = "ether"; // Exchange Balance & DAI - 18 decimals
      let tokenContract = component.getOptionsExchangeContract; // Exchange Balance contract
      if (component.buyWith === "USDT") {
        unit = "kwei"; // USDT (Tether) - 4 decimals
        // TODO: tokenContract = ...; // USDT contract
      }
      if (component.buyWith === "USDC") {
        unit = "mwei"; // USDC - 6 decimals
        tokenContract = component.getUsdcContract; // USDC contract
      }
      if (component.buyWith === "DAI") {
        tokenContract = component.getDaiContract; // DAI contract
      }
      // define allowance value
      let allowanceValue = component.getTotal * 1.05; // make it 5% bigger to avoid slippage issues
      if (component.unlimitedApproval) {
        allowanceValue = 10 ** 9; // 1B tokens as "unlimited" value
      }
      const allowanceValueWei = component.getWeb3.utils.toWei(String(allowanceValue.toFixed(4)), unit); // round to 4 decimals
      
      // call the approve method
      try {
        await tokenContract.methods.approve(component.option.poolAddr, allowanceValueWei).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("The approval was successfull. You can buy the option now.");
            // refresh values
            if (component.buyWith === "DAI") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.dai.lpAllowance = allowanceValue;
            } else if (component.buyWith === "USDC") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.usdc.lpAllowance = allowanceValue;
            } else if (component.buyWith === "USDT") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              // component.$store.state.tether.lpAllowance = allowanceValue;
            } else if (component.buyWith === "Exchange Balance") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.optionsExchange.userExchangeBalanceAllowance = allowanceValue;
            }
            component.getOptionPrice(); // refresh the option price
            
          } else {
            component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
          }
        }).on('error', function(error){
          console.log(error);
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } catch (e) {
          window.console.log("Error:", e);
          component.$toast.error("The transaction has been reverted. Please try again or contact DeFi Options support.");
      } finally {
        component.loading = false;
      }
    },

  }
}
</script>
