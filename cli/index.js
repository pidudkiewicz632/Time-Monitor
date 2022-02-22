#! /usr/bin/env node

const { program } = require("commander");
const addUser = require('./commands/addUser');
const deleteUser = require("./commands/deleteUser");
const clc = require("cli-color");

program
  .command("addUser")
  .arguments("<name> <surname> <login> <password>", "User informations")
  .option("--type <type>", "Type of user")
  .description("User adding")
  .action(addUser);

program
  .command("updateUser")
  .arguments("<login>", "User to update")
  .option("--name <n>", "Name to update")
  .option("--surname <n>", "Name to update")
  .option("--password <n>", "Name to update")
  .option("--type <n>", "Name to update")
  .option("--login <n>", "Name to update")
  .description("List all the TODO tasks")
  .action(deleteUser);

program.on("command:*", () => {
  console.error(clc.red("Invalid command: "), program.args.join(" "));
  console.error("See --help for a list of available commands." + "\n");
  process.exit(1);
});

program.parse();