import { TOTAL_SPREADS } from '../config.js';
import { Logger } from './Logger.js';

const state = {
  currentSpread: 0,
  isFlipping: false,
  flipPhase: 'idle',
};

export function getCurrentSpread() { return state.currentSpread; }
export function getIsFlipping() { return state.isFlipping; }

export function setCurrentSpread(n) {
  if (n < 0 || n >= TOTAL_SPREADS) return;
  state.currentSpread = n;
  Logger.info('BookState', `Spread → ${n}`);
}

export function setFlipPhase(phase) {
  state.flipPhase = phase;
  state.isFlipping = phase !== 'idle';
}

export function setFlipDirection() {}

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

export function resetState() {
  state.currentSpread = 0;
  state.isFlipping = false;
  state.flipPhase = 'idle';
}
