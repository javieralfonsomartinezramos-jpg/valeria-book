import { TOTAL_SPREADS } from '../config.js';
import { Logger } from '../core/Logger.js';
import { getCurrentSpread, getBookElement, setBookConfig, setCurrentSpread } from '../core/BookState.js';
import { initPageImages, createPageContent } from './PageRenderer.js';

export function renderPage(pageIndex) {
  const content = createPageContent(pageIndex);
  if (content) return content;
  const div = document.createElement('div');
  div.className = 'p-empty';
  div.textContent = '';
  return div;
}

export function renderSpreads() {
  const bookEl = getBookElement();
  if (!bookEl) return;

  const totalPages = TOTAL_SPREADS * 2;
  const frag = document.createDocumentFragment();

  for (let s = 0; s < TOTAL_SPREADS; s++) {
    const leftIdx = s * 2;
    const rightIdx = s * 2 + 1;

    const spreadEl = document.createElement('div');
    spreadEl.className = 'book-spread';
    spreadEl.dataset.spread = String(s);

    const leftPage = document.createElement('div');
    leftPage.className = 'book-page book-page-left';
    leftPage.dataset.pageIndex = String(leftIdx);
    leftPage.setAttribute('aria-label', 'P\u00E1gina ' + (leftIdx + 1));
    const leftContent = renderPage(leftIdx);
    if (leftContent) leftPage.appendChild(leftContent);
    spreadEl.appendChild(leftPage);

    if (rightIdx < totalPages) {
      const rightPage = document.createElement('div');
      rightPage.className = 'book-page book-page-right';
      rightPage.dataset.pageIndex = String(rightIdx);
      rightPage.setAttribute('aria-label', 'P\u00E1gina ' + (rightIdx + 1));
      const rightContent = renderPage(rightIdx);
      if (rightContent) rightPage.appendChild(rightContent);
      spreadEl.appendChild(rightPage);
    } else {
      const emptyPage = document.createElement('div');
      emptyPage.className = 'book-page book-page-right';
      emptyPage.setAttribute('aria-label', 'P\u00E1gina vac\u00EDa');
      spreadEl.appendChild(emptyPage);
    }

    frag.appendChild(spreadEl);
  }

  bookEl.innerHTML = '';
  bookEl.appendChild(frag);
}

export function showCurrentSpread(animated) {
  const bookEl = getBookElement();
  if (!bookEl) return;
  const cur = getCurrentSpread();
  const prev = document.querySelector('.book-spread.active');
  if (prev) prev.classList.remove('active');

  const target = bookEl.querySelector('.book-spread[data-spread="' + cur + '"]');
  if (!target) {
    Logger.error('BookEngine', 'Spread not found', cur);
    return;
  }
  target.classList.add('active');
  if (animated && window.gsap) {
    gsap.fromTo(target,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }
}

export function navigateSpread(dir, opts) {
  const animated = opts && opts.animated !== undefined ? opts.animated : true;
  const cur = getCurrentSpread();
  const next = cur + dir;
  if (next < 0 || next >= TOTAL_SPREADS) return;

  if (animated && window.gsap) {
    const bookEl = getBookElement();
    const curEl = bookEl.querySelector('.book-spread[data-spread="' + cur + '"]');
    if (curEl) {
      gsap.to(curEl, {
        opacity: 0,
        x: dir > 0 ? -50 : 50,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentSpread(next);
          showCurrentSpread(true);
          const theBtn = document.getElementById(dir > 0 ? 'nav-next' : 'nav-prev');
          if (theBtn) theBtn.blur();
          if (opts && opts.onComplete) opts.onComplete();
        }
      });
      return;
    }
  }
  setCurrentSpread(next);
  showCurrentSpread(false);
  if (opts && opts.onComplete) opts.onComplete();
}

export function initBookEngine() {
  initPageImages();
  const bookEl = document.getElementById('book');
  if (!bookEl) {
    Logger.fatal('BookEngine', 'No #book element found');
    return;
  }
  setBookConfig({ bookElement: bookEl });
  renderSpreads();
  showCurrentSpread(false);
  Logger.info('BookEngine', 'Initialized', getCurrentSpread());
}

export function initBook() {
  initBookEngine();
}

export function renderSpread() {
  renderSpreads();
  showCurrentSpread(false);
}

export function goToSpread(spread) {
  if (spread < 0 || spread >= TOTAL_SPREADS) return;
  setCurrentSpread(spread);
  showCurrentSpread(false);
}

export function navigateToSpreadAnimated(spread) {
  return new Promise((resolve) => {
    if (spread < 0 || spread >= TOTAL_SPREADS) { resolve(); return; }
    const cur = getCurrentSpread();
    if (spread === cur) { resolve(); return; }
    const dir = spread > cur ? 1 : -1;
    const steps = Math.abs(spread - cur);
    let completed = 0;
    const stepFn = () => {
      if (completed >= steps) { resolve(); return; }
      completed++;
      const cb = completed >= steps ? resolve : undefined;
      import('./FlipEngine.js').then(mod => mod.navigateWithFlip(dir, cb));
    };
    if (window.gsap) {
      stepFn();
    } else {
      goToSpread(spread);
      resolve();
    }
  });
}
