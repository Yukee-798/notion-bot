import { UserMapByID } from "./constant";
import { llm } from "./llm";
import {
  createComment,
  getCommentsList,
  getPageInfoListByDatabaseID,
} from "./request";
import { Comment } from "./types";
import { pollInSeconds } from "./utils";

export const getLatestPageInfo = async (databaseID: string) => {
  const list = await getPageInfoListByDatabaseID(databaseID);
  return list?.[0];
};

export const listenPageCommentsUpdate = async (
  pageID: string,
  callback: (newComments: Comment[]) => void
) => {
  let cache = [];
  pollInSeconds(async () => {
    const commentList = await getCommentsList(
      "7b0deed913a548eeac089c4fba6d59a6"
    );
    const isNewCommentCreated = cache.length !== commentList.length;
    console.log(
      "🚀 ~ file: index.ts:54 ~ pollInSeconds ~ isNewCommentCreated:",
      isNewCommentCreated
    );
    // if (isNewCommentCreated) {
    //   console.log('hello')
    //   cache = commentList
    // }
    if (isNewCommentCreated) {
      cache = [...commentList];
      const commentHistoryPrompt = commentList.reduce((pre, cur) => {
        const content = `Human(${UserMapByID[cur.userID]?.name}): ${cur.text}`;
        return `${pre}${content} \n`;
      }, "");
      // console.log(
      //   "🚀 ~ file: index.ts:50 ~ commentHistoryPrompt ~ commentHistoryPrompt:",
      //   commentHistoryPrompt
      // );
      const res = await llm.predict(`${commentHistoryPrompt}\nAI(Dora):`);
      await createComment("7b0deed913a548eeac089c4fba6d59a6", res);
    }
  }, 5);

  // let cache = [];
  // pollInSeconds(async () => {
  //   const commentList = await getCommentsList(
  //     "7b0deed913a548eeac089c4fba6d59a6"
  //   );
  //   const isNewCommentCreated = cache.length !== commentList.length;
  //   console.log(
  //     "🚀 ~ file: index.ts:54 ~ pollInSeconds ~ isNewCommentCreated:",
  //     isNewCommentCreated
  //   );
  //   // if (isNewCommentCreated) {
  //   //   console.log('hello')
  //   //   cache = commentList
  //   // }
  //   if (isNewCommentCreated) {
  //     cache = [...commentList];
  //     const commentHistoryPrompt = commentList.reduce((pre, cur) => {
  //       const content = `Human(${UserMapByID[cur.userID]?.name}): ${cur.text}`;
  //       return `${pre}${content} \n`;
  //     }, "");
  //     // console.log(
  //     //   "🚀 ~ file: index.ts:50 ~ commentHistoryPrompt ~ commentHistoryPrompt:",
  //     //   commentHistoryPrompt
  //     // );
  //     const res = await llm.predict(`${commentHistoryPrompt}\nAI(Dora):`);
  //     await createComment("7b0deed913a548eeac089c4fba6d59a6", res);
  //   }
  // }, 5);
};
