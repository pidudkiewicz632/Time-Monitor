<template>
  <v-app dark class="ma-0  pa-0">
    <v-main>
      <Nuxt />
    </v-main>
    <LoadingSpinner />
    <MessageAlert />
  </v-app>
</template>

<script>
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'LoginLayout',
  components: { LoadingSpinner },
}
</script>
