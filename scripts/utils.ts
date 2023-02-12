import consola from 'consola'
import { ofetch } from 'ofetch'

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
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }

  const mediumImage = await ofetch(url, options)
    .then((data) => {
      return data.data.Character.image.medium
    })
    .catch((e) => {
      consola.error('Anilist ID:', id)
      console.error(e)
    })

  return mediumImage
}
