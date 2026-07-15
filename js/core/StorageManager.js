console.log(`%c[FORENSIC] MODULE LOADED — js/core/StorageManager.js`, 'color:#27ae60;font-weight:bold');

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

import { Logger } from './Logger.js';

const PREFIX = 'vbook2_';

export class StorageManager {
  static get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      Logger.warn('StorageManager', `Failed to read "${key}"`, e);
      return fallback;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      Logger.warn('StorageManager', `Failed to write "${key}"`, e);
    }
  }

  static getFavs() {
    return this.get('favs', []);
  }

  static setFavs(favs) {
    this.set('favs', favs);
  }

  static getNotes() {
    return this.get('notes', []);
  }

  static setNotes(notes) {
    this.set('notes', notes);
  }

  static saveMusic(state) {
    this.set('m_state', state);
  }

  static loadMusic() {
    return this.get('m_state', { idx: -1, time: 0, vol: 1, muted: false, playing: false });
  }

  static getSpread() {
    return this.get('spread', 0);
  }

  static setSpread(spread) {
    this.set('spread', spread);
  }

  static getContrast() {
    return this.get('contrast', false);
  }

  static setContrast(enabled) {
    this.set('contrast', enabled);
  }

  static getAudioFX() {
    return this.get('audiofx', false);
  }

  static setAudioFX(enabled) {
    this.set('audiofx', enabled);
  }
}

StorageManager.get = _fW(StorageManager.get.bind(StorageManager), 'get', 'js/core/StorageManager.js');
StorageManager.set = _fW(StorageManager.set.bind(StorageManager), 'set', 'js/core/StorageManager.js');
StorageManager.getFavs = _fW(StorageManager.getFavs.bind(StorageManager), 'getFavs', 'js/core/StorageManager.js');
StorageManager.setFavs = _fW(StorageManager.setFavs.bind(StorageManager), 'setFavs', 'js/core/StorageManager.js');
StorageManager.getNotes = _fW(StorageManager.getNotes.bind(StorageManager), 'getNotes', 'js/core/StorageManager.js');
StorageManager.setNotes = _fW(StorageManager.setNotes.bind(StorageManager), 'setNotes', 'js/core/StorageManager.js');
StorageManager.saveMusic = _fW(StorageManager.saveMusic.bind(StorageManager), 'saveMusic', 'js/core/StorageManager.js');
StorageManager.loadMusic = _fW(StorageManager.loadMusic.bind(StorageManager), 'loadMusic', 'js/core/StorageManager.js');
StorageManager.getSpread = _fW(StorageManager.getSpread.bind(StorageManager), 'getSpread', 'js/core/StorageManager.js');
StorageManager.setSpread = _fW(StorageManager.setSpread.bind(StorageManager), 'setSpread', 'js/core/StorageManager.js');
StorageManager.getContrast = _fW(StorageManager.getContrast.bind(StorageManager), 'getContrast', 'js/core/StorageManager.js');
StorageManager.setContrast = _fW(StorageManager.setContrast.bind(StorageManager), 'setContrast', 'js/core/StorageManager.js');
StorageManager.getAudioFX = _fW(StorageManager.getAudioFX.bind(StorageManager), 'getAudioFX', 'js/core/StorageManager.js');
StorageManager.setAudioFX = _fW(StorageManager.setAudioFX.bind(StorageManager), 'setAudioFX', 'js/core/StorageManager.js');
