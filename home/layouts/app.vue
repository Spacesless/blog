<template>
  <div class="webapp">
    <!-- app start -->
    <nuxt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['configs'])
  },
  head() {
    return {
      htmlAttrs: {
        class: parseInt(this.configs.is_silent) ? 'silent' : ''
      }
    }
  }
}
</script>
