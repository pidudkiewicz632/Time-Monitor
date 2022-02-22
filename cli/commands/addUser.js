const mongo = require("../../time/config/mongo");
const User = require("../../time/models/user");
const clc = require("cli-color");

async function addUser(name, surname, login, password, optional) {
  try {
    const args = process.argv.slice(3);
    const type = optional.type ? optional.type : "user";
    mongo.startConnection();
    await User.create({
      name,
      surname,
      login,
      password,
      type,
    });
    console.log(clc.green("User added!"));
    mongo.closeConnection();
  } catch (err) {
    console.error(clc.red(err));
    mongo.closeConnection();
  }
}

module.exports = addUser;
