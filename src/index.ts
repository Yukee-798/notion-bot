import express from "express";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
import { createComment, getCommentsList } from "./request";
import { pollInSeconds } from "./utils";
import { UserMapByID } from "./constant";

dotenv.config();

const app = express();
export const notion = new Client({ auth: process.env.NOTION_KEY });
dayjs.extend(localeData);
dayjs.extend(weekOfYear);

// !! FIX ME: ob 的 journal 插件使用的是周天为一周第一天
// 自定义本地化实例
// const customLocale = {
//   name: "custom-locale",
//   weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
//   weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
//   weekdaysMin: "日_一_二_三_四_五_六".split("_"),
//   weekStart: 1, // 将周一设为一周的开始
// };

// dayjs.locale(customLocale, null, true);

app.use(express.json());

const listener = app.listen(process.env.PORT, function () {
  // @ts-ignore
  console.log("Your app is listening on port " + listener.address().port);
});

const main = async () => {
  let cache = [];
  pollInSeconds(async () => {
    const commentList = await getCommentsList(
      "7b0deed913a548eeac089c4fba6d59a6"
    );

    const isNewCommentCreated = cache.length < commentList.length;
    if (isNewCommentCreated) {
      const commentHistoryPrompt = commentList.reduce((pre, cur) => {
        const content = `Human(${UserMapByID[cur.userID]?.name}): ${cur.text}`;
        return `${pre}${content} \n`;
      }, "");
      console.log(
        "🚀 ~ file: index.ts:50 ~ commentHistoryPrompt ~ commentHistoryPrompt:",
        commentHistoryPrompt
      );




      cache = commentList;
    }
  }, 5);
};

main();
