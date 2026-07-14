import { gsap } from 'gsap';
import { CFG, TOTAL_SPREADS } from '../../config';
import { createPageContent, hasPageContent } from './PageRenderer';

interface FlipDOM {
  flip: HTMLElement | null;
  fFront: HTMLElement | null;
  fBack: HTMLElement | null;
  fBodyF: HTMLElement | null;
  fBodyB: HTMLElement | null;
  fNumF: HTMLElement | null;
  fNumB: HTMLElement | null;
  fShadow: HTMLElement | null;
  foldGrad: HTMLElement | null;
  book: HTMLElement | null;
}

interface FlipCallbacks {
  onNavigate: (dir: number) => void;
  getCurrentSpread: () => number;
  isMobile: () => boolean;
}

let isFlipping = false;
let flipResolve: ((val: boolean) => void) | null = null;
const flipDOM: Partial<FlipDOM> = {};
const cbs: FlipCallbacks = {
  onNavigate: () => {},
  getCurrentSpread: () => 0,
  isMobile: () => false,
};

interface DragState {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  startTime: number;
  dir: number;
}
const drag: DragState = { active: false, startX: 0, startY: 0, currentX: 0, startTime: 0, dir: 0 };

export function initFlipEngine(dom: FlipDOM, callbacks: FlipCallbacks): void {
  Object.assign(flipDOM, dom);
  Object.assign(cbs, callbacks);
  bindFlipEvents();
}

export function canGoNext(): boolean {
  const mob = cbs.isMobile();
  if (mob) return findNextPageIdx() !== -1;
  return cbs.getCurrentSpread() < TOTAL_SPREADS - 1;
}

export function canGoPrev(): boolean {
  const mob = cbs.isMobile();
  if (mob) return findPrevPageIdx() !== -1;
  return cbs.getCurrentSpread() > 0;
}

export function getIsFlipping(): boolean { return isFlipping; }

function getMobilePageIdx(): number {
  const spread = cbs.getCurrentSpread();
  const rightIdx = spread * 2 + 1;
  if (hasPageContent(rightIdx)) return rightIdx;
  return spread * 2;
}

function findNextPageIdx(): number {
  const from = getMobilePageIdx();
  for (let i = from + 1; i < TOTAL_SPREADS * 2; i++) {
    if (hasPageContent(i)) return i;
  }
  return -1;
}

function findPrevPageIdx(): number {
  const from = getMobilePageIdx();
  for (let i = from - 1; i >= 0; i--) {
    if (hasPageContent(i)) return i;
  }
  return -1;
}

export function navigateWithFlip(dir: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (isFlipping) { resolve(false); return; }
    if (dir > 0 && !canGoNext()) { resolve(false); return; }
    if (dir < 0 && !canGoPrev()) { resolve(false); return; }

    const mob = cbs.isMobile();
    isFlipping = true;
    flipResolve = resolve;

    if (!flipDOM.flip) { resolve(false); return; }
    flipDOM.flip.hidden = false;
    flipDOM.flip.className = 'flip-page';
    if (flipDOM.book) flipDOM.book.classList.add('flipping');

    let frontPage: number, backPage: number;

    if (mob) {
      flipDOM.flip.classList.add('dir-full');
      const current = getMobilePageIdx();
      if (dir > 0) {
        const next = findNextPageIdx();
        if (next === -1) { cancelFlip(resolve); return; }
        frontPage = current;
        backPage = next;
      } else {
        const prev = findPrevPageIdx();
        if (prev === -1) { cancelFlip(resolve); return; }
        frontPage = current;
        backPage = prev;
      }
    } else {
      const spread = cbs.getCurrentSpread();
      if (dir > 0) {
        flipDOM.flip.classList.add('dir-right');
        frontPage = spread * 2 + 1;
        backPage = (spread + 1) * 2;
      } else {
        flipDOM.flip.classList.add('dir-left');
        frontPage = spread * 2;
        backPage = (spread - 1) * 2 + 1;
      }
    }

    renderFlipContent(frontPage, backPage);

    gsap.set(flipDOM.flip!, { rotationY: 0 });
    gsap.set(flipDOM.fFront!, { rotationY: 0 });
    gsap.set(flipDOM.fBack!, { rotationY: 180 });
    gsap.set(flipDOM.fShadow!, { opacity: 0 });
    gsap.set(flipDOM.foldGrad!, { opacity: 0 });

    const dur = CFG.flipDuration / 1000;
    const tl = gsap.timeline({
      onComplete: () => completeNavigation(dir, mob, resolve),
    });

    tl.to(flipDOM.flip!, {
      rotationY: dir > 0 ? -180 : 180,
      duration: dur,
      ease: 'power3.inOut',
    }, 0);

    tl.to(flipDOM.fShadow!, {
      opacity: 0.45,
      duration: dur * 0.45,
      ease: 'power2.out',
    }, 0);

    tl.to(flipDOM.fShadow!, {
      opacity: 0,
      duration: dur * 0.55,
      ease: 'power3.in',
    }, dur * 0.45);

    tl.to(flipDOM.foldGrad!, {
      opacity: 0.7,
      duration: dur * 0.25,
      ease: 'power2.out',
    }, 0);

    tl.to(flipDOM.foldGrad!, {
      opacity: 0,
      duration: dur * 0.55,
      ease: 'power3.in',
    }, dur * 0.35);
  });
}

function renderFlipContent(frontPage: number, backPage: number): void {
  const frontContent = createPageContent(frontPage);
  const backContent = createPageContent(backPage);

  if (flipDOM.fBodyF) {
    flipDOM.fBodyF.innerHTML = '';
    if (frontContent) flipDOM.fBodyF.appendChild(frontContent);
  }
  if (flipDOM.fBodyB) {
    flipDOM.fBodyB.innerHTML = '';
    if (backContent) flipDOM.fBodyB.appendChild(backContent);
  }
  if (flipDOM.fNumF) flipDOM.fNumF.textContent = String(frontPage + 1);
  if (flipDOM.fNumB) flipDOM.fNumB.textContent = String(backPage + 1);
}

function completeNavigation(dir: number, _mob: boolean, resolve: (v: boolean) => void): void {
  if (flipDOM.flip) flipDOM.flip.hidden = true;
  if (flipDOM.book) flipDOM.book.classList.remove('flipping');
  isFlipping = false;
  cbs.onNavigate(dir);
  if (flipResolve) { flipResolve(true); flipResolve = null; }
  resolve(true);
}

function cancelFlip(resolve: (v: boolean) => void): void {
  isFlipping = false;
  if (flipDOM.flip) flipDOM.flip.hidden = true;
  if (flipDOM.book) flipDOM.book.classList.remove('flipping');
  resolve(false);
  if (flipResolve) { flipResolve(false); flipResolve = null; }
}

function shouldIgnoreTarget(target: EventTarget | null): boolean {
  if (!target || !(target as HTMLElement).closest) return false;
  const el = target as HTMLElement;
  if (el.closest('button, a, input, textarea, select, label, [role="button"]')) return true;
  if (el.closest('.mp-queue, .notes-list, .lightbox')) return true;
  return false;
}

function bindFlipEvents(): void {
  if (!flipDOM.book) return;

  const onDown = (x: number, y: number, target: EventTarget | null) => {
    if (isFlipping || !flipDOM.book) return;
    const rect = flipDOM.book.getBoundingClientRect();
    const relX = (x - rect.left) / rect.width;
    if (relX < 0 || relX > 1) return;
    if (shouldIgnoreTarget(target)) return;

    drag.active = true;
    drag.startX = x;
    drag.startY = y;
    drag.currentX = x;
    drag.startTime = Date.now();

    const half = x > rect.left + rect.width / 2;
    if (half && canGoNext()) drag.dir = 1;
    else if (!half && canGoPrev()) drag.dir = -1;
    else drag.active = false;
  };

  const onMove = (x: number) => {
    if (!drag.active || !flipDOM.book) return;
    drag.currentX = x;
  };

  const onUp = () => {
    if (!drag.active) return;
    const dir = drag.dir;
    const dx = Math.abs(drag.currentX - drag.startX);
    const rect = flipDOM.book ? flipDOM.book.getBoundingClientRect() : { width: 600 };
    const progress = dx / (rect.width * 0.45);
    const dt = Date.now() - drag.startTime || 1;
    const vel = dx / dt;
    drag.active = false;

    if (progress >= CFG.flipThreshold || vel > 0.4) {
      navigateWithFlip(dir);
    }
  };

  if (window.PointerEvent) {
    flipDOM.book.addEventListener('pointerdown', (e) => onDown(e.clientX, e.clientY, e.target));
  } else {
    flipDOM.book.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', onUp, { passive: true });
    document.addEventListener('touchcancel', onUp, { passive: true });
  }

  document.addEventListener('pointermove', (e) => onMove(e.clientX));
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);
}

export function animateEntrance(el: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
}

export function animatePageContent(container: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const children = Array.from(container.children).filter(
    (c) => !c.classList.contains('p-image') && (c as HTMLElement).offsetParent !== null
  );
  if (children.length === 0) return;
  gsap.fromTo(children, { opacity: 0, y: 8 }, {
    opacity: 1, y: 0, duration: 0.35,
    stagger: 0.05, ease: 'power2.out',
  });
}
