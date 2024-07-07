<template>
  <div>
    <LogCard v-for="log in logs" v-bind="log"/>
  </div>
</template>

<script setup lang="ts">
import wampService from '../websocket/wampService';
import subscriptionService from '../api/services/subscriptionService';
import LogCard from '../components/LogCard.vue';
import type { Log } from '../types/logTypes';
import { ref, onMounted } from 'vue';

const socket = wampService
socket.connect()

const logs = ref<Log[]>([])

const getData = () => {
  subscriptionService.getLogsList().then((response) => {
    logs.value = response
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>