<template>
  <div>
  <h3>Create Fund </h3>

  <input v-model="fund.depositFee" class="form-control deposit-input" placeholder="(Deposit Fee in BPS), Ex: 10">
  <input v-model="fund.withdrawFee" class="form-control deposit-input" placeholder="(Withdrawal Fee in BPS), Ex: 10">
  <input v-model="fund.performanceFee" class="form-control deposit-input"  placeholder="(Performance Fee in BPS), Ex: 10">
  <input v-model="fund.managementFee" class="form-control deposit-input"  placeholder="(Management Fee in BPS), Ex: 10">
  <input v-model="fund.performaceHurdleRateBps" class="form-control deposit-input"  placeholder="(Performace Hurdle Rate in BPS), Ex: 10">
  <input v-model="fund.baseToken" class="form-control deposit-input" placeholder="(Token Address Used For Deposits/Withdrawals), Ex: 0x1000000000000000000000000000000000000000">
  <input v-model="fund.allowedDepositAddrs" class="form-control deposit-input" placeholder="(Whitelisted Deposit Addresses, Ex: [0x1000000000000000000000000000000000000000, 0x2000000000000000000000000000000000000000, 0x3000000000000000000000000000000000000000]">
  <input v-model="fund.allowedManagers" class="form-control deposit-input" placeholder="(Allowed Fund Manager Addresses), Ex: [0x1000000000000000000000000000000000000000, 0x2000000000000000000000000000000000000000, 0x3000000000000000000000000000000000000000]">
  <input v-model="fund.governanceToken" class="form-control deposit-input" placeholder="(External Governance Token), Ex: 0x0000000000000000000000000000000000000000">
  <input v-model="fund.fundName" class="form-control deposit-input" placeholder="(Name of Fund), Ex: Berlin Community Governance">
  <input v-model="fund.fundSymbol" class="form-control deposit-input" placeholder="(Symbol for Fund), Ex: BGG">
  <input v-model="fund.feeCollectors" class="form-control deposit-input" placeholder="(Addresses Fees Will Be Sent To - 0:DepositFee, 1:WithdrawFee, 2:ManagementFee, 3:PerformanceFee), Ex: [0x1000000000000000000000000000000000000000, 0x2000000000000000000000000000000000000000, 0x3000000000000000000000000000000000000000, 0x4000000000000000000000000000000000000000]">
  <input v-model="governor.quorumFraction" class="form-control deposit-input" placeholder="(What percent needed to achive governance quorum), Ex: 10">
  <input v-model="governor.lateQuorum" class="form-control deposit-input" placeholder="(Seconds To add to voting period of large last min quorum), Ex: 86400">
  <input v-model="governor.votingDelay" class="form-control deposit-input"  placeholder="(Seconds to delay voting after proposal is made), Ex: 0">
  <input v-model="governor.votingPeriod" class="form-control deposit-input"  placeholder="(How much time to allow for voting), Ex: 21600">
  <input v-model="governor.proposalThreshold" class="form-control deposit-input"  placeholder="(The number of votes required in order for a voter to become a proposer), Ex: 1">

  <span></span>
  <div v-for="(value, key, keyIdx) in fundMetadata" class="flex flex-col gap-2">
    <textarea v-model="fundMetadata[key]" class="form-control deposit-input" placeholder="key"></textarea>
  </div>

  <pre>{{ fund }}</pre>
  <pre> {{ fundMetadata }}</pre>
  <pre>{{ governor }}</pre>
  </div>
</template>

<script>

export default {
  name: "FundInput",
  props: ["fund", "governor", "fundMetadata"],

  components: { 
  },
}
</script>

<style>

</style>