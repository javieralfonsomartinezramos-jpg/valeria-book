console.log(`%c[FORENSIC] MODULE LOADED — js/services/AudioManager.js`, 'color:#27ae60;font-weight:bold');

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

import { EventBus } from '../core/EventBus.js';
import { Logger } from '../core/Logger.js';
import { StorageManager } from '../core/StorageManager.js';
import { cleanLabel, fmtTime } from '../core/Utils.js';
import { CFG, MUSIC } from '../config.js';

let audio = null;
let currentIdx = -1;
let isPlaying = false;
let isMuted = false;
let savedVol = 1;
let rafId = 0;
let saveTimer = 0;
let loadTimer = 0;
let isLoading = false;
let errorSkips = 0;
let inited = false;

let progEl = null;
let curEl = null;
let totEl = null;
let trackEl = null;
let artistEl = null;
let playBtnEl = null;
let piconEl = null;
let eqEl = null;

export class AudioManager {
  static init() {
    if (inited) return;
    inited = true;
    console.log(`%c[FORENSIC] getElementById('audio') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    audio = document.getElementById('audio');
    if (audio) { console.log(`%c[FORENSIC] getElementById('audio') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('audio') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!audio) { Logger.warn('AudioManager', 'Audio element not found'); return; }
    bindAudioEvents();
    restoreState();
    AudioManager.setupMediaSession();
  }

  static refreshUI() {
    console.log(`%c[FORENSIC] getElementById('mp-prog') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    progEl = document.getElementById('mp-prog');
    if (progEl) { console.log(`%c[FORENSIC] getElementById('mp-prog') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-prog') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-cur') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    curEl = document.getElementById('mp-cur');
    if (curEl) { console.log(`%c[FORENSIC] getElementById('mp-cur') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-cur') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-tot') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    totEl = document.getElementById('mp-tot');
    if (totEl) { console.log(`%c[FORENSIC] getElementById('mp-tot') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-tot') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-track') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    trackEl = document.getElementById('mp-track');
    if (trackEl) { console.log(`%c[FORENSIC] getElementById('mp-track') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-track') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-artist') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    artistEl = document.getElementById('mp-artist');
    if (artistEl) { console.log(`%c[FORENSIC] getElementById('mp-artist') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-artist') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-play') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    playBtnEl = document.getElementById('mp-play');
    if (playBtnEl) { console.log(`%c[FORENSIC] getElementById('mp-play') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-play') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-picon') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    piconEl = document.getElementById('mp-picon');
    if (piconEl) { console.log(`%c[FORENSIC] getElementById('mp-picon') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-picon') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('mp-eq') — js/services/AudioManager.js`, 'color:#f28b9e;font-weight:bold');
    eqEl = document.getElementById('mp-eq');
    if (eqEl) { console.log(`%c[FORENSIC] getElementById('mp-eq') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('mp-eq') → NULL`, 'color:#e67e22;font-weight:bold'); }
    updatePlayBtn();
  }

  static destroy() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = 0; }
    if (loadTimer) { clearTimeout(loadTimer); loadTimer = 0; }
    if (audio) { audio.pause(); audio.src = ''; }
    audio = null;
    inited = false;
  }

  static play(idx, fromError) {
    if (idx < 0 || idx >= MUSIC.length || !audio) return;
    if (!fromError) errorSkips = 0;
    currentIdx = idx;
    audio.src = CFG.musicDir + encodeURIComponent(MUSIC[idx]);
    audio.load();
    isLoading = true;
    if (loadTimer) clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      if (isLoading && trackEl) trackEl.textContent = 'Cargando...';
    }, 800);

    audio.play().then(() => {
      isLoading = false;
      errorSkips = 0;
      if (loadTimer) { clearTimeout(loadTimer); loadTimer = 0; }
      AudioManager.updateUI();
      debounceSave();
    }).catch(() => {
      isLoading = false;
      if (loadTimer) { clearTimeout(loadTimer); loadTimer = 0; }
    });
    EventBus.emit('music:track-changed', { index: idx, title: cleanLabel(MUSIC[idx]) });
  }

  static toggle() {
    if (!audio) return;
    if (!audio.src && MUSIC.length > 0) { AudioManager.play(0); return; }
    if (isPlaying) { audio.pause(); }
    else { audio.play().catch(() => {}); }
  }

  static prev() {
    if (MUSIC.length === 0 || !audio) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    AudioManager.play((currentIdx - 1 + MUSIC.length) % MUSIC.length);
  }

  static next(fromError) {
    if (MUSIC.length === 0 || !audio) return;
    AudioManager.play((currentIdx + 1) % MUSIC.length, !!fromError);
  }

  static setVolume(vol) {
    if (!audio) return;
    audio.volume = Math.min(Math.max(vol, 0), 1);
    isMuted = audio.volume === 0;
    if (!isMuted) savedVol = audio.volume;
  }

  static toggleMute() {
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

  static seek(pct) {
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
  }

  static getCurrentIdx() { return currentIdx; }
  static getVolume() { return audio ? audio.volume : 0; }
  static getIsPlaying() { return isPlaying; }
  static getIsMuted() { return isMuted; }

  static setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    var self = AudioManager;
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

  static updateUI() {
    updatePlayBtn();
    updatePlaylist();
    updateNowPlaying();
  }
}

AudioManager.init = _fW(AudioManager.init.bind(AudioManager), 'init', 'js/services/AudioManager.js');
AudioManager.refreshUI = _fW(AudioManager.refreshUI.bind(AudioManager), 'refreshUI', 'js/services/AudioManager.js');
AudioManager.destroy = _fW(AudioManager.destroy.bind(AudioManager), 'destroy', 'js/services/AudioManager.js');
AudioManager.play = _fW(AudioManager.play.bind(AudioManager), 'play', 'js/services/AudioManager.js');
AudioManager.toggle = _fW(AudioManager.toggle.bind(AudioManager), 'toggle', 'js/services/AudioManager.js');
AudioManager.prev = _fW(AudioManager.prev.bind(AudioManager), 'prev', 'js/services/AudioManager.js');
AudioManager.next = _fW(AudioManager.next.bind(AudioManager), 'next', 'js/services/AudioManager.js');
AudioManager.setVolume = _fW(AudioManager.setVolume.bind(AudioManager), 'setVolume', 'js/services/AudioManager.js');
AudioManager.toggleMute = _fW(AudioManager.toggleMute.bind(AudioManager), 'toggleMute', 'js/services/AudioManager.js');
AudioManager.seek = _fW(AudioManager.seek.bind(AudioManager), 'seek', 'js/services/AudioManager.js');
AudioManager.getCurrentIdx = _fW(AudioManager.getCurrentIdx.bind(AudioManager), 'getCurrentIdx', 'js/services/AudioManager.js');
AudioManager.getVolume = _fW(AudioManager.getVolume.bind(AudioManager), 'getVolume', 'js/services/AudioManager.js');
AudioManager.getIsPlaying = _fW(AudioManager.getIsPlaying.bind(AudioManager), 'getIsPlaying', 'js/services/AudioManager.js');
AudioManager.getIsMuted = _fW(AudioManager.getIsMuted.bind(AudioManager), 'getIsMuted', 'js/services/AudioManager.js');
AudioManager.setupMediaSession = _fW(AudioManager.setupMediaSession.bind(AudioManager), 'setupMediaSession', 'js/services/AudioManager.js');
AudioManager.updateUI = _fW(AudioManager.updateUI.bind(AudioManager), 'updateUI', 'js/services/AudioManager.js');

function bindAudioEvents() {
  if (!audio) return;
  var self = AudioManager;
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

function rafLoop() {
  if (!audio) return;
  if (audio.duration) {
    let pct = (audio.currentTime / audio.duration) * 100;
    if (progEl) progEl.value = String(pct);
    if (curEl) curEl.textContent = fmtTime(audio.currentTime);
    if (totEl) totEl.textContent = fmtTime(audio.duration);
  }
  if (isPlaying) rafId = requestAnimationFrame(rafLoop);
}

function handleError() {
  isLoading = false;
  if (loadTimer) { clearTimeout(loadTimer); loadTimer = 0; }
  if (MUSIC.length <= 1 || errorSkips >= MUSIC.length - 1) {
    if (trackEl) trackEl.textContent = 'No se pudo cargar la canci\u00F3n';
    isPlaying = false;
    AudioManager.updateUI();
    return;
  }
  errorSkips++;
  AudioManager.next(true);
}

function debounceSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, CFG.saveDebounce);
}

function saveState() {
  let state = {
    idx: currentIdx,
    time: audio ? audio.currentTime : 0,
    vol: savedVol || (audio ? audio.volume : 1),
    muted: isMuted,
    playing: isPlaying,
  };
  StorageManager.saveMusic(state);
}

function restoreState() {
  let state = StorageManager.loadMusic();
  if (state.idx < 0 || state.idx >= MUSIC.length || !audio) return;
  currentIdx = state.idx;
  let restoredVol = Math.min(Math.max(state.vol, 0), 1);
  savedVol = restoredVol > 0 ? restoredVol : 1;
  isMuted = !!state.muted;
  audio.volume = isMuted ? 0 : restoredVol;

  /* restore saved time position but NEVER auto-play */
  if (state.time > 0) {
    audio.src = CFG.musicDir + encodeURIComponent(MUSIC[state.idx]);
    audio.addEventListener('loadedmetadata', function handler() {
      let savedTime = state.time || 0;
      if (savedTime > 0 && audio && audio.duration) {
        audio.currentTime = Math.min(savedTime, Math.max(audio.duration - 0.25, 0));
      }
      if (audio) audio.removeEventListener('loadedmetadata', handler);
    }, { once: true });
    audio.load();
  }
}

function updatePlayBtn() {
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

function updatePlaylist() {
  document.querySelectorAll('.qi').forEach((item, i) => {
    item.classList.toggle('active', i === currentIdx);
  });
}

function updateNowPlaying() {
  if (currentIdx < 0 || currentIdx >= MUSIC.length) return;
  if (trackEl) trackEl.textContent = cleanLabel(MUSIC[currentIdx]);
  if (artistEl) artistEl.textContent = 'Canci\u00F3n ' + (currentIdx + 1) + ' de ' + MUSIC.length;
}

function updateMediaSession() {
  if (!('mediaSession' in navigator) || currentIdx < 0) return;
  const title = cleanLabel(MUSIC[currentIdx]);
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist: 'Valeria\'s Book',
    album: 'Nuestra m\u00FAsica',
    artwork: [{ src: '/favicon.svg', sizes: '64x64', type: 'image/svg+xml' }],
  });
  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
}
