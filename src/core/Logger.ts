import type { LogLevel } from '../types';

console.log(`%c[FORENSIC] MODULE LOADED — js/core/Logger.js`, 'color:#27ae60;font-weight:bold');

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

const ENABLED: Record<LogLevel, boolean> = {
  info: true,
  warn: true,
  error: true,
  debug: false,
};

export class Logger {
  static PREFIX = '[VBook]';

  static info(source: string, message: string, ...args: unknown[]) {
    if (!ENABLED.info) return;
    console.info(`${this.PREFIX}[${source}] ${message}`, ...args);
  }

  static warn(source: string, message: string, ...args: unknown[]) {
    if (!ENABLED.warn) return;
    console.warn(`${this.PREFIX}[${source}] ${message}`, ...args);
  }

  static error(source: string, message: string, error?: unknown) {
    if (!ENABLED.error) return;
    console.error(`${this.PREFIX}[${source}] ${message}`, error ?? '');
  }

  static debug(source: string, message: string, ...args: unknown[]) {
    if (!ENABLED.debug) return;
    console.debug(`${this.PREFIX}[${source}] ${message}`, ...args);
  }
}

Logger.info = _fW(Logger.info.bind(Logger), 'info', 'js/core/Logger.js');
Logger.warn = _fW(Logger.warn.bind(Logger), 'warn', 'js/core/Logger.js');
Logger.error = _fW(Logger.error.bind(Logger), 'error', 'js/core/Logger.js');
Logger.debug = _fW(Logger.debug.bind(Logger), 'debug', 'js/core/Logger.js');
