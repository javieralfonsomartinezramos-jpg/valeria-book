console.log(`%c[FORENSIC] MODULE LOADED — js/managers/ResourceManager.js`, 'color:#27ae60;font-weight:bold');

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

import { Logger } from '../core/Logger.js';

let verificado = false;
let progress = 0;
let barFill = null;
let barPct = null;
let loaderEl = null;

export class ResourceManager {
  static init() {
    console.log(`%c[FORENSIC] getElementById('loader-fill') — js/managers/ResourceManager.js`, 'color:#f28b9e;font-weight:bold');
    barFill = document.getElementById('loader-fill');
    if (barFill) { console.log(`%c[FORENSIC] getElementById('loader-fill') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('loader-fill') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('loader-pct') — js/managers/ResourceManager.js`, 'color:#f28b9e;font-weight:bold');
    barPct = document.getElementById('loader-pct');
    if (barPct) { console.log(`%c[FORENSIC] getElementById('loader-pct') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('loader-pct') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('loader') — js/managers/ResourceManager.js`, 'color:#f28b9e;font-weight:bold');
    loaderEl = document.getElementById('loader');
    if (loaderEl) { console.log(`%c[FORENSIC] getElementById('loader') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('loader') → NULL`, 'color:#e67e22;font-weight:bold'); }
  }

  static getProgress() { return progress; }

  static getPromise() {
    if (verificado) return Promise.resolve();
    verificado = true;
    return new Promise(resolve => {
      this._setProgress(30);
      this._verifyCSS(() => {
        this._setProgress(50);
        this._verifyDOM(() => {
          this._setProgress(80);
          setTimeout(() => {
            this._setProgress(100);
            setTimeout(() => {
              if (loaderEl) loaderEl.classList.add('loaded');
              setTimeout(resolve, 200);
            }, 250);
          }, 100);
        });
      });
    });
  }

  static _setProgress(v) {
    const _prev = progress;
    const _t = performance.now();
    progress = v;
    if (barFill) {
      barFill.style.width = v + '%';
      console.log(`  📊 LOADER _setProgress(${v}%) — barFill.style.width = "${v}%" [prev=${_prev}]`);
    } else {
      console.warn(`  ⚠️ LOADER _setProgress(${v}%) — barFill es NULL!`);
    }
    if (barPct) {
      barPct.textContent = v + '%';
      console.log(`  📊 LOADER _setProgress(${v}%) — barPct.textContent = "${v}%"`);
    } else {
      console.warn(`  ⚠️ LOADER _setProgress(${v}%) — barPct es NULL!`);
    }
  }

  static _verifyCSS(done, _retries) {
    _retries = _retries || 0;
    const _t0 = performance.now();
    const test = getComputedStyle(document.documentElement);
    const rose = test.getPropertyValue('--rose');
    if (rose) {
      console.log(`  🎨 _verifyCSS — --rose = "${rose.trim()}" ENCONTRADO (sin reintentos)`);
      done();
      return;
    }
    Logger.warn('ResourceManager', `CSS vars not found (--rose), retry #${_retries+1}...`);
    console.warn(`  ⚠️ _verifyCSS — --rose NO ENCONTRADO, reintento #${_retries+1} en 100ms`);
    setTimeout(() => this._verifyCSS(done, _retries + 1), 100);
  }

  static _verifyDOM(done, _retries) {
    _retries = _retries || 0;
    const _t0 = performance.now();
    const book = document.getElementById('book');
    const portal = document.getElementById('portal');
    const bookOk = !!book, portalOk = !!portal;
    console.log(`  🏗 _verifyDOM — book=${bookOk ? '✅' : '❌'} portal=${portalOk ? '✅' : '❌'} (retry #${_retries})`);
    if (bookOk && portalOk) {
      console.log(`  🏗 _verifyDOM — AMBOS ENCONTRADOS (sin reintentos)`);
      done();
      return;
    }
    Logger.warn('ResourceManager', `DOM elements not ready (book=${bookOk}, portal=${portalOk}), retry #${_retries+1}...`);
    console.warn(`  ⚠️ _verifyDOM — book=${bookOk ? 'OK' : 'NULL'} portal=${portalOk ? 'OK' : 'NULL'}, reintento #${_retries+1} en 100ms`);
    setTimeout(() => this._verifyDOM(done, _retries + 1), 100);
  }
}

ResourceManager.init = _fW(ResourceManager.init.bind(ResourceManager), 'init', 'js/managers/ResourceManager.js');
ResourceManager.getProgress = _fW(ResourceManager.getProgress.bind(ResourceManager), 'getProgress', 'js/managers/ResourceManager.js');
ResourceManager.getPromise = _fW(ResourceManager.getPromise.bind(ResourceManager), 'getPromise', 'js/managers/ResourceManager.js');
ResourceManager._setProgress = _fW(ResourceManager._setProgress.bind(ResourceManager), '_setProgress', 'js/managers/ResourceManager.js');
ResourceManager._verifyCSS = _fW(ResourceManager._verifyCSS.bind(ResourceManager), '_verifyCSS', 'js/managers/ResourceManager.js');
ResourceManager._verifyDOM = _fW(ResourceManager._verifyDOM.bind(ResourceManager), '_verifyDOM', 'js/managers/ResourceManager.js');
