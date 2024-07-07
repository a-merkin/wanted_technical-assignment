<template>
  <p>
    {{ props.timestamp }} {{ props.level }} {{ props.message }} {{ props.source }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  timestamp: string
  level: string
  message: string
  source: string
}

const props = defineProps<Props>()

</script>

<style scoped>

</style>