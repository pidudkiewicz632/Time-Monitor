<template>
  <v-menu content-class="elevation-0">
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="selectedDate"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        dense
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="selectedDate" dark color="0D47A1"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    value: {
      type: String,
    },
    label: {
      type: String,
    },
  },
  data() {
    return {
      selectedDate: this.value,
    }
  },
  watch: {
    selectedDate(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style>
</style>