import { TOTAL_SPREADS, SPREAD_MUSIC, SPREAD_NOTES, SPREAD_CLOSING } from '../../config';
import { EventBus } from '../../core/EventBus';
import { Logger } from '../../core/Logger';
import { StorageManager } from '../../core/StorageManager';
import { initPageImages, createPageContent, setLightboxOpenFn } from './PageRenderer';
import { initFlipEngine, navigateWithFlip, getIsFlipping, animatePageContent } from './FlipEngine';
import { getCurrentSpread, setCurrentSpread, getPageName, bindNavButtons, bindKeyboardNav, completeNavigation, updateNavButtons } from './BookUI';
import { Lightbox } from '../Lightbox/Lightbox';

interface BookElements {
  psLeft: HTMLElement | null;
  psRight: HTMLElement | null;
  bodyL: HTMLElement | null;
  bodyR: HTMLElement | null;
  numL: HTMLElement | null;
  numR: HTMLElement | null;
  flip: HTMLElement | null;
  fFront: HTMLElement | null;
  fBack: HTMLElement | null;
  fBodyF: HTMLElement | null;
  fBodyB: HTMLElement | null;
  fNumF: HTMLElement | null;
  fNumB: HTMLElement | null;
  fShadow: HTMLElement | null;
  foldGrad: HTMLElement | null;
  topbar: HTMLElement | null;
  title: HTMLElement | null;
  bmRibbon: HTMLElement | null;
  bm: HTMLElement | null;
  book: HTMLElement | null;
}

const DOM: BookElements = {
  psLeft: null, psRight: null, bodyL: null, bodyR: null,
  numL: null, numR: null, flip: null, fFront: null, fBack: null,
  fBodyF: null, fBodyB: null, fNumF: null, fNumB: null,
  fShadow: null, foldGrad: null, topbar: null, title: null,
  bmRibbon: null, bm: null, book: null,
};

let initialized = false;

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function initBook(): void {
  if (initialized) return;
  initialized = true;

  DOM.psLeft = $('ps-left');
  DOM.psRight = $('ps-right');
  DOM.bodyL = $('body-left');
  DOM.bodyR = $('body-right');
  DOM.numL = $('num-left');
  DOM.numR = $('num-right');
  DOM.flip = $('flip-page');
  DOM.fFront = $('f-front');
  DOM.fBack = $('f-back');
  DOM.fBodyF = $('f-body-f');
  DOM.fBodyB = $('f-body-b');
  DOM.fNumF = $('f-num-f');
  DOM.fNumB = $('f-num-b');
  DOM.fShadow = $('f-shadow');
  DOM.foldGrad = $('fold-gradient');
  DOM.topbar = $('topbar');
  DOM.title = $('topbar-title');
  DOM.bmRibbon = $('bm-ribbon');
  DOM.bm = $('bookmark');
  DOM.book = $('book');

  initPageImages();

  initFlipEngine(
    {
      flip: DOM.flip,
      fFront: DOM.fFront,
      fBack: DOM.fBack,
      fBodyF: DOM.fBodyF,
      fBodyB: DOM.fBodyB,
      fNumF: DOM.fNumF,
      fNumB: DOM.fNumB,
      fShadow: DOM.fShadow,
      foldGrad: DOM.foldGrad,
      book: DOM.book,
    },
    {
      onNavigate: (dir: number) => onFlipNavigate(dir),
      getCurrentSpread: () => getCurrentSpread(),
      isMobile: () => window.innerWidth < 640,
    }
  );

  const saved = StorageManager.getSpread();
  if (saved >= 0 && saved < TOTAL_SPREADS) setCurrentSpread(saved);

  renderSpread();
  bindNavButtons();
  bindKeyboardNav();

  setLightboxOpenFn((idx: number) => Lightbox.open(idx));

  EventBus.on('book:navigate', (data) => {
    const n = data.spread;
    if (n < 0 || n >= TOTAL_SPREADS || getIsFlipping()) return;
    const current = getCurrentSpread();
    const diff = n - current;
    if (Math.abs(diff) === 1) {
      navigateWithFlip(diff > 0 ? 1 : -1);
    } else {
      goToSpread(n);
    }
  });

  Logger.info('BookEngine', 'Initialized');
}

function onFlipNavigate(dir: number): void {
  completeNavigation(dir);
  renderSpread();
  StorageManager.setSpread(getCurrentSpread());
  EventBus.emit('audiofx:page-turn');
}

export function renderSpread(): void {
  const mob = window.innerWidth < 640;
  const spread = getCurrentSpread();
  const leftIdx = spread * 2;
  const rightIdx = spread * 2 + 1;
  let titlePageIdx = rightIdx;

  if (mob) {
    const showingIdx = rightIdx;
    titlePageIdx = showingIdx;
    const content = createPageContent(showingIdx);
    if (DOM.bodyR) {
      DOM.bodyR.innerHTML = '';
      if (content) DOM.bodyR.appendChild(content);
      animatePageContent(DOM.bodyR);
    }
    if (DOM.numR) DOM.numR.textContent = String(showingIdx + 1);
    if (DOM.psLeft) DOM.psLeft.style.display = 'none';
  } else {
    if (DOM.psLeft) DOM.psLeft.style.display = '';
    const contentL = createPageContent(leftIdx);
    if (DOM.bodyL) {
      DOM.bodyL.innerHTML = '';
      if (contentL) DOM.bodyL.appendChild(contentL);
      animatePageContent(DOM.bodyL);
    }
    if (DOM.numL) DOM.numL.textContent = String(leftIdx + 1);

    const contentR = createPageContent(rightIdx);
    if (DOM.bodyR) {
      DOM.bodyR.innerHTML = '';
      if (contentR) DOM.bodyR.appendChild(contentR);
      animatePageContent(DOM.bodyR);
    }
    if (DOM.numR) DOM.numR.textContent = String(rightIdx + 1);
  }

  if (DOM.title) DOM.title.textContent = getPageName(titlePageIdx);

  const total = mob ? TOTAL_SPREADS * 2 - 1 : TOTAL_SPREADS - 1;
  const current = mob ? rightIdx : spread;
  const pct = total > 0 ? (current / total) * 100 : 0;
  if (DOM.bmRibbon) DOM.bmRibbon.style.width = pct + '%';
  if (DOM.bm) DOM.bm.setAttribute('aria-valuenow', String(Math.round(pct)));
  const isCover = spread === 0;
  if (DOM.topbar) DOM.topbar.hidden = isCover;
  const coverEl = document.querySelector('.book-cover-front') as HTMLElement | null;
  if (coverEl) coverEl.style.display = isCover ? 'flex' : 'none';

  updateNavButtons();
  EventBus.emit('book:page-changed', { spread, total: TOTAL_SPREADS, isMobile: mob });
  afterRender(titlePageIdx);
}

function afterRender(n: number): void {
  const mp = SPREAD_MUSIC * 2;
  const np = SPREAD_NOTES * 2;
  const cp = SPREAD_CLOSING * 2;

  if (n === mp || n === mp + 1) {
    EventBus.emit('ui:reach-music');
  }
  if (n === np || n === np + 1) {
    EventBus.emit('ui:reach-notes');
  }
  if (n === cp) {
    EventBus.emit('ui:reach-closing');
  }
}

export function goToSpread(n: number): void {
  if (n < 0 || n >= TOTAL_SPREADS || getIsFlipping()) return;
  setCurrentSpread(n);
  renderSpread();
  StorageManager.setSpread(getCurrentSpread());
}

export function navigateToSpreadAnimated(n: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (n < 0 || n >= TOTAL_SPREADS || getIsFlipping()) { resolve(false); return; }
    const current = getCurrentSpread();
    if (n === current) { renderSpread(); resolve(true); return; }
    const diff = n - current;
    if (Math.abs(diff) === 1) {
      navigateWithFlip(diff > 0 ? 1 : -1).then(resolve);
      return;
    }
    setCurrentSpread(n);
    renderSpread();
    StorageManager.setSpread(getCurrentSpread());
    resolve(true);
  });
}
