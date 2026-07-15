console.log(`%c[FORENSIC] MODULE LOADED — js/managers/DOMManager.js`, 'color:#27ae60;font-weight:bold');

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

let cache = {};
const clickDelegates = [];
const keyDelegates = [];

function match(el, selector) {
  if (selector === '*') return true;
  return el?.matches?.(selector) || el?.closest?.(selector);
}

function onClick(e) {
  for (const [sel, fn] of clickDelegates) {
    if (match(e.target, sel) && !e.defaultPrevented) fn(e);
  }
}

function onKey(e) {
  for (const [sel, fn] of keyDelegates) {
    if (match(e.target, sel) && !e.defaultPrevented) fn(e);
  }
}

export class DOMManager {
  static init() {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
  }

  static destroy() {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    cache = {};
    clickDelegates.length = 0;
    keyDelegates.length = 0;
  }

  static get(id) {
    const _t0 = performance.now();
    if (id in cache) {
      console.log(`  📦 DOMManager.get("${id}") — CACHE HIT (${(performance.now() - _t0).toFixed(2)}ms), result: ${cache[id] ? 'ELEMENT' : 'null (cached as null)'}`);
      return cache[id];
    }
    console.log(`  📦 DOMManager.get("${id}") — CACHE MISS`);
    cache[id] = document.getElementById(id);
    if (cache[id]) {
      console.log(`  📦 DOMManager.get("${id}") → ELEMENTO ENCONTRADO (${(performance.now() - _t0).toFixed(2)}ms)`);
    } else {
      console.warn(`  ⚠️ DOMManager.get("${id}") → ELEMENTO INEXISTE (${(performance.now() - _t0).toFixed(2)}ms)`);
    }
    return cache[id];
  }

  static getAll(ids) {
    return ids.map(id => this.get(id));
  }

  static clearCache(id) { delete cache[id]; }

  static onClick(selector, handler) {
    clickDelegates.push([selector, handler]);
  }

  static onKey(selector, handler) {
    keyDelegates.push([selector, handler]);
  }

  static removeClick(selector, handler) {
    const i = clickDelegates.findIndex(([s, h]) => s === selector && h === handler);
    if (i >= 0) clickDelegates.splice(i, 1);
  }

  static removeKey(selector, handler) {
    const i = keyDelegates.findIndex(([s, h]) => s === selector && h === handler);
    if (i >= 0) keyDelegates.splice(i, 1);
  }
}

DOMManager.init = _fW(DOMManager.init.bind(DOMManager), 'init', 'js/managers/DOMManager.js');
DOMManager.destroy = _fW(DOMManager.destroy.bind(DOMManager), 'destroy', 'js/managers/DOMManager.js');
DOMManager.get = _fW(DOMManager.get.bind(DOMManager), 'get', 'js/managers/DOMManager.js');
DOMManager.getAll = _fW(DOMManager.getAll.bind(DOMManager), 'getAll', 'js/managers/DOMManager.js');
DOMManager.clearCache = _fW(DOMManager.clearCache.bind(DOMManager), 'clearCache', 'js/managers/DOMManager.js');
DOMManager.onClick = _fW(DOMManager.onClick.bind(DOMManager), 'onClick', 'js/managers/DOMManager.js');
DOMManager.onKey = _fW(DOMManager.onKey.bind(DOMManager), 'onKey', 'js/managers/DOMManager.js');
DOMManager.removeClick = _fW(DOMManager.removeClick.bind(DOMManager), 'removeClick', 'js/managers/DOMManager.js');
DOMManager.removeKey = _fW(DOMManager.removeKey.bind(DOMManager), 'removeKey', 'js/managers/DOMManager.js');
