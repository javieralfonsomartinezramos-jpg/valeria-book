import { CFG, TOTAL_SPREADS } from '../config.js';
import { EventBus } from '../core/EventBus.js';
import { completeNavigation, getCurrentSpread, getIsFlipping, setIsFlipping, getBookElement } from '../core/BookState.js';
import { renderSpread, showCurrentSpread } from './BookEngine.js';

let flipTimeline = null;

function createFlipPage(dir) {
  const flipEl = document.getElementById('flip-page');
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
    const clone = spreadEl.cloneNode(true);
    clone.classList.remove('active');
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.pointerEvents = 'none';
    clone.querySelectorAll('.p-img-lazy').forEach(img => {
      const src = img.dataset.src || img.src;
      if (src && !img.src) img.src = src;
    });
    flipEl.appendChild(clone);
  }

  return { w, flipEl };
}

export function navigateWithFlip(dir, onComplete) {
  if (getIsFlipping()) return;
  const cur = getCurrentSpread();
  const next = cur + dir;
  if (next < 0 || next >= TOTAL_SPREADS) return;

  setIsFlipping(true);
  EventBus.emit('audiofx:page-turn');

  if (window.gsap) {
    gsapFlipNavigate(dir, onComplete);
  } else {
    instantNavigate(dir, onComplete);
  }
}

function gsapFlipNavigate(dir, onComplete) {
  const info = createFlipPage(dir);
  if (!info) { instantNavigate(dir, onComplete); return; }
  const { flipEl } = info;
  const dur = CFG.flipDuration / 1000;

  const tl = gsap.timeline({
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

function instantNavigate(dir, onComplete) {
  completeNavigation(dir);
  setIsFlipping(false);
  renderSpread(getCurrentSpread());
  showCurrentSpread();
  if (onComplete) onComplete();
}
