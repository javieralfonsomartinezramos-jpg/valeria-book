import { StorageManager } from '../core/StorageManager.js';
import { Logger } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

let enabled = false;
let ctx = null;

function updateBtn() {
  const btn = document.getElementById('btn-sound');
  if (btn) {
    btn.style.color = enabled ? 'var(--rose)' : '';
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }
}

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
