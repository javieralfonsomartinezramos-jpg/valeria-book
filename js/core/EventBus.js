console.log(`%c[FORENSIC] MODULE LOADED — js/core/EventBus.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = (fn, label, path) => function(...args) {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${e?.message||e}`); console.trace(); console.groupEnd(); throw e; }
};

export class EventBus {
  static listeners = new Map();

  static on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  static off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  static offAll(event) {
    this.listeners.delete(event);
  }

  static emit(event, data) {
    const cbs = this.listeners.get(event);
    const _t0 = performance.now();
    const count = cbs ? cbs.size : 0;
    console.log(`  📡 EventBus.emit("${event}") — listeners: ${count}, data: ${JSON.stringify(data).slice(0, 80)}`);
    if (!cbs) {
      console.log(`  📡 EventBus.emit("${event}") — SIN LISTENERS (evento perdido?)`);
      return;
    }
    let executed = 0, errors = 0;
    cbs.forEach((cb) => {
      try {
        const _t1 = performance.now();
        cb(data);
        console.log(`  📡 EventBus.emit("${event}") — listener #${executed + 1} ejecutado en ${(performance.now() - _t1).toFixed(2)}ms`);
        executed++;
      } catch (e) {
        console.error(`  📡 EventBus.emit("${event}") — listener #${executed + 1} ERROR: ${e.message || e}`);
        errors++;
        executed++;
      }
    });
    console.log(`  📡 EventBus.emit("${event}") — ${executed} ejecutados, ${errors} errores, ${count - executed} ignorados, total ${(performance.now() - _t0).toFixed(2)}ms`);
  }

  static clear() {
    this.listeners.clear();
  }
}

EventBus.on = _fW(EventBus.on.bind(EventBus), 'on', 'js/core/EventBus.js');
EventBus.off = _fW(EventBus.off.bind(EventBus), 'off', 'js/core/EventBus.js');
EventBus.offAll = _fW(EventBus.offAll.bind(EventBus), 'offAll', 'js/core/EventBus.js');
EventBus.emit = _fW(EventBus.emit.bind(EventBus), 'emit', 'js/core/EventBus.js');
EventBus.clear = _fW(EventBus.clear.bind(EventBus), 'clear', 'js/core/EventBus.js');
