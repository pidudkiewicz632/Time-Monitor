<template>
  <v-col class="mt-5 StatisticsFilterPanelWrapper" cols="12">
    <v-expansion-panels v-if="showMobileFilter" class="col-12 col-md-11">
      <v-expansion-panel>
        <v-expansion-panel-header color="blue darken-4">Filter</v-expansion-panel-header>
        <v-expansion-panel-content color="blue darken-4">
          <v-row class="col-12 col-md-11 mx-auto" justify="space-between" align="center">
            <v-col cols="12" md="3">
              <DatePicker v-model="startDate" label="Start Date" />
            </v-col>
            <v-col cols="12" md="3">
              <DatePicker v-model="endDate" label="End Date" />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-if="selectedTab != 2"
                v-model="selectedGroupType"
                dense
                :items="groupTypes"
                label="Group by"
              ></v-select>
              <v-select
                v-else
                v-model="selectedCalendarType"
                :items="typesOfCalendar"
                dense
                hide-details
                label="type"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-btn @click="$emit('filter')">Filter</v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row v-else class="col-12 col-md-11 mx-auto" justify="space-between" align="start">
      <v-col cols="12" sm="4">
        <DatePicker v-model="startDate" label="Start Date" />
      </v-col>
      <v-col cols="12" sm="4">
        <DatePicker v-model="endDate" label="End Date" />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-if="selectedTab != 2"
          v-model="selectedGroupType"
          dense
          :items="groupTypes"
          label="Group by"
        ></v-select>
        <v-select
          v-else
          v-model="selectedCalendarType"
          :items="typesOfCalendar"
          dense
          hide-details
          label="type"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-btn color="blue darken-4" @click="$emit('filter')">Filter</v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import moment from 'moment'

export default {
  name: 'StatisticsFilterPanel',
  props: {
    selectedTab: {
      type: Number,
    },
  },
  data() {
    return {
      typesOfCalendar: ['month', 'week', 'day'],
      groupTypes: [
        {
          text: 'Days',
          value: 'day',
        },
        {
          text: 'Months',
          value: 'month',
        },
        {
          text: 'Years',
          value: 'year',
        },
      ],
    }
  },
  computed: {
    showMobileFilter() {
      return this.$vuetify.breakpoint.width < 780
    },
    startDate: {
      get() {
        return this.$store.state.filterOptions.startDate
      },
      set(value) {
        this.$store.dispatch('changeStartDate', value)
      },
    },
    endDate: {
      get() {
        return this.$store.state.filterOptions.endDate
      },
      set(value) {
        this.$store.dispatch('changeEndDate', value)
      },
    },
    selectedGroupType: {
      get() {
        return this.$store.state.filterOptions.selectedGroupType
      },
      set(value) {
        this.$store.dispatch('changeSelectedGroupType', value)
      },
    },
    selectedCalendarType: {
      get() {
        return this.$store.state.filterOptions.selectedCalendarType
      },
      set(value) {
        this.$store.dispatch('changeSelectedCalendarType', value)
      },
    },
  },
  created() {
    this.startDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
    this.endDate = moment().format('YYYY-MM-DD')
    this.selectedGroupType = 'month'
    this.selectedCalendarType = 'month'
  },
}
</script>

<style>
</style>