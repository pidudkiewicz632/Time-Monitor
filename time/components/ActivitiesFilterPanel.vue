<template>
  <v-col class="mt-5" cols="12">
    <v-expansion-panels v-if="showMobileFilter" class="col-12 col-md-11">
      <v-expansion-panel>
        <v-expansion-panel-header color="blue darken-4">
          Filter
        </v-expansion-panel-header>
        <v-expansion-panel-content color="blue darken-4">
          <v-row
            class="col-12 col-md-11 mx-auto"
            justify="space-between"
            align="center"
          >
            <v-col cols="12" md="4">
              <DatePicker v-model="startDate" label="Start Date" />
            </v-col>
            <v-col cols="12" md="4">
              <DatePicker v-model="endDate" label="End Date" />
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox
                v-model="editableActivities"
                label="Show only editable"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox
                v-model="editableActivities"
                label="Show only editable"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row
      v-else
      class="col-12 col-md-11 ml-8"
      justify="space-between"
      align="center"
    >
      <v-col cols="12" md="4">
        <DatePicker v-model="startDate" label="Start Date" />
      </v-col>
      <v-col cols="12" md="4">
        <DatePicker v-model="endDate" label="End Date" />
      </v-col>
      <v-col cols="12" md="4">
        <v-checkbox
          v-model="editableActivities"
          label="Show only editable"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ActivitiesFilterPanel',
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
          text: 'Weeks',
          value: 'week',
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
    editableActivities: {
      get() {
        return this.$store.state.filterOptions.editableActivities
      },
      set(value) {
        this.$store.dispatch('changeEditableActivities', value)
      },
    },
  },
  created() {
    this.startDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
    this.endDate = moment().format('YYYY-MM-DD')
    this.editableActivities = false
  },
}
</script>

<style>
</style>