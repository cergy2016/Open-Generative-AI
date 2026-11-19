// Chung Studio: free image generation through Cloudflare Workers AI (FLUX.1 schnell).
export const CF_MODEL_ID = 'cloudflare-flux-schnell';
export const CF_MODEL_NAME = 'FLUX schnell (Cloudflare, free)';

const isWeb = () => typeof window !== 'undefined' && /^https?:$/.test(window.location.protocol);

export function hasCloudflareCreds() {
    return Boolean(localStorage.getItem('cf_account_id') && localStorage.getItem('cf_api_token'));
}

function endpoint() {
    if (isWeb()) return '/api/cf-image';
    // Desktop app (file://): needs the address of your deployed site.
    const base = (localStorage.getItem('cf_proxy_url') || '').trim().replace(/\/+$/, '');
    if (!base) {
        throw new Error('Desktop app: add your site address (Cloudflare proxy URL) in Settings.');
    }
    return `${base}/api/cf-image`;
}

// Returns a blob: URL for the generated JPEG.
export async function generateCloudflareImage({ prompt, steps = 4, seed }) {
    const accountId = (localStorage.getItem('cf_account_id') || '').trim();
    const token = (localStorage.getItem('cf_api_token') || '').trim();
    if (!accountId || !token) {
        throw new Error('Cloudflare credentials missing. Add them in Settings.');
    }
    const res = await fetch(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, token, prompt, steps, seed }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.image) {
        throw new Error(data.error || `Cloudflare request failed (${res.status})`);
    }
    const bytes = Uint8Array.from(atob(data.image), (c) => c.charCodeAt(0));
    return URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
}
