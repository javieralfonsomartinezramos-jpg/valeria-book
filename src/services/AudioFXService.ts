import { StorageManager } from '../core/StorageManager';
import { Logger } from '../core/Logger';
import { EventBus } from '../core/EventBus';

export class AudioFXService {
  private static enabled = false;
  private static ctx: AudioContext | null = null;

  static init(): void {
    this.enabled = StorageManager.getAudioFX();
    this.updateBtn();
    EventBus.on('audiofx:page-turn', () => this.play());
    Logger.info('AudioFX', 'Initialized');
  }

  private static ensureCtx(): AudioContext | null {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
      catch { return null; }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  static toggle(): void {
    this.enabled = !this.enabled;
    StorageManager.setAudioFX(this.enabled);
    this.updateBtn();
  }

  static play(): void {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
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

  private static updateBtn(): void {
    const btn = document.getElementById('btn-sound');
    if (btn) {
      (btn as HTMLElement).style.color = this.enabled ? 'var(--rose)' : '';
      btn.setAttribute('aria-pressed', this.enabled ? 'true' : 'false');
    }
  }
}
