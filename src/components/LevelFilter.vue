<template>
  <select class="level-filter" v-model="wampStore.selectedLevelFilter">
    <option value="all">All</option>
    <option value="FATAL">FATAL</option>
    <option value="ERROR">ERROR</option>
    <option value="DEBUG">DEBUG</option>
    <option value="INFO">INFO</option>
    <option value="TRACE">TRACE</option>
  </select>
</template>

<script setup lang="ts">
import { useWampStore } from "../store/wampStore";

const wampStore = useWampStore();
</script>

<style scoped>
.level-filter {
  width: 160px;
}
</style>
