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
  name: 'HitoKoto',
  props: {
    kinds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      hitokotoData: '',
      loading: false
    }
  },
  created () {
    this.fetchHitokoto()
  },
  methods: {
    fetchHitokoto () {
      this.loading = true
      axios.get('https://api.timelessq.com/sentence', {
        params: {
          type: this.kinds.join(','),
          maxLength: 200
        }
      }).then((res) => {
        this.hitokotoData = res.data?.data || {}
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
