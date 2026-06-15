<template>
  <ContentArticleContent :is-edit="true" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '修改文章',
  noCache: true,
})
</script>
