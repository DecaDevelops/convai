import createClient from "@/lib/openai/create-client";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

interface ModelProvider {
  sendMessage(input: {
    messages: ChatCompletionMessageParam[];
    model: string;
    temperature?: number;
    maxTokens?: number;
    topK?: number;
    topP?: number;
  }): Promise<string>;
}

export class Provider implements ModelProvider {
  private Client: OpenAI;
  constructor(baseURL: string, apiKey: string) {
    this.Client = createClient(baseURL, apiKey);
  }
  async sendMessage({
    messages,
    model,
    maxTokens,
    temperature = 0.7,
    topK,
    topP,
  }: {
    messages: ChatCompletionMessageParam[];
    model: string;
    temperature?: number;
    maxTokens?: number;
    topK?: number;
    topP?: number;
  }): Promise<string> {
    const result = await this.Client.chat.completions.create({
      model,
      messages,
      temperature,
      top_p: topP,
      max_completion_tokens: maxTokens,
    });
    const message = result.choices[0].message.content;
    if (!message) throw new Error("Could not create response");
    return message;
  }
}
