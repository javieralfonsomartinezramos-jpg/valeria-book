import { Logger } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';
import { StorageManager } from '../core/StorageManager.js';
import { detectLowPerf, isMobile } from '../core/Utils.js';
import { DOMManager } from './DOMManager.js';
import { ResourceManager } from './ResourceManager.js';
import { ImageManager, setLightboxOpenFn } from './ImageManager.js';
import { AnimationManager } from './AnimationManager.js';
import {
  SPREAD_LETTER_START, SPREAD_LETTER_COUNT, SPREAD_IMAGE_START, IMAGE_COUNT,
  SPREAD_MOVIE_START, SPREAD_MOVIE_COUNT, SPREAD_MUSIC, SPREAD_NOTES,
  SPREAD_CLOSING, TOTAL_SPREADS, getPageName
} from '../config.js';
import { allowGesture } from '../core/gesture.js';
import { getIsFlipping, canGoNext, canGoPrev, getCurrentSpread } from '../core/BookState.js';
import { renderSpread, showCurrentSpread, goToSpread, navigateToSpreadAnimated, initBook } from '../components/BookEngine.js';
import { navigateWithFlip } from '../components/FlipEngine.js';
import { Lightbox } from '../components/Lightbox.js';
import { Sidebar } from '../components/Sidebar.js';
import { AudioManager } from '../services/AudioManager.js';
import { AudioFXService } from '../services/AudioFXService.js';

let started = false;
let resizeTimer = null;

/* ─── Helpers ──────────────────────────────────────────────── */

function applyContrast(enabled) {
  const root = document.documentElement;
  root.setAttribute('data-theme', enabled ? 'highcontrast' : 'dark');
  StorageManager.setContrast(enabled);
  const btn = DOMManager.get('btn-contrast');
  if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
}

function onSpreadChanged(spreadIdx) {
  const title = DOMManager.get('topbar-title');
  if (title) title.textContent = getPageName(spreadIdx * 2);
  const ribbon = DOMManager.get('bm-ribbon');
  if (ribbon) {
    const total = TOTAL_SPREADS * 2;
    const pct = total > 0 ? Math.round(((spreadIdx * 2 + 1) / total) * 100) : 0;
    ribbon.style.width = pct + '%';
    const bm = DOMManager.get('bookmark');
    if (bm) bm.setAttribute('aria-valuenow', String(pct));
  }
}

/* ─── 9 Phases ─────────────────────────────────────────────── */

function phase1Config() {
  Logger.info('Startup', 'Phase 1/9 — Config');
  DOMManager.init();
  detectLowPerf();
  document.documentElement.setAttribute('data-mobile', isMobile() ? 'true' : 'false');
  applyContrast(StorageManager.getContrast());
}

function phase2Resources() {
  Logger.info('Startup', 'Phase 2/9 — Resources');
  ResourceManager.init();
}

async function phase3State() {
  Logger.info('Startup', 'Phase 3/9 — State');
  await ResourceManager.getPromise();
  ImageManager.init();
  setLightboxOpenFn(idx => Lightbox.open(idx));
}

function phase4Render() {
  Logger.info('Startup', 'Phase 4/9 — Render');
  initBook();
}

function phase5Interface() {
  Logger.info('Startup', 'Phase 5/9 — Interface');
  const topbar = DOMManager.get('topbar');
  if (topbar) topbar.hidden = false;
  updateTitle(getCurrentSpread());
  onSpreadChanged(getCurrentSpread());

  DOMManager.onClick('#nav-prev', () => {
    if (getIsFlipping() || !canGoPrev()) return;
    navigateWithFlip(-1);
  });
  DOMManager.onClick('#nav-next', () => {
    if (getIsFlipping() || !canGoNext()) return;
    navigateWithFlip(1);
  });
  DOMManager.onClick('#btn-index', () => Sidebar.toggle());
  DOMManager.onClick('#btn-contrast', () => {
    applyContrast(document.documentElement.getAttribute('data-theme') !== 'highcontrast');
  });
  DOMManager.onClick('#btn-sound', () => AudioFXService.toggle());
  DOMManager.onClick('#btn-surprise', () => {
    const data = ImageManager.getData();
    if (data.length === 0 || getIsFlipping()) return;
    const idx = Math.floor(Math.random() * data.length);
    navigateToSpreadAnimated(SPREAD_IMAGE_START + idx).then(() => {
      setTimeout(() => { allowGesture(); Lightbox.open(idx); }, 120);
    });
  });
}

function phase6Events() {
  Logger.info('Startup', 'Phase 6/9 — Events');

  EventBus.on('book:spread-changed', onSpreadChanged);
  EventBus.on('book:navigate', data => {
    if (data.animated) navigateToSpreadAnimated(data.spread);
    else goToSpread(data.spread);
  });
  EventBus.on('audiofx:page-turn', () => AudioFXService.play());

  EventBus.on('ui:reach-music', () => {
    import('../components/MusicPlayer.js').then(m => m.MusicPlayer.initUI()).catch(() => {});
  });
  EventBus.on('ui:reach-notes', () => {
    import('../components/Notes.js').then(m => m.Notes.render()).catch(() => {});
  });
  EventBus.on('ui:reach-closing', () => {
    import('../components/Petals.js').then(m => m.Petals.spawn()).catch(() => {});
  });

  DOMManager.onKey('*', e => {
    const lb = DOMManager.get('lightbox');
    if (lb && !lb.hidden) { Lightbox.handleKey(e); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); if (canGoPrev()) navigateWithFlip(-1); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); if (canGoNext()) navigateWithFlip(1); }
    else if (e.key === 'Home') { e.preventDefault(); goToSpread(0); }
    else if (e.key === 'End') { e.preventDefault(); goToSpread(TOTAL_SPREADS - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); Sidebar.toggle(); }
  });
}

function phase7Audio() {
  Logger.info('Startup', 'Phase 7/9 — Audio');
  AudioFXService.init();
  AudioManager.init();
}

function phase8Secondary() {
  Logger.info('Startup', 'Phase 8/9 — Secondary');
  import('../components/Sidebar.js').then(m => m.Sidebar.init()).catch(() => {});
  AudioManager.updateUI();
}

function phase9Effects() {
  Logger.info('Startup', 'Phase 9/9 — Effects');
  AnimationManager.init();
  import('../components/Particles.js').then(m => m.startParticles()).catch(() => {});

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const mob = isMobile();
      const wasMob = document.documentElement.getAttribute('data-mobile') === 'true';
      if (mob !== wasMob) {
        document.documentElement.setAttribute('data-mobile', mob ? 'true' : 'false');
        renderSpread();
      }
    }, 150);
  });
}

/* ─── Public API ───────────────────────────────────────────── */

export class StartupManager {
  static async start() {
    if (started) return;
    started = true;

    phase1Config();
    phase2Resources();
    await phase3State();
    phase4Render();
    phase5Interface();
    phase6Events();
    phase7Audio();
    phase8Secondary();
    phase9Effects();
    Logger.info('Startup', 'All phases complete');
  }
}
