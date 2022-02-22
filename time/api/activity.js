const router = require('express').Router()
const moment = require('moment')
const functions = require('../lib/functions')
const Activity = require('../models/activity')
const User = require('../models/user')

router.use(functions.authenticate)

router.post('/add', async (req, res) => {
  try {
    const { userId, startTime, endTime, description } = req.body

    const user = await User.findById(userId)

    if (!user) {
      return res.status(400).json({
        message: 'Something went wrong.',
        data: 'This user not exsist',
      })
    }

    if (req.user.id !== userId && req.user.type !== 'admin') {
      return res.status(405).json({
        message: 'Something went wrong.',
        data: 'You cmust be admin',
      })
    }
    if (
      moment(startTime) < moment().subtract(1, 'months') ||
      moment(endTime) < moment().subtract(1, 'months')
    ) {
      throw Object({
        name: 'ValidationError',
        message:
          'Activity validation failed: startTime and endTime cannot be older than one month',
      })
    }

    const activity = await Activity.create({
      startTime,
      endTime,
      description,
      user: userId,
    })

    return res.status(200).json({
      message: 'Success',
      data: {
        id: activity.id,
        startTime: activity.startTime,
        endTime: activity.endTime,
        description: activity.description,
      },
    })
  } catch (err) {
    console.log(err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Something went wrong.',
        err,
      })
    }
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.delete('/delete', async (req, res) => {
  try {
    if (!req.body.activities) {
      return res.status(200).json({
        message: 'Success',
      })
    }
    const activitiesToDelete = JSON.parse(req.body.activities)
    const userId = req.user.id
    const date = moment().subtract(1, 'months').format('YYYY-MM-') + '01'

    if (req.user.type === 'user') {
      await Activity.deleteMany({
        _id: { $in: activitiesToDelete },
        startTime: { $gte: new Date(date) },
        user: { $eq: userId },
      })
    } else if (req.user.type === 'admin') {
      await Activity.deleteMany({
        _id: { $in: activitiesToDelete },
      })
    }

    return res.status(200).json({
      message: 'Success',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.put('/edit', async (req, res) => {
  try {
    // eslint-disable-next-line prefer-const
    let { id, startTime, endTime, description } = req.body

    const oldActivity = await Activity.findById(id)

    const activity = await functions.isInCollision(
      oldActivity.user,
      startTime,
      endTime,
      id
    )

    if (activity) {
      throw Object({
        name: 'ValidationError',
        message: 'The given working time is in conflict with another time.',
      })
    }

    if (
      oldActivity.user.toString() !== req.user.id &&
      req.user.type !== 'admin'
    ) {
      return res.status(405).json({
        message: 'You cannot change not yours activities',
      })
    }

    startTime = moment(startTime)
    endTime = moment(endTime)

    if (
      startTime < moment(oldActivity.startTime).subtract(1, 'months') ||
      endTime < moment(oldActivity.endTime).subtract(1, 'months')
    ) {
      throw Object({
        name: 'ValidationError',
        message:
          'Activity validation failed: startTime and endTime cannot be older than one month from the current date.',
      })
    }

    await oldActivity.overwrite({
      startTime,
      endTime,
      description,
      user: oldActivity.user,
    })

    let newActivity = await oldActivity.save()

    newActivity = {
      id: newActivity.id,
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      description: newActivity.description,
    }

    return res.status(200).json({
      message: 'Success',
      data: newActivity,
    })
  } catch (err) {
    console.log(err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Something went wrong.',
        err,
      })
    }
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.get('/user', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const filterParams = {
      user: req.user.id,
    }

     if (startDate && endDate) {
       filterParams.startTime = { $gte: startDate, $lte: endDate }
     }

    const activities = await Activity.find(filterParams).select('-user -__v')

    return res.status(200).json({
      message: 'Success',
      activities,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.get('/allUsers', async (req, res) => {
  try {
    const populateParams = {
      path: 'activities',
      select: '-__v',
    };

    const { startDate, endDate } = req.query

    if (startDate && endDate) {
      populateParams.match = { startTime: { $gte: startDate, $lte: endDate } }
    }
      if (req.user.type !== 'admin') {
        return res.status(400).json({
          message: 'You must be admin.',
        })
      }

    const activities = await User.find({}, 'id login').populate(populateParams)

    return res.status(200).json({
      message: 'Success',
      activities,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.get('/collision', async (req, res) => {
  try {
    let activity = await functions.isInCollision(
      req.user.id,
      req.query.startTime,
      req.query.endTime,
      req.query.activityId
    )

    if (activity) {
      activity = {
        startTime: activity.startTime,
        endTime: activity.endTime,
      }
    }
    return res.status(200).json({
      message: 'Success',
      collision: !!activity,
      activity,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

module.exports = router
