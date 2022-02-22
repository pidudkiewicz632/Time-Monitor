<template>
  <v-container fluid>
    <v-row class="mt-3" justify="center" align="start">
      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>New Activity</v-card-title>
              <v-card-text>
                <ActivityForm @added="update" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <TypeSlider
              v-model="currentUserTable.selectedUserTableType"
              more-link="/user/statistics/1"
              title="User Statistics"
            >
              <UserActivityTable :data="currentUserTableData" user-group-by />
            </TypeSlider>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title>User Calendar</v-card-title>
              <v-select
                v-model="selectedUserCalendarType"
                :items="typesOfCalendar"
                dense
                hide-details
                class="mt-5 col-5 mx-auto"
                label="type"
              ></v-select>
              <v-card-text>
                <UserCalendar
                  :data="userCalendarData"
                  :calendar-type="selectedUserCalendarType"
                  @typeChange="selectedUserCalendarType = $event"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="blue darken-4"
                  to="/user/statistics/2"
                  class="mx-auto"
                  >More</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col v-if="isAdmin" cols="12">
            <v-card>
              <v-card-title>All Users Calendar</v-card-title>
              <v-select
                v-model="electedAllUsersCalendarType"
                :items="typesOfCalendar"
                dense
                hide-details
                class="mt-5 col-5 mx-auto"
                label="type"
              ></v-select>
              <v-card-text>
                <UserCalendar
                  :data="allUsersCalendarData"
                  :calendar-type="electedAllUsersCalendarType"
                  @typeChange="selectedAllUsersCalendarType = $event"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="blue darken-4"
                  to="/admin/statistics/2"
                  class="mx-auto"
                  >More</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12">
            <TypeSlider
              v-model="currentUserChart.selectedType"
              more-link="/user/statistics/0"
              title="User Statistics"
            >
              <ActivityChart
                :activities="chartBarUserData"
                :label-type="userChartGroupType"
              />
            </TypeSlider>
          </v-col>
          <v-col v-if="isAdmin" cols="12">
            <TypeSlider
              v-model="allUsersTable.selectedType"
              more-link="/admin/statistics/1"
              title="All Users Statistics"
            >
              <UserActivityTable
                :headers-prop="allUsersTable.headers"
                user-group-by
                :data="allUsersTableData"
              />
            </TypeSlider>
          </v-col>
          <v-col v-if="isAdmin" cols="12">
            <TypeSlider
              v-model="allUsersChart.selectedType"
              more-link="/admin/statistics/0"
              title="All Users Statistics"
            >
              <ActivityChart
                :activities="chartAllUsersData"
                all-users
                :label-type="allUsersChartGroupType"
              />
            </TypeSlider>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import dateFunctions from '../lib/dateFunctions'

export default {
  name: 'IndexPage',
  transition: 'fade',
  data() {
    return {
      isAdmin: 'false',
      currentUserChart: {
        selectedType: 0,
      },
      currentUserTable: {
        selectedUserTableType: 0,
      },
      allUsersTable: {
        selectedType: 0,
        headers: [
          { text: 'User', value: 'user' },
          { text: 'Date', value: 'x' },
          { text: 'Duration', value: 'y' },
        ],
      },
      userActivities: [],
      allUsersActivities: [],
      allUsersChart: {
        selectedType: 0,
      },
      selectedUserCalendarType: 'month',
      electedAllUsersCalendarType: 'month',
      startTimeCalendars: moment().subtract(1, 'years').startOf('year'),
      endTimeCalendars: moment().endOf('month'),
      typesOfCalendar: ['month', 'week', 'day'],
    }
  },
  async fetch() {
    this.$progressBar.start()
    this.isAdmin = this.$auth.user.type === 'admin'

    const params = {
      startDate: this.startTimeCalendars.format('YYYY-MM-DD HH:mm'),
      endDate: this.endTimeCalendars.format('YYYY-MM-DD HH:mm'),
    }

    if (this.isAdmin) {
      this.allUsersActivities = await this.$axios
        .get('/api/activity/allUsers', { params })
        .then((res) => res.data.activities)

      this.allUsersActivities = dateFunctions.preparationAllUsersActivities(
        this.allUsersActivities
      )
    }
    this.userActivities = await this.$axios
      .get('/api/activity/user', { params })
      .then((res) => res.data.activities)

    this.userActivities = dateFunctions.preparationSingleUserActivities(
      this.userActivities
    )

    this.$progressBar.stop()
  },
  computed: {
    userChartGroupType() {
      switch (this.currentUserChart.selectedType) {
        case 1:
          return 'day'
        case 2:
          return 'month'
        case 3:
          return 'month'
        default:
          return 'day'
      }
    },
    allUsersChartGroupType() {
      switch (this.allUsersChart.selectedType) {
        case 1:
          return 'day'
        case 2:
          return 'month'
        case 3:
          return 'month'
        default:
          return 'day'
      }
    },
    chartBarUserData() {
      const data = this.preparationUsersData(this.currentUserChart.selectedType)
      return dateFunctions.markMinMax(data)
    },
    currentUserTableData() {
      return this.preparationUsersData(
        this.currentUserTable.selectedUserTableType
      )
    },
    chartAllUsersData() {
      return this.preparationUsersData(this.allUsersChart.selectedType, true)
    },
    allUsersTableData() {
      const allUsersData = this.preparationUsersData(
        this.allUsersTable.selectedType,
        true
      )
      return dateFunctions.preparationAllUsersTableDataToPrint(allUsersData)
    },
    userCalendarData() {
      return dateFunctions.preparationCalendarDataToPrint(
        this.userActivities,
        this.startTimeCalendars,
        this.endTimeCalendars,
        this.$auth.user.login
      )
    },
    allUsersCalendarData() {
      let data = []
      this.allUsersActivities.forEach((element) => {
        data = data.concat(
          dateFunctions.preparationCalendarDataToPrint(
            element.data,
            this.startTimeCalendars,
            this.endTimeCalendars,
            element.name
          )
        )
      })

      return data
    },
  },
  methods: {
    update() {
      this.$fetch()
    },
    preparationUsersData(selectedType, allUsers) {
      const data = allUsers ? this.allUsersActivities : this.userActivities
      let start, end, group
      switch (selectedType) {
        case 1:
          start = moment()
            .subtract(1, 'months')
            .startOf('month')
            .format('YYYY-MM-DD')
          end = moment()
            .subtract(1, 'months')
            .endOf('month')
            .format('YYYY-MM-DD')
          group = 'day'
          break
        case 2:
          start = moment().startOf('year').format('YYYY-MM-DD')
          end = moment().endOf('year').format('YYYY-MM-DD')
          group = 'month'
          break
        case 3:
          start = moment()
            .subtract(1, 'year')
            .startOf('year')
            .format('YYYY-MM-DD')
          end = moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
          group = 'month'
          break
        default:
          start = moment().startOf('month').format('YYYY-MM-DD')
          end = moment().endOf('month').format('YYYY-MM-DD')
          group = 'day'
      }

      if (allUsers) {
        return dateFunctions.preparationAllUsersCharDataToPrint(
          data,
          group,
          start,
          end
        )
      } else {
        return dateFunctions.group(data, group, start, end)
      }
    },
  },
}
</script>
