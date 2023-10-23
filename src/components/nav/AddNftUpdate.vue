<template>
  <div>
    <div v-for="pos in positions" v-bind:key="pos.oracleAddress" class="flex flex-col gap-2">
      <h3>Add/Reference Existing NAV NFT Update</h3>
      <input v-model="pos.oracleAddress" class="form-control deposit-input" placeholder="(Feed Address), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.nftAddress" class="form-control deposit-input" placeholder="(NFT Address), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.nftType" class="form-control deposit-input" placeholder="(NFT Kind), Ex: 1155">
      <input v-model="pos.nftIndex" class="form-control deposit-input" placeholder="(NFT Index), Ex: 1">
      <input v-model="pos.pastNAVUpdateIndex" class="form-control deposit-input" placeholder="Reference Location in Past NAVNFTUpdate, Ex:0">

    </div>

    <pre>{{ positions }}</pre>
  </div>
</template>

<script>

    /*
        struct NAVNFTUpdate {
          address oracleAddress;
          address nftAddress;
          NAVNFTType nftType;
          uint256 nftIndex;
          uint256 pastNAVUpdateIndex;
        
    */

export default {
  name: "AddNftUpdate",
  props: ["positions"],

  components: { 
  },
}
</script>

<style>

</style>