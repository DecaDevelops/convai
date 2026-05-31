import OpenAI from "openai";

const createClient = (baseURL: string, apiKey: string) => {
  return new OpenAI({
    apiKey,
    baseURL,
  });
};

export default createClient;
