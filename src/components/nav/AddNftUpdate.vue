<template>
  <div>
    <div v-for="pos in positions" v-bind:key="pos.strike" class="flex flex-col gap-2">
      <h3>Add or Modify Existing Symbol </h3>
      <input v-model="pos.udlFeed" class="form-control deposit-input" placeholder="(Feed Address), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="pos.strike" class="form-control deposit-input" placeholder="(Strike Price), Ex: 1000">
      <input v-model="pos.maturity" class="form-control deposit-input"  placeholder="(Unix Timestamp), Ex: 1979397234">
      <input v-model="pos.optionType" class="form-control deposit-input" placeholder="(Option Type), Ex: CALL or PUT">
      <input v-model="pos.t0" class="form-control deposit-input" placeholder="(Start Pricing Timestamp), Ex: 1969397234">
      <input v-model="pos.t1" class="form-control deposit-input" placeholder="(End Pricing Timestamp), Ex: 1979397234">
      <input v-model="pos.x" class="form-control deposit-input" placeholder="(Underlying Price Points (US$)), Ex: 1350, 1400, 1450, 1500, 1550, 1600, 1650">
      <input v-model="pos.y" class="form-control deposit-input" placeholder="(Option price points for t0 concat  points for t1 (US$)), Ex: 27, 42, 62, 87, 118, 152, 191,   22, 36, 56, 81, 111, 146, 185">
      <input v-model="pos.bsStockSpread" class="form-control deposit-input" placeholder="(Max contracts bid, Max Contracts ask, Percent Spread), Ex: 100,100,5">
    </div>

    <pre>{{ positions }}</pre>
  </div>
</template>

<script>

export default {
  name: "AddNftUpdate",
  props: ["positions"],

  components: { 
  },
}
</script>

<style>

</style>