<template>
  <div class="py-2.5 pb-[var(--grid-space)] text-[15px] text-[var(--color-secondary)]">
    <Icon v-if="loading" name="ph:spinner" class="animate-spin" />
    <span class="text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">{{ hitokotoData.hitokoto }}</span>
    <span v-if="hitokotoData.from" class="ml-2 text-[13px] text-[var(--color-secondary)]">《{{ hitokotoData.from }}》</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  kinds?: string[]
}>()

const hitokotoData = ref<{ hitokoto?: string; from?: string }>({})
const loading = ref(false)

async function fetchHitokoto() {
  loading.value = true
  try {
    const res = await $fetch<{ data?: { hitokoto?: string; from?: string } }>(
      'https://api.timelessq.com/sentence',
      {
        params: {
          type: props.kinds?.join(',') || '',
          maxLength: 200,
        },
      },
    )
    hitokotoData.value = res?.data || {}
  } catch {
    hitokotoData.value = {}
  } finally {
    loading.value = false
  }
}

onMounted(fetchHitokoto)
</script>
