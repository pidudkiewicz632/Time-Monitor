const passport = require('passport')
const Activity = require('../models/activity')

module.exports = {
  authenticate: passport.authenticate('jwt', {
    session: false,
  }),
  async isInCollision (userId, startTime, endTime, activityId) {
    const activity = await Activity.findOne({
      _id: { $ne: activityId },
      user: userId,
      $or: [
        {
          $and: [
            {
              startTime: { $gt: startTime },
            },
            {
              startTime: { $lt: endTime },
            },
          ],
        },
        {
          $and: [
            {
              endTime: { $gt: startTime },
            },
            {
              endTime: { $lt: endTime },
            },
          ],
        },
        {
          $and: [
            {
              startTime: { $lt: startTime },
            },
            {
              endTime: { $gt: startTime },
            },
          ],
        },
        {
          $and: [
            {
              startTime: { $lt: endTime },
            },
            {
              endTime: { $gt: endTime },
            },
          ],
        },
        {
          $and: [
            {
              startTime: { $eq: startTime },
            },
            {
              endTime: { $eq: endTime },
            },
          ],
        },
      ],
    })

    return activity;
  },
}
