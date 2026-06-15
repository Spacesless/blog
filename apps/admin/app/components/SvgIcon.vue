<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  iconClass: string
  className?: string
}>()

const iconName = computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => (props.className ? `svg-icon ${props.className}` : 'svg-icon'))
</script>

<style scoped>
.svg-icon {
  width: 1.4em;
  height: 1.4em;
  overflow: hidden;
  vertical-align: middle;
  fill: currentcolor;
}
</style>
