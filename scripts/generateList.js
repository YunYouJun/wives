const fetch = require("node-fetch");

/**
 * 从 [AniList](https://anilist.co/) 获取图片
 */
async function getImageFromAniList(id) {
  const query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Character (id: $id) {
    image {
      medium
    }
  }
}
  `;

  const variables = {
    id,
  };

  // Define the config we'll need for our Api request
  const url = "https://graphql.anilist.co";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const mediumImage = await fetch(url, options)
    .then((response) => {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    })
    .then((data) => {
      return data.data.Character.image.medium;
    });

  return mediumImage;
}

/**
 * 生成 markdown 列表
 */
async function generateMarkdown(girls) {
  let toc_md = `# 可爱的女孩子们 (${girls.length})

|#|姓名|头像|立绘|作品|萌娘百科|
|-|---|:-:|:--:|---|---|
`;

  for (let i = 0; i < girls.length; i++) {
    const girl = girls[i];

    // 角色姓名
    const name = girl.anilist_id
      ? `[${girl.name}](https://anilist.co/character/${girl.anilist_id})`
      : girl.name;
    // 头像图片链接
    girl.avatar = girl.anilist_id
      ? await getImageFromAniList(girl.anilist_id)
      : girl.avatar;
    const avatar = `<img width="50" src="${girl.avatar}" alt="${girl.name}"/>`;
    // 立绘
    const tachie = girl.tachie
      ? `<img width="50" src="./images/${girl.tachie}" alt="${girl.name}"/>`
      : "暂无";
    // 出自作品及豆瓣链接
    const from = `[${girl.from}](https://movie.douban.com/subject/${girl.douban_id})`;
    // 萌娘百科链接
    const moegirl = `[Link](https://zh.moegirl.org.cn/${
      girl.moegirl ? girl.moegirl : girl.name
    })`;

    toc_md += `|${i + 1}|${name}|${avatar}|${tachie}|${from}|${moegirl}|\n`;
  }

  return toc_md;
}

module.exports = {
  generateMarkdown,
};
