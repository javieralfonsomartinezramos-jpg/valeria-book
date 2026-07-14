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
