const router = require('express').Router()
const bcrypt = require('bcrypt')
const multer = require('multer')
const functions = require('../lib/functions')
const User = require('../models/user')
const path = require('path')

router.use(functions.authenticate)

const maxSizeAvatar = 5 * 1000 * 1000

router.get('/me', function (req, res) {
  if (!req.user) {
    return res.status(405).json({
      message: 'invalid token',
    })
  }
  return res.status(200).json({ user: req.user })
})

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v')

    return res.status(200).json({
      message: 'Success',
      data: user,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.get('/checkLogin', async (req, res) => {
  try {
    const user = await User.findOne({
      login: req.query.login,
    })

    const inUse = !!user

    return res.status(200).json({
      message: 'Success',
      data: inUse,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

router.get('/checkPassword', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    const isGood = await bcrypt.compare(req.query.password, user.password)

    return res.status(200).json({
      message: 'Success',
      data: isGood,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong.',
    })
  }
})

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './static/user')
  },
  filename(req, file, callback) {
    const filename = req.user.id + path.extname(file.originalname)
    callback(null, filename)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: maxSizeAvatar },
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.png' && ext !== '.jpg') {
      req.validationFail = {
        message: 'Not allowed extension!',
      }
      return callback(null, false, new Error('Not allowed extension!'))
    }
    return callback(null, true)
  },
}).single('userPhoto')

router.post('/upload', async (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Something went wrong.',
        err,
      })
    } else if (req.validationFail) {
      return res.status(400).json({
        message: req.validationFail,
      })
    } else {
      
      User.updateOne(
        {
          id: req.user.id,
        },
        {
          avatar: req.file.filename,
        }
      )
        .then((result) => {
          return res.status(200).json({
            message: 'Success',
          })
        })
        .catch((err) => {
          return res.status(500).json({
            message: 'Something went wrong.',
            err,
          })
        })
    }
  })
})

router.put('/update', multer().none(), async (req, res) => {
  try {
    const updatedUser = {}

    const { login, password } = req.body

    if (login) {
      updatedUser.login = login
    }

    if (password) {
      updatedUser.password = password
    }

    if (Object.keys(updatedUser).length < 1) {
      return res.status(200).json({
        message: 'Nothing to update',
      })
    }

    const user = await User.updateOne({ id: req.user.id }, updatedUser, {
      runValidators: true,
    })

    if (user.modifiedCount < 1) {
      return res.status(200).json({
        message: 'Nothing to update',
      })
    }

    return res.status(200).json({
      message: 'Success',
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

module.exports = router
