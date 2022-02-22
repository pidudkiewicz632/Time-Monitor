<template>
  <v-container class="col-12 col-md-10" fluid>
    <v-sheet class="px-2 my-3">
      <v-row align="center">
        <v-col class="text-h4 pt-8 pl-8" cols="12"> Users Activities </v-col>
        <ActivitiesFilterPanel />
        <v-col cols="12">
          <UserActivityTable
            v-model="selectedToDelete"
            class="col-12 col-md-11 my-6 mx-auto"
            :data="userActivityData"
            :headers-prop="headers"
            show-actions
            @deleteActivity="deleteActivity"
            @deleteActivities="deleteActivities"
            @editActivity="editActivity"
            @addActivity="addActivity"
          />
        </v-col>
      </v-row>
    </v-sheet>
    <ActivityFormDialog ref="dialog" />
    <ConfirmDialog ref="confirm" />
    <MessageAlert ref="message" />
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'UsersActivities',
  transition: 'fade',
  data() {
    return {
      userActivities: [],
      selectedToDelete: [],
      users: [],
      headers: [
        { text: 'User', value: 'user' },
        { text: 'Date', value: 'startTime' },
        { text: 'Date', value: 'endTime' },
        { text: 'Description', value: 'description' },
        { text: 'Duration', value: 'y' },
      ],
    }
  },
  async fetch() {
    this.$progressBar.start()

    const temp = await this.$axios
      .get('/api/activity/allUsers')
      .then((res) => res.data.activities)

    this.users = temp.map((user) => ({
      text: user.login,
      value: user.id,
    }))

    this.userActivities = [];

    temp.forEach((element) => {
      element.activities.forEach((activity) => {
        const duration = moment
          .duration(moment(activity.endTime).diff(activity.startTime))
          .asHours()
        const editable =
          moment().isSame(activity.startTime, 'month') ||
          moment().subtract(1, 'months').isSame(activity.startTime, 'month')
        this.userActivities.push({
          startTime: moment(activity.startTime).format('YYYY-MM-DD HH:mm'),
          endTime: moment(activity.endTime).format('YYYY-MM-DD HH:mm'),
          description: activity.description,
          y: Number(Number(duration).toFixed(2)),
          editable,
          id: activity.id,
          user: element.login,
          toDelete: false,
        })
      })
    })
    this.userActivities.sort((a, b) => {
      if (moment(a.startTime).valueOf() < moment(b.startTime).valueOf()) return 1
      if (moment(a.startTime).valueOf() > moment(b.startTime).valueOf()) return -1
      return 0
    })
    this.$nextTick(this.$progressBar.stop());
  },
  computed: {
    ...mapGetters(['startDate', 'endDate', 'editableActivities']),
    userActivityData() {
      const startDate = moment(moment(this.startDate).format('YYYY-MM-DD')).valueOf();
      const endDate = moment(moment(this.endDate).format('YYYY-MM-DD')).valueOf();

      const data = this.userActivities.filter((item) => {
        if (this.editableActivities) {
          return item.editable
        }
        return (
          moment(moment(item.startTime).format('YYYY-MM-DD')).valueOf() >= startDate &&
          moment(moment(item.startTime).format('YYYY-MM-DD')).valueOf() <= endDate
        )
      });

      return data;
    },
  },
  methods: {
    editActivity(item) {
      this.$refs.dialog.startDialog(item).then((data) => {
        const index = this.userActivities.findIndex(
          (activity) => activity.id === data.id
        )
        if (index >= 0) {
          const duration = moment
            .duration(moment(data.endTime).diff(data.startTime))
            .asHours()
          const editable =
            moment().isSame(data.startTime, 'month') ||
            moment().subtract(1, 'months').isSame(data.startTime, 'month')
            
          this.userActivities[index].startTime = moment(data.startTime).format('YYYY-MM-DD HH:mm')
          this.userActivities[index].endTime = moment(data.endTime).format('YYYY-MM-DD HH:mm')
          this.userActivities[index].description = data.description
          this.userActivities[index].y = Number(Number(duration).toFixed(2))
          this.userActivities[index].editable = editable
        }
      })
    },
    addActivity() {
      this.$refs.dialog
        .startDialog(null, false, true, this.users)
        .then((data) => {
          const duration = moment
            .duration(moment(data.endTime).diff(data.startTime))
            .asHours()
          const editable =
            moment().isSame(data.startTime, 'month') ||
            moment().subtract(1, 'months').isSame(data.startTime, 'month')
          this.userActivities.push({
            startTime: moment(data.startTime).format('YYYY-MM-DD HH:mm'),
            endTime: moment(data.endTime).format('YYYY-MM-DD HH:mm'),
            description: data.description,
            id: data.id,
            y: Number(Number(duration).toFixed(2)),
            editable,
          })
        })
    },
    deleteActivity(item) {
      this.sendActivitiesToDelete([item.id])
    },
    deleteActivities() {
      const deletedActivities = this.selectedToDelete.map((item) => item.id)
      this.sendActivitiesToDelete(deletedActivities)
    },
    sendActivitiesToDelete(activities) {
      this.$refs.confirm.open('Sure?').then((result) => {
        if (result) {
          this.$progressBar.start()
          this.$axios
            .delete('/api/activity/delete', {
              data: {
                activities: JSON.stringify(activities),
              },
            })
            .then((response) => {
              this.$messageAlert(true, 'Activity removed', 'success')
              if (activities.length === 1) {
                const index = this.userActivities.findIndex(
                  (activity) => activity.id === activities[0]
                )
                return this.userActivities.splice(index, 1)
              }
              return this.$fetch()
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.$progressBar.stop()
            })
        }
      })
    },
  },
}
</script>

<style>
</style>