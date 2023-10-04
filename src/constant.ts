import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";

dotenv.config();
dayjs.extend(localeData);
dayjs.extend(weekOfYear);

export const UserMapByID = {
  "3a7a75e9-d1d9-44d3-bf77-b032ce191e31": {
    role: "Human",
    name: "KLL",
  },
  "70e15717-c814-4fe7-8c9d-46858800857a": {
    role: "AI",
    name: "Dora",
  },
  "11": {
    role: "Human",
    name: "DwD",
  },
};

export const notion = new Client({ auth: process.env.NOTION_KEY });
export const envConfig: any = process.env;
