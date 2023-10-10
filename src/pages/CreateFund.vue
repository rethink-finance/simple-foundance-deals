/* eslint-disable */
<template>
  <!------ Create Fund ------>

  <div class="section-big row mt-4 mx-3">
    <div class="col-md-12">
      <FundInput :fund="fund" />
      <span></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FundInput from '../components/fund/FundInput.vue';

export default {
  name: "CreateFund",

  computed: {
    ...mapGetters("accounts", ["getChainName", "isUserConnected"]),

    isGoerli() {
      return this.getChainName == "Goerli";
    }
  },

  created() {
    // check if user has already confirmed the compliance modal (this modal is in Navbar)
    this.isCompliant = localStorage.getItem('isCompliant');
  },

  data() {
    return {
      fund: {
        depositFee: null,
        withdrawFee: null,
        performanceFee: null,//TODO: not imp 
        managementFee: null,
        performaceHurdleRateBps: null,//TODO: not imp 
        baseToken: "",
        allowedDepositAddrs: [],
        allowedManagers: [],
        governanceToken: "",
        fundName: "",
        fundSymbol: ""
      }
    }
  },

  components: {
    FundInput
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
  }
}
</script>
