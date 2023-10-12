/* eslint-disable */
<template>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "UpdateFundNAV",

  computed: {
    ...mapGetters("accounts", ["getWeb3", "getChainName", "isUserConnected"]),

    isGoerli() {
      return this.getChainName == "Goerli";
    }
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$store.dispatch("fundFactory/fetchContract");
    }
  },

  data() {
    return {
      isCompliant: null
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
  }
}
</script>
