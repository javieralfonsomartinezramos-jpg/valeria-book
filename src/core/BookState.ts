import { TOTAL_SPREADS } from '../config';
import { Logger } from './Logger';

export type FlipPhase = 'idle' | 'folding' | 'turning' | 'settling';

interface BookStateData {
  currentSpread: number;
  isFlipping: boolean;
  flipPhase: FlipPhase;
}

const state: BookStateData = {
  currentSpread: 0,
  isFlipping: false,
  flipPhase: 'idle',
};

export function getCurrentSpread(): number { return state.currentSpread; }
export function getIsFlipping(): boolean { return state.isFlipping; }

export function setCurrentSpread(n: number): void {
  if (n < 0 || n >= TOTAL_SPREADS) return;
  state.currentSpread = n;
  Logger.info('BookState', `Spread → ${n}`);
}

export function setFlipPhase(phase: FlipPhase): void {
  state.flipPhase = phase;
  state.isFlipping = phase !== 'idle';
}

export function setFlipDirection(_dir: number): void {}

export function canGoNext(): boolean {
  return state.currentSpread < TOTAL_SPREADS - 1;
}

export function canGoPrev(): boolean {
  return state.currentSpread > 0;
}

export function completeNavigation(dir?: number): void {
  if (dir) state.currentSpread += dir;
  state.isFlipping = false;
  state.flipPhase = 'idle';
}

export function resetState(): void {
  state.currentSpread = 0;
  state.isFlipping = false;
  state.flipPhase = 'idle';
}
