#!/usr/bin/env node
const fs = require('fs')
const { program } = require('commander')
const yaml = require('js-yaml')

const inquirer = require('inquirer')
const pkg = require('../package.json')
const { questions, dataFile } = require('./config')

program.version(pkg.version)

program.command('add').action(async() => {
  const answers = await inquirer.prompt(questions)
  const item = yaml.dump([answers])
  // eslint-disable-next-line no-console
  console.log(item)
  fs.appendFileSync(dataFile, item)
})

program.parse(process.argv)
