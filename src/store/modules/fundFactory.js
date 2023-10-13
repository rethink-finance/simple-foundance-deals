import ContractJson from "../../contracts/GovernableFundFactory.json";
import addresses from "../../contracts/addresses.json";

const ContractName = "GovernableFundFactoryBeaconProxy";

const state = {
  abi: null,
  address: null,
  contract: null,
};

const getters = {
  getFundFactoryAbi(state) {
    return state.abi;
  },
  getFundFactoryAddress(state) {
    return state.address;
  },
  getFunds(state) {
    return state.funds;
  },
  getFundFactoryContract(state) {
    return state.contract;
  }
};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = addresses[ContractName][chainIdDec];
    let contract = new web3.eth.Contract(ContractJson.abi, address);
    console.log("fund factory contract fetch");
    commit("setContract", contract);
  },
  async fetchFunds({ commit, dispatch, rootState, state }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }
    let fundAmount = await state.contract.methods.registeredFundsLength().call();
    let funds = await state.contract.methods.registeredFunds(0, fundAmount).call();
    let fundData = {};
    for(var i=0;i<funds.length;i++){
      fundData[funds[i]] = {
          "address": funds[i]
      }
    }
    console.log(fundData)
    commit("setFunds", fundData);
  },
  storeAbi({commit}) {
    commit("setAbi", ContractJson.abi);
  },
  storeAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    commit("setAddress", addresses[ContractName][chainIdDec]);
  }
};

const mutations = {
  setAbi(state, abi) {
    state.abi = abi;
  },
  setAddress(state, address) {
    state.address = address;
  },
  setFunds(state, funds) {
    state.funds = funds;
  },
  setContract(state, _contract) {
    state.contract = _contract;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
