export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface BookConfig {
  bookElement: HTMLElement | null;
}

export interface MusicState {
  idx: number;
  time: number;
  vol: number;
  muted: boolean;
  playing: boolean;
}

export type Direction = -1 | 1;

export interface MusicTrack {
  title: string;
  file: string;
  artist: string;
}

export interface Chapter {
  label: string;
  spread: number;
}

declare global {
  interface Window {
    __FORENSIC?: {
      t0: number;
    };
  }
}
