// pages/api/ollama-chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Ollama URL from environment variable or use in-cluster service
  //const ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
  const ollamaUrl = process.env.OLLAMA_URL || 'http://192.168.1.233:11434';

  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Ollama proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to Ollama',
      message: error.message 
    });
  }
}