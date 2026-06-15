<template>
  <ContentArticleContent :is-edit="false" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '新增文章',
  noCache: true,
})
</script>
