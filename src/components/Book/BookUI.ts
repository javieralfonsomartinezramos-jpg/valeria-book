import { TOTAL_SPREADS, SPREAD_IMAGE_START, IMAGE_COUNT, SPREAD_MOVIE_START, SPREAD_MOVIE_COUNT, SPREAD_MUSIC, SPREAD_NOTES, SPREAD_CLOSING } from '../../config';
import { EventBus } from '../../core/EventBus';
import { Logger } from '../../core/Logger';
import { navigateWithFlip, canGoNext, canGoPrev, getIsFlipping } from './FlipEngine';
import { Lightbox } from '../Lightbox/Lightbox';

let currentSpread = 0;

export function getCurrentSpread(): number { return currentSpread; }
export function setCurrentSpread(n: number): void { currentSpread = n; }

export function hasPrevPage(): boolean {
  return currentSpread > 0;
}

export function hasNextPage(): boolean {
  return currentSpread < TOTAL_SPREADS - 1;
}

export function completeNavigation(dir: number): void {
  const targetSpread = currentSpread + dir;
  if (targetSpread < 0 || targetSpread >= TOTAL_SPREADS) return;
  currentSpread = targetSpread;
}

export function getPageName(pageIndex: number): string {
  if (pageIndex <= 1) return 'Portada';
  if (pageIndex <= 5) return 'Prologo';
  if (pageIndex <= 7) return 'Cartas';
  const ms = SPREAD_MOVIE_START * 2;
  if (pageIndex >= ms && pageIndex < ms + SPREAD_MOVIE_COUNT * 2) return 'Nuestras peliculas';
  const isp = SPREAD_IMAGE_START * 2;
  const iep = isp + IMAGE_COUNT * 2;
  if (pageIndex >= isp && pageIndex < iep) return (pageIndex % 2 === 0) ? 'Nuestros recuerdos' : 'Gracias';
  const mp = SPREAD_MUSIC * 2;
  if (pageIndex === mp || pageIndex === mp + 1) return 'Nuestra música';
  const np = SPREAD_NOTES * 2;
  if (pageIndex === np || pageIndex === np + 1) return 'Dedicatoria y notas';
  const cp = SPREAD_CLOSING * 2;
  if (pageIndex === cp) return 'Fin';
  return '';
}

export function bindNavButtons(): void {
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (getIsFlipping()) return;
      if (canGoPrev()) navigateWithFlip(-1);
    });
  } else {
    Logger.warn('BookUI', 'nav-prev not found');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (getIsFlipping()) return;
      if (canGoNext()) navigateWithFlip(1);
    });
  } else {
    Logger.warn('BookUI', 'nav-next not found');
  }
}

export function bindKeyboardNav(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const lb = document.getElementById('lightbox');
    if (lb && !lb.hidden) {
      Lightbox.handleKey(e);
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (canGoPrev()) navigateWithFlip(-1);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (canGoNext()) navigateWithFlip(1);
    }
    if (e.key === 'Home') { e.preventDefault(); EventBus.emit('book:navigate', { spread: 0, animated: false }); }
    if (e.key === 'End') { e.preventDefault(); EventBus.emit('book:navigate', { spread: TOTAL_SPREADS - 1, animated: false }); }
    if (e.key === 'Escape') { e.preventDefault(); EventBus.emit('ui:toggle-sidebar'); }
  });
}

export function updateNavButtons(): void {
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');
  if (prevBtn) prevBtn.toggleAttribute('aria-disabled', !hasPrevPage());
  if (nextBtn) nextBtn.toggleAttribute('aria-disabled', !hasNextPage());
}
