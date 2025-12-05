import './clocks.css';
import './clocks.js';
import './webcomponent.js';

// `src/clocks.js` is an IIFE that populates globals on `window` when run in a browser.
// We expose those globals as named exports for ESM consumers and also attach a
// runtime-friendly object to `window.SwatchClocks` for UMD/browser usage.

const getGlobal = (name, fallback) => (typeof window !== 'undefined' && window[name]) ? window[name] : fallback;

export const getPreset = getGlobal('getPreset', () => undefined);
export const getPresets = getGlobal('getPresets', () => []);
export const getPresetNormalized = getGlobal('getPresetNormalized', () => undefined);
export const buildOptionsForElement = getGlobal('buildOptionsForElement', null);
export const Clock = getGlobal('Clock', null);

// Helper: initialize all `div.internetTime` and `<swatch-clock>` places on the page
export function autoInit(root = document) {
	if (typeof document === 'undefined') return;

	// legacy containers
	const legacy = Array.from((root || document).querySelectorAll('.internetTime'));
	legacy.forEach(el => {
		try {
			const style = el.dataset.style;
			const norm = (typeof getPresetNormalized === 'function') ? getPresetNormalized(style) : (typeof getPreset === 'function' ? getPreset(style) : null);
			const opts = (typeof buildOptionsForElement === 'function') ? buildOptionsForElement(el, norm) : (norm || {});
			if (typeof Clock === 'function') new Clock(el, opts);
		} catch (e) { /* ignore per-element errors */ }
	});

	// custom elements: <swatch-clock data-style="...">
	const custom = Array.from((root || document).querySelectorAll('swatch-clock'));
	custom.forEach(el => {
		// the webcomponent will auto-mount itself; nothing to do here, but leave hook for future
	});
}

// When running in the browser attach a runtime helper object to window and auto-init
if (typeof window !== 'undefined') {
	const runtime = { getPreset, getPresets, getPresetNormalized, buildOptionsForElement, Clock, autoInit };
	// do not overwrite if user set their own SwatchClocks object
	if (!window.SwatchClocks) window.SwatchClocks = runtime;

	// Respect a global toggle `window.SwatchClocksAutoInit` (default true)
	try {
		if (window.SwatchClocksAutoInit !== false) {
			// run autoInit on DOMContentLoaded (if not already loaded)
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', () => autoInit(document));
			} else {
				autoInit(document);
			}
		}
	} catch (e) {
		// swallow any runtime errors during auto-init
	}
}

// No default export — this module only provides named exports to keep Rollup happy.
