import dayjs from "dayjs";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";
import { getFiles, pollInFixedTime, pollInHours, readFile } from "./utils";
import { createPage } from "./request";

export const splitMarkdownStr = (content: string) => {
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

export const syncOb2Notion = async () => {
  const curDate = dayjs().format("YYYY-MM-DD");
  const [year, month, date] = curDate.split("-");
  const weekNumber = dayjs().week();
  const journalWeekPath = `${process.env.OBSIDIAN_VAULT_PATH}/1 Journal/${year}/W${weekNumber}`;
  const targetJournalPath = `${journalWeekPath}/${month}-${date}.md`;
  const journalFileNames = await getFiles(journalWeekPath);
  // const latestJournalFileName = journalFileNames.at(-1);
  const latestJournalFileName = journalFileNames[journalFileNames.length - 1];
  const isObTodayJournalCreated =
    latestJournalFileName === `${month}-${date}.md`;

  // sync content with Notion
  if (isObTodayJournalCreated) {
    const dbID = process.env.NOTION_DB_ID_FOR_KLL;
    const pageName = curDate;
    const content = await readFile(targetJournalPath);
    console.log("🚀 ~ file: server.js:214 ~ main ~ content:", content.length);

    const splitsMapByHead2 = splitMarkdownStr(content);

    // const dailyPlanBlocks = markdownToBlocks(splitsMapByHead2["Daily Plan"]);
    // const weeklyPlanBlocks = markdownToBlocks(splitsMapByHead2["Weekly Plan"]);
    const reviewBlocks = markdownToBlocks(splitsMapByHead2["Review"]);
    const feedbackBlocks = markdownToBlocks(splitsMapByHead2["Feedback"]);

    // const content = "Hello world! I love you :)";

    const data = await createPage(dbID, pageName, feedbackBlocks as any);
    const syncInfo = {
      ...data,
      obJournalFileName: latestJournalFileName,
    };
    return syncInfo;
  } else {
    throw Error("Today's journal is not created in Obsidian!");
  }
};

export const runSync = async () => {
  // Scheduled task execution
  pollInFixedTime(async () => {
    const curTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    // const syncInfo = await syncOb2Notion();
    // console.log(
    //   `Synchronization of ${syncInfo.obJournalFileName} completed at ${curTime}`
    // );
  }, 22);

  // const curTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  // const { data, obJournalFileName } = await syncOb2Notion();
  // console.log("🚀 ~ file: server.js:138 ~ main ~ data:", data);
  // console.log(
  //   `Synchronization of ${obJournalFileName} completed at ${curTime}`
  // );
};
