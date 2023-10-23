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
      NAVNFTType: {
        "ERC1155": 0,
        "ERC721": 1,
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
    ...mapGetters("fund", ["getSelectedFundAddress"]),

    getFundData(){
      console.log(this.getSelectedFundAddress);
      console.log(this.getFunds[fidx]);
      for (var fidx in this.getFunds){
        if (this.getFunds[fidx].fundAddress == this.getSelectedFundAddress) {
          this.fund = this.getFunds[fidx];
          return this.getFunds[fidx];
        }
      }
    },

  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

  },

  methods: {

    addNavUpdateEntry: function (){
        this.navUpdateEntries.push({
          index: this.entryIdx++,
          liquidUpdates: [],
          iliquidUpdates: [],
          nftUpdates: [],
          composableUpdates: []
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

    async createProposal () {
      let component = this;
      component.loading = true;

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
        }

      */

      let addLiquidUpdateAbiJSON = component.getFundAbi[8];
      let addIlliquidUpdateAbiJSON = component.getFundAbi[33];
      let addNftUpdateAbiJSON = component.getFundAbi[32];
      let addComposableUpdateAbiJSON = component.getFundAbi[32];

      let encodedDataLiquid = [];
      let encodedDataIlliquid = [];
      let encodedDataNFT = [];
      let encodedDataComposeable = [];

      //encode all liquid, push back onto NavUpdateEntry
      if (component.validateObj(component.liquidUpdates)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
            ]//[buyStock * (10**EXCHG['decimals']),sellStock * (10**EXCHG['decimals']), spreadPercent * (10**7)]

          ];
          encodedDataLiquid.push(
            component.getWeb3.eth.abi.encodeFunctionCall(addLiquidUpdateAbiJSON, parameters)
          );
        }
      }

      //encode all illiquid, push back onto NavUpdateEntry
      if (component.validateObj(component.illiquidUpdate)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
            ]//[buyStock * (10**EXCHG['decimals']),sellStock * (10**EXCHG['decimals']), spreadPercent * (10**7)]

          ];
          encodedDataIlliquid.push(
            component.getWeb3.eth.abi.encodeFunctionCall(addIlliquidUpdateAbiJSON, parameters)
          );
        }
      }

      //encode all nfts, push back onto NavUpdateEntry
      if (component.validateObj(component.nftUpdates)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
            ]//[buyStock * (10**EXCHG['decimals']),sellStock * (10**EXCHG['decimals']), spreadPercent * (10**7)]

          ];
          encodedDataNFT.push(
            component.getWeb3.eth.abi.encodeFunctionCall(addNftUpdateAbiJSON, parameters)
          );
        }
      }

      //encode all composable, push back onto NavUpdateEntry
      if (component.validateObj(component.composableUpdates)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
            ]//[buyStock * (10**EXCHG['decimals']),sellStock * (10**EXCHG['decimals']), spreadPercent * (10**7)]

          ];
          encodedDataComposeable.push(
            component.getWeb3.eth.abi.encodeFunctionCall(encodedDataComposeable, parameters)
          );
        }
      }

      const rethinkFundGovernorContract = new component.getWeb3.eth.Contract(
        RethinkFundGovernorJSON.abi,
        component.fundAddress
      );

      //proposae nav update for fund (target: fund addr, payloadL bytes)
      await rethinkFundGovernorContract.methods.propose(
        deployPoolManagmentProposal.options.address,
        component.getSelectedPoolAddress,
        2, //enum Quorum { SIMPLE_MAJORITY, TWO_THIRDS, QUADRATIC } 0,1,2
        1, //enum VoteType {PROTOCOL_SETTINGS, POOL_SETTINGS, ORACLE_SETTINGS} 0,1,2
        Number(Math.floor(Date.now() / 1000) + (60 * 60)) //30 min to vote
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
          component.$toast.error("The register proposal tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
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
