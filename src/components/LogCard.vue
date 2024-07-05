<template>
  <p>
    {{ props.log }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  log: string
}

const props = defineProps<Props>()

</script>

<style scoped>

</style>