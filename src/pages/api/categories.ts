import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const url = `https://api.oyonews.com.ng/wp-json/wp/v2/categories?${query}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; OyoNewsProxy/1.0)',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Upstream error:', response.status, text.slice(0, 200));
      return res.status(response.status).json({ error: 'Upstream error' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(502).json({ error: 'Failed to reach API' });
  }
}