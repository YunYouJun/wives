import fetch from 'node-fetch'
import { logger } from './logger'

/**
 * 从 [AniList](https://anilist.co/) 获取图片
 * @param {*} id 角色 ID
 */
export async function getImageFromAniList(id) {
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

  const mediumImage = await fetch(url, options)
    .then((response) => {
      return response.json().then((json) => {
        return response.ok ? json : Promise.reject(json)
      })
    })
    .then((data) => {
      return data.data.Character.image.medium
    })
    .catch((e) => {
      logger.error('Anilist ID:', id)
      console.error(e)
    })

  return mediumImage
}
