<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: false,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const segments = ((route.params.path as string[]) || []).join('/')
  const target = '/' + segments + (route.query && Object.keys(route.query).length
    ? '?' + new URLSearchParams(route.query as Record<string, string>).toString()
    : '')
  router.replace(target)
})
</script>
