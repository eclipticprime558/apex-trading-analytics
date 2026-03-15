module.exports = async function handler(req, res) {
  // Allow CORS from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  // Only allow Yahoo Finance and Finnhub requests through this proxy
  const allowed = [
    'query1.finance.yahoo.com',
    'query2.finance.yahoo.com',
    'finnhub.io',
  ];
  let targetHost;
  try {
    targetHost = new URL(url).hostname;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (!allowed.some(h => targetHost.endsWith(h))) {
    return res.status(403).json({ error: 'URL not allowed' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://finance.yahoo.com',
        'Referer': 'https://finance.yahoo.com/',
      },
    });

    const data = await response.json();
    // Cache for 60 seconds on Vercel's edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
