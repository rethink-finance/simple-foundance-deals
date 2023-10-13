/* eslint-disable */
<template>

<div class="section-big row mt-4 mx-3">
  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <div class="col-md-12">
    <FundToggle :fund="getFunds" />
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
    ...mapGetters("fundFactory", ["getFundFactoryContract", "getFunds"]),
  },

  created() {
      this.$store.dispatch("fundFactory/fetchFunds");
  },

  data() {
    return {
      loading: false
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
  }
}
</script>
