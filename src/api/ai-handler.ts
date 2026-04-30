import { GoogleGenerativeAI } from '@google/generative-ai';

export async function handleAIChat(prompt: string, apiKey: string, retries = 2): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    // If it's a 503 (Server Busy) and we have retries left...
    if (error.status === 503 && retries > 0) {
      console.log(`Model busy, retrying... (${retries} attempts left)`);
      // Wait 2 seconds before trying again
      await new Promise(resolve => setTimeout(resolve, 2000));
      return handleAIChat(prompt, apiKey, retries - 1);
    }

    // Friendly message for the UI
    if (error.status === 503) {
      return "Google's AI servers are currently overloaded due to high demand. Please wait a moment and try your question again!";
    }

    throw error;
  }
}