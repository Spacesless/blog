<template>
  <div class="hitokoto">
    <span v-if="loading" class="el-icon-loading" />
    <span class="hitokoto__title">{{ hitokotoData.hitokoto }}</span>
    <span v-if="hitokotoData.from" class="hitokoto__from">《{{ hitokotoData.from }}》</span>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    kinds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hitokotoData: '',
      loading: false
    }
  },
  created() {
    this.fetchHitokoto()
  },
  methods: {
    fetchHitokoto() {
      const kindToString = this.kinds.map(item => `c=${item}`).join('&')
      this.loading = true
      axios.get('https://v1.hitokoto.cn?' + kindToString, {
        params: {
          max_length: 200
        }
      }).then(res => {
        this.hitokotoData = res.data || {}
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hitokoto{
  min-height: 24px;
  margin-top: -16px;
  margin-bottom: 30px;
  line-height: 24px;
  &__from{
    color: var(--color-secondary);
  }
}
</style>
