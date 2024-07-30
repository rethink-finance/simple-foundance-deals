<template>
  <div>

    <!-- Hero -->
    <section class="text-center hero">

      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h1 class="hero-title">Foundance Deals</h1>
        </div>
      </div>

      <div class="d-flex flex-row justify-content-center text-white" v-if="isCantoTestnet">
        <div class="canto-hero-line-left"></div>
        <div>on</div>
        <img src="@/assets/img/canto-logo-green-on-transparent.png" class="polygon-logo" />
        <div class="canto-hero-line-right"></div>
      </div>

      <div class="d-flex flex-row justify-content-center text-white" v-if="isMumbai">
        <div class="polygon-hero-line-left"></div>
        <div>on</div>
        <img src="@/assets/img/polygon-logo-inverted.svg" class="polygon-logo" />
        <div class="polygon-hero-line-right"></div>
      </div>

      <div class="d-flex flex-row justify-content-center text-white" v-if="isPolygon">
        <div class="polygon-hero-line-left"></div>
        <div>on</div>
        <img src="@/assets/img/polygon-logo-inverted.svg" class="polygon-logo" />
        <div class="polygon-hero-line-right"></div>
      </div>

      <div class="d-flex flex-row justify-content-center text-white" v-if="isAmoy">
        <div class="polygon-hero-line-left"></div>
        <div>on</div>
        <img src="@/assets/img/polygon-logo-inverted.svg" class="polygon-logo" />
        <div class="polygon-hero-line-right"></div>
      </div>
      
      <div class="d-flex flex-wrap flex-row justify-content-center text-uppercase hero-buttons" v-if="isUserConnected">
        <router-link to="/create" style="text-decoration: none">
          <a class="btn btn-success m-1" href="/create">Create Deal</a>
        </router-link>
      </div> 

      <div class="d-flex flex-wrap flex-row justify-content-center text-uppercase hero-buttons" v-if="!isUserConnected">
        <a class="btn btn-outline-success m-1" target="_blank" href="https://discord.gg/dB9yaEf5YQ">Join Discord</a>

        <button class="btn btn-success m-1" v-if="!isUserConnected && isCompliant" @click="connectWeb3Modal">Connect wallet</button>
        <button class="btn btn-success m-1" v-if="!isUserConnected && !isCompliant" data-bs-toggle="modal" data-bs-target="#complianceModal">Connect wallet</button>
      </div> 


    </section>
    <!-- END Hero -->

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",

  computed: {
    ...mapGetters("accounts", ["getWeb3", "getChainName", "isUserConnected"]),

    isGoerli() {
      return this.getChainName == "Goerli";
    },

    isMumbai() {
      return this.getChainName == "Mumbai";
    },

    isCantoTestnet() {
      return this.getChainName == "Canto Testnet";
    },

    isPolygon() {
      return this.getChainName == "Polygon";
    },

    isAmoy() {
      return this.getChainName == "Amoy";
    }
  },

  created() {
    this.$store.dispatch("accounts/initWeb3Modal");
    this.$store.dispatch("accounts/ethereumListener");
    // check if user has already confirmed the compliance modal (this modal is in Navbar)
    this.isCompliant = localStorage.getItem('isCompliant');
    this.$store.dispatch("fundFactory/fetchContract");
    this.$store.dispatch("fundFactory/fetchContract1");
  },

  data() {
    return {
      isCompliant: null
    }
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
  }
}
</script>

<style scoped>
.audit-link {
  color: white;
  text-decoration: underline;
}

.audit-link:hover {
  text-decoration: none;
}

.btn-social:hover {
  background-color: #00072D;
  border-color: #5AFFB0;
  color: #5AFFB0;
}

.btn-social {
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  padding: 0;
  border-radius: 50%;
  font-size: 1.3rem;
  background-color: #5AFFB0;
  border-color: #5AFFB0;
  color: #00072D;
}

.feature-image {
  margin-bottom: 24px;
}

.feature-text {
  font-size: 14px;
  font-weight: 300;
}

.feature-text-short {
  font-size: 14px;
  font-weight: 300;
  width: 460px;
}

.feature-title {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 400;
  text-transform: none;
}

.hero {
  margin-top: 120px;
  margin-bottom: 60px;
}

.hero-buttons {
  margin-top: 70px;
}

.polygon-hero-line-left {
  width: 190px;
  height: 1px;
  background: linear-gradient(270deg, #7951DD 0%, rgba(32, 164, 221, 0) 100%);
  margin-top: 11px;
  margin-right: 16px;
}

.polygon-hero-line-right {
  width: 190px;
  height: 1px;
  background: linear-gradient(270deg, #7951DD 0%, rgba(32, 164, 221, 0) 100%);
  margin-top: 11px;
  transform: rotate(180deg);
  margin-left: 16px;
}

.canto-hero-line-left {
  width: 190px;
  height: 1px;
  background: linear-gradient(270deg, #48cc8c 0%, rgba(90, 255, 176, 0) 100%);
  margin-top: 11px;
  margin-right: 16px;
}

.canto-hero-line-right {
  width: 190px;
  height: 1px;
  background: linear-gradient(270deg, #48cc8c 0%, rgba(90, 255, 176, 0) 100%);
  margin-top: 11px;
  transform: rotate(180deg);
  margin-left: 16px;
}

.hero-title {
  font-weight: 400;
  font-size: 60px;
  color: #FFFFFF;
}

.ml-40-px {
  margin-left: 40px;
}

.nav-item {
  color: #5AFFB0;
  font-weight: 500;
}

.polygon-logo {
  height: 26px;
  margin-left: 16px;
}

.section-divider {
  background: linear-gradient(270deg, rgba(32, 164, 221, 0) 0%, #5AFFB0 48.96%, rgba(32, 164, 221, 0) 100%);
  width: 220px;
  height: 1px;
}

.section-title {
  font-weight: 400;
  font-size: 32px;
  color: #FFFFFF;
  text-transform: none;
}

.why-options-col {
  padding-right: 20px;
  padding-left: 20px;
  margin-bottom: 40px;
}

/* iPhone 8 */
@media screen and (max-width: 375px) {
  .hero-title {
    font-size: 50px;
  }
}

/* iPhone SE */
@media screen and (max-width: 320px) {
  .hero-title {
    font-size: 45px;
  }

  .ml-40-px {
    margin-left: 30px;
  }
}
</style>