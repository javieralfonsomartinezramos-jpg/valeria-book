console.log(`%c[FORENSIC] MODULE LOADED — js/services/AudioFXService.js`, 'color:#27ae60;font-weight:bold');

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

import { StorageManager } from '../core/StorageManager.js';
import { Logger } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

let enabled = false;
let ctx = null;

function _f_updateBtn() {
  console.log(`%c[FORENSIC] getElementById('btn-sound') — js/services/AudioFXService.js`, 'color:#f28b9e;font-weight:bold');
  const btn = document.getElementById('btn-sound');
  if (btn) { console.log(`%c[FORENSIC] getElementById('btn-sound') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('btn-sound') → NULL`, 'color:#e67e22;font-weight:bold'); }
  if (btn) {
    btn.style.color = enabled ? 'var(--rose)' : '';
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }
}
const updateBtn = _fW(_f_updateBtn, 'updateBtn', 'js/services/AudioFXService.js');

export class AudioFXService {
  static init() {
    enabled = StorageManager.getAudioFX();
    updateBtn();
    EventBus.on('audiofx:page-turn', () => AudioFXService.play());
    Logger.info('AudioFX', 'Initialized');
  }

  static toggle() {
    enabled = !enabled;
    StorageManager.setAudioFX(enabled);
    updateBtn();
  }

  static play() {
    if (!enabled) return;
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch { return; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    try {
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.04, now);
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
      }
      noise.buffer = buf;
      noise.connect(gain);
      noise.start(now);
      noise.stop(now + 0.06);
    } catch (err) {
      Logger.error('AudioFXService', 'Failed to play page-turn sound', err);
    }
  }
}

AudioFXService.init = _fW(AudioFXService.init.bind(AudioFXService), 'init', 'js/services/AudioFXService.js');
AudioFXService.toggle = _fW(AudioFXService.toggle.bind(AudioFXService), 'toggle', 'js/services/AudioFXService.js');
AudioFXService.play = _fW(AudioFXService.play.bind(AudioFXService), 'play', 'js/services/AudioFXService.js');
