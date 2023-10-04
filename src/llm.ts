import { OpenAI, OpenAIChat } from "langchain/llms/openai";

export const llm = new OpenAI({
  modelName: "gpt-3.5-turbo",
  configuration: {
    basePath: "https://api.aikey.one/v1",
    apiKey: "sk-Zvj3ZeJ2LxmAk22GC19aA58d669341Ff9c517d290a2f1d9e",
  },
  openAIApiKey: "sk-Zvj3ZeJ2LxmAk22GC19aA58d669341Ff9c517d290a2f1d9e",
  // openAIApiKey: "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",
});

export const chat = new OpenAIChat({
  modelName: "gpt-3.5-turbo",
  configuration: {
    basePath: "https://api.aikey.one/v1",
    apiKey: "sk-Zvj3ZeJ2LxmAk22GC19aA58d669341Ff9c517d290a2f1d9e",
  },
  openAIApiKey: "sk-Zvj3ZeJ2LxmAk22GC19aA58d669341Ff9c517d290a2f1d9e",
  // openAIApiKey: "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",
});


// const llmResult = await chat.predict("hello");
// chat.predict("hello").then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log("🚀 ~ file: index.ts:63 ~ chat.predict ~ err:", err);
//   }
// );
