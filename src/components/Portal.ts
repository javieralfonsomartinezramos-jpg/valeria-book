console.log(`%c[FORENSIC] MODULE LOADED — js/components/Portal.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, label: string, path: string) => function(this: unknown, ...args: TArgs): TReturn {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${(e as Error).message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${(e as Error).message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { FocusTrap } from '../core/FocusTrap.js';
import { Logger } from '../core/Logger.js';

let releaseFocus: (() => void) | null = null;

export class Portal {
  static init() {
    console.log(`%c[FORENSIC] getElementById('portal') — js/components/Portal.js`, 'color:#f28b9e;font-weight:bold');
    const portal = document.getElementById('portal');
    if (portal) { console.log(`%c[FORENSIC] getElementById('portal') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('portal') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('portal-btn') — js/components/Portal.js`, 'color:#f28b9e;font-weight:bold');
    const btn = document.getElementById('portal-btn');
    if (btn) { console.log(`%c[FORENSIC] getElementById('portal-btn') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('portal-btn') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!portal || !btn) { Logger.warn('Portal', 'Elements not found'); return; }
    releaseFocus = FocusTrap.trap(portal, btn);
  }

  static close() {
    console.log(`%c[FORENSIC] getElementById('portal') — js/components/Portal.js`, 'color:#f28b9e;font-weight:bold');
    const portal = document.getElementById('portal');
    if (portal) { console.log(`%c[FORENSIC] getElementById('portal') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('portal') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!portal) return;
    if (window.gsap) {
      window.gsap.to(portal, {
        opacity: 0, scale: 1.08, duration: 0.8, ease: 'power2.inOut',
        onComplete: () => {
          portal.style.display = 'none';
          if (releaseFocus) releaseFocus();
          console.log(`%c[FORENSIC] getElementById('book') — js/components/Portal.js`, 'color:#f28b9e;font-weight:bold');
          const book = document.getElementById('book');
          if (book) { console.log(`%c[FORENSIC] getElementById('book') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('book') → NULL`, 'color:#e67e22;font-weight:bold'); }
          if (book) { book.tabIndex = -1; book.focus(); }
        },
      });
    } else {
      portal.style.display = 'none';
      if (releaseFocus) releaseFocus();
    }
  }
}

Portal.init = _fW(Portal.init.bind(Portal), 'init', 'js/components/Portal.js');
Portal.close = _fW(Portal.close.bind(Portal), 'close', 'js/components/Portal.js');
