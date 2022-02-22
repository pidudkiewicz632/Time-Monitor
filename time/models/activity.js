const mongoose = require('mongoose');
const moment = require('moment');

const schemaActivity = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
      validate: [
        {
          validator(value) {
            const startDate = moment(value)
            const endDate = moment(this.endTime)
            return endDate > startDate
          },
          message: 'The start time cannot be greater than the end time.',
        },
        {
          validator(value) {
            const startDate = moment(value)
            const endDate = moment(this.endTime)
            const duration = moment.duration(endDate.diff(startDate))
            return Math.abs(duration.asHours()) <= 12
          },
          message:
            'The difference between the dates cannot be greater than 12 hours.',
        },],
    },
    endTime: {
      type: Date,
      required: true,
      validate: [
        {
          validator(value) {
            const startDate = moment(this.startTime)
            const endDate = moment(value)
            return endDate > startDate
          },
          message: 'The end time cannot be less than the start time.',
        },
        {
          validator(value) {
            const startDate = moment(this.startTime)
            const endDate = moment(value)
            const duration = moment.duration(endDate.diff(startDate))

            return Math.abs(duration.asHours()) <= 12
          },
          message:
            'The difference between the dates cannot be greater than 12 hours.',
        },
      ],
    },
    description: {
      type: String,
      maxLength: 50,
      validate: {
        validator(value) {
          return !value || /^[A-Za-z0-9 _.\-:()]*$/.test(value)
        },
        message: 'The description have unacceptable characters.',
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      virtuals: true,
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      virtuals: true,
    },
  }
)

const Activity = mongoose.model( "Activity", schemaActivity );

module.exports = Activity;
