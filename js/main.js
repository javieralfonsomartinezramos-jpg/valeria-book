console.log(`%c[FORENSIC] MODULE LOADED — js/main.js`, 'color:#27ae60;font-weight:bold');

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

import { Portal } from './components/Portal.js';
import { StartupManager } from './managers/StartupManager.js';

function _f_init() {
  console.log(`%c[FORENSIC] getElementById('portal-btn') — js/main.js`, 'color:#f28b9e;font-weight:bold');
  const btn = document.getElementById('portal-btn');
  if (btn) {
    console.log(`%c[FORENSIC] getElementById('portal-btn') → FOUND`, 'color:#27ae60;font-weight:bold');
  } else {
    console.warn(`%c[FORENSIC] ⚠ getElementById('portal-btn') → NULL`, 'color:#e67e22;font-weight:bold');
  }
  if (btn) {
    btn.addEventListener('click', () => {
      Portal.close();
      StartupManager.start();
    }, { once: true });
  }
}

const init = _fW(_f_init, 'init', 'js/main.js');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
