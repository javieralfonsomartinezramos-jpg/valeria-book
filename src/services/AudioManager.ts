import type { MusicState } from '../types';
import { EventBus } from '../core/EventBus';
import { Logger } from '../core/Logger';
import { StorageManager } from '../core/StorageManager';
import { fmtTime } from '../core/Utils';
import { CFG, MUSIC } from '../config';

let audio: HTMLAudioElement | null = null;
let currentIdx = -1;
let isPlaying = false;
let isMuted = false;
let savedVol = 1;
let rafId = 0;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let loadTimer: ReturnType<typeof setTimeout> | null = null;
let isLoading = false;
let errorSkips = 0;
let inited = false;
let pendingRestore: MusicState | null = null;

let progEl: HTMLInputElement | null = null;
let curEl: HTMLElement | null = null;
let totEl: HTMLElement | null = null;
let trackEl: HTMLElement | null = null;
let artistEl: HTMLElement | null = null;
let playBtnEl: HTMLElement | null = null;
let piconEl: HTMLElement | null = null;
let eqEl: HTMLElement | null = null;

function bindAudioEvents(): void {
  if (!audio) return;
  const self = AudioManager;
  audio.addEventListener('play', function () {
    isPlaying = true;
    updatePlayBtn();
    updateMediaSession();
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    rafLoop();
    EventBus.emit('music:play-state', { isPlaying: true });
  });

  audio.addEventListener('pause', function () {
    isPlaying = false;
    updatePlayBtn();
    updateMediaSession();
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    debounceSave();
    EventBus.emit('music:play-state', { isPlaying: false });
  });

  audio.addEventListener('ended', function () { self.next(false); });
  audio.addEventListener('error', function () { handleError(); });
}

function rafLoop(): void {
  if (!audio) return;
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progEl) progEl.value = String(pct);
    if (curEl) curEl.textContent = fmtTime(audio.currentTime);
    if (totEl) totEl.textContent = fmtTime(audio.duration);
  }
  if (isPlaying) rafId = requestAnimationFrame(rafLoop);
}

function handleError(): void {
  const failedIdx = currentIdx;
  isLoading = false;
  if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; }
  if (failedIdx >= 0) {
    EventBus.emit('music:track-invalid', { index: failedIdx });
  }
  if (MUSIC.length <= 1 || errorSkips >= MUSIC.length - 1) {
    if (trackEl) trackEl.textContent = 'No se pudo cargar la canción';
    isPlaying = false;
    AudioManager.updateUI();
    return;
  }
  errorSkips++;
  AudioManager.next(true);
}

function debounceSave(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, CFG.saveDebounce);
}

function saveState(): void {
  const state: MusicState = {
    idx: currentIdx,
    time: audio ? audio.currentTime : 0,
    vol: savedVol || (audio ? audio.volume : 1),
    muted: isMuted,
    playing: isPlaying,
  };
  StorageManager.saveMusic(state);
}

function restoreState(): void {
  const state = StorageManager.loadMusic();
  if (state.idx < 0 || state.idx >= MUSIC.length || !audio) return;
  currentIdx = state.idx;
  const restoredVol = Math.min(Math.max(state.vol, 0), 1);
  savedVol = restoredVol > 0 ? restoredVol : 1;
  isMuted = !!state.muted;
  audio.volume = isMuted ? 0 : restoredVol;
  pendingRestore = state;
}

function updatePlayBtn(): void {
  if (piconEl) {
    piconEl.innerHTML = isPlaying
      ? '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>'
      : '<path d="M8 5v14l11-7z"/>';
  }
  if (playBtnEl) {
    playBtnEl.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproducir');
    playBtnEl.classList.toggle('is-playing', isPlaying);
  }
  if (eqEl) eqEl.hidden = !isPlaying || currentIdx < 0;
}

function updatePlaylist(): void {
  document.querySelectorAll('.qi').forEach((item, i) => {
    item.classList.toggle('active', i === currentIdx);
  });
}

function updateNowPlaying(): void {
  if (currentIdx < 0 || currentIdx >= MUSIC.length) return;
  if (trackEl) trackEl.textContent = MUSIC[currentIdx].title;
  if (artistEl) artistEl.textContent = 'Canción ' + (currentIdx + 1) + ' de ' + MUSIC.length;
}

function updateMediaSession(): void {
  if (!('mediaSession' in navigator) || currentIdx < 0) return;
  const title = MUSIC[currentIdx].title;
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist: MUSIC[currentIdx].artist || "Valeria's Book",
    album: 'Nuestra música',
    artwork: [{ src: CFG.favicon, sizes: '64x64', type: 'image/svg+xml' }],
  });
  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
}

export class AudioManager {
  static init(): void {
    if (inited) return;
    inited = true;
    audio = document.getElementById('audio') as HTMLAudioElement | null;
    if (!audio) { Logger.warn('AudioManager', 'Audio element not found'); return; }
    bindAudioEvents();
    restoreState();
    AudioManager.setupMediaSession();
  }

  static refreshUI(): void {
    progEl = document.getElementById('mp-prog') as HTMLInputElement | null;
    curEl = document.getElementById('mp-cur');
    totEl = document.getElementById('mp-tot');
    trackEl = document.getElementById('mp-track');
    artistEl = document.getElementById('mp-artist');
    playBtnEl = document.getElementById('mp-play');
    piconEl = document.getElementById('mp-picon');
    eqEl = document.getElementById('mp-eq');
    updatePlayBtn();
    updateNowPlaying();
  }

  static destroy(): void {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; }
    if (audio) { audio.pause(); audio.src = ''; }
    audio = null;
    inited = false;
  }

  static play(idx: number, fromError?: boolean): void {
    if (idx < 0 || idx >= MUSIC.length || !audio) return;
    if (!fromError) errorSkips = 0;
    currentIdx = idx;
    audio.src = CFG.musicDir + encodeURIComponent(MUSIC[idx].file);
    const restoreTime = pendingRestore?.idx === idx ? pendingRestore.time : 0;
    pendingRestore = null;
    if (restoreTime > 0) {
      audio.addEventListener('loadedmetadata', function handler() {
        if (audio && audio.duration) {
          audio.currentTime = Math.min(restoreTime, Math.max(audio.duration - 0.25, 0));
        }
        audio?.removeEventListener('loadedmetadata', handler);
      }, { once: true });
    }
    audio.load();
    isLoading = true;
    if (loadTimer) clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      if (isLoading && trackEl) trackEl.textContent = 'Cargando...';
    }, 800);

    audio.play().then(() => {
      isLoading = false;
      errorSkips = 0;
      if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; }
      AudioManager.updateUI();
      debounceSave();
    }).catch(() => {
      isLoading = false;
      if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; }
    });
    EventBus.emit('music:track-changed', { index: idx, title: MUSIC[idx].title });
  }

  static toggle(): void {
    if (!audio) return;
    if (!audio.src && MUSIC.length > 0) {
      AudioManager.play(currentIdx >= 0 ? currentIdx : 0);
      return;
    }
    if (isPlaying) { audio.pause(); }
    else { audio.play().catch(() => {}); }
  }

  static prev(): void {
    if (MUSIC.length === 0 || !audio) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    AudioManager.play((currentIdx - 1 + MUSIC.length) % MUSIC.length);
  }

  static next(fromError?: boolean): void {
    if (MUSIC.length === 0 || !audio) return;
    AudioManager.play((currentIdx + 1) % MUSIC.length, !!fromError);
  }

  static setVolume(vol: number): void {
    if (!audio) return;
    audio.volume = Math.min(Math.max(vol, 0), 1);
    isMuted = audio.volume === 0;
    if (!isMuted) savedVol = audio.volume;
  }

  static toggleMute(): void {
    if (!audio) return;
    if (isMuted) {
      audio.volume = savedVol > 0 ? savedVol : 1;
      isMuted = false;
    } else {
      savedVol = audio.volume;
      audio.volume = 0;
      isMuted = true;
    }
  }

  static seek(pct: number): void {
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
  }

  static getCurrentIdx(): number { return currentIdx; }
  static getVolume(): number { return audio ? audio.volume : 0; }
  static getIsPlaying(): boolean { return isPlaying; }
  static getIsMuted(): boolean { return isMuted; }

  static setupMediaSession(): void {
    if (!('mediaSession' in navigator)) return;
    const self = AudioManager;
    navigator.mediaSession.setActionHandler('play', function () { self.toggle(); });
    navigator.mediaSession.setActionHandler('pause', function () { self.toggle(); });
    navigator.mediaSession.setActionHandler('previoustrack', function () { self.prev(); });
    navigator.mediaSession.setActionHandler('nexttrack', function () { self.next(false); });
    navigator.mediaSession.setActionHandler('seekforward', function () {
      if (audio) audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0);
    });
    navigator.mediaSession.setActionHandler('seekbackward', function () {
      if (audio) audio.currentTime = Math.max(audio.currentTime - 10, 0);
    });
  }

  static updateUI(): void {
    updatePlayBtn();
    updatePlaylist();
    updateNowPlaying();
  }
}
