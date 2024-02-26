/* eslint-disable */
<template>
  <!------ Create Fund ------>

  <div class="section-big row mt-4 mx-3">
    <div class="col-md-12">
      <FundInput :fund="fund" :governor="governor" :fundMetadata="fundMetadata"/>
      <span></span>
    </div>
    <div class="fund-submit-buttons">
      <button @click="createFund" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create Fund
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FundInput from '../components/fund/FundInput.vue';

export default {
  name: "CreateFund",

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("fundFactory", ["getFundFactoryContract"]),
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
  },

  data() {
    return {
      loading: false,
      fund: {
        depositFee: null,
        withdrawFee: null,
        //performanceFee: null,//TODO: not imp 
        managementFee: null,
        //performaceHurdleRateBps: null,//TODO: not imp 
        baseToken: "",
        allowedDepositAddrs: "",
        allowedManagers: "",
        feeCollectors: "",
        governanceToken: "0x0000000000000000000000000000000000000000",
        fundName: "",
        fundSymbol: ""
      },
      fundMetadata : {
        description: null,
        photoUrl: null,
        plannedSettlementPeriod: null,
        minLiquidAssetShare: null
      },
      governor: {
        quorumFraction: null,
        lateQuorum: null,
        votingDelay: null,
        votingPeriod: null,
        proposalThreshold: null
      }
    }
  },

  components: {
    FundInput
  },

  methods: {
    ...mapActions("accounts", ["connectWeb3Modal"]),
    validateFund(obj) {
      if(obj.depositFee == null) return false;
      if(obj.withdrawFee == null) return false;
      if(obj.performanceFee == null) return false;
      if(obj.managementFee == null) return false;
      if(obj.performaceHurdleRateBps == null) return false;
      if(obj.baseToken.length == 0) return false;
      if(obj.allowedManagers.length == 0) return false;
      if(obj.feeCollectors.length == 0) return false;
      if(obj.fundName.length == 0) return false;
      if(obj.fundSymbol.length == 0) return false;
      return true;
    },
    validateGovernor(obj) {
      if(obj.quorumFraction == null) return false;
      if(obj.lateQuorum == null) return false;
      if(obj.votingDelay == null) return false;
      if(obj.votingPeriod == null) return false;
      if(obj.proposalThreshold == null) return false;
      return true;
    },
    validateFundMetadata(obj) {
      if(obj.description == null) return false;
      if(obj.photoUrl == null) return false;
      return true;
    },
    getCreateFundMutation(){
      //https://apidocs.tally.xyz/#group-Operations-Mutations
      /*
        let OrganizationArgs = {
          "name": "abc123", //TODO [symbol]-[gov token addr]
          "description": "abc123"//TODO: [symbol]-[gov token addr], could be other stuff fund manager may want
        }

        let TokenArgs = {
          "id": "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f", //TODO: need to get from gov factory contract after creation
          "start": 987 //TODO: need input field for block hight if external gov token and erc20votes compatavle, need to get block of create fund tx from tx hash data returned
        }

        let GovernanceArgs = {
          "id": "eip155:1:0x7e90e03654732abedf89Faf87f05BcD03ACEeFdc", //TODO: need to get from gov factory contract after creation
          "type": "OPENZEPPELINGOVERNOR",
          "start": 987 //need to get block of create fund tx from tx hash data returned
        }
      */
      var fundMutation = `mutation CreateGovernorOrganization(
                            $orgArgs: OrganizationArgs!,
                            $tokenArgs: TokenArgs!,
                            $governanceArgs: GovernanceArgs!
                          ) {
                            createGovernorOrganization(
                              orgArgs: $orgArgs,
                              tokenArgs: $tokenArgs,
                              governanceArgs: $governanceArgs
                            ) {
                              id
                              slug
                              name
                              website
                              description
                              visual {
                                icon
                                color
                              }
                              socialProfiles {
                                Discord
                                Telegram
                                Twitter
                                Others {
                                  ...OtherLinkFragment
                                }
                              }
                              creator {
                                id
                                address
                                ens
                                twitter
                                name
                                bio
                                participations {
                                  ...ParticipationFragment
                                }
                                picture
                                activity {
                                  ... on Proposal {
                                    ...ProposalFragment
                                  }
                                  ... on Vote {
                                    ...VoteFragment
                                  }
                                }
                                safes
                                type
                                meta {
                                  ...AccountMetaFragment
                                }
                                votes
                              }
                              members {
                                id
                                account {
                                  ...AccountFragment
                                }
                                organization {
                                  ...OrganizationFragment
                                }
                              }
                              issues {
                                id
                                organizationId
                                name
                                description
                              }
                            }
                          }`;

      fetch(process.env.TALLY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.TALLY_API_KEY,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }).then(
        (response) => response.json()
      ).then((json) => {
        if (json?.errors) {
          console.error("error when fetching");

          return null;
        }

        return json.data;
      }).catch((error) => {
        console.log("Error when fetching =>", error);

        return null;
      });
    },
    async createFund () {
      let component = this;
      component.loading = true;
      /*
        struct Settings {
            uint256 depositFee;
            uint256 withdrawFee;
            uint256 performanceFee;//TODO: not imp 
            uint256 managementFee;
            uint256 performaceHurdleRateBps;//TODO: not imp 
            address baseToken;
            address safe; 
            bool isExternalGovTokenInUse;
            bool isWhitelistedDeposits;
            address[] allowedDepositAddrs;
            address[] allowedManagers;
            address governanceToken;
            address governor;
            address fundAddress;//TODO: this may not be needed if delegatecall has balance refs to callee addr
            string fundName;
            string fundSymbol;
            address[4] feeCollectors;
          }
      */
      if (component.validateFund(component.fund) && component.validateGovernor(component.governor) && (component.validateFundMetadata(component.fundMetadata))) {
        await component.getFundFactoryContract.methods.createFund(
          [
            parseInt(component.fund.depositFee),
            parseInt(component.fund.withdrawFee),
            parseInt(component.fund.performanceFee),//performanceFee bps
            parseInt(component.fund.managementFee),
            parseInt(component.fund.performaceHurdleRateBps),//performaceHurdleRateBps bps
            component.fund.baseToken,
            "0x0000000000000000000000000000000000000000",
            false,//false
            false,//false
            component.fund.allowedDepositAddrs.split(",").filter((val) => (val != "") ? true :  false),
            component.fund.allowedManagers.split(",").filter((val) => (val != "") ? true :  false),
            component.fund.governanceToken,
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000",
            component.fund.fundName,
            component.fund.fundSymbol,
            component.fund.feeCollectors.split(",").filter((val) => (val != "") ? true :  false),
          ],
          [
            parseInt(component.governor.quorumFraction),
            parseInt(component.governor.lateQuorum),
            parseInt(component.governor.votingDelay),
            parseInt(component.governor.votingPeriod),
            parseInt(component.governor.proposalThreshold),
          ],
          JSON.stringify(component.fundMetadata),//fundMetadata
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
            component.$toast.success("Create Fund transaction was successfull.");
            
          } else {
            component.$toast.error("The Create Fund tx has failed. Please contact the Rethink Finance community for support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the Rethink Finance community for support.");
        });
      }
    },
  }
}
</script>
