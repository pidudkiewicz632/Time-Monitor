<template>
  <v-snackbar v-model="show" :color="color" min-height="7%">
    <v-row class="px-2" align="center" justify="start">
      <v-icon color="white" large>
        {{ iconName }}
      </v-icon>
      <div class="text-button ml-2">
        {{ message }}
      </div>
    </v-row>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MessageTemplate',
  computed: {
    ...mapState(['message', 'type']),
    color() {
      if (this.type === 'success') {
        return 'success';
      }

      return 'error';
    },
    iconName() {
      if (this.type === 'success') {
        return 'mdi-check';
      }

      return 'mdi-alert-circle';
    },
    show: {
      get() {
        return this.$store.state.show
      },
      set(value) {
        this.$store.dispatch('changeShow', value)
      },
    },
  },
}
</script>

<style>
</style>