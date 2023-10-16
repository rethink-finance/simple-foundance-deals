/* eslint-disable */
<template>
  <div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MintFakeStablecoin from '../components/tokens/MintFakeTokens.vue';

export default {
  name: "PrepRoleMod",

  computed: {
    ...mapGetters("accounts", ["getWeb3", "getChainName", "isUserConnected"]),

  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
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
