import Vue from 'vue';
import Vuex from 'vuex';
import accounts from "./modules/accounts";
import fund from "./modules/fund";
import fundFactory from "./modules/fundFactory";
import nav from "./modules/nav";

import dai from "./modules/dai";
import usdc from "./modules/usdc";
import btc from "./modules/btc";
import eth from "./modules/eth";
import matic from "./modules/matic";
import avax from "./modules/avax";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        accounts,
        fund,
        dai,
        fundFactory,
        nav,
        usdc,
        btc,
        eth,
        matic,
        avax
    }
});