require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const { markdownToBlocks, markdownToRichText } = require("@tryfabric/martian");
const cron = require("node-cron");

const dayjs = require("dayjs");
const localeData = require("dayjs/plugin/localeData");
const weekOfYear = require("dayjs/plugin/weekOfYear");
const { createComment, createPage } = require("./request");

dayjs.extend(localeData);
dayjs.extend(weekOfYear);

// 自定义本地化实例
// const customLocale = {
//   name: "custom-locale",
//   weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
//   weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
//   weekdaysMin: "日_一_二_三_四_五_六".split("_"),
//   weekStart: 1, // 将周一设为一周的开始
// };

// dayjs.locale(customLocale, null, true);

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

const readFile = async (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const bufferString = data.toString("utf8");
        resolve(bufferString);
      }
    });
  });
};

// 获取目录下所有文件名
const getFiles = async (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

const splitMarkdown = (content) => {
  const [, ...splitsByHead2] = content.split("##");
  const map = {};
  splitsByHead2.forEach((item) => {
    // ignore the first space
    const startIndex = 1;
    const endIndex = item.indexOf("\n");

    const header = item.slice(startIndex, endIndex);
    map[header] = `##${item}`;
  });
  return map;
};

const syncOb2Notion = async () => {
  const curDate = dayjs().format("YYYY-MM-DD");
  const [year, month, date] = curDate.split("-");
  const weekNumber = dayjs().week();
  const journalWeekPath = `${process.env.OBSIDIAN_JOURNAL_PATH}/1 Journal/${year}/W${weekNumber}`;
  const targetJournalPath = `${journalWeekPath}/${month}-${date}.md`;
  const journalFileNames = await getFiles(journalWeekPath);
  const latestJournalFileName = journalFileNames.at(-1);
  const isObTodayJournalCreated =
    latestJournalFileName === `${month}-${date}.md`;

  // sync content with Notion
  if (isObTodayJournalCreated) {
    const dbID = process.env.NOTION_DB_ID;
    const pageName = curDate;
    const content = await readFile(targetJournalPath);
    console.log("🚀 ~ file: server.js:214 ~ main ~ content:", content.length);

    const splitsMapByHead2 = splitMarkdown(content);

    const dailyPlanBlocks = markdownToBlocks(splitsMapByHead2["Daily Plan"]);
    const weeklyPlanBlocks = markdownToBlocks(splitsMapByHead2["Weekly Plan"]);
    const reviewBlocks = markdownToBlocks(splitsMapByHead2["Review"]);

    // const content = "Hello world! I love you :)";

    await createPage(dbID, pageName, reviewBlocks);
  } else {
    console.error("Today's journal is not created in Obsidian!");
  }

  const syncInfo = {
    obJournalFileName: latestJournalFileName,
  };

  return syncInfo;
};

const autoComment = async () => {};

const main = async () => {
  // Scheduled task execution
  cron.schedule("*/10 * * * * *", async () => {
    const curTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const syncInfo = await syncOb2Notion();
    console.log(
      `Synchronization of ${syncInfo.obJournalFileName} completed at ${curTime}`
    );
  });

  // const res = markdownToBlocks(" Review\n\n- Check List\n- 哪些选择\n\n");
  // await createPage(process.env.NOTION_DB_ID, "Review", res);

  // listen new page and comment created
  await autoComment();
};

main();
