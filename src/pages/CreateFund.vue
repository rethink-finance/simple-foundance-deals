/* eslint-disable */
<template>
  <!------ Create Fund ------>

  <div class="section-big row mt-4 mx-3">
    <div class="col-md-12">
      <FundInput :fund="fund" :governor="governor"/>
      <span></span>
    </div>
    <div class="fund-submit-buttons">
      <button @click="createFund" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create Fund
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FundInput from '../components/fund/FundInput.vue';

export default {
  name: "CreateFund",

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("fundFactory", ["getFundFactoryContract"]),
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
  },

  data() {
    return {
      loading: false,
      fund: {
        depositFee: null,
        withdrawFee: null,
        //performanceFee: null,//TODO: not imp 
        managementFee: null,
        //performaceHurdleRateBps: null,//TODO: not imp 
        baseToken: "",
        allowedDepositAddrs: "",
        allowedManagers: "",
        governanceToken: "0x0000000000000000000000000000000000000000",
        fundName: "",
        fundSymbol: ""
      },
      governor: {
        quorumFraction: null,
        lateQuorum: null,
        votingDelay: null,
        votingPeriod: null
      }
    }
  },

  components: {
    FundInput
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
    validateFund(obj) {
      if(obj.depositFee == null) return false;
      if(obj.withdrawFee == null) return false;
      //if(obj.performanceFee == null) return false;//TODO: not imp 
      if(obj.managementFee == null) return false;
      //if(obj.performaceHurdleRateBps == null) return false;//TODO: not imp 
      if(obj.baseToken.length == 0) return false;
      if(obj.allowedManagers.length == 0) return false;
      if(obj.fundName.length == 0) return false;
      if(obj.fundSymbol.length == 0) return false;
      return true;
    },
    validateGovernor(obj) {
      if(obj.quorumFraction == null) return false;
      if(obj.lateQuorum == null) return false;
      if(obj.votingDelay == null) return false;
      if(obj.votingPeriod == null) return false;
      return true;
    },
    async createFund () {
      let component = this;
      component.loading = true;
      /*
        struct Settings {
            uint256 depositFee;
            uint256 withdrawFee;
            uint256 performanceFee;//TODO: not imp 
            uint256 managementFee;
            uint256 performaceHurdleRateBps;//TODO: not imp 
            address baseToken;
            address safe; 
            bool isExternalGovTokenInUse;
            bool isWhitelistedDeposits;
            address[] allowedDepositAddrs;
            address[] allowedManagers;
            address governanceToken;
            address governor;
            address fundAddress;//TODO: this may not be needed if delegatecall has balance refs to callee addr
            string fundName;
            string fundSymbol;
          }
      */
      if (component.validateFund(component.fund) && component.validateGovernor(component.governor)) {
        await component.getFundFactoryContract.methods.createFund(
          [
            parseInt(component.fund.depositFee),
            parseInt(component.fund.withdrawFee),
            0,//performanceFee bps
            parseInt(component.fund.managementFee),
            0,//performaceHurdleRateBps bps
            component.fund.baseToken,
            "0x0000000000000000000000000000000000000000",
            false,//false
            false,//false
            component.fund.allowedDepositAddrs.split(",").filter((val) => (val != "") ? true :  false),
            component.fund.allowedManagers.split(",").filter((val) => (val != "") ? true :  false),
            component.fund.governanceToken,
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000",
            component.fund.fundName,
            component.fund.fundSymbol
          ],
          [
            parseInt(component.governor.quorumFraction),
            parseInt(component.governor.lateQuorum),
            parseInt(component.governor.votingDelay),
            parseInt(component.governor.votingPeriod),
          ]
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
            component.$toast.success("Create Fund transaction was successfull.");
            
          } else {
            component.$toast.error("The Create Fund tx has failed. Please contact the Rethink Finance community for support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the Rethink Finance community for support.");
        });
      }
    },
  }
}
</script>
