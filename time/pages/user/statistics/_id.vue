<template>
    <v-container class="col-12 col-md-10" fluid fill-height>
        <v-sheet class="pa-2 my-3">
            <v-row align="center">
                <v-col class="text-h4 pt-8 pl-8" cols="12"> Your Statistics </v-col>
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
                            <ActivityChart :activities="userActivityData" :label-type="selectedGroupType"/>
                        </v-tab-item>
                        <v-tab-item eager>
                            <UserActivityTable class="mx-5" :data="userActivityData" />
                        </v-tab-item>
                        <v-tab-item eager>
                            <UserCalendar :data="userCalendarData" :calendar-type="selectedCalendarType" @typeChange="selectedCalendarType = $event"/>
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
    name: "UserStatisticsPage",
    transition: 'fade',
    data() {
        return {
            currentDate: "",
            selectedCalendarDate: "",
            menu: false,
            userActivities: [],
            userActivityData: [],
            userCalendarData: [],
            selectedTab: 0,
        };
    },
    async fetch() {
        this.$progressBar.start();
        this.userActivities = await this.$axios
            .get("/api/activity/user")
            .then((res) => res.data.activities);
        this.userActivities = dateFunctions.preparationSingleUserActivities(this.userActivities);
        this.filter();
        this.$progressBar.stop()
    },
    created() {
    this.selectedTab = this.$route.params.id ? Number(this.$route.params.id) : 0;
  },
  methods: {
      filter() {
          this.$progressBar.start();
          const data = dateFunctions.group(this.userActivities, this.selectedGroupType, this.startDate, this.endDate);
            this.userActivityData =  dateFunctions.markMinMax(data);  
            this.userCalendarData = dateFunctions.preparationCalendarDataToPrint(this.userActivities, this.startDate, this.endDate, this.$auth.user.login);
            this.$progressBar.stop();
      },
  },
    computed: {
        ...mapGetters(['startDate', 'endDate', 'selectedGroupType', 'selectedCalendarType']),
    }
}
</script>

<style>
</style>