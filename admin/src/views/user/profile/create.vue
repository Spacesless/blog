<template>
  <admin-form :is-edit="false" />
</template>

<script>
import AdminForm from './components/AdminForm'

export default {
  name: 'CreateAdmin',
  components: { AdminForm }
}
</script>
