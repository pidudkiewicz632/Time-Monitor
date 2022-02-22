const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('../config/mongo');

// Create express instance
const app = express()

mongo.startConnection();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', require('./user'));

app.use('/activity', require('./activity'));

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}