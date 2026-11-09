console.log(`%c[FORENSIC] MODULE LOADED — js/components/FlipEngine.js`, 'color:#27ae60;font-weight:bold');

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

import { CFG, TOTAL_SPREADS } from '../config.js';
import { EventBus } from '../core/EventBus.js';
import { completeNavigation, getCurrentSpread, getIsFlipping, setIsFlipping, getBookElement } from '../core/BookState.js';
import { renderSpread, showCurrentSpread } from './BookEngine.js';

let flipTimeline: any = null;

interface FlipInfo {
  w: number;
  flipEl: HTMLElement;
}

function _f_createFlipPage(dir: number): FlipInfo | null {
  console.log(`%c[FORENSIC] getElementById('flip-page') — js/components/FlipEngine.js`, 'color:#f28b9e;font-weight:bold');
  const flipEl = document.getElementById('flip-page');
  if (flipEl) { console.log(`%c[FORENSIC] getElementById('flip-page') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('flip-page') → NULL`, 'color:#e67e22;font-weight:bold'); }
  const bookEl = getBookElement();
  if (!flipEl || !bookEl) return null;
  const w = bookEl.offsetWidth;
  const h = bookEl.offsetHeight;
  if (!w || !h) return null;

  const curIdx = getCurrentSpread();
  const nextIdx = curIdx + dir;
  if (nextIdx < 0 || nextIdx >= TOTAL_SPREADS) return null;

  flipEl.style.display = 'block';
  flipEl.style.width = w + 'px';
  flipEl.style.height = h + 'px';
  flipEl.style.zIndex = '10';
  flipEl.style.top = '0';
  flipEl.style.left = dir === 1 ? '0' : (w * 0.5) + 'px';
  flipEl.style.transformOrigin = 'left center';
  flipEl.style.transform = 'perspective(' + CFG.flipPerspective + 'px) rotateY(0deg)';

  const targetIdx = dir === 1 ? nextIdx : curIdx - 1;
  flipEl.innerHTML = '';
  renderSpread(targetIdx);
  const spreadEl = bookEl.querySelector('.book-spread[data-spread="' + targetIdx + '"]');
  if (spreadEl) {
    const clone = spreadEl.cloneNode(true) as HTMLElement;
    clone.classList.remove('active');
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.pointerEvents = 'none';
    clone.querySelectorAll('.p-img-lazy').forEach(img => {
      const htmlImg = img as HTMLImageElement;
      const src = htmlImg.dataset.src || htmlImg.src;
      if (src && !htmlImg.src) htmlImg.src = src;
    });
    flipEl.appendChild(clone);
  }

  return { w, flipEl };
}
const createFlipPage = _fW(_f_createFlipPage, 'createFlipPage', 'js/components/FlipEngine.js');

function _f_navigateWithFlip(dir: number, onComplete?: () => void): void {
  if (getIsFlipping()) return;
  const cur = getCurrentSpread();
  const next = cur + dir;
  if (next < 0 || next >= TOTAL_SPREADS) return;

  setIsFlipping(true);
  EventBus.emit('audiofx:page-turn', {});

  if (window.gsap) {
    gsapFlipNavigate(dir, onComplete);
  } else {
    instantNavigate(dir, onComplete);
  }
}
export const navigateWithFlip = _fW(_f_navigateWithFlip, 'navigateWithFlip', 'js/components/FlipEngine.js');

function _f_gsapFlipNavigate(dir: number, onComplete?: () => void): void {
  const info = createFlipPage(dir);
  if (!info) { instantNavigate(dir, onComplete); return; }
  const { flipEl } = info;
  const dur = CFG.flipDuration / 1000;

  const tl = window.gsap.timeline({
    onComplete: () => {
      flipEl.style.display = 'none';
      flipEl.innerHTML = '';
      completeNavigation(dir);
      setIsFlipping(false);
      renderSpread(getCurrentSpread());
      showCurrentSpread();
      if (onComplete) onComplete();
    },
  });

  tl.to(flipEl, {
    rotationY: dir === 1 ? -180 : 180,
    duration: dur,
    ease: 'power2.inOut',
    transformOrigin: 'left center',
    transformPerspective: CFG.flipPerspective,
  });

  flipTimeline = tl;
}
const gsapFlipNavigate = _fW(_f_gsapFlipNavigate, 'gsapFlipNavigate', 'js/components/FlipEngine.js');

function _f_instantNavigate(dir: number, onComplete?: () => void): void {
  completeNavigation(dir);
  setIsFlipping(false);
  renderSpread(getCurrentSpread());
  showCurrentSpread();
  if (onComplete) onComplete();
}
const instantNavigate = _fW(_f_instantNavigate, 'instantNavigate', 'js/components/FlipEngine.js');
