const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

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
const createPage = async (dbID, pageName, content = "") => {
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
    console.log({ message: "success!", data: newPage });
  } catch (error) {
    console.log({ message: "error", error });
  }
};

const createComment = async (pageID, comment) => {
    try {
      const newComment = await notion.comments.create({
        parent: {
          page_id: pageID,
        },
        rich_text: [
          {
            text: {
              content: comment,
            },
          },
        ],
      });
      response.json({ message: "success!", data: newComment });
    } catch (error) {
      response.json({ message: "error", error });
    }
};

module.exports = {
  createPage,
  createComment,
};
