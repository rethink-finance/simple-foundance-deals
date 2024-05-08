<template>
  <div>
    <div v-for="entry in entries" v-bind:key="entry.index">
      <NavEntry :entry="entry" :fund="fund" />
    </div>
  </div>
</template>

<script>
import NavEntry from './NavEntry.vue';

export default {
  name: "UpdateList",
  props: ["entries", "fund"],

  components: { 
    NavEntry 
  },
}
</script>

<style>

</style>