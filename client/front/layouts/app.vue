<template>
  <div class="webapp">
    <!-- app start -->
    <nuxt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head () {
    return {
      htmlAttrs: {
        class: parseInt(this.configs.is_silent) ? 'silent' : ''
      }
    }
  },
  computed: {
    ...mapGetters(['configs'])
  }
}
</script>
