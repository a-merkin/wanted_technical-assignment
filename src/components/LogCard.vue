<template>
  <p class="log" :class="{'--warn': props.Level === 'WARN'}">
    {{ props.Timestamp }} {{ props.Level }} {{ props.Message }} {{ props.Source }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  Timestamp: string
  Level: string
  Message: string
  Source: string
}

const props = defineProps<Props>()

</script>

<style scoped>
.log {
  &.--warn {
    color: rgb(255, 147, 85)
  }
}
</style>