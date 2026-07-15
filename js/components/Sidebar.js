import { CHAPTERS } from '../config.js';
import { sanitize } from '../core/Utils.js';
import { FocusTrap } from '../ui/FocusTrap.js';
import { Logger } from '../core/Logger.js';
import { getCurrentSpread } from '../core/BookState.js';

let sidebarOpen = false;
let releaseFocus = null;
let prevFocus = null;

export class Sidebar {
  static init() {
    buildIndex();
    bindEvents();
  }

  static toggle() {
    sidebarOpen = !sidebarOpen;
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    sb.classList.toggle('open', sidebarOpen);
    sb.hidden = !sidebarOpen;

    if (sidebarOpen) {
      buildIndex();
      prevFocus = document.activeElement;
      releaseFocus = FocusTrap.trap(sb, document.getElementById('sidebar-close'));
    } else {
      cleanup();
    }
  }

  static close() {
    if (!sidebarOpen) return;
    sidebarOpen = false;
    const sb = document.getElementById('sidebar');
    if (sb) {
      sb.classList.remove('open');
      sb.hidden = true;
    }
    cleanup();
  }
}

function buildIndex() {
  const list = document.getElementById('index-list');
  if (!list) return;

  list.innerHTML = CHAPTERS.map((ch) => {
    const active = ch.spread === getCurrentSpread();
    return '<li><a href="#" data-spread="' + ch.spread + '" class="index-link' + (active ? ' active' : '') + '">' + sanitize(ch.name) + '</a></li>';
  }).join('');

  list.querySelectorAll('.index-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const s = parseInt(link.dataset.spread || '0', 10);
      if (s !== getCurrentSpread()) {
        import('../components/BookEngine.js').then(mod => mod.navigateToSpreadAnimated(s));
      }
      Sidebar.close();
    });
  });
}

function cleanup() {
  if (releaseFocus) { releaseFocus(); releaseFocus = null; }
  if (prevFocus) { prevFocus.focus(); prevFocus = null; }
}

function bindEvents() {
  const btnIndex = document.getElementById('btn-index');
  if (btnIndex) btnIndex.addEventListener('click', () => Sidebar.toggle());
  else Logger.warn('Sidebar', 'btn-index not found');

  const closeBtn = document.getElementById('sidebar-close');
  if (closeBtn) closeBtn.addEventListener('click', () => Sidebar.close());

  document.addEventListener('click', (e) => {
    const sb = document.getElementById('sidebar');
    if (sidebarOpen && sb && !sb.contains(e.target) && e.target !== btnIndex) Sidebar.close();
  });
}
