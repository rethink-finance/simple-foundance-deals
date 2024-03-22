<template>
  <div>
    <div class="flex flex-col gap-2">
      <h3>Reference Existing NAV Entry Info</h3>
      <input v-model="entry.isPastNAVUpdate" class="form-control deposit-input" placeholder="(Referencing  Past NAV Update?), Ex: false">
      <input v-model="entry.pastNAVUpdateIndex" class="form-control deposit-input" placeholder="(Index of Past NAV Update), Ex: 0">
      <input v-model="entry.pastNAVUpdateEntryIndex" class="form-control deposit-input" placeholder="(Index of NAV Entry In Past NAV Update), Ex: 0">
      <div v-for="(value, key, keyIdx) in entry.description" class="flex flex-col gap-2">
        <input v-model="entry.description[key]" class="form-control deposit-input" :placeholder="key">
      </div>
      <input v-model="entry.pastNAVUpdateEntryFundAddress" class="form-control deposit-input" placeholder="(Address of fund Where NAV Entry Is Used In Past NAV Update), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">

    </div>

    <span></span>
    <span></span>

    <pre>
      isPastNAVUpdate: {{ entry.isPastNAVUpdate }}
      pastNAVUpdateIndex: {{ entry.pastNAVUpdateIndex }}
      pastNAVUpdateEntryIndex: {{ entry.pastNAVUpdateEntryIndex }}
      pastNAVUpdateEntryFundAddress: {{ entry.pastNAVUpdateEntryFundAddress }}
      description: {{ entry.description }}

    </pre>
  </div>
</template>

<script>

//- position name
//      - vaulation source

export default {
  name: "AddPastNavEntryRef",
  props: ["entry"],

  components: { 
  },
}
</script>

<style>

</style>