console.log(`%c[FORENSIC] MODULE LOADED — js/components/Petals.js`, 'color:#27ae60;font-weight:bold');

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

export class Petals {
  static spawn() {
    console.log(`%c[FORENSIC] getElementById('close-petals') — js/components/Petals.js`, 'color:#f28b9e;font-weight:bold');
    const container = document.getElementById('close-petals');
    if (container) { console.log(`%c[FORENSIC] getElementById('close-petals') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('close-petals') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!container || container.children.length > 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const symbols = ['\u2665', '\u2661', '\u2726'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = symbols[i % symbols.length];
      p.style.left = Math.random() * 100 + '%';
      p.style.fontSize = (0.5 + Math.random() * 0.6) + 'rem';
      p.style.animationDuration = (6 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 6) + 's';
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }
}

Petals.spawn = _fW(Petals.spawn.bind(Petals), 'spawn', 'js/components/Petals.js');
