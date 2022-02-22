const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportConfig = require('../config/passportConfig')

passportConfig(router)

router.get('/help', (req, res) => { 
  
})

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(401).json({
        message: 'Login or password is bad',
      })
    }

    req.logIn(user, { session: false }, function (err) {
      if (err) {
        return next(err)
      }

      const token = jwt.sign(user._id.toString(), 'token')

      return res.status(200).json({
        token,
      })
    })
  })(req, res, next)
})

router.use('/', require('./userProtect'))

module.exports = router
