console.log(`%c[FORENSIC] MODULE LOADED — js/components/Sidebar.js`, 'color:#27ae60;font-weight:bold');

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

import { CHAPTERS } from '../config.js';
import { sanitize } from '../core/Utils.js';
import { FocusTrap } from '../core/FocusTrap.js';
import { Logger } from '../core/Logger.js';
import { DOMManager } from '../managers/DOMManager.js';
import { getCurrentSpread } from '../core/BookState.js';

let sidebarOpen = false;
let releaseFocus: (() => void) | null = null;
let prevFocus: HTMLElement | null = null;
let sidebarEl: HTMLElement | null = null;
let btnIndex: HTMLElement | null = null;

function _f_buildIndex(): void {
  console.log(`%c[FORENSIC] getElementById('index-list') — js/components/Sidebar.js`, 'color:#f28b9e;font-weight:bold');
  const list = document.getElementById('index-list');
  if (list) { console.log(`%c[FORENSIC] getElementById('index-list') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('index-list') → NULL`, 'color:#e67e22;font-weight:bold'); }
  if (!list) return;
  list.innerHTML = CHAPTERS.map(ch => {
    const active = ch.spread === getCurrentSpread();
    return '<li><a href="#" data-spread="' + ch.spread + '" class="index-link' + (active ? ' active' : '') + '">' + sanitize(ch.label) + '</a></li>';
  }).join('');
}
const buildIndex = _fW(_f_buildIndex, 'buildIndex', 'js/components/Sidebar.js');

function _f_cleanup(): void {
  if (releaseFocus) { releaseFocus(); releaseFocus = null; }
  if (prevFocus) { prevFocus.focus(); prevFocus = null; }
}
const cleanup = _fW(_f_cleanup, 'cleanup', 'js/components/Sidebar.js');

export class Sidebar {
  static init(): void {
    if (sidebarEl) return;
    console.log(`%c[FORENSIC] getElementById('sidebar') — js/components/Sidebar.js`, 'color:#f28b9e;font-weight:bold');
    sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) { console.log(`%c[FORENSIC] getElementById('sidebar') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('sidebar') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('btn-index') — js/components/Sidebar.js`, 'color:#f28b9e;font-weight:bold');
    btnIndex = document.getElementById('btn-index');
    if (btnIndex) { console.log(`%c[FORENSIC] getElementById('btn-index') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('btn-index') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!sidebarEl) { Logger.warn('Sidebar', 'sidebar not found'); return; }

    DOMManager.onClick('#sidebar-close', () => Sidebar.close());
    DOMManager.onClick('*', (e: Event) => {
      if (sidebarOpen && sidebarEl && !sidebarEl.contains(e.target as Node) && e.target !== btnIndex) Sidebar.close();
    });
  }

  static toggle(): void {
    sidebarOpen = !sidebarOpen;
    if (!sidebarEl) return;
    sidebarEl.classList.toggle('open', sidebarOpen);
    sidebarEl.hidden = !sidebarOpen;
    if (sidebarOpen) {
      buildIndex();
      prevFocus = document.activeElement as HTMLElement | null;
      console.log(`%c[FORENSIC] getElementById('sidebar-close') — js/components/Sidebar.js`, 'color:#f28b9e;font-weight:bold');
      const _sc = document.getElementById('sidebar-close');
      if (_sc) { console.log(`%c[FORENSIC] getElementById('sidebar-close') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('sidebar-close') → NULL`, 'color:#e67e22;font-weight:bold'); }
      releaseFocus = FocusTrap.trap(sidebarEl, _sc ?? undefined);
    } else {
      cleanup();
    }
  }

  static close(): void {
    if (!sidebarOpen) return;
    sidebarOpen = false;
    if (sidebarEl) { sidebarEl.classList.remove('open'); sidebarEl.hidden = true; }
    cleanup();
  }
}

Sidebar.init = _fW(Sidebar.init.bind(Sidebar), 'init', 'js/components/Sidebar.js');
Sidebar.toggle = _fW(Sidebar.toggle.bind(Sidebar), 'toggle', 'js/components/Sidebar.js');
Sidebar.close = _fW(Sidebar.close.bind(Sidebar), 'close', 'js/components/Sidebar.js');
