const fs = require("fs");
const yaml = require("js-yaml");

const { generateMarkdown } = require("./generateList");

/**
 * 生成 Json 列表
 */
function writeJson(girls) {
  try {
    fs.mkdirSync("./dist/");
  } catch ({ code }) {
    if (code !== "EEXIST") return;
  }
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
try {
  const girls = yaml.safeLoad(fs.readFileSync("./data/list.yml", "utf8"));
  writeJson(girls);
  writeMarkdown(girls);
} catch (e) {
  console.error(e);
}
