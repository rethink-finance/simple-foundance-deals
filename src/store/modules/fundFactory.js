import ContractJson from "../../contracts/GovernableFundFactory.json";
import addresses from "../../contracts/addresses.json";

const ContractName = "GovernableFundFactoryBeaconProxy";

const state = {
  abi: null,
  address: null,
  contract: null,
  funds:[],
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
    let fundsInfo = await state.contract.methods.registeredFundsData(0, fundAmount).call();
    let fundData = [];
    /*
      struct Settings {
        uint256 depositFee;
        uint256 withdrawFee;
        uint256 performanceFee;
        uint256 managementFee;
        uint256 performaceHurdleRateBps;
        address baseToken;
        address safe; //TODO: needs to be set after safe creation
        bool isExternalGovTokenInUse;
        bool isWhitelistedDeposits;
        address[] allowedDepositAddrs;
        address[] allowedManagers;
        address governanceToken;
        address fundAddress;//TODO: this may not be needed if delegatecall has balance refs to callee addr
        address governor;
        string fundName;
        string fundSymbol;
      }
    */
    for(var i=0;i<funds.length;i++){
      fundData.push({
          "address": fundsInfo[0][i],
          "data": fundsInfo[1][i]
      });

      console.log(fundsInfo[1][i])
    }
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
