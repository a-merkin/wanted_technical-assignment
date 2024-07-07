<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import wampService from '../websocket/wampService';
import subscriptionService from '../api/services/subscriptionService';

const socket = wampService
socket.connect()
subscriptionService.getLogsList()
</script>

<style scoped>

</style>