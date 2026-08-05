/**
 * Portfolio Worker — static assets + privacy-friendly event ingest.
 * No cookies, no fingerprinting, no PII. Respects Do Not Track.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/event' && request.method === 'POST') {
      if (request.headers.get('DNT') === '1') {
        return new Response(null, { status: 204 });
      }

      let body = {};
      try {
        body = await request.json();
      } catch {
        return new Response('Bad Request', { status: 400 });
      }

      const path = String(body.p || '').slice(0, 200);
      const hash = String(body.h || '').slice(0, 80);
      const event = String(body.e || 'pageview').slice(0, 40);
      const referrerHost = String(body.r || '').slice(0, 120);

      if (!path.startsWith('/')) {
        return new Response('Bad Request', { status: 400 });
      }

      if (env.ANALYTICS) {
        env.ANALYTICS.writeDataPoint({
          indexes: [event],
          blobs: [path, hash, referrerHost],
          doubles: [1],
        });
      }

      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': url.origin,
          'Cache-Control': 'no-store',
        },
      });
    }

    if (url.pathname === '/api/event' && request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': url.origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
