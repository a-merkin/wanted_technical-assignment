<template>
  <router-view />
</template>

<script setup lang="ts">
import { useWampStore } from './store/wampStore';

const wampStore = useWampStore()

wampStore.connect()
</script>
<style>
/* ваши стили */
</style>
