import { Logger } from './Logger';
import type { MusicState } from '../types/music';

const PREFIX = 'vbook2_';

export class StorageManager {
  static get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw) as T;
    } catch (e) {
      Logger.warn('StorageManager', `Failed to read "${key}"`, e);
      return fallback;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      Logger.warn('StorageManager', `Failed to write "${key}"`, e);
    }
  }

  static getFavs(): number[] {
    return this.get<number[]>('favs', []);
  }

  static setFavs(favs: number[]): void {
    this.set('favs', favs);
  }

  static getNotes(): string[] {
    return this.get<string[]>('notes', []);
  }

  static setNotes(notes: string[]): void {
    this.set('notes', notes);
  }

  static saveMusic(state: MusicState): void {
    this.set('m_state', state);
  }

  static loadMusic(): MusicState {
    return this.get<MusicState>('m_state', {
      idx: -1, time: 0, vol: 1, muted: false, playing: false,
    });
  }

  static getSpread(): number {
    return this.get<number>('spread', 0);
  }

  static setSpread(spread: number): void {
    this.set('spread', spread);
  }

  static getContrast(): boolean {
    return this.get<boolean>('contrast', false);
  }

  static setContrast(enabled: boolean): void {
    this.set('contrast', enabled);
  }

  static getAudioFX(): boolean {
    return this.get<boolean>('audiofx', false);
  }

  static setAudioFX(enabled: boolean): void {
    this.set('audiofx', enabled);
  }
}
