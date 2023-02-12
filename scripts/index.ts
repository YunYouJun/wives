import * as fs from 'fs'
import * as yaml from 'js-yaml'

import { sleep } from '@yunyoujun/utils'

import consola from 'consola'
import { cyan, yellow } from 'chalk'
import { dataFile } from '../config'
import { getImageFromAniList } from './utils'
import { generateMarkdown } from './generateList'
import type { Girl } from './types'

/**
 * 生成 Json 列表
 */
async function writeJson(girls: Girl[]) {
  try {
    fs.mkdirSync('./dist/')
  }
  catch ({ code }) {
    if (code !== 'EEXIST')
      return
  }

  // https://anilist.gitbook.io/anilist-apiv2-docs/overview/rate-limiting
  // 90/m
  const maxRequests = 90

  consola.info(`Lovely Girls ${cyan(girls.length)}`)
  for (let i = 0; i < girls.length; i++) {
    // sleep before
    if ((i + 1) % maxRequests === 0) {
      consola.info('Sleep 60s to avoid too many requests!')
      await sleep(60000)
    }

    const girl = girls[i]
    consola.info(`Fetch ${i + 1} girl info: ${cyan(girl.name)} + ${yellow(girl.anilist_id)}...`)

    if (!girl.avatar) {
      girl.avatar = girl.anilist_id
        ? await getImageFromAniList(girl.anilist_id)
        : `https://cdn.jsdelivr.net/gh/YunYouJun/wives@gh-pages/images/tachie/${girl.tachie}`
    }

    consola.success(`avatar: ${yellow(girl.avatar)}`)
  }

  fs.writeFileSync('./dist/girls.json', JSON.stringify(girls))
  consola.success('Generate girls.json successfully!')
}

/**
 * 写入 Markdown 文件
 */
function writeMarkdown(girls: Girl[]) {
  const md = generateMarkdown(girls)
  fs.writeFileSync('./dist/README.md', md)
  consola.success(`老婆列表生成完毕，共 ${girls.length} 位老婆！`)
}

// Let's go.
async function main() {
  try {
    consola.info(`Read data from ${dataFile}`)
    const girls = yaml.load(fs.readFileSync(dataFile, 'utf8')) as Girl[]
    consola.info('Write Json File...')
    await writeJson(girls)
    writeMarkdown(girls)
  }
  catch (e) {
    console.error(e)
  }
}

main()
