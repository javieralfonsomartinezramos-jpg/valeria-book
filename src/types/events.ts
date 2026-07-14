export type EventMap = {
  'book:page-changed': { spread: number; total: number; isMobile: boolean };
  'book:will-navigate': { from: number; to: number; dir: number };
  'book:navigated': { spread: number };
  'book:navigate': { spread: number; animated: boolean };

  'music:track-changed': { index: number; title: string };
  'music:play-state': { isPlaying: boolean };
  'music:shuffle': { enabled: boolean };
  'music:repeat': { mode: 'off' | 'all' | 'one' };

  'ui:reach-music': void;
  'ui:reach-notes': void;
  'ui:reach-closing': void;
  'ui:toggle-sidebar': void;

  'audiofx:page-turn': void;

  'error:occurred': { source: string; message: string; error?: unknown };
};

export type EventName = keyof EventMap;
export type EventCallback<T = unknown> = (data: T) => void;
