/* eslint-disable */
<template>

  <div>

    <!------ List DAOS ------>

    <!------ <div class="deposit-button form-button-mobile">
      <button 
        class="btn btn-success btn-user btn-block text-uppercase form-control" @click="getDaos">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Get Daos
      </button>
      <div></div>
    </div>  ------>


    <div class="token-dropdown form-button-mobile">
      <div class="btn-group" aria-describedby="button-text">
        <h3>Select DAO Addr: </h3>
        <button type="button" class="btn btn-outline-success dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
          {{selectedDAO}}
        </button>
        <ul class="dropdown-menu">
          <li v-for="dao in daos" v-bind:key="dao">
            <span class="dropdown-item text-uppercase" @click="getCrowdfundingIDs">{{ dao }}</span>
          </li>
        </ul>
      </div>
    </div>


    <!------ List DAO DEALS------>

    <div class="token-dropdown form-button-mobile">
      <div class="btn-group" aria-describedby="button-text">
        <h3>Select DAO CrowdFunding ID: </h3>
        <button type="button" class="btn btn-outline-success dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
          {{selectedDeal}}
        </button>
        <ul class="dropdown-menu">
          <li v-for="daoCid in daoCids" v-bind:key="daoCid">
            <span class="dropdown-item text-uppercase" @click="changeDaoCid">{{ daoCid }}</span>
          </li>
        </ul>
      </div>
    </div>


    <!------ Approve Foundace CrowdFundingAdapter Contract------>

    <div class="deposit-button form-button-mobile">
      <button 
        class="btn btn-success btn-user btn-block text-uppercase form-control" @click="approveAllowance">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Approve CrowdFundingAdapter Contract
      </button>
      <div></div>
    </div>

    <!------ Create Deal ------>

    <div class="section-big row mt-4 mx-3">
      <div class="section-big row mt-4 mx-3">
        <h3> Selected DAO: </h3>
        <pre style="color:#fff">{{ selectedDAO }}</pre>
      </div>

      <div class="section-big row mt-4 mx-3">
        <h3> Selected CrowdFunding ID:</h3>  
        <pre style="color:#fff">{{ selectedDeal }}</pre>
      </div>
      
      <div class="section-big row mt-4 mx-3">
        <h3> Selected CrowdFunding ID Terms: </h3> 
        <pre style="color:#fff">{{ selectedDAOSettings }}</pre>
      </div>
      
      <div class="section-big row mt-4 mx-3">
        <h3> Crowd Funding Amount:</h3>
        <div class="col-md-12">
          <input type="text" v-model="quoteAssetContributionAmount" class="form-control deposit-input" placeholder="1000.0" aria-describedby="depositText">
        </div>
        <div class="fund-submit-buttons">
          <button @click="actContributeCrowdFunding" class="btn btn-success">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Execute Token Swap
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ethers } from "ethers";
import DaoRegistryJSON from "../contracts/DaoRegistry.json";
import ICrowdFundingExtensionJSON from "../contracts/ICrowdFundingExtension.json";


const getCrowdFundingConfigABI = ICrowdFundingExtensionJSON.abi.find(
  func => func.name === "getCrowdFundingConfig" && func.type === "function",
);


export default {
  name: "CreateDeal",

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("usdc", ["getUserUsdcBalance", "getUsdcContract", "getFundUsdcAllowance"]),
    ...mapGetters("fundFactory", ["getFoundanceFactoryContract", "getCrowdFundingAdapterContract", "getCrowdFundingAdapterAddress"]),
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
    this.getDaos();
  },

  data() {
    return {
      loading: false,
      selectedDAO: null,
      selectedDAOCfeAddr: null,
      selectedDAOSettings: null,
      selectedDeal: null,
      quoteAssetContributionAmount: null,
      daos: [],
      daoCids: []
    }
  },

  components: {},

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),

    async changeDaoCid(event) {
      this.selectedDeal = event.srcElement.textContent;
      this.getCrowdFundingConfig();
    },

    async getDaos() {
      if (this.daos.length === 0) {
        let daos = await this.getFoundanceFactoryContract.methods.getDaoAddresses().call();
        this.daos = daos;
      }
    },

    async getCrowdfundingIDs(event) {

      const dao = event.srcElement.textContent;
      console.log(dao);
      this.selectedDAO = dao;

      /*

        dao_cfe_addr = dao.functions.getExtensions(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("crowd-funding-ext"))).call()
        print("dao cfe addr", dao_cfe_addr)

        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("crowd-funding-ext"))

        cfe = w3.eth.contract(abi=ICrowdFundingExtensionContract["abi"], address=Web3.to_checksum_address(dao_cfe_addr))


        print("cfe ids", [w3.to_hex(x) for x in cfe.functions.getCrowdFundingIds().call()])


      */



      if (dao !== null) {

        const daoRegisitryContract = await new this.getWeb3.eth.Contract(DaoRegistryJSON.abi, dao);

        const dao_cfe_addr = await daoRegisitryContract.methods.getExtensions(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("crowd-funding-ext"))).call();
        this.selectedDAOCfeAddr = dao_cfe_addr;

        const crowdFundingExtensionContract = await new this.getWeb3.eth.Contract(ICrowdFundingExtensionJSON.abi, dao_cfe_addr);

        const daos = await crowdFundingExtensionContract.methods.getCrowdFundingIds().call();
        this.daoCids = daos;
      }
    },

    async getCrowdFundingConfig() {

      if((this.selectedDAO !== null) && (this.selectedDAOCfeAddr !== null)){
        
        const crowdFundingExtensionContract = await new this.getWeb3.eth.Contract(ICrowdFundingExtensionJSON.abi, this.selectedDAOCfeAddr);
        const daoSettings = await crowdFundingExtensionContract.methods.getCrowdFundingConfig(this.selectedDAO).call();

        console.log(getCrowdFundingConfigABI["outputs"][0]["components"]);

        var output = daoSettings.map(function(obj,index){
          var myobj = {};
          myobj[getCrowdFundingConfigABI["outputs"][0]["components"][index].name] = obj;
          return myobj;
        });

        this.selectedDAOSettings = output;
      }
    },

    async approveAllowance() {
      let component = this;
      component.loading = true;

      // define unit and token contract
      let unit = "mwei"; // USDC - 6 decimals

      // convert deposit value to wei
      //let tokensWei = component.getWeb3.utils.toWei(component.depositValue, unit);

      // call the approve method
      await component.getUsdcContract.methods.approve(component.getCrowdFundingAdapterAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null

      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");

      }).on('receipt', function(receipt){
        console.log(receipt);

        if (receipt.status) {
          component.$toast.success("The approval was successfull. You can execute the deal now.");
          
        } else {
          component.$toast.error("The transaction has failed. Please contact the Rethink Finance support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the Rethink Finance support.");
      });

    },

    async actContributeCrowdFunding() {
      let component = this;
      component.loading = true;

      // define unit and token contract
      let unit = "mwei"; // USDC - 6 decimals

      // convert deposit value to wei
      let tokensWei = component.getWeb3.utils.toWei(component.quoteAssetContributionAmount, unit);

      console.log(component.getCrowdFundingAdapterContract);

      if(component.getCrowdFundingAdapterContract) {
        // call the actContributeCrowdFunding method
        await component.getCrowdFundingAdapterContract.methods.actContributeCrowdFunding(
          component.selectedDAO,
          component.selectedDeal,
          tokensWei,
          component.getActiveAccount,
          component.getActiveAccount,
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null

        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The actContributeCrowdFunding transaction has been submitted. Please wait for it to be confirmed.");

        }).on('receipt', function(receipt){
          console.log(receipt);

          if (receipt.status) {
            component.$toast.success("The actContributeCrowdFunding transaction was successfull.");
            
          } else {
            component.$toast.error("The transaction has failed. Please contact the Rethink Finance support.");
          }
          
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the Rethink Finance support.");
        });
      } else {
            this.$store.dispatch("fundFactory/fetchContract1");
          component.loading = false;
      }

    },
  }
}
</script>
