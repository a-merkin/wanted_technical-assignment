<template>
  <div class="sidebar">
    <SearchBar />
    <LevelFilter />
  </div>
</template>

<script setup lang="ts">
import SearchBar from "./SearchBar.vue";
import LevelFilter from "./LevelFilter.vue";
</script>

<style scoped>
.sidebar {
  position: fixed;
  right: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}
</style>
