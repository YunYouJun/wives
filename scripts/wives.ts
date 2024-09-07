import fs from 'node:fs'
import process from 'node:process'
import { input, number } from '@inquirer/prompts'
import { program } from 'commander'

import yaml from 'js-yaml'
import { dataFile } from '../config'
import pkg from '../package.json'

program.version(pkg.version)

program.command('add').action(async () => {
  const answers = {
    name: await input({ message: '老婆名称:' }),
    anilist_id: await number({ message: 'Anilist ID(https://anilist.co/):' }),
    douban_id: await number({ message: '豆瓣 ID:' }),
    from: await input({ message: '出自作品:' }),
    reason: await input({ message: '喜爱原因:' }),
  }

  const item = yaml.dump([answers])

  console.log(item)
  fs.appendFileSync(dataFile, item)
})

program.parse(process.argv)
