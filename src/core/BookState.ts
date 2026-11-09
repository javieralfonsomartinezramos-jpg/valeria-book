import type { BookConfig } from '../types';

console.log(`%c[FORENSIC] MODULE LOADED — js/core/BookState.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, label: string, path: string) => function(this: unknown, ...args: TArgs): TReturn {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${(e as Error).message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { TOTAL_SPREADS } from '../config';
import { Logger } from './Logger';

let bookElement: HTMLElement | null = null;

const state: { currentSpread: number; isFlipping: boolean; flipPhase: string } = {
  currentSpread: 0,
  isFlipping: false,
  flipPhase: 'idle',
};

function _f_getBookElement(): HTMLElement | null { return bookElement; }
function _f_setBookConfig(cfg: BookConfig) {
  if (cfg && cfg.bookElement) bookElement = cfg.bookElement;
}

function _f_setIsFlipping(v: boolean) {
  state.isFlipping = !!v;
  state.flipPhase = v ? 'flipping' : 'idle';
}

function _f_getCurrentSpread(): number { return state.currentSpread; }
function _f_getIsFlipping(): boolean { return state.isFlipping; }

function _f_setCurrentSpread(n: number) {
  if (n < 0 || n >= TOTAL_SPREADS) return;
  state.currentSpread = n;
  Logger.info('BookState', `Spread → ${n}`);
}

function _f_canGoNext(): boolean {
  return state.currentSpread < TOTAL_SPREADS - 1;
}

function _f_canGoPrev(): boolean {
  return state.currentSpread > 0;
}

function _f_completeNavigation(dir?: number) {
  if (dir) state.currentSpread += dir;
  state.isFlipping = false;
  state.flipPhase = 'idle';
}

export const getBookElement = _fW(_f_getBookElement, 'getBookElement', 'js/core/BookState.js');
export const setBookConfig = _fW(_f_setBookConfig, 'setBookConfig', 'js/core/BookState.js');
export const setIsFlipping = _fW(_f_setIsFlipping, 'setIsFlipping', 'js/core/BookState.js');
export const getCurrentSpread = _fW(_f_getCurrentSpread, 'getCurrentSpread', 'js/core/BookState.js');
export const getIsFlipping = _fW(_f_getIsFlipping, 'getIsFlipping', 'js/core/BookState.js');
export const setCurrentSpread = _fW(_f_setCurrentSpread, 'setCurrentSpread', 'js/core/BookState.js');
export const canGoNext = _fW(_f_canGoNext, 'canGoNext', 'js/core/BookState.js');
export const canGoPrev = _fW(_f_canGoPrev, 'canGoPrev', 'js/core/BookState.js');
export const completeNavigation = _fW(_f_completeNavigation, 'completeNavigation', 'js/core/BookState.js');
