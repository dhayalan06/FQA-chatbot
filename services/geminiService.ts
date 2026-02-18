import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini AI client
// Note: We are using a generic try-catch block in the functions to handle missing keys gracefully in the UI.
let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } else {
    console.warn("API_KEY is missing. Gemini features will not work.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

export const generateFallbackResponse = async (query: string): Promise<string> => {
  if (!ai) {
    return "I'm sorry, I couldn't find an answer in my database, and I cannot connect to my external brain (API Key missing).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful customer support AI. 
      The user asked: "${query}". 
      We do not have a specific FAQ for this in our local database.
      Please provide a helpful, polite, and concise general answer. 
      If the question is completely unrelated to technology or business, politely decline to answer.`,
    });

    return response.text || "I'm having trouble thinking of an answer right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm currently unable to generate a response due to a connection issue.";
  }
};

export const enhanceAnswer = async (faqAnswer: string, userQuery: string): Promise<string> => {
    if (!ai) return faqAnswer;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user asked: "${userQuery}".
            Our official FAQ answer is: "${faqAnswer}".
            Rephrase the FAQ answer to be more conversational and directly address the user's specific phrasing, but do not change the factual meaning.`
        });
        return response.text || faqAnswer;
    } catch (e) {
        return faqAnswer;
    }
}
