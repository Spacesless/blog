<template>
  <div class="webapp" :class="classObj">
    <!-- app start -->
    <nuxt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['configs']),
    classObj() {
      return {
        silent: this.configs.is_silent
      }
    }
  }
}
</script>
