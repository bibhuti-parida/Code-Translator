import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const MODEL_NAME = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

let groq = null;

if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key") {
  console.warn("Groq AI is disabled (no valid API key)");
} else {
  console.log("Groq AI initialized");
  groq = new Groq({ apiKey });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateContent = async (prompt, retries = 2) => {
  if (!groq) {
    throw new Error("Groq API not configured");
  }

  try {
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });
    const text = response.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response from Groq");
    }

    return text;
  } catch (error) {
    if (error?.status === 429 && retries > 0) {
      console.warn(`Retrying Groq request (${retries} remaining)`);
      await sleep(2000);
      return generateContent(prompt, retries - 1);
    }

    console.error("Groq request error:", error.message);
    throw new Error("Failed to get response from Groq AI");
  }
};

export const safeGenerateContent = async (prompt) => {
  try {
    return await generateContent(prompt);
  } catch (error) {
    console.warn("Groq fallback activated");

    return JSON.stringify({
      translatedCode: "// Groq is unavailable. Try again later.",
      explanation: "Groq AI is currently unavailable.",
      optimizedCode: "// Unable to optimize due to API limit.",
      suggestions: "API limit reached. Retry later.",
      timeComplexity: "N/A",
      spaceComplexity: "N/A",
    });
  }
};

export { generateContent };
