/**
 * 生成 markdown 列表
 */
function generateMarkdown(girls) {
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
    const avatar = `<img width="50" src="${girl.avatar}" alt="${girl.name}"/>`;
    // 立绘
    const tachie = girl.tachie
      ? `<img width="50" src="${girl.tachie}" alt="${girl.name}"/>`
      : "暂无";
    // 出自作品及豆瓣链接
    const from = girl.douban_id
      ? `[${girl.from}](https://movie.douban.com/subject/${girl.douban_id}/)`
      : `[${
          girl.from
        }](https://search.douban.com/movie/subject_search?search_text=${encodeURIComponent(
          girl.from
        )})`;
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
