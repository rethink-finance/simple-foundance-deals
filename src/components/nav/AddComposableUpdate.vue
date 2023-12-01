<template>
  <div>
    <div v-for="pos in positions" v-bind:key="pos.remoteContractAddress" class="flex flex-col gap-2">
      <h3>Add or Modify Existing Symbol </h3>
      <input v-model="pos.remoteContractAddress" class="form-control deposit-input" placeholder="(Remote Contract Address), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.functionSignatures" class="form-control deposit-input" placeholder="(Function Signatur), EX: getPositionValueInUSD(address,address,uint256)">
      <input v-model="pos.functionSignatureWithEncodedInputs" class="form-control deposit-input" placeholder="(Encoded Function Input Data)">
      <input v-model="pos.normalizationDecimals" class="form-control deposit-input" placeholder="(Decinals Used For Return Value), Ex: 18">
      <input v-model="pos.isReturnArray" class="form-control deposit-input" placeholder="(Are Values Returns in An array?), Ex: true">
      <input v-model="pos.returnValIndex" class="form-control deposit-input" placeholder="(Desired Index In Array), Ex: 2">
      <input v-model="pos.returnArraySize" class="form-control deposit-input" placeholder="(Size Of Array), Ex: 5">
      <input v-model="pos.returnValType" class="form-control deposit-input" placeholder="(Type Of Data Returned), Ex: UINT256">
      <input v-model="pos.pastNAVUpdateIndex" class="form-control deposit-input" placeholder="Reference Location in Past NAVComposableUpdate, Ex:0">
      <input v-model="pos.isNegative" class="form-control deposit-input" placeholder="The sign of the return value, Ex:false">

    </div>

    <pre>{{ positions }}</pre>
  </div>
</template>

<script>

    /*
        struct NAVComposableUpdate {
          address remoteContractAddress;
          string functionSignatures;
          bytes encodedFunctionSignatureWithInputs;
          uint256 normalizationDecimals;
          bool isReturnArray;
          uint256 returnValIndex;
          uint256 returnArraySize;
          NAVComposableUpdateReturnType returnValType;
          uint256 pastNAVUpdateIndex;
        }
    */

export default {
  name: "AddComposableUpdate",
  props: ["positions"],

  components: { 
  },
}
</script>

<style>

</style>