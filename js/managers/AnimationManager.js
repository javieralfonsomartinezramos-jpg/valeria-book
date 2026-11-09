console.log(`%c[FORENSIC] MODULE LOADED — js/managers/AnimationManager.js`, 'color:#27ae60;font-weight:bold');

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

const frames = {};
let paused = false;
let saved = {};

export class AnimationManager {
  static init() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        paused = true;
        this._pauseNonEssential();
      } else {
        paused = false;
        this._resumeNonEssential();
      }
    });
  }

  static destroy() {
    Object.keys(frames).forEach(id => this.stop(id));
    document.removeEventListener('visibilitychange', this._handler);
  }

  static register(id, frameId) {
    frames[id] = { frameId, running: true };
  }

  static stop(id) {
    const f = frames[id];
    if (f?.frameId) { cancelAnimationFrame(f.frameId); }
    if (f) f.running = false;
  }

  static isPaused() { return paused; }

  static _pauseNonEssential() {
    ['particles', 'petals'].forEach(id => {
      if (frames[id]?.running) {
        saved[id] = true;
        this.stop(id);
      }
    });
  }

  static _resumeNonEssential() {
    ['particles', 'petals'].forEach(id => {
      if (saved[id] && frames[id]) {
        frames[id].running = true;
      }
    });
    saved = {};
  }
}

AnimationManager.init = _fW(AnimationManager.init.bind(AnimationManager), 'init', 'js/managers/AnimationManager.js');
AnimationManager.destroy = _fW(AnimationManager.destroy.bind(AnimationManager), 'destroy', 'js/managers/AnimationManager.js');
AnimationManager.register = _fW(AnimationManager.register.bind(AnimationManager), 'register', 'js/managers/AnimationManager.js');
AnimationManager.stop = _fW(AnimationManager.stop.bind(AnimationManager), 'stop', 'js/managers/AnimationManager.js');
AnimationManager.isPaused = _fW(AnimationManager.isPaused.bind(AnimationManager), 'isPaused', 'js/managers/AnimationManager.js');
AnimationManager._pauseNonEssential = _fW(AnimationManager._pauseNonEssential.bind(AnimationManager), '_pauseNonEssential', 'js/managers/AnimationManager.js');
AnimationManager._resumeNonEssential = _fW(AnimationManager._resumeNonEssential.bind(AnimationManager), '_resumeNonEssential', 'js/managers/AnimationManager.js');
