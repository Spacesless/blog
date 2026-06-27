<template>
  <CategoryContent :is-edit="true" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '栏目内容',
  noCache: true,
})
</script>
