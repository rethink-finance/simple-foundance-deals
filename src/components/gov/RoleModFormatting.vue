<template>
  <div>
    <div v-for="tx in transactions" v-bind:key="tx.idx" class="flex flex-col gap-2">
      <h3>Add or Modify Existing Symbol </h3>
      <textarea v-model="tx.data" class="form-control deposit-input" placeholder="(Raw Tx Bytes), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52"></textarea>
    </div>

    <div class="pool-submit-buttons">
      <button @click="formatRoleMods" class="btn btn-success">
        Format Role Mods
      </button>
    </div>

    <pre>{{ processedTxs }}</pre>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SafeMultiSendJSON from "../../contracts/safe/SafeMultiSend.json";

export default {
  name: "RoleModFormatting",
  props: ["transactions"],

  data() {
    return {
      processedTxs: []
    }
  },

  components: { 
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
  },

  computed: {
        ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
  },

  methods: {
    formatRoleMods(){
      let multisendAbiJSON = SafeMultiSendJSON.abi[0];
      this.processedTxs = []
      for (var tx in this.transactions){
        let filteredTx = this.getWeb3.eth.abi.encodeFunctionCall(multisendAbiJSON, [this.transactions[tx].data]);
        this.processedTxs.push(filteredTx);
      }
    }
  }
}
</script>

<style>

</style>