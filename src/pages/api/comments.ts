import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const query = new URLSearchParams(req.query as Record<string, string>).toString();
      const response = await fetch(
        `https://api.oyonews.com.ng/wp-json/wp/v2/comments?${query}`
      );
      if (!response.ok) return res.status(response.status).json({ error: 'Upstream error' });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const response = await fetch(
        'https://api.oyonews.com.ng/wp-json/wp/v2/comments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify(req.body),
        }
      );
      if (!response.ok) return res.status(response.status).json({ error: 'Upstream error' });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch {
    return res.status(502).json({ error: 'Failed to reach API' });
  }
}