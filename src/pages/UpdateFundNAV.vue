/* eslint-disable */
<template>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "UpdateFundNAV",

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
      isCompliant: null
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
  }
}
</script>
