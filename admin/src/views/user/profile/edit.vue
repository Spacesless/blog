<template>
  <admin-form :is-edit="true" />
</template>

<script>
import AdminForm from './components/AdminForm'

export default {
  name: 'EditAdmin',
  components: { AdminForm }
}
</script>
