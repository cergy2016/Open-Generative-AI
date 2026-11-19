// Chung Studio: size presets for book covers and KDP / social images.
// Generation models only accept fixed aspect ratios, so each preset picks the
// closest ratio the current model supports. Upscale the result to the target
// pixel size before uploading (KDP wants 300 dpi).

export const KDP_PRESETS = [
    { id: 'kindle-cover',  label: 'Kindle cover',          ratio: 1 / 1.6,  target: '1600 x 2560 px' },
    { id: 'paperback-6x9', label: 'Paperback 6 x 9 in',    ratio: 6 / 9,    target: '1800 x 2700 px (300 dpi)' },
    { id: 'paperback-55',  label: 'Paperback 5.5 x 8.5 in', ratio: 5.5 / 8.5, target: '1650 x 2550 px (300 dpi)' },
    { id: 'pinterest',     label: 'Pinterest pin',         ratio: 2 / 3,    target: '1000 x 1500 px' },
    { id: 'square',        label: 'Square post',           ratio: 1,        target: '1080 x 1080 px' },
    { id: 'banner',        label: 'Banner / YouTube',      ratio: 16 / 9,   target: '1920 x 1080 px' },
];

function parseRatio(str) {
    const m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(String(str).trim());
    if (!m) return null;
    const w = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    return w > 0 && h > 0 ? w / h : null;
}

// Returns the supported aspect-ratio string closest to the preset, or null.
export function nearestAspectRatio(preset, available) {
    let best = null;
    let bestDiff = Infinity;
    for (const r of available || []) {
        const v = parseRatio(r);
        if (!v) continue;
        const diff = Math.abs(Math.log(v / preset.ratio));
        if (diff < bestDiff) { bestDiff = diff; best = r; }
    }
    return best;
}

export function showPresetNotice(message) {
    const el = document.createElement('div');
    el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-black/90 border border-white/10 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
}
