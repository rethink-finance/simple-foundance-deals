<template>
  <div class="pool-management-body-text-color">

    <h1> Current Fund: ({{getSelectedFundAddress.substring(0, 6)}}...{{getSelectedFundAddress.substring(38, 42)}})</h1>

    <NavEntryList :entries="navUpdateEntries"/>

    <div class="pool-submit-buttons">

      <button @click="addNavUpdateEntry" class="btn btn-success">
        Add NAV Update Entry
      </button>
    </div>

    <div class="pool-submit-buttons">
      <button @click="createProposal" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create and Register Proposal
      </button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NavEntryList from '../components/nav/NavEntryList.vue';

import addresses from "../contracts/addresses.json";
import RethinkFundGovernorJSON from "../contracts/RethinkFundGovernor.json";

export default {
  name: 'UpdateFundNAV',
  data() {
    return {
      loading: false,
      fund: {},
      entryIdx: 0,
      BOOL_TYPE: {
        "true": true,
        "false": false
      },
      PastNAVUpdateMap: {
        "true": true,
        "false": false
      },
      NAVNFTType: {
        "ERC1155": 0,
        "ERC721": 1,
        "NONE": 2
      },
      NAVComposableUpdateReturnType: {
        "UINT256": 0,
        "INT256": 1,
      },
      NavUpdateType: {
        "NAVLiquidUpdateType": 0,
        "NAVIlliquidUpdateType": 1,
        "NAVNFTUpdateType": 2,
        "NAVComposableUpdateType": 3
      },
      navUpdateEntries: []
    }
  },
  components: {
    NavEntryList
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("fundFactory", ["getFundFactoryContract", "getFunds"]),
    ...mapGetters("fund", ["getSelectedFundAddress", "getFundAbi", "getFundContract"]),

    

  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
    this.$store.dispatch("fund/fetchContract");
    this.getFundData()
    
    for (var i in this.getFundAbi) {
      console.log(i + " " + JSON.stringify(this.getFundAbi[i]));
    }

  },

  methods: {
    getFundData(){
      console.log(this.getSelectedFundAddress);
      for (var fidx in this.getFunds){
        if (this.getFunds[fidx].fundAddress == this.getSelectedFundAddress) {
          this.fund = this.getFunds[fidx];
          console.log(this.getFunds[fidx]);
          return this.getFunds[fidx];
        }
      }
    },

  /*
    struct NavUpdateEntry {
      NavUpdateType entryType;
      NAVLiquidUpdate[] liquid;
      NAVIlliquidUpdate[] illiquid;
      NAVNFTUpdate[] nft;
      NAVComposableUpdate[] composable;
      bool isPastNAVUpdate;
      uint256 pastNAVUpdateIndex;
      uint256 pastNAVUpdateEntryIndex;
      string description;
    }

  */

    addNavUpdateEntry: function (){
        this.navUpdateEntries.push({
          index: this.entryIdx++,
          liquidUpdates: [],
          illiquidUpdates: [],
          nftUpdates: [],
          composableUpdates: [],
          entryType: null, //auto set based on what is clicked
          isPastNAVUpdate: null,
          pastNAVUpdateIndex: null,
          pastNAVUpdateEntryIndex: null,
          description: "",
        })
    },

    

    validateObj(obj) {
      if (obj.length == 0)
        return false;

      for (let i =0; i < obj.length; i++) {
        for (const key in obj[i]) {
          if (obj[i][key] === null) {
            return false;
          }
        }
      }

      return true;
    },

    prepNAVLiquidUpdate(liquidUpdates) {
      let data = [];
      for(let i=0; i<liquidUpdates.length; i++) {
        let parameters = [
          liquidUpdates[i].tokenPair,
          liquidUpdates[i].aggregatorAddress,
          liquidUpdates[i].functionSignatureWithEncodedInputs, 
          liquidUpdates[i].assetTokenAddress,
          liquidUpdates[i].nonAssetTokenAddress,
          this.BOOL_TYPE[liquidUpdates[i].isReturnArray],
          parseInt(liquidUpdates[i].returnLength),
          parseInt(liquidUpdates[i].returnIndex),
          parseInt(liquidUpdates[i].pastNAVUpdateIndex)
        ];
        data.push(parameters);
      }
      return data;
    },

    prepNAVIlliquidUpdate(illiquidUpdates) {
      let data = [];

      for(let i=0; i<illiquidUpdates.length; i++) {
        let hashes = illiquidUpdates[i].otcTxHashes.split(",");
        console.log(this.NAVNFTType);
        console.log(illiquidUpdates[i].nftType);
        console.log(this.NAVNFTType[illiquidUpdates[i].nftType]);
        let parameters = [
          String((Number(illiquidUpdates[i].baseCurrencySpent) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})), //price * 10 ** 18 TODO: need to use base currency decimals
          parseInt(illiquidUpdates[i].amountAquiredTokens),
          illiquidUpdates[i].tokenAddress,
          this.BOOL_TYPE[illiquidUpdates[i].isNFT], 
          hashes.filter((val) => (val != "") ? true :  false),
          this.NAVNFTType[illiquidUpdates[i].nftType],
          parseInt(illiquidUpdates[i].nftIndex),
          parseInt(illiquidUpdates[i].pastNAVUpdateIndex)
        ];
        data.push(parameters);
      }
      return data;
    },

    prepNAVNFTUpdate(nftUpdates) {
      let data = [];
      for(let i=0; i<nftUpdates.length; i++) {
        let parameters = [
          nftUpdates[i].oracleAddress,
          nftUpdates[i].nftAddress,
          this.NAVNFTType[nftUpdates[i].nftType],
          parseInt(nftUpdates[i].nftIndex),
          parseInt(nftUpdates[i].pastNAVUpdateIndex)
        ];
        data.push(parameters);
      }
      return data;
    },

    prepNAVComposableUpdate(composableUpdates) {
      let data = [];
      for(let i=0; i<composableUpdates.length; i++) {
        let parameters = [
          composableUpdates[i].remoteContractAddress,
          composableUpdates[i].functionSignatures,
          composableUpdates[i].encodedFunctionSignatureWithInputs, 
          parseInt(composableUpdates[i].normalizationDecimals),
          this.BOOL_TYPE[composableUpdates[i].isReturnArray],
          parseInt(composableUpdates[i].returnValIndex),
          parseInt(composableUpdates[i].returnArraySize),
          this.NAVComposableUpdateReturnType[composableUpdates[i].returnValType],
          parseInt(composableUpdates[i].pastNAVUpdateIndex),
          this.BOOL_TYPE[composableUpdates[i].isNegative],
        ];
        data.push(parameters);
      }
      return data;
    },

    async createProposal () {
      let component = this;
      component.loading = true;

      /*
      let addLiquidUpdateAbiJSON = component.getFundAbi[8];
      let addIlliquidUpdateAbiJSON = component.getFundAbi[33];
      let addNftUpdateAbiJSON = component.getFundAbi[32];
      let addComposableUpdateAbiJSON = component.getFundAbi[32];
      */
      let addNavUpdateEntryAbiJSON = component.getFundAbi[52];
      let collectFeesAbiJSON = component.getFundAbi[20];

      let dataNavUpdateEntries = [];

      //encode all liquid, push back onto NavUpdateEntry
      if (component.validateObj(component.navUpdateEntries)) {
        for(let i=0; i<component.navUpdateEntries.length; i++) {
          let parameters = [
            component.NavUpdateType[component.navUpdateEntries[i].entryType],
            component.prepNAVLiquidUpdate(
              component.navUpdateEntries[i].liquidUpdates
            ),//NAVLiquidUpdate[] liquid;
            component.prepNAVIlliquidUpdate(
              component.navUpdateEntries[i].illiquidUpdates
            ),//NAVIlliquidUpdate[] illiquid;
            component.prepNAVNFTUpdate(
              component.navUpdateEntries[i].nftUpdates
            ),//NAVNFTUpdate[] nft;
            component.prepNAVComposableUpdate(
              component.navUpdateEntries[i].composableUpdates
            ),//NAVComposableUpdate[] composable;
            component.PastNAVUpdateMap[component.navUpdateEntries[i].isPastNAVUpdate],
            parseInt(component.navUpdateEntries[i].pastNAVUpdateIndex),
            parseInt(component.navUpdateEntries[i].pastNAVUpdateEntryIndex),
            component.navUpdateEntries[i].description
          ];

          dataNavUpdateEntries.push(
            parameters
          );
        }
      }

      console.log(JSON.stringify(dataNavUpdateEntries));
      console.log(addNavUpdateEntryAbiJSON);
      let encodedDataNavUpdateEntries = component.getWeb3.eth.abi.encodeFunctionCall(addNavUpdateEntryAbiJSON, [dataNavUpdateEntries]);

      console.log(component.fund.governor);
      console.log(component.getSelectedFundAddress);
      console.log(component.getActiveAccount);

      const rethinkFundGovernorContract = new component.getWeb3.eth.Contract(
        RethinkFundGovernorJSON.abi,
        component.fund.governor
      );

      let navUpdateIndex = await component.getFundContract.methods._navUpdateLatestIndex().call();

      /*

        function propose(
          address[] memory targets,
          uint256[] memory values,
          bytes[] memory calldatas,
          string memory description
      ) 
        */

      /*  
        TODO:
           insert calls for claiming fees, need a way to check if claiming fees will error out? dont let function error out by returning early?

           let encodedCollectFlowFeesAbiJSON = component.getWeb3.eth.abi.encodeFunctionCall(collectFeesAbiJSON, [0]);
           let encodedCollectManagerFeesAbiJSON = component.getWeb3.eth.abi.encodeFunctionCall(collectFeesAbiJSON, [2]);
           let encodedCollectPerformanceFeesAbiJSON = component.getWeb3.eth.abi.encodeFunctionCall(collectFeesAbiJSON, [3]);
      */

      //proposae nav update for fund (target: fund addr, payloadL bytes)
      await rethinkFundGovernorContract.methods.propose(
        [component.getSelectedFundAddress],
        [0],
        [encodedDataNavUpdateEntries],
        "NAV UPDATE: #" + String(navUpdateIndex)
      ).send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
      }).on('receipt', function(receipt){
        console.log(receipt);
        if (receipt.status) {
          component.$toast.success("Register the proposal transactions was successfull. You can now vote on the proposal in the pool governance page.");
          
        } else {
          component.$toast.error("The register proposal tx has failed. Please contact the Rethink Finance support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the Rethink Finance support.");
      });

    },
  }
}
</script>

<style scoped>
.pool-submit-buttons {
  padding: 20px 20px !important;
}
.pool-management-body-text-color {
  color: #48cc8c;
}
</style>
