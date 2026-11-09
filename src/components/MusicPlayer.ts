console.log(`%c[FORENSIC] MODULE LOADED — js/components/MusicPlayer.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, label: string, path: string) => function(this: unknown, ...args: TArgs): TReturn {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${(e as Error).message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${(e as Error).message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { EventBus } from '../core/EventBus.js';
import { MUSIC } from '../config.js';
import { AudioManager } from '../services/AudioManager.js';
import { DOMManager } from '../managers/DOMManager.js';

let uiInited = false;
let shuffle = false;
let repeat: 'off' | 'all' | 'one' = 'off';

function _f_syncToggleButtons(): void {
  const shuf = DOMManager.get('mp-shuffle');
  if (shuf) shuf.classList.toggle('active', shuffle);
  const rep = DOMManager.get('mp-repeat');
  if (rep) {
    rep.classList.toggle('active', repeat !== 'off');
    rep.classList.toggle('mp-repeat-once', repeat === 'one');
    const labels: Record<string, string> = { off: 'Repetir todo', all: 'Repetir todo', one: 'Repetir una canci\u00F3n' };
    rep.setAttribute('aria-label', labels[repeat]);
  }
}
const syncToggleButtons = _fW(_f_syncToggleButtons, 'syncToggleButtons', 'js/components/MusicPlayer.js');

function _f_syncVolumeIcon(): void {
  const wrap = DOMManager.get('mp-mute');
  if (wrap) wrap.classList.toggle('mp-muted', AudioManager.getIsMuted());
}
const syncVolumeIcon = _fW(_f_syncVolumeIcon, 'syncVolumeIcon', 'js/components/MusicPlayer.js');

export class MusicPlayer {
  static initUI(): void {
    if (uiInited) return;
    uiInited = true;

    const dock = DOMManager.get('music-dock');
    const source = document.querySelector<HTMLTemplateElement>('template[data-name="music"]');
    if (dock && source) {
      dock.appendChild(source.content.cloneNode(true));
      dock.hidden = false;

      const playlistToggle = document.createElement('button');
      playlistToggle.type = 'button';
      playlistToggle.className = 'music-dock-toggle';
      playlistToggle.setAttribute('aria-expanded', 'false');
      playlistToggle.setAttribute('aria-label', 'Mostrar lista de canciones');
      playlistToggle.title = 'Lista de canciones';
      playlistToggle.innerHTML = '<span aria-hidden="true">☷</span>';
      playlistToggle.addEventListener('click', () => {
        const expanded = dock.classList.toggle('is-expanded');
        playlistToggle.setAttribute('aria-expanded', String(expanded));
        playlistToggle.setAttribute('aria-label', expanded ? 'Ocultar lista de canciones' : 'Mostrar lista de canciones');
      });
      dock.appendChild(playlistToggle);
    }

    AudioManager.refreshUI();

    const queue = DOMManager.get('mp-queue');
    if (queue && queue.children.length === 0) {
      MUSIC.forEach((track, i) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'qi';
        item.dataset.idx = String(i);
        item.setAttribute('aria-label', 'Reproducir ' + track.title);
        const num = document.createElement('span');
        num.className = 'qi-num';
        num.textContent = String(i + 1);
        const nameSpan = document.createElement('span');
        nameSpan.className = 'qi-name';
        nameSpan.textContent = track.title;
        item.appendChild(num);
        item.appendChild(nameSpan);
        item.addEventListener('click', () => AudioManager.play(i));
        queue.appendChild(item);
      });
    }

    EventBus.on('music:track-invalid', data => {
      const index = (data as { index?: number })?.index;
      if (typeof index !== 'number') return;
      const item = queue?.querySelector<HTMLElement>('.qi[data-idx="' + index + '"]');
      if (!item) return;
      item.classList.add('is-unavailable');
      item.setAttribute('aria-disabled', 'true');
      item.setAttribute('title', 'Esta canción no se pudo cargar y fue ocultada');
      setTimeout(() => item.remove(), 250);
    });

    DOMManager.onClick('#mp-play', () => AudioManager.toggle());
    DOMManager.onClick('#mp-prev', () => AudioManager.prev());
    DOMManager.onClick('#mp-next', () => AudioManager.next(false));
    DOMManager.onClick('#mp-mute', () => { AudioManager.toggleMute(); syncVolumeIcon(); });
    DOMManager.onClick('#mp-shuffle', () => {
      shuffle = !shuffle;
      syncToggleButtons();
      EventBus.emit('music:shuffle', { enabled: shuffle });
    });
    DOMManager.onClick('#mp-repeat', () => {
      const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
      const idx = modes.indexOf(repeat);
      repeat = modes[(idx + 1) % modes.length];
      syncToggleButtons();
      EventBus.emit('music:repeat', { mode: repeat });
    });

    const prog = DOMManager.get('mp-prog') as HTMLInputElement | null;
    if (prog && !(prog as HTMLInputElement & { _mpBound?: boolean })._mpBound) {
      (prog as HTMLInputElement & { _mpBound?: boolean })._mpBound = true;
      prog.addEventListener('input', () => {
        if (AudioManager.getCurrentIdx() < 0) return;
        AudioManager.seek(parseFloat(prog.value));
      });
    }

    const vol = DOMManager.get('mp-vol') as HTMLInputElement | null;
    if (vol && !(vol as HTMLInputElement & { _mpBound?: boolean })._mpBound) {
      (vol as HTMLInputElement & { _mpBound?: boolean })._mpBound = true;
      vol.addEventListener('input', () => {
        AudioManager.setVolume(parseFloat(vol.value));
        syncVolumeIcon();
      });
    }

    AudioManager.updateUI();
    const cachedVol = DOMManager.get('mp-vol') as HTMLInputElement | null;
    if (cachedVol) cachedVol.value = String(AudioManager.getIsMuted() ? 0 : AudioManager.getVolume());
    syncVolumeIcon();
  }
}

MusicPlayer.initUI = _fW(MusicPlayer.initUI.bind(MusicPlayer), 'initUI', 'js/components/MusicPlayer.js');
