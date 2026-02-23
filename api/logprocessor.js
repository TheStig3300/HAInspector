/**
 * Vercel Serverless Proxy for WCloud CrashLogProcessor API
 *
 * Relays POST requests to the Widex CrashLogProcessor endpoint,
 * bypassing CORS restrictions (the WCloud API has no CORS headers
 * because it was designed for native C# app usage).
 *
 * Client sends: POST /api/logprocessor?firmwareVersion=X
 *   Body: { "hex_strings": ["0A", "FF", ...] }
 *
 * This proxy forwards to:
 *   POST https://apimgmt.widex.com/clp/v1/api/CrashLogProcessor/processArrayOfStrings?firmwareVersion=X
 */

const WCLOUD_BASE =
  'https://apimgmt.widex.com/clp/v1/api/CrashLogProcessor/processArrayOfStrings';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firmwareVersion } = req.query;
  if (!firmwareVersion) {
    return res.status(400).json({ error: 'firmwareVersion query parameter is required' });
  }

  // Forward headers from the client request
  const clientProgram = req.headers['x-clientprogram'] || 'HAInspector/1.0';
  const subscriptionKey = req.headers['ocp-apim-subscription-key'] || '';

  const url = `${WCLOUD_BASE}?firmwareVersion=${encodeURIComponent(firmwareVersion)}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-ClientProgram': clientProgram,
  };
  if (subscriptionKey) {
    headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const text = await upstream.text();

    // Forward the upstream status and body
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Failed to reach WCloud API', details: err.message });
  }
}
