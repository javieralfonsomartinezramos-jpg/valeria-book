/* ============================================================
 *  FORENSIC DIAGNOSTIC — valeria-book
 *  Instrumentación completa de arranque.
 *  NO modifica comportamiento.
 *  ============================================================ */

const _F = window.__FORENSIC = {
  t0: performance.now(),
  counters: {},
  timers: {},
  promises: {},
  domQueries: {},
  moduleLoads: {},
  eventListeners: [],
  errors: [],
  unhandled: [],
};

const BOOT = 'color:#f28b9e;font-weight:bold';
const ERR  = 'color:#c0392b;font-weight:bold';
const WARN = 'color:#e67e22;font-weight:bold';
const OK   = 'color:#27ae60;font-weight:bold';

function ts() { return (performance.now() - _F.t0).toFixed(2); }

function mark(m) { performance.mark(m); }

function log(label, msg) {
  console.log(`%c[${ts()}ms] [FORENSIC] ${label} — ${msg}`, BOOT);
}

function warn(label, msg) {
  console.warn(`%c[${ts()}ms] [FORENSIC] ⚠ ${label} — ${msg}`, WARN);
}

function err(label, msg) {
  console.error(`%c[${ts()}ms] [FORENSIC] 🚨 ${label} — ${msg}`, ERR);
}

function ok(label, msg) {
  console.log(`%c[${ts()}ms] [FORENSIC] ✓ ${label} — ${msg}`, OK);
}

function count(label) {
  _F.counters[label] = (_F.counters[label] || 0) + 1;
  return _F.counters[label];
}

function traceModuleLoad(file) {
  const t = performance.now();
  _F.moduleLoads[file] = { status: 'loading', t0: t };
  log('MODULE', `${file} — loading`);
  return {
    done() {
      _F.moduleLoads[file].status = 'loaded';
      _F.moduleLoads[file].t1 = performance.now();
      ok('MODULE', `${file} — LOADED in ${(performance.now() - t).toFixed(2)}ms`);
    }
  };
}

function traceFn(file, fn, label) {
  return function traced(...args) {
    const id = count(`fn:${file}:${fn}`);
    const t = performance.now();
    console.groupCollapsed(`[${ts()}ms] [FN] ${file} → ${label || fn} [#${id}]`);
    log('FN', `${file}.${label || fn}() — enter`);
    if (args.length) log('FN', `  args: ${args.map(a => typeof a === 'object' ? JSON.stringify(a).slice(0,80) : String(a)).join(', ')}`);
    try {
      const result = fn.apply(this, args);
      const elapsed = performance.now() - t;
      if (result instanceof Promise) {
        log('FN', `${file}.${label || fn}() — returned Promise, awaiting...`);
        result.then(
          v => { ok('FN', `${file}.${label || fn}() — resolved in ${(performance.now() - t).toFixed(2)}ms`); console.groupEnd(); },
          e => { err('FN', `${file}.${label || fn}() — REJECTED after ${(performance.now() - t).toFixed(2)}ms: ${e?.message || e}`); console.groupEnd(); }
        );
      } else {
        ok('FN', `${file}.${label || fn}() — completed in ${elapsed.toFixed(2)}ms`);
        console.groupEnd();
      }
      return result;
    } catch (e) {
      err('FN', `${file}.${label || fn}() — EXCEPTION: ${e?.message || e}`);
      console.trace();
      console.groupEnd();
      throw e;
    }
  };
}

function getById(id, context) {
  count(`dom:getElementById`);
  const el = document.getElementById(id);
  if (el) {
    log('DOM', `${context || ''} getElementById('${id}') → FOUND`);
  } else {
    warn('DOM', `${context || ''} getElementById('${id}') → NULL ⚠️`);
  }
  return el;
}

function trackTimer(label, ms) {
  const id = setTimeout(() => {
    warn('TIMER', `${label} FIRED (${ms}ms)`);
  }, ms);
  _F.timers[label] = { id, ms, created: performance.now() };
  log('TIMER', `${label} — ${ms}ms timer CREATED`);
  return id;
}

function clearTrackedTimer(label) {
  if (_F.timers[label]) {
    clearTimeout(_F.timers[label].id);
    const elapsed = performance.now() - _F.timers[label].created;
    ok('TIMER', `${label} — CANCELLED after ${elapsed.toFixed(2)}ms`);
    delete _F.timers[label];
  }
}

function trackRaf(label, rafId) {
  log('RAF', `${label} — rafId=${rafId} CREATED`);
  return rafId;
}

function cancelRaf(label, rafId) {
  cancelAnimationFrame(rafId);
  log('RAF', `${label} — rafId=${rafId} CANCELLED`);
}

function trackPromise(label, promise) {
  const t = performance.now();
  const id = count(`promise:${label}`);
  _F.promises[`${label}#${id}`] = { status: 'pending', t0: t };
  log('PROMISE', `${label}#${id} — CREATED`);
  promise.then(
    v => {
      _F.promises[`${label}#${id}`].status = 'resolved';
      _F.promises[`${label}#${id}`].t1 = performance.now();
      ok('PROMISE', `${label}#${id} — RESOLVED in ${(performance.now() - t).toFixed(2)}ms`);
    },
    e => {
      _F.promises[`${label}#${id}`].status = 'rejected';
      _F.promises[`${label}#${id}`].t1 = performance.now();
      err('PROMISE', `${label}#${id} — REJECTED after ${(performance.now() - t).toFixed(2)}ms: ${e?.message || e}`);
    }
  );
  return promise;
}

function setupGlobalErrorHandlers() {
  log('GLOBAL', 'Setting up window.onerror + window.onunhandledrejection');
  window.onerror = function (msg, url, line, col, error) {
    err('GLOBAL', `onerror: ${msg} at ${url}:${line}:${col}`);
    _F.errors.push({ type: 'onerror', msg, url, line, col, stack: error?.stack });
    console.trace();
    return true;
  };
  window.onunhandledrejection = function (event) {
    err('GLOBAL', `onunhandledrejection: ${event.reason?.message || event.reason}`);
    _F.unhandled.push({ type: 'unhandledrejection', reason: event.reason?.message || String(event.reason), stack: event.reason?.stack });
    console.trace();
  };
  ok('GLOBAL', 'onerror + onunhandledrejection registered');
}

/* ============================================================
 *  Auto‑exec on first import
 *  ============================================================ */
setupGlobalErrorHandlers();
log('FORENSIC', 'forensic.js loaded and active');
