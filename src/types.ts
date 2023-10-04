export interface PageInfo {
  // TODO: ...
}

export interface Comment {
  id: string;
  // 可能来自 block, page
  parent: {
    type: string;
    [prop: string]: string;
  };
  createTime: string;
  lastEditedTime: string;
  // DwD, bot and me.
  userID: string;
  // TODO: 目前仅为字符串，后续需要支持 rich_text
  text: string;
}
