import { ofetch } from 'ofetch'
import consola from 'consola'
import { sleep } from '@yunyoujun/utils'

/**
 * 从 [AniList](https://anilist.co/) 获取图片
 * @param {*} id 角色 ID
 */
export async function getImageFromAniList(id: number) {
  const query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Character (id: $id) {
    image {
      medium
    }
  }
}
  `

  const variables = {
    id,
  }

  // Define the config we'll need for our Api request
  const url = 'https://graphql.anilist.co'

  let mediumImage = ''

  try {
    const data = await ofetch(url, {
      method: 'POST',
      // auto add
      // headers: {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json',
      // },
      // auto stringify
      body: {
        query,
        variables,
      },

      // maybe too many requests
      // retry: 1,

      async onResponseError({ response }) {
        const status = (response as any).status as number
        // 429 too many requests
        if (status && status === 429) {
          consola.info('Too many requests. Sleep 60s ...')
          await sleep(6000)
          mediumImage = await getImageFromAniList(id)
        }
      },
    })

    mediumImage = data.data.Character.image.medium as string
  }
  catch (e: any) {
    consola.error('Anilist ID:', id)
    console.error(e)
  }

  return mediumImage
}
