<template>
  <div>
    <div v-for="entry in entries" v-bind:key="entry.index">
      <NavEntry :entry="entry" />
    </div>
  </div>
</template>

<script>
import NavEntry from './NavEntry.vue';

export default {
  name: "UpdateList",
  props: ["entries"],

  components: { 
    NavEntry 
  },
}
</script>

<style>

</style>