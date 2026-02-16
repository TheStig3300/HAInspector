export default function handler(req, res) {
  res.json({
    country: req.headers['x-vercel-ip-country'] || 'unknown',
    city: decodeURIComponent(req.headers['x-vercel-ip-city'] || 'unknown'),
    region: req.headers['x-vercel-ip-country-region'] || 'unknown',
  });
}
