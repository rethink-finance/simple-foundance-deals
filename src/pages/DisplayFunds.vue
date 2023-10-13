/* eslint-disable */
<template>

<div class="section-big row mt-4 mx-3">
  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <div class="col-md-12">
    <FundToggle :funds="filteredFunds" />
  </div>
</div>

</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FundToggle from '../components/fund/FundToggle.vue';


export default {
  name: "DisplayFund",

  components: {
    FundToggle
  },

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("fundFactory", ["getFundFactoryContract", "getFunds"]),
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
    this.$store.dispatch("fundFactory/fetchFunds");
    this.getFilteredFunds();
  },

  data() {
    return {
      loading: false,
      filteredFunds: []
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
    async getFilteredFunds(){
      this.filteredFunds = this.getFunds;
      console.log(this.filteredFunds);
    }
  }
}
</script>
