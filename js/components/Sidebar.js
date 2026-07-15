import { CHAPTERS } from '../config.js';
import { sanitize } from '../core/Utils.js';
import { FocusTrap } from '../ui/FocusTrap.js';
import { Logger } from '../core/Logger.js';
import { DOMManager } from '../managers/DOMManager.js';
import { getCurrentSpread } from '../core/BookState.js';

let sidebarOpen = false;
let releaseFocus = null;
let prevFocus = null;
let sidebarEl = null;
let btnIndex = null;

function buildIndex() {
  const list = document.getElementById('index-list');
  if (!list) return;
  list.innerHTML = CHAPTERS.map(ch => {
    const active = ch.spread === getCurrentSpread();
    return '<li><a href="#" data-spread="' + ch.spread + '" class="index-link' + (active ? ' active' : '') + '">' + sanitize(ch.name) + '</a></li>';
  }).join('');
}

function cleanup() {
  if (releaseFocus) { releaseFocus(); releaseFocus = null; }
  if (prevFocus) { prevFocus.focus(); prevFocus = null; }
}

export class Sidebar {
  static init() {
    if (sidebarEl) return;
    sidebarEl = document.getElementById('sidebar');
    btnIndex = document.getElementById('btn-index');
    if (!sidebarEl) { Logger.warn('Sidebar', 'sidebar not found'); return; }

    DOMManager.onClick('#sidebar-close', () => Sidebar.close());
    DOMManager.onClick('*', e => {
      if (sidebarOpen && sidebarEl && !sidebarEl.contains(e.target) && e.target !== btnIndex) Sidebar.close();
    });
  }

  static toggle() {
    sidebarOpen = !sidebarOpen;
    if (!sidebarEl) return;
    sidebarEl.classList.toggle('open', sidebarOpen);
    sidebarEl.hidden = !sidebarOpen;
    if (sidebarOpen) {
      buildIndex();
      prevFocus = document.activeElement;
      releaseFocus = FocusTrap.trap(sidebarEl, document.getElementById('sidebar-close'));
    } else {
      cleanup();
    }
  }

  static close() {
    if (!sidebarOpen) return;
    sidebarOpen = false;
    if (sidebarEl) { sidebarEl.classList.remove('open'); sidebarEl.hidden = true; }
    cleanup();
  }
}
