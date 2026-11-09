console.log(`%c[FORENSIC] MODULE LOADED — js/components/BookEngine.js`, 'color:#27ae60;font-weight:bold');

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

import { TOTAL_SPREADS, SPREAD_IMAGE_START, SPREAD_MUSIC, SPREAD_NOTES, SPREAD_CLOSING } from '../config.js';
import { Logger } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';
import { getCurrentSpread, getBookElement, setBookConfig, setCurrentSpread } from '../core/BookState.js';
import { createPageContent } from './PageRenderer.js';
import { ImageManager } from '../managers/ImageManager.js';

const KEEP_RANGE = 1;

function _f_renderSinglePage(pageIndex) {
  const content = createPageContent(pageIndex);
  if (content) return content;
  const div = document.createElement('div');
  div.className = 'p-empty';
  return div;
}
const renderSinglePage = _fW(_f_renderSinglePage, 'renderSinglePage', 'js/components/BookEngine.js');

function _f_createSpreadDOM(spreadIdx) {
  const _t0 = performance.now();
  const bookEl = getBookElement();
  if (!bookEl) { console.warn(`  📖 createSpreadDOM(${spreadIdx}) — bookEl es NULL`); return null; }

  const leftIdx = spreadIdx * 2;
  const rightIdx = spreadIdx * 2 + 1;
  const totalPages = TOTAL_SPREADS * 2;

  console.log(`  📖 createSpreadDOM(spread=${spreadIdx}) — pages: left=${leftIdx}${rightIdx < totalPages ? ', right=' + rightIdx : ' (no right)'}, totalPages=${totalPages}`);

  const spreadEl = document.createElement('div');
  spreadEl.className = 'book-spread';
  spreadEl.dataset.spread = String(spreadIdx);

  const leftPage = document.createElement('div');
  leftPage.className = 'book-page book-page-left';
  leftPage.dataset.pageIndex = String(leftIdx);
  leftPage.setAttribute('aria-label', 'Página ' + (leftIdx + 1));
  const leftContent = renderSinglePage(leftIdx);
  if (leftContent) leftPage.appendChild(leftContent); else console.warn(`  ⚠️ createSpreadDOM(${spreadIdx}) — leftContent NULL`);
  spreadEl.appendChild(leftPage);

  if (rightIdx < totalPages) {
    const rightPage = document.createElement('div');
    rightPage.className = 'book-page book-page-right';
    rightPage.dataset.pageIndex = String(rightIdx);
    rightPage.setAttribute('aria-label', 'Página ' + (rightIdx + 1));
    const rightContent = renderSinglePage(rightIdx);
    if (rightContent) rightPage.appendChild(rightContent); else console.warn(`  ⚠️ createSpreadDOM(${spreadIdx}) — rightContent NULL`);
    spreadEl.appendChild(rightPage);
  }

  console.log(`  📖 createSpreadDOM(spread=${spreadIdx}) — completado en ${(performance.now() - _t0).toFixed(2)}ms`);
  return spreadEl;
}
const createSpreadDOM = _fW(_f_createSpreadDOM, 'createSpreadDOM', 'js/components/BookEngine.js');

function _f_destroySpread(spreadIdx) {
  const bookEl = getBookElement();
  if (!bookEl) return;
  const el = bookEl.querySelector('.book-spread[data-spread="' + spreadIdx + '"]');
  if (!el) return;
  el.querySelectorAll('.p-img-lazy').forEach(img => {
    const src = img.src;
    img.removeAttribute('src');
    img.classList.remove('loaded');
    if (src) URL.revokeObjectURL?.(src);
  });
  el.innerHTML = '';
  el.remove();
}
const destroySpread = _fW(_f_destroySpread, 'destroySpread', 'js/components/BookEngine.js');

function _f_syncWindows() {
  const bookEl = getBookElement();
  if (!bookEl) return;
  const cur = getCurrentSpread();
  const keepSet = new Set();
  for (let i = Math.max(0, cur - KEEP_RANGE); i <= Math.min(TOTAL_SPREADS - 1, cur + KEEP_RANGE); i++) {
    keepSet.add(i);
  }
  Array.from(bookEl.querySelectorAll('.book-spread')).forEach(el => {
    const s = parseInt(el.dataset.spread, 10);
    if (!isNaN(s) && !keepSet.has(s)) destroySpread(s);
  });
  keepSet.forEach(s => {
    if (!bookEl.querySelector('.book-spread[data-spread="' + s + '"]')) {
      const spreadEl = createSpreadDOM(s);
      if (spreadEl) bookEl.appendChild(spreadEl);
    }
  });
}
const syncWindows = _fW(_f_syncWindows, 'syncWindows', 'js/components/BookEngine.js');

function _f_renderSpread() {
  if (!getBookElement()) return;
  syncWindows();
}
export const renderSpread = _fW(_f_renderSpread, 'renderSpread', 'js/components/BookEngine.js');

function _f_showCurrentSpread() {
  const _t0 = performance.now();
  const bookEl = getBookElement();
  if (!bookEl) { console.warn(`  📖 showCurrentSpread — bookEl NULL`); return; }
  const cur = getCurrentSpread();
  console.log(`  📖 showCurrentSpread — spread=${cur}, pageNames: left="${SPREAD_IMAGE_START <= cur ? 'image' : 'letter'}", right="..."`);
  const prevActive = bookEl.querySelectorAll('.book-spread.active');
  console.log(`  📖 showCurrentSpread — desactivando ${prevActive.length} spread(s) activo(s) previo(s)`);
  prevActive.forEach(el => el.classList.remove('active'));
  const target = bookEl.querySelector('.book-spread[data-spread="' + cur + '"]');
  if (target) {
    target.classList.add('active');
    console.log(`  📖 showCurrentSpread — spread ${cur} ACTIVADO`);
    ImageManager.loadImage(target);
    console.log(`  📖 showCurrentSpread — ImageManager.loadImage() llamado`);
  } else {
    console.warn(`  ⚠️ showCurrentSpread — spread ${cur} NO ENCONTRADO en el DOM`);
  }

  EventBus.emit('book:spread-changed', cur);
  if (cur === SPREAD_MUSIC) { console.log(`  📖 showCurrentSpread — reach MUSIC, emitiendo ui:reach-music`); EventBus.emit('ui:reach-music', {}); }
  if (cur === SPREAD_NOTES) { console.log(`  📖 showCurrentSpread — reach NOTES, emitiendo ui:reach-notes`); EventBus.emit('ui:reach-notes', {}); }
  if (cur === SPREAD_CLOSING) { console.log(`  📖 showCurrentSpread — reach CLOSING, emitiendo ui:reach-closing`); EventBus.emit('ui:reach-closing', {}); }
  console.log(`  📖 showCurrentSpread — completado en ${(performance.now() - _t0).toFixed(2)}ms`);
}
export const showCurrentSpread = _fW(_f_showCurrentSpread, 'showCurrentSpread', 'js/components/BookEngine.js');

function _f_goToSpread(spread) {
  if (spread < 0 || spread >= TOTAL_SPREADS) return;
  const cur = getCurrentSpread();
  if (spread === cur) return;
  setCurrentSpread(spread);
  syncWindows();
  showCurrentSpread();
}
export const goToSpread = _fW(_f_goToSpread, 'goToSpread', 'js/components/BookEngine.js');

function _f_navigateToSpreadAnimated(spread) {
  return new Promise(function (resolve) {
    if (spread < 0 || spread >= TOTAL_SPREADS || spread === getCurrentSpread()) { resolve(); return; }
    const dir = spread > getCurrentSpread() ? 1 : -1;
    const steps = Math.abs(spread - getCurrentSpread());
    let completed = 0;
    function step() {
      if (completed >= steps) { resolve(); return; }
      completed++;
      const next = getCurrentSpread() + dir;
      if (next < 0 || next >= TOTAL_SPREADS) { resolve(); return; }
      setCurrentSpread(next);
      syncWindows();
      showCurrentSpread();
      if (completed >= steps) resolve(); else step();
    }
    step();
  });
}
export const navigateToSpreadAnimated = _fW(_f_navigateToSpreadAnimated, 'navigateToSpreadAnimated', 'js/components/BookEngine.js');

function _f_initBook() {
  console.log(`%c[FORENSIC] getElementById('book') — js/components/BookEngine.js`, 'color:#f28b9e;font-weight:bold');
  const bookEl = document.getElementById('book');
  if (bookEl) { console.log(`%c[FORENSIC] getElementById('book') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('book') → NULL`, 'color:#e67e22;font-weight:bold'); }
  if (!bookEl) { Logger.error('BookEngine', 'No #book element found'); return; }
  setBookConfig({ bookElement: bookEl });
  syncWindows();
  showCurrentSpread();
  Logger.info('BookEngine', 'Initialized');
}
export const initBook = _fW(_f_initBook, 'initBook', 'js/components/BookEngine.js');
