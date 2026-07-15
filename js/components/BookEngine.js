import { TOTAL_SPREADS, SPREAD_MUSIC, SPREAD_NOTES, SPREAD_CLOSING } from '../config.js';
import { Logger } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';
import { getCurrentSpread, getBookElement, setBookConfig, setCurrentSpread } from '../core/BookState.js';
import { createPageContent } from './PageRenderer.js';
import { ImageManager } from '../managers/ImageManager.js';

const KEEP_RANGE = 1;

function renderSinglePage(pageIndex) {
  const content = createPageContent(pageIndex);
  if (content) return content;
  const div = document.createElement('div');
  div.className = 'p-empty';
  return div;
}

function createSpreadDOM(spreadIdx) {
  const bookEl = getBookElement();
  if (!bookEl) return null;

  const spreadEl = document.createElement('div');
  spreadEl.className = 'book-spread';
  spreadEl.dataset.spread = String(spreadIdx);

  const leftIdx = spreadIdx * 2;
  const rightIdx = spreadIdx * 2 + 1;
  const totalPages = TOTAL_SPREADS * 2;

  const leftPage = document.createElement('div');
  leftPage.className = 'book-page book-page-left';
  leftPage.dataset.pageIndex = String(leftIdx);
  leftPage.setAttribute('aria-label', 'Página ' + (leftIdx + 1));
  const leftContent = renderSinglePage(leftIdx);
  if (leftContent) leftPage.appendChild(leftContent);
  spreadEl.appendChild(leftPage);

  if (rightIdx < totalPages) {
    const rightPage = document.createElement('div');
    rightPage.className = 'book-page book-page-right';
    rightPage.dataset.pageIndex = String(rightIdx);
    rightPage.setAttribute('aria-label', 'Página ' + (rightIdx + 1));
    const rightContent = renderSinglePage(rightIdx);
    if (rightContent) rightPage.appendChild(rightContent);
    spreadEl.appendChild(rightPage);
  }

  return spreadEl;
}

function destroySpread(spreadIdx) {
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

function syncWindows() {
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

export function renderSpread() {
  if (!getBookElement()) return;
  syncWindows();
}

export function showCurrentSpread() {
  const bookEl = getBookElement();
  if (!bookEl) return;
  const cur = getCurrentSpread();
  bookEl.querySelectorAll('.book-spread.active').forEach(el => el.classList.remove('active'));
  const target = bookEl.querySelector('.book-spread[data-spread="' + cur + '"]');
  if (target) {
    target.classList.add('active');
    ImageManager.loadImage(target);
  }

  EventBus.emit('book:spread-changed', cur);
  if (cur === SPREAD_MUSIC) EventBus.emit('ui:reach-music', {});
  if (cur === SPREAD_NOTES) EventBus.emit('ui:reach-notes', {});
  if (cur === SPREAD_CLOSING) EventBus.emit('ui:reach-closing', {});
}

export function goToSpread(spread) {
  if (spread < 0 || spread >= TOTAL_SPREADS) return;
  const cur = getCurrentSpread();
  if (spread === cur) return;
  setCurrentSpread(spread);
  syncWindows();
  showCurrentSpread();
}

export function navigateToSpreadAnimated(spread) {
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

export function initBook() {
  const bookEl = document.getElementById('book');
  if (!bookEl) { Logger.error('BookEngine', 'No #book element found'); return; }
  setBookConfig({ bookElement: bookEl });
  syncWindows();
  showCurrentSpread();
  Logger.info('BookEngine', 'Initialized');
}
