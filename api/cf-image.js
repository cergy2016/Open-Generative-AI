// Chung Studio: forwards an image request to Cloudflare Workers AI (FLUX.1 schnell).
// The browser cannot call api.cloudflare.com directly (CORS), so it calls this
// function. The Cloudflare token comes from the user's own browser settings in
// each request and is never stored or logged here.

const MODEL = '@cf/black-forest-labs/flux-1-schnell';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

    const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
    const { accountId, token, prompt } = body;
    const steps = Math.min(8, Math.max(1, parseInt(body.steps, 10) || 4));
    const seed = Number.isInteger(body.seed) && body.seed >= 0 ? body.seed : undefined;

    if (!/^[a-f0-9]{32}$/i.test(String(accountId || ''))) {
        return res.status(400).json({ error: 'Invalid Cloudflare Account ID (32 hex characters).' });
    }
    if (!token || !/^[\x21-\x7E]+$/.test(String(token))) {
        return res.status(400).json({ error: 'Missing or invalid Cloudflare API token.' });
    }
    if (!prompt || typeof prompt !== 'string' || prompt.length > 2048) {
        return res.status(400).json({ error: 'Prompt is required and must be 2048 characters or fewer.' });
    }

    try {
        const payload = { prompt, steps };
        if (seed !== undefined) payload.seed = seed;
        const cf = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );
        const data = await cf.json().catch(() => ({}));
        const image = data?.result?.image;
        if (!cf.ok || !image) {
            const msg = data?.errors?.[0]?.message || `Cloudflare returned ${cf.status}`;
            return res.status(cf.ok ? 502 : cf.status).json({ error: msg });
        }
        return res.status(200).json({ image });
    } catch (e) {
        return res.status(502).json({ error: 'Could not reach Cloudflare.' });
    }
};

function safeParse(s) {
    try { return JSON.parse(s); } catch { return {}; }
}
