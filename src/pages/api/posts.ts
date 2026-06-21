import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { _embed, ...rest } = req.query;
    const params = new URLSearchParams(rest as Record<string, string>);
    if (_embed !== undefined) params.append('_embed', '1');

    const url = `https://api.oyonews.com.ng/wp-json/wp/v2/posts?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'X-LiteSpeed-Cache-Control': 'no-cache',
      },
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('Upstream error:', response.status, text.slice(0, 300));
      return res.status(response.status).json({ error: 'Upstream error' });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Failed to parse JSON. Response was:', text.slice(0, 300));
      return res.status(502).json({ error: 'Invalid JSON from upstream' });
    }

    if (!Array.isArray(data)) {
      console.error('Not an array:', JSON.stringify(data).slice(0, 300));
      return res.status(502).json({ error: 'Unexpected response shape' });
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(502).json({ error: 'Failed to reach API' });
  }
}