module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const allowed = [
    'query1.finance.yahoo.com',
    'query2.finance.yahoo.com',
    'finnhub.io',
  ];
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (!allowed.some(h => parsed.hostname.endsWith(h))) {
    return res.status(403).json({ error: 'URL not allowed' });
  }

  // For Finnhub requests, inject the API key from the environment variable
  if (parsed.hostname.endsWith('finnhub.io')) {
    const key = process.env.FINNHUB_KEY;
    if (!key) return res.status(500).json({ error: 'FINNHUB_KEY env var not set on server' });
    parsed.searchParams.set('token', key);
  }

  try {
    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://finance.yahoo.com',
        'Referer': 'https://finance.yahoo.com/',
      },
    });

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=10');
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
