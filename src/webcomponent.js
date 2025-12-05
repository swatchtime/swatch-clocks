class SwatchClockElement extends HTMLElement {
  connectedCallback() {
    const style = this.getAttribute('data-style') || this.dataset.style;
    let preset = null;
    try {
      preset = (typeof window !== 'undefined' && typeof window.getPreset === 'function') ? window.getPreset(style) : null;
    } catch (e) {
      // ignore
    }

    const opts = preset && typeof window.buildOptionsForElement === 'function' ? window.buildOptionsForElement(this, preset) : (preset || {});

    if (typeof window.Clock === 'function') {
      new window.Clock(this, opts);
    } else {
      this.textContent = 'SwatchClock: ' + (style || 'unknown');
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('swatch-clock')) {
  customElements.define('swatch-clock', SwatchClockElement);
}

export default SwatchClockElement;
