import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { getGeminiUsage, incrementGeminiUsage } from "../utils/usageTracker.js";

export const getLLM = () => {
  let provider = process.env.AI_PROVIDER || "openai";
  let modelName = process.env.AI_MODEL || "gpt-4o-mini";
  let apiKey = process.env.AI_API_KEY;
  let baseURL = process.env.AI_BASE_URL || "https://api.openai.com/v1";

  console.log(`DEBUG: Initial LLM Request - Provider: ${provider}, Model: ${modelName}, Key Present: ${!!apiKey}`);

  // Check Gemini usage limit
  if (provider === "google-gemini") {
    const usage = getGeminiUsage();
    console.log(`DEBUG: Gemini usage check - Count: ${usage}`);
    if (usage >= 15) {
      console.log(`Gemini limit (15) reached. Current usage: ${usage}. Falling back to OpenRouter.`);
      provider = process.env.FALLBACK_AI_PROVIDER || "openrouter";
      modelName = process.env.FALLBACK_AI_MODEL || "anthropic/claude-3.5-sonnet";
      apiKey = process.env.FALLBACK_AI_API_KEY;
      baseURL = process.env.FALLBACK_AI_BASE_URL || "https://openrouter.ai/api/v1";
    } else {
      incrementGeminiUsage();
      console.log(`Using Gemini. Current usage: ${usage + 1}/15`);
    }
  }

  try {
    if (provider === "google-gemini") {
      return new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: apiKey,
      });
    }

    if (provider === "openai" || provider === "openrouter") {
      return new ChatOpenAI({
        model: modelName,
        apiKey: apiKey,
        configuration: {
          baseURL: baseURL,
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
