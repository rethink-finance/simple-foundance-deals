import ContractJson from "../../contracts/Foundance.json";
import ContractJson1 from "../../contracts/CrowdFundingAdapter.json";
import addresses from "../../contracts/addresses.json";

const ContractName = "Foundance";
const ContractName1 = "CrowdFundingAdapter";

const state = {
  ffAbi: null,
  cfaAbi: null,
  cfaAddress: null,
  ffContract: null,
  cfaContract: null,
};

const getters = {

  getFoundanceFactoryAbi(state) {
    return state.ffAbi;
  },

  getCrowdFundingAdapterAbit(state) {
    return state.cfaAbi;
  },

  getFoundanceFactoryContract(state) {
    return state.ffContract;
  },

  getCrowdFundingAdapterContract(state) {
    return state.cfaContract;
  },

  getCrowdFundingAdapterAddress(state) {
    return state.cfaAddress;
  },

};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = addresses[ContractName][chainIdDec];
    console.log(address);

    if(address){
      let contract = new web3.eth.Contract(ContractJson.abi, address);
      console.log("foundance factory contract fetch");

      commit("setContract", contract);
    }

  },

  async fetchContract1({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);

    let address1 = addresses[ContractName1][chainIdDec];
    console.log(address1);

    if(address1){

      let contract1 = new web3.eth.Contract(ContractJson1.abi, address1);

      console.log("CrowdFundingAdapter contract fetch");

      commit("setContract1", contract1);
      commit("setAddress", address1);
    }

  },

  storeAbi({commit}) {
    commit("setAbi", ContractJson.abi);
  },
  storeAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    commit("setAddress", addresses[ContractName1][chainIdDec]);
  }
};

const mutations = {
  setAbi(state, abi) {
    state.abi = abi;
  },
  setAddress(state, address) {
    state.cfaAddress = address;
  },
  setFunds(state, funds) {
    state.funds = funds;
  },
  setContract(state, _contract) {
    state.ffContract = _contract;
  },
  setContract1(state, _contract) {
    state.cfaContract = _contract;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
