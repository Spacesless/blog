<template>
  <NuxtChild keep-alive :keep-alive-props="{ include: cachedViews }" />
</template>

<script>
export default {
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
