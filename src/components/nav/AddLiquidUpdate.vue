<template>
  <div>
    <div v-for="pos in positions" v-bind:key="pos.tokenPair" class="flex flex-col gap-2">
      <h3>Add/Reference Existing NAV Liquid Update </h3>
      <input v-model="pos.tokenPair" class="form-control deposit-input" placeholder="(Token Pair), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.aggregatorAddress" class="form-control deposit-input" placeholder="(Aggregator), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.functionSignatureWithEncodedInputs" class="form-control deposit-input" placeholder="(Encoded Function Input Data)">
      <input v-model="pos.assetTokenAddress" class="form-control deposit-input" placeholder="(Token Held In Safe), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.nonAssetTokenAddress" class="form-control deposit-input" placeholder="(Token2 Liquidity Agaisnt Token), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.isReturnArray" class="form-control deposit-input" placeholder="(Returns and Array?), Ex:false">
      <input v-model="pos.returnLength" class="form-control deposit-input" placeholder="(Size of return array), Ex:4">
      <input v-model="pos.returnIndex" class="form-control deposit-input" placeholder="(Desired Value if return array, zero indexed), Ex:1">
      <input v-model="pos.pastNAVUpdateIndex" class="form-control deposit-input" placeholder="Reference Location in Past NAVLiquidUpdate, Ex:0">

    </div>

    <pre>{{ positions }}</pre>
  </div>
</template>

<script>

    /*
      struct NAVLiquidUpdate {
        address tokenPair;
        address aggregatorAddress;
        bytes functionSignatureWithEncodedInputs;
        address assetTokenAddress;
        address nonAssetTokenAddress;
        bool isReturnArray;
        uint256 returnLength;
        uint256 returnIndex;
        uint256 pastNAVUpdateIndex;
      }
    */

export default {
  name: "AddLiquidUpdate",
  props: ["positions"],

  components: { 
  },
}
</script>

<style>

</style>