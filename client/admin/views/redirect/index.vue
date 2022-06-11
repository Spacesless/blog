<script>
export default {
  name: 'RedirectPage',
  created () {
    const { params, query } = this.$route
    const path = params.path || ''
    this.$router.replace({ path: '/' + path, query })
  },
  render (h) {
    return h() // avoid warning message
  }
}
</script>
