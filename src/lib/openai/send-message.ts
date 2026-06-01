import { ChatCompletionMessageParam } from "openai/resources";
import { deepseekClient } from "./deepseek-client";

export const sendRequest = async (
  messageHistory: ChatCompletionMessageParam[],
) => {
  // const response = await deepseekClient.chat.completions.create({
  //   messages: messageHistory,
  //   model: "deepseek-chat",
  //   max_completion_tokens: 1500,
  //   temperature: 1.0,
  //   top_p: 0.9,
  // });

  return deepseekClient.sendMessage({
    messages: messageHistory,
    model: "deepseek-chat",
    maxTokens: 1500,
    temperature: 0.7,
    topK: 40,
    topP: 0.9,
  });
};
