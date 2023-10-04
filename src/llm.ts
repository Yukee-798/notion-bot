import { OpenAI, OpenAIChat } from "langchain/llms/openai";
import { envConfig } from "./constant";

export const llm = new OpenAI({
  modelName: "gpt-3.5-turbo",
  configuration: {
    basePath: envConfig.OPENAI_BASE_PATH,
    apiKey: envConfig.OPENAI_API_KEY,
  },
  openAIApiKey: envConfig.OPENAI_API_KEY,
});

export const chat = new OpenAIChat({
  modelName: "gpt-3.5-turbo",
  configuration: {
    basePath: envConfig.OPENAI_BASE_PATH,
    apiKey: envConfig.OPENAI_API_KEY,
  },
  openAIApiKey: envConfig.OPENAI_API_KEY,
});
