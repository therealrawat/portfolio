import process from 'process';
import { handleAIChat } from '../../src/api/ai-handler';

export default async function chat(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = (process as any).env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }

    const body = (await request.json()) as { prompt?: string };
    if (!body.prompt?.trim()) {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = await handleAIChat(body.prompt, apiKey);

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
