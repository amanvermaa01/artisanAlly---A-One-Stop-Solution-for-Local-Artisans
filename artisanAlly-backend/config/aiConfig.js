// config/aiConfig.js
import { ChatOpenAI } from "@langchain/openai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";

export const getLLM = () => {
  const provider = process.env.AI_PROVIDER || "openai";

  try {
    if (provider === "openai" || provider === "openrouter") {
      return new ChatOpenAI({
        modelName: process.env.AI_MODEL || "gpt-4o-mini",
        openAIApiKey: process.env.AI_API_KEY,
        configuration: {
          baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
        },
      });
    } else if (provider === "huggingface") {
      return new HuggingFaceInference({
        apiKey: process.env.HF_API_KEY,
        model: process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2",
      });
    }
  } catch (err) {
    console.error("Error selecting provider:", err.message);
  }

  // Default fallback: HuggingFace free model
  return new HuggingFaceInference({
    apiKey: process.env.HF_API_KEY,
    model: "google/flan-t5-base", // lightweight & free
  });
};
