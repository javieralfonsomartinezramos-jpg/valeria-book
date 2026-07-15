import { EventBus } from '../core/EventBus.js';
import { Logger } from '../core/Logger.js';
import { StorageManager } from '../core/StorageManager.js';
import { cleanLabel, fmtTime } from '../core/Utils.js';
import { CFG, MUSIC } from '../config.js';

export class AudioManager {
  static audio = null;
  static currentIdx = -1;
  static isPlaying = false;
  static isMuted = false;
  static savedVol = 1;
  static rafId = 0;
  static saveTimer = 0;
  static loadTimer = 0;
  static isLoading = false;
  static errorSkips = 0;
  static inited = false;

  static init() {
    if (this.inited) return;
    this.inited = true;
    this.audio = document.getElementById('audio');
    if (!this.audio) {
      Logger.warn('AudioManager', 'Audio element not found');
      return;
    }
    this.bindAudioEvents();
    this.restoreState();
    this.setupMediaSession();
  }

  static play(idx, fromError) {
    if (idx < 0 || idx >= MUSIC.length || !this.audio) return;
    if (!fromError) this.errorSkips = 0;
    this.currentIdx = idx;
    this.audio.src = CFG.musicDir + encodeURIComponent(MUSIC[idx]);
    this.audio.load();
    this.isLoading = true;
    if (this.loadTimer) clearTimeout(this.loadTimer);
    this.loadTimer = setTimeout(() => {
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

  static toggle() {
    if (!this.audio) return;
    if (!this.audio.src && MUSIC.length > 0) { this.play(0); return; }
    if (this.isPlaying) { this.audio.pause(); }
    else { this.audio.play().catch(() => {}); }
  }

  static prev() {
    if (MUSIC.length === 0 || !this.audio) return;
    if (this.audio.currentTime > 3) { this.audio.currentTime = 0; return; }
    this.play((this.currentIdx - 1 + MUSIC.length) % MUSIC.length);
  }

  static next(fromError) {
    if (MUSIC.length === 0 || !this.audio) return;
    this.play((this.currentIdx + 1) % MUSIC.length, !!fromError);
  }

  static setVolume(vol) {
    if (!this.audio) return;
    this.audio.volume = Math.min(Math.max(vol, 0), 1);
    this.isMuted = this.audio.volume === 0;
    if (!this.isMuted) this.savedVol = this.audio.volume;
  }

  static toggleMute() {
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

  static seek(pct) {
    if (!this.audio || !this.audio.duration) return;
    this.audio.currentTime = (pct / 100) * this.audio.duration;
  }

  static getCurrentIdx() { return this.currentIdx; }
  static getVolume() { return this.audio ? this.audio.volume : 0; }
  static getIsPlaying() { return this.isPlaying; }
  static getIsMuted() { return this.isMuted; }

  static setupMediaSession() {
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

  static updateMediaSession() {
    if (!('mediaSession' in navigator) || this.currentIdx < 0) return;
    const title = cleanLabel(MUSIC[this.currentIdx]);
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: 'Valeria\'s Book',
      album: 'Nuestra m\u00FAsica',
      artwork: [
        { src: CFG.imgDir + '../favicon.svg', sizes: '64x64', type: 'image/svg+xml' },
      ],
    });
    navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
  }

  static bindAudioEvents() {
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

  static rafLoop() {
    if (!this.audio) return;
    if (this.audio.duration) {
      const pct = (this.audio.currentTime / this.audio.duration) * 100;
      const prog = document.getElementById('mp-prog');
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

  static handleError() {
    this.isLoading = false;
    if (this.loadTimer) clearTimeout(this.loadTimer);
    if (MUSIC.length <= 1 || this.errorSkips >= MUSIC.length - 1) {
      const track = document.getElementById('mp-track');
      if (track) track.textContent = 'No se pudo cargar la canci\u00F3n';
      this.isPlaying = false;
      this.updateUI();
      return;
    }
    this.errorSkips++;
    this.next(true);
  }

  static debounceSave() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveState(), CFG.saveDebounce);
  }

  static saveState() {
    const state = {
      idx: this.currentIdx,
      time: this.audio ? this.audio.currentTime : 0,
      vol: this.savedVol || (this.audio ? this.audio.volume : 1),
      muted: this.isMuted,
      playing: this.isPlaying,
    };
    StorageManager.saveMusic(state);
  }

  static restoreState() {
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

  static updateUI() {
    this.updatePlayBtn();
    this.updatePlaylist();
    this.updateNowPlaying();
  }

  static updatePlayBtn() {
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

  static updatePlaylist() {
    document.querySelectorAll('.qi').forEach((item, i) => {
      item.classList.toggle('active', i === this.currentIdx);
    });
  }

  static updateNowPlaying() {
    if (this.currentIdx < 0 || this.currentIdx >= MUSIC.length) return;
    const track = document.getElementById('mp-track');
    const artist = document.getElementById('mp-artist');
    if (track) track.textContent = cleanLabel(MUSIC[this.currentIdx]);
    if (artist) artist.textContent = 'Canci\u00F3n ' + (this.currentIdx + 1) + ' de ' + MUSIC.length;
  }
}
