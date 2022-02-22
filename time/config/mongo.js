const mongoose = require('mongoose')

module.exports = {
  startConnection() {
    mongoose
      .connect(process.env.DB_ADRESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((i) => console.log('Connected to DB'))
      .catch((err) => console.log('Error with connection to DB:' + err))
  },
  closeConnection() {
    mongoose.connection.close();
  },
}
