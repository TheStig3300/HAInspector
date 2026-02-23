import { defineConfig } from 'vite';

const WCLOUD_BASE =
  'https://apimgmt.widex.com/clp/v1/api/CrashLogProcessor/processArrayOfStrings';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'logprocessor-proxy',
      configureServer(server) {
        // Mirror the Vercel serverless function (api/logprocessor.js) for local dev.
        // Makes a clean backend fetch — no browser Origin/Referer headers leak through.
        server.middlewares.use('/api/logprocessor', async (req, res) => {
          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Method not allowed' }));
          }

          // Read request body
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = Buffer.concat(chunks).toString();

          // Parse firmwareVersion from query string
          const url = new URL(req.url, 'http://localhost');
          const fw = url.searchParams.get('firmwareVersion') || '';

          const upstream = `${WCLOUD_BASE}?firmwareVersion=${encodeURIComponent(fw)}`;
          const clientProgram = req.headers['x-clientprogram'] || 'HAInspector/1.0';
          const subscriptionKey = req.headers['ocp-apim-subscription-key'] || '';

          const headers = {
            'Content-Type': 'application/json',
            'x-ClientProgram': clientProgram,
          };
          if (subscriptionKey) {
            headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
          }

          console.log('[proxy] >>>', upstream);
          console.log('[proxy] >>> headers:', JSON.stringify(headers));
          console.log('[proxy] >>> body:', body.substring(0, 200));

          try {
            const upstreamRes = await fetch(upstream, {
              method: 'POST',
              headers,
              body,
            });

            const text = await upstreamRes.text();
            console.log('[proxy] <<< status:', upstreamRes.status);
            console.log('[proxy] <<< content-type:', upstreamRes.headers.get('content-type'));
            console.log('[proxy] <<< body:', text.substring(0, 300) || '(empty)');

            res.writeHead(upstreamRes.status, {
              'Content-Type': upstreamRes.headers.get('content-type') || 'application/json',
            });
            res.end(text);
          } catch (err) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to reach WCloud API', details: err.message }));
          }
        });
      },
    },
  ],
  test: {
    include: ['src/**/*.test.js'],
  }
});
