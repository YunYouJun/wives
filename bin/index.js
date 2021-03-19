#!/usr/bin/env node
const { program } = require("commander");
const pkg = require("../package.json");
const yaml = require("js-yaml");
const fs = require("fs");

const inquirer = require("inquirer");
const { questions, dataFile } = require("./config");

program.version(pkg.version);

program.command("add").action(async () => {
  const answers = await inquirer.prompt(questions);
  const item = yaml.dump([answers]);
  console.log(item);
  fs.appendFileSync(dataFile, item);
});

program.parse(process.argv);
