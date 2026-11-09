import { Logger } from '../core/Logger';
import { EventBus } from '../core/EventBus';
import { StorageManager } from '../core/StorageManager';
import { detectLowPerf, isMobile } from '../core/Utils';
import { DOMManager } from './DOMManager';
import { ResourceManager } from './ResourceManager';
import { ImageManager, setLightboxOpenFn } from './ImageManager';
import { AnimationManager } from './AnimationManager';
import {
  SPREAD_IMAGE_START, TOTAL_SPREADS, getPageName,
} from '../config';
import { allowGesture } from '../core/gesture';
import { getIsFlipping, canGoNext, canGoPrev, getCurrentSpread } from '../core/BookState';
import { renderSpread, showCurrentSpread, goToSpread, navigateToSpreadAnimated, initBook } from '../components/BookEngine';
import { navigateWithFlip } from '../components/FlipEngine';
import { Lightbox } from '../components/Lightbox';
import { Sidebar } from '../components/Sidebar';
import { AudioManager } from '../services/AudioManager';
import { AudioFXService } from '../services/AudioFXService';

let started = false;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function applyContrast(enabled: boolean): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', enabled ? 'highcontrast' : 'dark');
  StorageManager.setContrast(enabled);
  const btn = DOMManager.get('btn-contrast');
  if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
}

function onSpreadChanged(spreadIdx: number): void {
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

function phase1Config(): void {
  Logger.info('Startup', 'Phase 1/9 — Config');
  DOMManager.init();
  detectLowPerf();
  document.documentElement.setAttribute('data-mobile', isMobile() ? 'true' : 'false');
  applyContrast(StorageManager.getContrast());
}

function phase2Resources(): void {
  Logger.info('Startup', 'Phase 2/9 — Resources');
  ResourceManager.init();
}

async function phase3State(): Promise<void> {
  Logger.info('Startup', 'Phase 3/9 — State');
  await ResourceManager.getPromise();
  ImageManager.init();
  setLightboxOpenFn(idx => Lightbox.open(idx));
}

function phase4Render(): void {
  Logger.info('Startup', 'Phase 4/9 — Render');
  initBook();
}

function phase5Interface(): void {
  Logger.info('Startup', 'Phase 5/9 — Interface');
  const topbar = DOMManager.get('topbar');
  if (topbar) topbar.hidden = false;

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

function phase6Events(): void {
  Logger.info('Startup', 'Phase 6/9 — Events');

  EventBus.on('book:spread-changed', (data: unknown) => {
    onSpreadChanged((data as { spread: number }).spread ?? (data as number));
  });
  EventBus.on('book:navigate', (data: unknown) => {
    const d = data as { animated?: boolean; spread: number };
    if (d.animated) navigateToSpreadAnimated(d.spread);
    else goToSpread(d.spread);
  });
  EventBus.on('audiofx:page-turn', () => AudioFXService.play());

  EventBus.on('ui:reach-music', () => {
    import('../components/MusicPlayer').then(m => m.MusicPlayer.initUI()).catch(() => {});
  });
  EventBus.on('ui:reach-notes', () => {
    import('../components/Notes').then(m => m.Notes.render()).catch(() => {});
  });
  EventBus.on('ui:reach-closing', () => {
    import('../components/Petals').then(m => m.Petals.spawn()).catch(() => {});
  });

  DOMManager.onKey('*', (e: Event) => {
    const ke = e as KeyboardEvent;
    const lb = DOMManager.get('lightbox');
    if (lb && !lb.hidden) { Lightbox.handleKey(ke); return; }
    if (ke.key === 'ArrowLeft' || ke.key === 'ArrowUp') { ke.preventDefault(); if (canGoPrev()) navigateWithFlip(-1); }
    else if (ke.key === 'ArrowRight' || ke.key === 'ArrowDown') { ke.preventDefault(); if (canGoNext()) navigateWithFlip(1); }
    else if (ke.key === 'Home') { ke.preventDefault(); goToSpread(0); }
    else if (ke.key === 'End') { ke.preventDefault(); goToSpread(TOTAL_SPREADS - 1); }
    else if (ke.key === 'Escape') { ke.preventDefault(); Sidebar.toggle(); }
  });
}

function phase7Audio(): void {
  Logger.info('Startup', 'Phase 7/9 — Audio');
  AudioFXService.init();
  AudioManager.init();
}

function phase8Secondary(): void {
  Logger.info('Startup', 'Phase 8/9 — Secondary');
  Sidebar.init();
  AudioManager.updateUI();
}

function phase9Effects(): void {
  Logger.info('Startup', 'Phase 9/9 — Effects');
  AnimationManager.init();
  import('../components/Particles').then(m => m.startParticles()).catch(() => {});

  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
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

async function runPhase(id: number, name: string, fn: () => void | Promise<void>): Promise<void> {
  Logger.info('Startup', `Phase ${id}/9 — ${name}`);
  try {
    await fn();
    Logger.info('Startup', `Phase ${id}/9 — ${name} OK`);
  } catch (e) {
    Logger.error('Startup', `Phase ${id}/9 — ${name} FAILED: ${(e as Error).message || e}`);
  }
}

export class StartupManager {
  static async start(): Promise<void> {
    if (started) return;
    started = true;

    await runPhase(1, 'Config', phase1Config);
    await runPhase(2, 'Resources', phase2Resources);
    await runPhase(3, 'State', phase3State);
    await runPhase(4, 'Render', phase4Render);
    await runPhase(5, 'Interface', phase5Interface);
    await runPhase(6, 'Events', phase6Events);
    await runPhase(7, 'Audio', phase7Audio);
    await runPhase(8, 'Secondary', phase8Secondary);
    await runPhase(9, 'Effects', phase9Effects);

    Logger.info('Startup', 'All phases complete');
  }
}
