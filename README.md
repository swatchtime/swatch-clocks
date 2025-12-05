# Swatch Clocks

A library you can use to insert Swatch Internet Time clocks into your own website or Javascript application.

## License

[MIT](LICENSE)

## Usage

This library provides two modes of consumption:

- ESM named exports (for bundlers / frameworks): `getPreset`, `getPresets`, `getPresetNormalized`, `buildOptionsForElement`, `Clock`, and `autoInit`.
- UMD / browser build: attaches a runtime helper to `window.SwatchClocks` and registers a small Web Component `<swatch-clock>` for convenience.

### Auto-init behavior

By default the browser/UMD bundle will automatically initialize any `.internetTime` containers on the page when the script loads. If you prefer to control initialization manually (for SPA frameworks like Preact/React/Vue), set:

```html
<script>window.SwatchClocksAutoInit = false;</script>
<script src="https://cdn.jsdelivr.net/npm/@swatchtime/clocks@1.0.0/dist/clocks.min.js"></script>
```

When `window.SwatchClocksAutoInit` is `false` the bundle will not perform automatic DOM mounting. You can then initialize programmatically using one of the methods below.

### Manual initialization (UMD global)

If you're using the UMD bundle, call the runtime helper `window.SwatchClocks.autoInit(root)` to initialize clocks inside `root` (or the whole document):

```js
// initialize all .internetTime elements under #app
window.SwatchClocks.autoInit(document.getElementById('app'));
```

This helper mirrors the library's internal behavior and is safe to call multiple times.

### Manual initialization (ESM)

Import the named exports and construct `Clock` instances yourself for fine-grained control and cleanup.

Example (Preact / React `useEffect`):

```js
import { useEffect, useRef } from 'preact/hooks';
import { getPreset, buildOptionsForElement, Clock } from '@swatchtime/clocks';

function ManualClocks() {
	const rootRef = useRef(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const instances = [];
		root.querySelectorAll('.internetTime').forEach(el => {
			const style = el.dataset.style;
			const norm = typeof getPreset === 'function' ? getPreset(style) : null;
			const opts = typeof buildOptionsForElement === 'function' ? buildOptionsForElement(el, norm) : (norm || {});
			if (typeof Clock === 'function') {
				instances.push(new Clock(el, opts));
			}
		});

		return () => {
			instances.forEach(i => i && typeof i.destroy === 'function' && i.destroy());
		};
	}, []);

	return (
		<div ref={rootRef}>
			<div class="internetTime" data-style="minimal-plain-small"></div>
		</div>
	);
}
```

### Using the Web Component

The library registers a lightweight custom element `<swatch-clock>` that mounts itself when connected. Use it in markup or JSX:

```html
<swatch-clock data-style="minimal-plain-small"></swatch-clock>
```

If you render server-side, ensure the element is only created on the client (or wrap in a client-only component) to avoid SSR issues with unknown elements.

### Loading from jsDelivr (after publish)

After publishing to npm, the library will be available on jsDelivr. Example:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@swatchtime/clocks@1.0.0/dist/clocks.css">
<script src="https://cdn.jsdelivr.net/npm/@swatchtime/clocks@1.0.0/dist/clocks.min.js"></script>
```

Pin versions in production to avoid unexpected updates.

---

## Development

Build with Rollup:

```bash
npm install
npm run build
```

The build produces `dist/clocks.esm.js`, `dist/clocks.umd.js` and extracted `dist/clocks.css`.

If you want examples for Preact integration or automated publish workflows, open an issue or request a sample file and I'll add it here.
