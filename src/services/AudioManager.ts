import { EventBus } from '../core/EventBus';
import { Logger } from '../core/Logger';
import { StorageManager } from '../core/StorageManager';
import { cleanLabel, fmtTime } from '../core/Utils';
import { CFG, MUSIC } from '../config';
import type { MusicState } from '../types/music';

export class AudioManager {
  private static audio: HTMLAudioElement | null = null;
  private static currentIdx = -1;
  private static isPlaying = false;
  private static isMuted = false;
  private static savedVol = 1;
  private static rafId = 0;
  private static saveTimer = 0;
  private static loadTimer = 0;
  private static isLoading = false;
  private static errorSkips = 0;
  private static inited = false;

  static init(): void {
    if (this.inited) return;
    this.inited = true;
    this.audio = document.getElementById('audio') as HTMLAudioElement | null;
    if (!this.audio) {
      Logger.warn('AudioManager', 'Audio element not found');
      return;
    }
    this.bindAudioEvents();
    this.restoreState();
    this.setupMediaSession();
  }

  static play(idx: number, fromError?: boolean): void {
    if (idx < 0 || idx >= MUSIC.length || !this.audio) return;
    if (!fromError) this.errorSkips = 0;
    this.currentIdx = idx;
    this.audio.src = CFG.musicDir + encodeURIComponent(MUSIC[idx]);
    this.audio.load();
    this.isLoading = true;
    if (this.loadTimer) clearTimeout(this.loadTimer);
    this.loadTimer = window.setTimeout(() => {
      if (AudioManager.isLoading) {
        const track = document.getElementById('mp-track');
        if (track) track.textContent = 'Cargando...';
      }
    }, 800);

    this.audio.play()
      .then(() => {
        AudioManager.isLoading = false;
        AudioManager.errorSkips = 0;
        if (AudioManager.loadTimer) clearTimeout(AudioManager.loadTimer);
        AudioManager.updateUI();
        AudioManager.debounceSave();
      })
      .catch(() => {
        AudioManager.isLoading = false;
        if (AudioManager.loadTimer) clearTimeout(AudioManager.loadTimer);
      });
    EventBus.emit('music:track-changed', {
      index: idx,
      title: cleanLabel(MUSIC[idx]),
    });
  }

  static toggle(): void {
    if (!this.audio) return;
    if (!this.audio.src && MUSIC.length > 0) { this.play(0); return; }
    if (this.isPlaying) { this.audio.pause(); }
    else { this.audio.play().catch(() => {}); }
  }

  static prev(): void {
    if (MUSIC.length === 0 || !this.audio) return;
    if (this.audio.currentTime > 3) { this.audio.currentTime = 0; return; }
    this.play((this.currentIdx - 1 + MUSIC.length) % MUSIC.length);
  }

  static next(fromError?: boolean): void {
    if (MUSIC.length === 0 || !this.audio) return;
    this.play((this.currentIdx + 1) % MUSIC.length, !!fromError);
  }

  static setVolume(vol: number): void {
    if (!this.audio) return;
    this.audio.volume = Math.min(Math.max(vol, 0), 1);
    this.isMuted = this.audio.volume === 0;
    if (!this.isMuted) this.savedVol = this.audio.volume;
  }

  static toggleMute(): void {
    if (!this.audio) return;
    if (this.isMuted) {
      this.audio.volume = this.savedVol > 0 ? this.savedVol : 1;
      this.isMuted = false;
    } else {
      this.savedVol = this.audio.volume;
      this.audio.volume = 0;
      this.isMuted = true;
    }
  }

  static seek(pct: number): void {
    if (!this.audio || !this.audio.duration) return;
    this.audio.currentTime = (pct / 100) * this.audio.duration;
  }

  static getCurrentIdx(): number { return this.currentIdx; }
  static getVolume(): number { return this.audio ? this.audio.volume : 0; }
  static getIsPlaying(): boolean { return this.isPlaying; }
  static getIsMuted(): boolean { return this.isMuted; }

  private static setupMediaSession(): void {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => this.toggle());
    navigator.mediaSession.setActionHandler('pause', () => this.toggle());
    navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
    navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
    navigator.mediaSession.setActionHandler('seekforward', () => {
      if (this.audio) this.audio.currentTime = Math.min(this.audio.currentTime + 10, this.audio.duration || 0);
    });
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      if (this.audio) this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
    });
  }

  private static updateMediaSession(): void {
    if (!('mediaSession' in navigator) || this.currentIdx < 0) return;
    const title = cleanLabel(MUSIC[this.currentIdx]);
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: 'Valeria\'s Book',
      album: 'Nuestra música',
      artwork: [
        { src: `${CFG.imgDir}../favicon.svg`, sizes: '64x64', type: 'image/svg+xml' },
      ],
    });
    navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
  }

  private static bindAudioEvents(): void {
    if (!this.audio) return;
    const self = this;

    this.audio.addEventListener('play', () => {
      self.isPlaying = true;
      self.updatePlayBtn();
      self.updateMediaSession();
      if (self.rafId) cancelAnimationFrame(self.rafId);
      self.rafLoop();
      EventBus.emit('music:play-state', { isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      self.isPlaying = false;
      self.updatePlayBtn();
      self.updateMediaSession();
      if (self.rafId) { cancelAnimationFrame(self.rafId); self.rafId = 0; }
      self.debounceSave();
      EventBus.emit('music:play-state', { isPlaying: false });
    });

    this.audio.addEventListener('ended', () => self.next(false));
    this.audio.addEventListener('error', () => self.handleError());
  }

  private static rafLoop(): void {
    if (!this.audio) return;
    if (this.audio.duration) {
      const pct = (this.audio.currentTime / this.audio.duration) * 100;
      const prog = document.getElementById('mp-prog') as HTMLInputElement | null;
      if (prog) prog.value = String(pct);
      const cur = document.getElementById('mp-cur');
      if (cur) cur.textContent = fmtTime(this.audio.currentTime);
      const tot = document.getElementById('mp-tot');
      if (tot) tot.textContent = fmtTime(this.audio.duration);
    }
    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(() => this.rafLoop());
    }
  }

  private static handleError(): void {
    this.isLoading = false;
    if (this.loadTimer) clearTimeout(this.loadTimer);
    if (MUSIC.length <= 1 || this.errorSkips >= MUSIC.length - 1) {
      const track = document.getElementById('mp-track');
      if (track) track.textContent = 'No se pudo cargar la canción';
      this.isPlaying = false;
      this.updateUI();
      return;
    }
    this.errorSkips++;
    this.next(true);
  }

  private static debounceSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.saveState(), CFG.saveDebounce);
  }

  private static saveState(): void {
    const state: MusicState = {
      idx: this.currentIdx,
      time: this.audio ? this.audio.currentTime : 0,
      vol: this.savedVol || (this.audio ? this.audio.volume : 1),
      muted: this.isMuted,
      playing: this.isPlaying,
    };
    StorageManager.saveMusic(state);
  }

  private static restoreState(): void {
    const state = StorageManager.loadMusic();
    if (state.idx < 0 || state.idx >= MUSIC.length || !this.audio) return;

    this.currentIdx = state.idx;
    const restoredVol = Math.min(Math.max(state.vol, 0), 1);
    this.savedVol = restoredVol > 0 ? restoredVol : 1;
    this.isMuted = !!state.muted;
    this.audio.volume = this.isMuted ? 0 : restoredVol;
    this.audio.src = CFG.musicDir + encodeURIComponent(MUSIC[state.idx]);

    this.audio.addEventListener('loadedmetadata', function handler() {
      const self = AudioManager;
      const savedTime = state.time || 0;
      if (savedTime > 0 && self.audio && self.audio.duration) {
        self.audio.currentTime = Math.min(savedTime, Math.max(self.audio.duration - 0.25, 0));
      }
      if (state.playing && !self.isMuted) {
        self.audio?.play().catch(() => {});
      }
      if (self.audio) self.audio.removeEventListener('loadedmetadata', handler);
    }, { once: true });

    this.audio.load();
  }

  static updateUI(): void {
    this.updatePlayBtn();
    this.updatePlaylist();
    this.updateNowPlaying();
  }

  private static updatePlayBtn(): void {
    const icon = document.getElementById('mp-picon');
    if (icon) {
      icon.innerHTML = this.isPlaying
        ? '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>'
        : '<path d="M8 5v14l11-7z"/>';
    }
    const btn = document.getElementById('mp-play');
    if (btn) {
      btn.setAttribute('aria-label', this.isPlaying ? 'Pausar' : 'Reproducir');
      btn.classList.toggle('is-playing', this.isPlaying);
    }
    const eq = document.getElementById('mp-eq');
    if (eq) eq.hidden = !this.isPlaying || this.currentIdx < 0;
  }

  private static updatePlaylist(): void {
    document.querySelectorAll('.qi').forEach((item, i) => {
      item.classList.toggle('active', i === this.currentIdx);
    });
  }

  private static updateNowPlaying(): void {
    if (this.currentIdx < 0 || this.currentIdx >= MUSIC.length) return;
    const track = document.getElementById('mp-track');
    const artist = document.getElementById('mp-artist');
    if (track) track.textContent = cleanLabel(MUSIC[this.currentIdx]);
    if (artist) artist.textContent = `Canción ${this.currentIdx + 1} de ${MUSIC.length}`;
  }

}
