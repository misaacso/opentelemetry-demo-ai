// pages/api/ollama-chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ollamaUrl = process.env.OLLAMA_URL || 'http://192.168.1.233:11434';
  //const ollamaUrl = 'http://192.168.1.233:11434';

  console.log('Connecting to Ollama URL:', ollamaUrl);
  
  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();

    // Normalize response shape for frontend
    const content =
      data?.message?.content ||
      data?.message ||
      data?.response ||
      JSON.stringify(data);

    res.status(200).json({ message: { content } });
  } catch (error: any) {
    console.error('Ollama proxy error:', error);
    res.status(500).json({
      message: { content: `Failed to connect to Ollama: ${error.message}` },
    });
  }
}
