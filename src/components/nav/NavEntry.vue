<template>

<div class="section-small">

  <div class="d-flex justify-content-between flex-wrap">
    <h3>Nav Update Entry</h3>
    <!-- Action button -->
    <div>
      <button @click="toggleForm" class="btn btn-success" v-if="!showForm">
        View
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-chevron-up" v-if="showForm"></i>
      </button>
      <button @click="toggleForm" class="btn btn-outline-success" v-if="showForm">
        Close
        <i class="fas fa-chevron-up"></i>
      </button>

      <span></span>
    </div>
  </div>

  <div v-if="showForm">
    <!------ Adding/reference LiquidUpdate ------>

    <div class="section-big row mt-4 mx-3" v-if="showLiq">
      <div class="col-md-12">
        <AddLiquidUpdate :positions="entry.liquidUpdates" />
        <span></span>
      </div>
      <button @click="addLiquidUpdate" class="btn btn-success">
        Add/Reference Liquid Update (GOV REQUIRED)
      </button>
    </div>

    <span></span>
    <span></span>

    <!------ Adding/ref iliquidUpdates ------>

    <div class="section-big row mt-4 mx-3" v-if="showIliq">
      <div class="col-md-12">
        <AddIlliquidUpdate :positions="entry.illiquidUpdates" />
        <span></span>
      </div>
      <button @click="addIlliquidUpdate" class="btn btn-success">
        Add/Reference Illiquid Update (GOV REQUIRED)
      </button>
    </div>

    <span></span>
    <span></span>

        <!------ Adding/Reference NftUpdate ------>

    <div class="section-big row mt-4 mx-3" v-if="showNft">
      <div class="col-md-12">
        <AddNftUpdate :positions="entry.nftUpdates" />
        <span></span>
      </div>
      <button @click="addNftUpdate" class="btn btn-success">
        Add/Reference Nft Update (GOV REQUIRED)
      </button>
    </div>

    <span></span>
    <span></span>

        <!------ Adding/Reference symbols ------>

    <div class="section-big row mt-4 mx-3" v-if="showComp">
      <div class="col-md-12">
        <AddComposableUpdate :positions="entry.composableUpdates" />
        <span></span>
      </div>
      <button @click="addComposableUpdate" class="btn btn-success">
        Add/Reference Composable Update (GOV REQUIRED)
      </button>
    </div>

    <span></span>
    <span></span>    
  </div>
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";

import AddLiquidUpdate from './AddLiquidUpdate.vue';
import AddIlliquidUpdate from './AddIlliquidUpdate.vue';
import AddNftUpdate from './AddNftUpdate.vue';
import AddComposableUpdate from './AddComposableUpdate.vue';


export default {
  name: "NavEntry",
  props: ["entry"],
  data() {
    return {
      showForm: false,
      showLiq: true,
      showIliq: true,
      showNft: true,
      showComp: true,
    }
  },

  components: { 
    AddLiquidUpdate,
    AddIlliquidUpdate,
    AddNftUpdate,
    AddComposableUpdate,
  },

  created() {
  },

  computed: {
    ...mapGetters("accounts", ["getWeb3"]),
  },

  watch: {
      entry: async function() {

        if (this.entry.liquidUpdate.length > 0) {
          this.showIliq = false;
          this.showNft = false;
          this.showComp = false;
        } else if (this.entry.illiquidUpdates.length > 0) {
          this.showLiq = false;
          this.showNft = false;
          this.showComp = false;
        } else if (this.entry.nftUpdates.length > 0) {
          this.showLiq = false;
          this.showIliq = false;
          this.showComp = false;
        } else if (this.entry.composableUpdates.length > 0) {
          this.showLiq = false;
          this.showIliq = false;
          this.showNft = false;
        }         
      },
  },

  methods: {
    toggleForm() {
      if (this.showForm) {
        this.showForm = false;
      } else {
        this.showForm = true;
      }
    },

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

    addLiquidUpdate: function () {
      this.entry.liquidUpdates.push({
        tokenPair: null,
        aggregatorAddress: null,
        functionSignatureWithEncodedInputs: null, 
        assetTokenAddress: null,
        nonAssetTokenAddress: null,
        isReturnArray: null,
        returnLength: null,
        returnIndex: null,
        pastNAVUpdateIndex: null
      });
    },

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

    addIlliquidUpdate: function () {
      this.entry.illiquidUpdates.push({
        baseCurrencySpent: null,
        amountAquiredTokens: null,
        tokenAddress: null, 
        isNFT: null,
        otcTxHashes: null,
        nftType: null,
        nftIndex: null,
        pastNAVUpdateIndex: null,
      });
    },

    /*
        struct NAVNFTUpdate {
          address oracleAddress;
          address nftAddress;
          NAVNFTType nftType;
          uint256 nftIndex;
          uint256 pastNAVUpdateIndex;
        
    */

    addNftUpdate: function () {
      this.entry.nftUpdates.push({
        oracleAddress: null,
        nftAddress: null,
        nftType: null, 
        nftIndex: null,
        pastNAVUpdateIndex: null,
      });
    },

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

    addComposableUpdate: function () {
      this.entry.composableUpdates.push({
        remoteContractAddress: null,
        functionSignatures: null,
        encodedFunctionSignatureWithInputs: null, 
        normalizationDecimals: null,
        isReturnArray: null,
        returnValIndex: null,
        returnArraySize: null,
        returnValType: null,
        pastNAVUpdateIndex: null
      });
    },

  }
}
</script>

<style>
.data-item {
  margin-right: 5px;
}

.div-flex {
  display: flex;
}

.fa-chevron-down, .fa-chevron-up {
  margin-left: 10px;
}

.show-form {
  margin-top: 24px;
}

.section-small {
  margin-top: 16px;
}

/* Mobile screens */
@media screen and (max-width: 600px) {
  .data-item {
    margin-right: 0px;
  }

  .div-flex {
    display: block;
  }
}
</style>