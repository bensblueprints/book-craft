import OpenAI from "openai";

export const validateOpenRouterApiKey = async (
  apiKey: string
): Promise<boolean> => {
  // Initialize OpenAI client with OpenRouter's endpoint
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or any OpenRouter-supported model
      messages: [{ role: "user", content: "Hello!" }],
    });

    if (response.choices[0].message.content) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("OpenRouter validation error:", error);

    // Check for 401 Unauthorized
    if (error.status === 401) {
      return false;
    }

    // Re-throw other errors
    throw new Error(
      `OpenRouter API validation failed: ${error.message || "Unknown error"}`
    );
  }
};
