import { AudioManager } from '../../services/AudioManager';
import { EventBus } from '../../core/EventBus';
import { cleanLabel } from '../../core/Utils';
import { MUSIC } from '../../config';

type RepeatMode = 'off' | 'all' | 'one';

export class MusicPlayer {
  private static uiInited = false;
  private static shuffle = false;
  private static repeat: RepeatMode = 'off';

  static init(): void {
    AudioManager.init();
    EventBus.on('music:track-changed', () => this.refreshUI());
    EventBus.on('ui:reach-music', () => this.initUI());
  }

  static initUI(): void {
    if (this.uiInited) return;
    this.uiInited = true;
    const queue = document.getElementById('mp-queue');
    if (!queue) return;

    if (queue.children.length === 0) {
      MUSIC.forEach((name, i) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'qi';
        item.dataset.idx = String(i);
        item.setAttribute('aria-label', `Reproducir ${cleanLabel(name)}`);
        const num = document.createElement('span');
        num.className = 'qi-num';
        num.textContent = String(i + 1);
        const nameSpan = document.createElement('span');
        nameSpan.className = 'qi-name';
        nameSpan.textContent = cleanLabel(name);
        item.appendChild(num);
        item.appendChild(nameSpan);
        item.addEventListener('click', () => AudioManager.play(i));
        queue.appendChild(item);
      });
    }

    this.bindUIEvents();
    AudioManager.updateUI();
    this.syncControls();
    this.syncToggleButtons();
  }

  private static bindUIEvents(): void {
    const bindClick = (id: string, fn: () => void) => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) { el.dataset.bound = 'true'; el.addEventListener('click', fn); }
    };

    bindClick('mp-play', () => AudioManager.toggle());
    bindClick('mp-prev', () => AudioManager.prev());
    bindClick('mp-next', () => AudioManager.next(false));
    bindClick('mp-mute', () => { AudioManager.toggleMute(); this.syncVolumeIcon(); });

    bindClick('mp-shuffle', () => {
      this.shuffle = !this.shuffle;
      this.syncToggleButtons();
      EventBus.emit('music:shuffle', { enabled: this.shuffle });
    });

    bindClick('mp-repeat', () => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const idx = modes.indexOf(this.repeat);
      this.repeat = modes[(idx + 1) % modes.length];
      this.syncToggleButtons();
      EventBus.emit('music:repeat', { mode: this.repeat });
    });

    const prog = document.getElementById('mp-prog') as HTMLInputElement | null;
    if (prog && !prog.dataset.bound) {
      prog.dataset.bound = 'true';
      prog.addEventListener('input', () => {
        if (AudioManager.getCurrentIdx() < 0) return;
        AudioManager.seek(parseFloat(prog.value));
      });
    }

    const vol = document.getElementById('mp-vol') as HTMLInputElement | null;
    if (vol && !vol.dataset.bound) {
      vol.dataset.bound = 'true';
      vol.addEventListener('input', () => {
        AudioManager.setVolume(parseFloat(vol.value));
        this.syncVolumeIcon();
      });
    }
  }

  private static syncToggleButtons(): void {
    const shuf = document.getElementById('mp-shuffle');
    if (shuf) shuf.classList.toggle('active', this.shuffle);

    const rep = document.getElementById('mp-repeat');
    if (rep) {
      rep.classList.toggle('active', this.repeat !== 'off');
      rep.classList.toggle('mp-repeat-once', this.repeat === 'one');
      const labels: Record<RepeatMode, string> = { off: 'Repetir todo', all: 'Repetir todo', one: 'Repetir una canción' };
      rep.setAttribute('aria-label', labels[this.repeat]);
    }
  }

  private static syncVolumeIcon(): void {
    const wrap = document.getElementById('mp-mute');
    if (wrap) wrap.classList.toggle('mp-muted', AudioManager.getIsMuted());
  }

  private static refreshUI(): void {
    AudioManager.updateUI();
  }

  private static syncControls(): void {
    const vol = document.getElementById('mp-vol') as HTMLInputElement | null;
    if (vol) vol.value = String(AudioManager.getIsMuted() ? 0 : AudioManager.getVolume());
    this.syncVolumeIcon();
  }
}
