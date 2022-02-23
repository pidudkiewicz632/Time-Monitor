/* eslint-disable vue/no-computed-properties-in-data */
<template>
  <div>
    <v-form ref="formActivity" v-model="validAddActivity">
      <v-select
        v-if="showSelectUser"
        v-model="selectedUser"
        :items="users"
        :rules="selectUserValidation"
      ></v-select>
      <DateTimePicker
        v-model="startTime"
        :rules="startTimeTextField.rules"
        :errors="startTimeTextField.errorMessages"
        label="Start"
        @input="timeValidation"
      />
      <DateTimePicker
        v-model="endTime"
        :rules="endTimeTextField.rules"
        :errors="endTimeTextField.errorMessages"
        label="End"
        @input="timeValidation"
      />
      <v-textarea
        v-model="description"
        label="Description"
        :rules="rules.description"
      ></v-textarea>
      <v-btn color="blue darken-4" @click="addActivity">{{
        edit ? 'Save' : 'Add'
      }}</v-btn>
    </v-form>
  </div>
</template>

<script>
import moment from 'moment'
import DateTimePicker from './DateTimePicker.vue'

export default {
  name: 'ActivityForm',
  components: { DateTimePicker },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    showSelectUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startTime: null,
      endTime: null,
      selectedUser: null,
      id: '',
      validAddActivity: true,
      data: {},
      description: '',
      rules: {
        description: [
          (v) =>
            !v ||
            v.length <= 50 ||
            'The description cannot be a greater than 50.',
          (v) =>
            !v || /^[A-Za-z0-9 _.\-:()]*$/.test(v) || 'The description have',
        ],
      },
      dateProps: {
        color: '0D47A1',
        dark: true,
      },
      timeProps: {
        format: '24hr',
      },
      selectUserValidation: [(v) => !!v || 'You must select a user.'],
      endTimeTextField: {
        errorMessages: [],
        rules: [
          (v) => !!v || 'End time is required',
          (v) =>
            (v && moment(v) < moment()) ||
            'The end time cannot be a future time.',
        ],
      },
      startTimeTextField: {
        errorMessages: [],
        rules: [
          (v) => !!v || 'End time is required',
          (v) =>
            (v && moment(v) < moment()) ||
            'The start time cannot be a future time.',
        ],
      },
    }
  },
  created() {
    let fun1 = (v) =>
      (v && moment(v) >= moment().subtract(1, 'months')) ||
      'The start time cannot be older than one month.'
    let fun2 = (v) =>
      (v && moment(v) >= moment().subtract(1, 'months')) ||
      'The end time cannot be older than one month.'
    if (this.edit) {
      fun1 = (v) =>
        (v && moment(v) >= moment(this.data.startTime).subtract(1, 'months')) ||
        'The start time cannot be older than one month.'
      fun2 = (v) =>
        (v && moment(v) >= moment(this.data.endTime).subtract(1, 'months')) ||
        'The start time cannot be older than one month.'
    }
    this.startTimeTextField.rules.push(fun1)
    this.endTimeTextField.rules.push(fun2)
  },
  methods: {
    update(data) {
      this.data = data
      this.startTime = data.startTime
      this.endTime = data.endTime
      this.description = data.description
      this.id = data.id
    },
    clear() {
      this.$refs.formActivity.reset();
      this.endTimeTextField.errorMessages = [];
      this.startTimeTextField.errorMessages = [];
      this.startTime = null;
      this.endTime = null;
    },
    async addActivity() {
      this.snackbar = true
      await this.timeValidation()
      this.$refs.formActivity.validate()
      
      if (this.validAddActivity) {
        this.loading = true;
        if (this.edit) {
          this.$axios
            .put('/api/activity/edit', {
              startTime: moment(this.startTime),
              endTime: moment(this.endTime),
              description: this.description,
              id: this.data.id,
            })
            .then((response) => {
              this.$messageAlert(true, 'Activity updated.', 'success')
              this.$emit('updated', true, response.data.data)
              this.clear()
            })
            .catch((error) => {
              console.log(error)
              this.$emit('updated', false, error)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$axios
            .post('/api/activity/add', {
              startTime: moment(this.startTime),
              endTime: moment(this.endTime),
              description: this.description,
              userId: this.showSelectUser
                ? this.selectedUser
                : this.$auth.user.id,
            })
            .then((response) => {
              this.$messageAlert(true, 'Activity added.', 'success')
              this.$emit('added', true, response.data.data)
              this.clear()
            })
            .catch((error) => {
              console.log(error)
              this.$emit('added', false, error)
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
    async timeValidation() {
      this.endTimeTextField.errorMessages = []
      this.startTimeTextField.errorMessages = []

      if (this.startTime && this.endTime) {
        const startTime = moment(this.startTime)
        const endTime = moment(this.endTime)
        const duration = moment.duration(endTime.diff(startTime))
        const params = {
          startTime: this.startTime,
          endTime: this.endTime,
        }

        if(this.edit) {
          params.activityId = this.data.id;
        }

        const collision = await this.$axios.get('/api/activity/collision',{
          params
        }).then((res) => res.data);

        if(collision.collision) {
          this.endTimeTextField.errorMessages.push(
            `The given run time is in conflict with ${moment(collision.activity.startTime).format('YYYY-MM-DD HH:mm')} - ${moment(collision.activity.endTime).format('YYYY-MM-DD HH:mm')}`
          )
        }

        if (startTime >= endTime) {
          this.endTimeTextField.errorMessages.push(
            'The end time cannot be less than the start time.'
          )
          this.startTimeTextField.errorMessages.push(
            'The start time cannot be greater than the end time.'
          )
        }

        if (Math.abs(duration.asHours()) > 12) {
          this.endTimeTextField.errorMessages.push(
            'The difference between the dates cannot be greater than 12 hours.'
          )
        }
      }
    },
  },
}
</script>

<style></style>
