<template>
  <v-container>
    <v-menu
      v-model="show"
      :close-on-content-click="false"
      content-class="elevation-0"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="selectedDateTime"
          :label="label"
          :rules="rules"
          :error-messages="errors"
          prepend-icon="mdi-calendar"
          readonly
          dense
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-container fill-height>
        <v-card>
          <v-tabs v-model="selectedTab" align-with-title>
            <v-tab>
              <v-icon>mdi-calendar</v-icon>
            </v-tab>
            <v-tab>
              <v-icon>mdi-clock</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="selectedTab">
            <v-tab-item>
              <v-date-picker v-model="date" dark color="0D47A1" reactive></v-date-picker>
            </v-tab-item>
            <v-tab-item>
              <v-time-picker v-model="time" dark color="0D47A1" format="24hr" reactive></v-time-picker>
            </v-tab-item>
          </v-tabs-items>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="show = false">Cancel</v-btn>
            <v-btn color="primary" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-menu>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DateTimePicker',
  props: {
    value: {
      type: String,
    },
    label: {
      type: String,
    },
    rules: {
      type: Array,
      default() {
        return []
      },
    },
    errors: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      time: '',
      date: '',
      selectedTab: '',
      show: false,
    }
  },
  computed: {
    selectedDateTime: {
      get() {
        if (this.date && this.time) {
          return `${this.date} ${this.time}`
        }
        return null
      },
      set(value) {
        if (value) {
          this.date = moment(value).format('YYYY-MM-DD')
          this.time = moment(value).format('HH:mm')
          return
        }
        this.date = null
        this.time = null
      },
    },
  },
  watch: {
    value(value) {
      if (value) {
        this.date = moment(value).format('YYYY-MM-DD')
        this.time = moment(value).format('HH:mm')
        return
      }
      this.date = null
      this.time = null
    },
    selectedDateTime(value) {
      this.$emit('input', value)
    },
  },
  methods: {
    save() {
      this.show = false
      this.$emit('input', this.selectedDateTime)
    },
  },
}
</script>

<style>
</style>