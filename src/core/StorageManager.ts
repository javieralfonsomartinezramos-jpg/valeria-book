import type { MusicState, NoteEntry } from '../types';
import { Logger } from './Logger';

console.log(`%c[FORENSIC] MODULE LOADED — js/core/StorageManager.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, label: string, path: string) => function(this: unknown, ...args: TArgs): TReturn {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${(e as Error).message||e}`); console.trace(); console.groupEnd(); throw e; }
};

const PREFIX = 'vbook2_';

export class StorageManager {
  static get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      Logger.warn('StorageManager', `Failed to read "${key}"`, e);
      return fallback;
    }
  }

  static set(key: string, value: unknown) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      Logger.warn('StorageManager', `Failed to write "${key}"`, e);
    }
  }

  static getFavs(): number[] {
    return this.get('favs', []);
  }

  static setFavs(favs: number[]) {
    this.set('favs', favs);
  }

  static getNotes(): NoteEntry[] {
    const saved = this.get<unknown[]>('notes', []);
    return saved.flatMap(note => {
      if (typeof note === 'string') {
        return [{ name: 'Anónimo', text: note, createdAt: new Date().toISOString() }];
      }
      if (!note || typeof note !== 'object') return [];
      const entry = note as Partial<NoteEntry>;
      if (typeof entry.text !== 'string' || typeof entry.name !== 'string') return [];
      return [{
        name: entry.name,
        text: entry.text,
        createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString(),
      }];
    });
  }

  static setNotes(notes: NoteEntry[]) {
    this.set('notes', notes);
  }

  static saveMusic(state: MusicState) {
    this.set('m_state', state);
  }

  static loadMusic(): MusicState {
    return this.get('m_state', { idx: -1, time: 0, vol: 1, muted: false, playing: false });
  }

  static getSpread(): number {
    return this.get('spread', 0);
  }

  static setSpread(spread: number) {
    this.set('spread', spread);
  }

  static getContrast(): boolean {
    return this.get('contrast', false);
  }

  static setContrast(enabled: boolean) {
    this.set('contrast', enabled);
  }

  static getAudioFX(): boolean {
    return this.get('audiofx', false);
  }

  static setAudioFX(enabled: boolean) {
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
