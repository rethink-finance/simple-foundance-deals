<template>

<div class="section-small">

  <div class="d-flex justify-content-between flex-wrap">

    <!-- Fund data -->
    <div class="div-flex justify-content-center flex-wrap">
      <button @click="toggleFund" style="background: inherit !important; border: 0 !important;"><FundDataItem class="data-item" title="Fund" :data="formatAddress" :divider="true" :info="formatAddressInfo" /></button>
      <button @click="toggleGovernor" style="background: inherit !important; border: 0 !important;"><FundDataItem class="data-item" title="Governance" :data="formatGovernanceAddress" :divider="true" :info="formatAddressInfo"/></button>
      <button @click="toggleSafe" style="background: inherit !important; border: 0 !important;"><FundDataItem class="data-item" title="Safe" :data="formatSafeAddress" :divider="true" :info="formatAddressInfo"/></button>
      
      <div class="data-item" >
        <div class="data-item" @mouseover="toggleFund">
          <router-link to="/fund" class="btn btn-success">
            View Fund
          </router-link>
        </div>
      </div>
    </div>

    <!-- Action button -->
    <div>
      
      <span></span>
    </div>
  </div>
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import FundDataItem from './FundDataItem.vue';

export default {
  name: "Fund",
  props: ["fund"],
  data() {
    return {}
  },

  components: { 
    FundDataItem
  },

  created() {
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("usdc/fetchUserBalance");
  },

  computed: {
    ...mapGetters("accounts", ["getWeb3"]),

    formatAddress () {
      return this.fund.address.substring(0, 6) + '...' + this.fund.address.substring(38, 42)
    }, 

    formatGovernanceAddress () {
      return this.fund.governor.substring(0, 6) + '...' + this.fund.governor.substring(38, 42)
    }, 

    formatSafeAddress () {
      return this.fund.safe.substring(0, 6) + '...' + this.fund.safe.substring(38, 42)
    }, 

    formatAddressInfo () {
      return "Fund Address (copy to clipboard when selecting fund)"
    }, 
  },

  methods: {
    async toggleFund() {
      this.copyFundAddr()
    /*
      this.$root.$emit('poolToggleEvent', [this.pool.symbol, this.pool.address]);
      this.$store.commit("optionsExchange/setSelectedPool", this.pool.symbol);
      this.$store.state.liquidityPool["selectedPoolAddress"] = this.pool.address;

      this.$store.dispatch("liquidityPool/fetchContract");
      this.$store.dispatch("liquidityPool/fetchUserBalance");
      this.$store.dispatch("optionsExchange/fetchLiquidityPoolBalance");
      this.$store.dispatch("optionsExchange/fetchPoolOptions");
      this.$store.dispatch("liquidityPool/fetchApy");
      this.$store.dispatch("liquidityPool/storeAddress");
      this.$store.dispatch("liquidityPool/fetchUserPoolUsdValue");
      this.$store.dispatch("liquidityPool/fetchPoolFreeBalance");
      this.$store.dispatch("liquidityPool/fetchPoolMaturityDate");
      this.$store.dispatch("liquidityPool/fetchPoolWithdrawalFee");
      this.$store.dispatch("liquidityPool/fetchSymbolsList");


      this.$store.commit("liquidityPool/setSelectedPoolAddress", this.pool.address);
      this.copyPoolAddr();*/

    },
    async toggleSafe() {
      this.copySafeAddr()
    },
    async toggleGovernor() {
      this.copyGovernorAddr()
    },
    async copyFundAddr() {
      try {
        await navigator.clipboard.writeText(this.fund.address);
        let msg = "Copied Fund Address (" + this.fund.address + ") to clipboard";
        this.$toast.success(msg);
      } catch($e) {return;}
    },
    async copyGovernorAddr() {
      try {
        await navigator.clipboard.writeText(this.fund.governor);
        let msg = "Copied Governor Address (" + this.fund.governor + ") to clipboard";
        this.$toast.success(msg);
      } catch($e) {return;}
    },
    async copySafeAddr() {
      try {
        await navigator.clipboard.writeText(this.fund.safe);
        let msg = "Copied Safe Address (" + this.fund.safe + ") to clipboard";
        this.$toast.success(msg);
      } catch($e) {return;}
    }
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