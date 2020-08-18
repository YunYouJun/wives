const fs = require("fs");
const yaml = require("js-yaml");

const { getImageFromAniList } = require("./utils");
const { generateMarkdown } = require("./generateList");

/**
 * 生成 Json 列表
 * @param {*} girls [girl]
 */
async function writeJson(girls) {
  try {
    fs.mkdirSync("./dist/");
  } catch ({ code }) {
    if (code !== "EEXIST") return;
  }

  let promiseArr = [];
  girls.forEach(async (girl) => {
    promiseArr.push(
      (async (girl) => {
        girl.avatar = girl.anilist_id
          ? await getImageFromAniList(girl.anilist_id)
          : girl.avatar;
      })(girl)
    );
  });
  await Promise.all(promiseArr);

  fs.writeFileSync("./dist/girls.json", JSON.stringify(girls));
  console.log("Generate girls.json successfully!");
}

/**
 * 写入 Markdown 文件
 */
async function writeMarkdown(girls) {
  const md = await generateMarkdown(girls);
  fs.writeFileSync("./dist/README.md", md);
  console.log(`老婆列表生成完毕，共 ${girls.length} 位老婆！`);
}

// Let's go.
async function main() {
  try {
    const girls = yaml.safeLoad(fs.readFileSync("./data/list.yml", "utf8"));
    await writeJson(girls);
    writeMarkdown(girls);
  } catch (e) {
    console.error(e);
  }
}

main();
