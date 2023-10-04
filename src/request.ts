import dayjs from "dayjs";
import { envConfig, notion } from "./constant";
import { Comment } from "./types";

const writePageContent = async (pageID, content, mode = "append") => {
  try {
    if (mode === "append") {
      const newPage = await notion.blocks.children.append({
        block_id: pageID,
        children: [
          {
            object: "block",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content,
                  },
                },
              ],
            },
          },
        ],
      });
      console.log({ message: "success!", data: newPage });
    } else {
      await notion.blocks.update({
        block_id: pageID,
        // paragraph: {
        //   rich_text: [
        //     {
        //       text: {
        //         content,
        //       },
        //     },
        //   ],
        // },
        // children: [
        //   {
        //     object: "block",
        //     paragraph: {
        //       rich_text: [
        //         {
        //           text: {
        //             content,
        //           },
        //         },
        //       ],
        //     },
        //   },
        // ],
      });
    }
  } catch (error) {
    console.log({ message: "error", error });
  }
};

export const createPage = async (dbID, pageName, content = "") => {
  try {
    let newPage;
    if (typeof content === "string") {
      newPage = await notion.pages.create({
        parent: {
          type: "database_id",
          database_id: dbID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: pageName,
                },
              },
            ],
          },
        },
        children: [
          {
            object: "block",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content,
                  },
                },
              ],
            },
          },
          // {
          //   object: "block",
          //   heading_2: {
          //     rich_text: [
          //       {
          //         text: {
          //           content: header,
          //         },
          //       },
          //     ],
          //   },
          // },
        ],
      });
    } else if (typeof content === "object") {
      newPage = await notion.pages.create({
        parent: {
          type: "database_id",
          database_id: dbID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: pageName,
                },
              },
            ],
          },
        },
        children: content,
      });
    }
    return { message: "success!", data: newPage };
  } catch (error) {
    return error;
  }
};

export const getPageInfoListByDatabaseID = async (databaseID: string) => {
  const list = await notion.databases.query({
    database_id: databaseID,
    filter: {
      timestamp: "created_time",
      created_time: {
        on_or_after: dayjs().subtract(10, "day").format("YYYY-MM-DD"),
      },
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });
  return list;
};

// 这里的 blockID 也可以是 pageID
export const getCommentsList = async (blockID: string): Promise<Comment[]> => {
  const { results } = await notion.comments.list({ block_id: blockID });
  const list = results.map((item) => {
    const {
      created_by,
      created_time,
      id,
      parent,
      rich_text,
      last_edited_time,
    } = item;

    const comment: Comment = {
      id,
      userID: created_by.id,
      createTime: dayjs(created_time).format("YYYY-MM-DD HH:mm:ss"),
      lastEditedTime: dayjs(last_edited_time).format("YYYY-MM-DD HH:mm:ss"),
      parent,
      text: rich_text[0].plain_text,
    };
    return comment;
  });
  return list;
};

export const createComment = async (pageID, content) => {
  try {
    const newComment = await notion.comments.create({
      parent: {
        page_id: pageID,
      },
      rich_text: [
        {
          text: {
            content,
          },
        },
      ],
    });
    return { message: "success!", data: newComment };
  } catch (error) {
    return error;
  }
};
