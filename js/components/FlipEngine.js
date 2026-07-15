import { CFG, TOTAL_SPREADS } from '../config.js';
import { EventBus } from '../core/EventBus.js';
import { Logger } from '../core/Logger.js';
import { completeNavigation, getCurrentSpread, getIsFlipping, setIsFlipping, getBookElement, isLastSpread, isFirstSpread } from '../core/BookState.js';
import { renderPage } from './BookEngine.js';

let flipTimeline = null;

export function getFlipTimeline() {
  return flipTimeline;
}

function createPageTurn(dir) {
  const flipEl = document.getElementById('flip-page');
  const bookEl = getBookElement();
  if (!flipEl || !bookEl) return null;
  const w = bookEl.offsetWidth;
  const h = bookEl.offsetHeight;
  if (!w || !h) return null;

  const curIdx = getCurrentSpread();
  const nextIdx = curIdx + dir;

  flipEl.style.display = 'block';
  flipEl.style.width = w + 'px';
  flipEl.style.height = h + 'px';
  flipEl.style.zIndex = '10';

  if (dir === 1) {
    flipEl.style.top = '0';
    flipEl.style.left = '0';
    flipEl.style.transformOrigin = 'left center';
    flipEl.style.transform = 'perspective(' + CFG.flipPerspective + 'px) rotateY(0deg)';
    flipEl.innerHTML = '';
    const content = renderPage(nextIdx);
    if (content) flipEl.appendChild(content);
  } else {
    flipEl.style.top = '0';
    flipEl.style.left = (w * 0.5) + 'px';
    flipEl.style.transformOrigin = 'left center';
    flipEl.style.transform = 'perspective(' + CFG.flipPerspective + 'px) rotateY(0deg)';
    flipEl.innerHTML = '';
    const content = renderPage(curIdx - 1);
    if (content) flipEl.appendChild(content);
  }

  return { w, h, flipEl };
}

export function navigateWithFlip(dir, onComplete) {
  if (getIsFlipping()) return;
  const cur = getCurrentSpread();
  const next = cur + dir;
  if (next < 0 || next >= TOTAL_SPREADS) return;

  setIsFlipping(true);

  if (window.gsap) {
    gsapFlipNavigate(dir, onComplete);
  } else {
    instantNavigate(dir, onComplete);
  }
}

function gsapFlipNavigate(dir, onComplete) {
  const info = createPageTurn(dir);
  if (!info) { instantNavigate(dir, onComplete); return; }
  const { w, flipEl } = info;
  const dur = CFG.flipDuration;

  const tl = gsap.timeline({
    onComplete: () => {
      flipEl.style.display = 'none';
      flipEl.innerHTML = '';
      completeNavigation(dir);
      setIsFlipping(false);
      if (onComplete) onComplete();
    }
  });

  if (dir === 1) {
    tl.to(flipEl, {
      rotationY: -180,
      duration: dur,
      ease: 'power2.inOut',
      transformOrigin: 'left center',
      transformPerspective: CFG.flipPerspective,
    });
  } else {
    tl.to(flipEl, {
      rotationY: 180,
      duration: dur,
      ease: 'power2.inOut',
      transformOrigin: 'left center',
      transformPerspective: CFG.flipPerspective,
    });
  }

  flipTimeline = tl;
}

function instantNavigate(dir, onComplete) {
  completeNavigation(dir);
  setIsFlipping(false);
  if (onComplete) onComplete();
}

export function animateCornerFold(pageEl, corner) {
  if (!pageEl || !window.gsap) return;
  const w = pageEl.offsetWidth || 300;
  gsap.fromTo(pageEl,
    {
      rotationY: corner === 'tl' ? -30 : 30,
      transformOrigin: corner.indexOf('l') !== -1 ? 'left center' : 'right center',
      transformPerspective: 1200,
      opacity: 0.85,
    },
    {
      rotationY: 0,
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out',
    }
  );
}
