import { TOTAL_SPREADS } from '../config';
import { EventBus } from './EventBus';
import { Logger } from './Logger';

export type FlipPhase = 'idle' | 'folding' | 'turning' | 'settling';

interface BookStateData {
  currentSpread: number;
  isFlipping: boolean;
  flipPhase: FlipPhase;
  flipDirection: number;
  pageHistory: number[];
}

const state: BookStateData = {
  currentSpread: 0,
  isFlipping: false,
  flipPhase: 'idle',
  flipDirection: 0,
  pageHistory: [],
};

export function getCurrentSpread(): number { return state.currentSpread; }
export function getIsFlipping(): boolean { return state.isFlipping; }
export function getFlipPhase(): FlipPhase { return state.flipPhase; }
export function getFlipDirection(): number { return state.flipDirection; }
export function getPageHistory(): number[] { return [...state.pageHistory]; }

export function setCurrentSpread(n: number): void {
  if (n < 0 || n >= TOTAL_SPREADS) return;
  state.pageHistory.push(state.currentSpread);
  if (state.pageHistory.length > 50) state.pageHistory.shift();
  state.currentSpread = n;
  Logger.info('BookState', `Spread → ${n}`);
}

export function setFlipPhase(phase: FlipPhase): void {
  state.flipPhase = phase;
  state.isFlipping = phase !== 'idle';
}

export function setFlipDirection(dir: number): void {
  state.flipDirection = dir;
}

export function canGoNext(): boolean {
  return state.currentSpread < TOTAL_SPREADS - 1;
}

export function canGoPrev(): boolean {
  return state.currentSpread > 0;
}

export function hasNextPage(): boolean {
  return state.currentSpread < TOTAL_SPREADS - 1;
}

export function hasPrevPage(): boolean {
  return state.currentSpread > 0;
}

export function navigate(dir: number): boolean {
  if (state.isFlipping) return false;
  if (dir > 0 && !canGoNext()) return false;
  if (dir < 0 && !canGoPrev()) return false;
  state.flipDirection = dir;
  state.pageHistory.push(state.currentSpread);
  if (state.pageHistory.length > 50) state.pageHistory.shift();
  state.currentSpread += dir;
  state.isFlipping = true;
  state.flipPhase = 'folding';
  Logger.info('BookState', `Navigate ${dir > 0 ? '→' : '←'} spread ${state.currentSpread}`);
  EventBus.emit('book:will-navigate', { from: state.currentSpread - dir, to: state.currentSpread, dir });
  return true;
}

export function completeNavigation(): void {
  state.isFlipping = false;
  state.flipPhase = 'idle';
  state.flipDirection = 0;
  EventBus.emit('book:navigated', { spread: state.currentSpread });
}

export function goToSpread(n: number): void {
  if (n < 0 || n >= TOTAL_SPREADS || state.isFlipping) return;
  state.pageHistory.push(state.currentSpread);
  if (state.pageHistory.length > 50) state.pageHistory.shift();
  state.currentSpread = n;
  Logger.info('BookState', `Jump → spread ${n}`);
}

export function goBack(): boolean {
  if (state.pageHistory.length === 0 || state.isFlipping) return false;
  const prev = state.pageHistory.pop()!;
  state.currentSpread = prev;
  return true;
}

export function resetState(): void {
  state.currentSpread = 0;
  state.isFlipping = false;
  state.flipPhase = 'idle';
  state.flipDirection = 0;
  state.pageHistory = [];
}
