import './clocks.css';
import { getPreset, getPresets, getPresetNormalized, buildOptionsForElement, Clock } from './clocks.js';
import SwatchClockElement from './webcomponent.js';

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

	// custom elements: <swatch-clock data-style="..."> — webcomponent auto-mounts
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

// Re-export core runtime helpers for ESM consumers
export { getPreset, getPresets, getPresetNormalized, buildOptionsForElement, Clock, SwatchClockElement };
