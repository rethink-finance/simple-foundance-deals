<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.to" class="form-control deposit-input" :placeholder="getDesc1">
    <input v-model="data.amount" class="form-control deposit-input" :placeholder="getDesc2">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetAddressWithUint",
  props: ["data"],

  components: { 
  },

  computed: {
    getDesc1() {
      return this.data.desc1
    },
    getDesc2() {
      return this.data.desc2
    },
  },
}
</script>

<style>

</style>