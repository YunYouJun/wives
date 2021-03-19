const fs = require("fs");
const yaml = require("js-yaml");

const { getImageFromAniList } = require("./utils");
const { generateMarkdown } = require("./generateList");

const { common } = require("@yunyoujun/utils");
const logger = require("./logger");

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

  // https://anilist.gitbook.io/anilist-apiv2-docs/overview/rate-limiting
  // 90/m
  const maxRequests = 90;
  for (let i = 0; i < girls.length; i++) {
    if ((i + 1) % maxRequests === 0) {
      logger.info("Sleep 60s to avoid too many requests!");
      await common.sleep(60000);
    }

    const girl = girls[i];
    if (!girl.avatar) {
      girl.avatar = girl.anilist_id
        ? await getImageFromAniList(girl.anilist_id)
        : `https://cdn.jsdelivr.net/gh/YunYouJun/wives@gh-pages/images/tachie/${girl.tachie}`;
    }
  }

  fs.writeFileSync("./dist/girls.json", JSON.stringify(girls));
  logger.success("Generate girls.json successfully!");
}

/**
 * 写入 Markdown 文件
 */
function writeMarkdown(girls) {
  const md = generateMarkdown(girls);
  fs.writeFileSync("./dist/README.md", md);
  logger.success(`老婆列表生成完毕，共 ${girls.length} 位老婆！`);
}

// Let's go.
async function main() {
  try {
    const girls = yaml.load(fs.readFileSync("./data/list.yml", "utf8"));
    await writeJson(girls);
    writeMarkdown(girls);
  } catch (e) {
    console.error(e);
  }
}

main();
