<template>
  <div>
    <div v-for="pos in positions" v-bind:key="pos.tokenAddress" class="flex flex-col gap-2">
      <h3>Add/Reference Existing NAV Illiquid Update</h3>
      <input v-model="pos.baseCurrencySpent" class="form-control deposit-input" placeholder="(Base Token Amount Spent), Ex: 10">
      <input v-model="pos.amountAquiredTokens" class="form-control deposit-input" placeholder="(NFT Amout Aquired), Ex: 1">
      <input v-model="pos.tokenAddress" class="form-control deposit-input" placeholder="(Token Address), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.isNFT" class="form-control deposit-input" placeholder="(Is NFT?), Ex: false">
      <input v-model="pos.otcTxHashes" class="form-control deposit-input" placeholder="(Comma Seperated List of Tx Hashs for OTC deal), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.nftType" class="form-control deposit-input" placeholder="(NFT Kind), Ex: ERC1155">
      <input v-model="pos.nftIndex" class="form-control deposit-input" placeholder="(NFT Index), Ex: 1">
      <input v-model="pos.pastNAVUpdateIndex" class="form-control deposit-input" placeholder="Reference Location in Past NAVIlliquidUpdate, Ex:0">
    </div>

    <pre>{{ positions }}</pre>
  </div>
</template>

<script>

/*
        struct NAVIlliquidUpdate {
          uint256 baseCurrencySpent;
          uint256 amountAquiredTokens;
          address tokenAddress;
          bool isNFT;
          string[] otcTxHashes;
          NAVNFTType nftType;
          uint256 nftIndex;
          uint256 pastNAVUpdateIndex;
        }
    */

export default {
  name: "AddIlliquidUpdate",
  props: ["positions"],

  components: { 
  },
}
</script>

<style>

</style>