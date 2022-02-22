const passport = require('passport')
const LocalStarategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const JwtExtract = require('passport-jwt').ExtractJwt
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = function (app) {
  app.use(passport.initialize())

  passport.use(
    new LocalStarategy(
      {
        usernameField: 'login',
        passwordField: 'password',
      },
      async function (login, password, done) {
        try {
          const user = await User.findOne({ login })

          if (user) {
            if (user.type === 'deleted') {
              return done(null, false, {
                message: 'This user is deleted',
              })
            }
            return bcrypt.compare(password, user.password, function (err, res) {
              if (res) {
                
                return done(null, user, {
                  message: 'Success',
                })
              } else if (err) {
                return done(err)
              }
              return done(null, false, {
                message: 'Invalid password',
              })
            })
          }

          return done(null, false, {
            message: 'User with that login not exist.',
          })
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  const opts = {}
  opts.jwtFromRequest = JwtExtract.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = 'token'
  passport.use(
    new JwtStrategy(opts, function (payload, done) {
      User.findById(payload)
        .select('-password -__v')
        .then((result) => {
          if (result) {
            if (result.type !== 'deleted') {
              return done(null, result)
            }
          }
          return done(null, false)
        })
        .catch((err) => {
          return done(err, false)
        })
    })
  )
}
