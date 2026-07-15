console.log(`%c[FORENSIC] MODULE LOADED — js/ui/FocusTrap.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = (fn, label, path) => function(...args) {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${e?.message||e}`); console.trace(); console.groupEnd(); throw e; }
};

export class FocusTrap {
  static handler = null;

  static _f_orig_trap(container, firstEl) {
    const sel = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])';
    const els = Array.from(container.querySelectorAll(sel));
    const first = els[0];
    const last = els[els.length - 1];

    this.handler = (e) => {
      if (e.key !== 'Tab') return;
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === container) {
          e.preventDefault();
          (last || first).focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', this.handler);
    requestAnimationFrame(() => (firstEl || first || container).focus());

    return () => {
      if (this.handler) {
        container.removeEventListener('keydown', this.handler);
        this.handler = null;
      }
    };
  }
}

FocusTrap.trap = _fW(FocusTrap._f_orig_trap.bind(FocusTrap), 'trap', 'js/ui/FocusTrap.js');
