<template>
  <v-container class="col-12 col-md-10" fluid>
    <v-sheet class="px-2 my-3">
      <v-row align="center">
        <v-col class="text-h4 pt-8 pl-8" cols="12">Users Statistics</v-col>
        <v-col cols="12">
          <v-tabs v-model="selectedTab" align-with-title>
            <v-tab>Chart</v-tab>
            <v-tab>Table</v-tab>
            <v-tab>Calendar</v-tab>
          </v-tabs>
        </v-col>
        <StatisticsFilterPanel :selected-tab="selectedTab" @filter="filter" />
        <v-col cols="12">
          <v-tabs-items v-model="selectedTab">
            <v-tab-item eager>
              <ActivityChart
                :activities="userActivityData"
                all-users
                :label-type="selectedGroupType"
              />
            </v-tab-item>
            <v-tab-item eager>
              <UserActivityTable
                class="mx-4 mb-4"
                :headers-prop="headers"
                user-group-by
                :data="tableData"
              />
            </v-tab-item>
            <v-tab-item eager>
              <UserCalendar
                :data="userCalendarData"
                :calendar-type="selectedCalendarType"
                @typeChange="selectedCalendarType = $event"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFunctions from '@/lib/dateFunctions'

export default {
  name: 'UsersStatisticsPage',
  transition: 'fade',
  data() {
    return {
      currentDate: '',
      selectedCalendarDate: '',
      menu: false,
      userActivities: [],
      userCalendarData: [],
      userActivityData: [],
      tableData: [],
      selectedTab: 0,
      headers: [
        { text: 'User', value: 'user' },
        { text: 'Date', value: 'x' },
        { text: 'Duration', value: 'y' },
      ],
    }
  },
  async fetch() {
    this.$progressBar.start()
    this.userActivities = await this.$axios
      .get('/api/activity/allUsers')
      .then((res) => res.data.activities)

    this.userActivities = dateFunctions.preparationAllUsersActivities(
      this.userActivities
    )

    this.filter();

    this.$progressBar.stop()
  },
  methods: {
    filter() {
      this.$progressBar.start();
      this.userActivityData = dateFunctions.preparationAllUsersCharDataToPrint(
        this.userActivities,
        this.selectedGroupType,
        this.startDate,
        this.endDate
      );

      this.tableData = dateFunctions.preparationAllUsersTableDataToPrint(
        this.userActivityData
      );

      let data = [];

      this.userActivities.forEach((element) => {
        data = data.concat(
          dateFunctions.preparationCalendarDataToPrint(
            element.data,
            this.startDate,
            this.endDate,
            element.name
          )
        )
      });

      this.userCalendarData = data;
      this.$progressBar.stop();
    }
  },
  computed: {
    ...mapGetters(['startDate', 'endDate', 'selectedGroupType', 'selectedCalendarType']),
  },
  created() {
    this.selectedTab = this.$route.params.id ? Number(this.$route.params.id) : 0;
  },
}
</script>

<style>
</style>