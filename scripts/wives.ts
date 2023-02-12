#!/usr/bin/env node
import fs from 'fs'
import { program } from 'commander'
import yaml from 'js-yaml'

import inquirer from 'inquirer'
import pkg from '../package.json'
import { dataFile, questions } from '../config'

program.version(pkg.version)

program.command('add').action(async () => {
  const answers = await inquirer.prompt(questions)
  const item = yaml.dump([answers])

  console.log(item)
  fs.appendFileSync(dataFile, item)
})

program.parse(process.argv)
