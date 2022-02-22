const mongo = require("../../time/config/mongo");
const User = require("../../time/models/user");
const clc = require("cli-color");

async function updateUser(login, options) {
  try {
    const args = process.argv.slice(3);

    mongo.startConnection();

    const update = options;

    const result = await User.updateOne(
      {
        login,
      },
      update,
      {
        runValidators: true,
      }
    );

    if (result.matchedCount) {
      mongo.closeConnection();
      return console.log(clc.green("User uptdated!"));
    }
    console.error(clc.red("This user not exist!"));
    mongo.closeConnection();
  } catch (err) {
    console.error(clc.red(err));
    mongo.closeConnection();
  }
}

module.exports = updateUser;
