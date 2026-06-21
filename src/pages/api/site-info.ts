import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://api.oyonews.com.ng/wp-json/wp/v2/settings');

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream error' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('site-info fetch failed:', err);
    return res.status(502).json({ error: 'Failed to reach API' });
  }
}