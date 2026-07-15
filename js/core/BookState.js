import { TOTAL_SPREADS } from '../config.js';
import { Logger } from './Logger.js';

let bookElement = null;

const state = {
  currentSpread: 0,
  isFlipping: false,
  flipPhase: 'idle',
};

export function getBookElement() { return bookElement; }
export function setBookConfig(cfg) {
  if (cfg && cfg.bookElement) bookElement = cfg.bookElement;
}

export function setIsFlipping(v) {
  state.isFlipping = !!v;
  state.flipPhase = v ? 'flipping' : 'idle';
}

export function getCurrentSpread() { return state.currentSpread; }
export function getIsFlipping() { return state.isFlipping; }

export function setCurrentSpread(n) {
  if (n < 0 || n >= TOTAL_SPREADS) return;
  state.currentSpread = n;
  Logger.info('BookState', `Spread → ${n}`);
}

export function canGoNext() {
  return state.currentSpread < TOTAL_SPREADS - 1;
}

export function canGoPrev() {
  return state.currentSpread > 0;
}

export function completeNavigation(dir) {
  if (dir) state.currentSpread += dir;
  state.isFlipping = false;
  state.flipPhase = 'idle';
}


