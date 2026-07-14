import { detectLowPerf, isMobile } from './core/Utils';
import { Logger } from './core/Logger';
import { StorageManager } from './core/StorageManager';
import { Loader } from './ui/Loader';
import { initBook, navigateToSpreadAnimated, renderSpread } from './components/Book/BookEngine';
import { getIsFlipping } from './components/Book/FlipEngine';
import { getPageImgData } from './components/Book/PageRenderer';
import { SPREAD_IMAGE_START } from './config';
import { Portal } from './components/Portal/Portal';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Lightbox } from './components/Lightbox/Lightbox';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { Notes } from './components/Notes/Notes';
import { AudioFXService } from './services/AudioFXService';
import { Petals } from './components/Petals/Petals';
import { startParticles } from './components/Particles/Particles';
import { ButtonManager, type ButtonDef } from './ui/ButtonManager';

import './styles/main.scss';

function applyContrast(enabled: boolean): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', enabled ? 'highcontrast' : 'dark');
  StorageManager.setContrast(enabled);
  const btn = document.getElementById('btn-contrast');
  if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
}

async function init(): Promise<void> {
  Loader.init();

  StorageManager.getContrast() ? applyContrast(true) : applyContrast(false);
  detectLowPerf();
  document.documentElement.setAttribute('data-mobile', isMobile() ? 'true' : 'false');

  await Loader.getPromise();

  Portal.init();
  initBook();
  Sidebar.init();
  Lightbox.init();
  AudioFXService.init();
  MusicPlayer.init();
  Notes.init();
  Petals.init();
  startParticles();

  const buttons: ButtonDef[] = [
    {
      id: 'btn-surprise',
      onClick: () => {
        const data = getPageImgData();
        if (data.length === 0 || getIsFlipping()) return;
        const idx = Math.floor(Math.random() * data.length);
        navigateToSpreadAnimated(SPREAD_IMAGE_START + idx).then(() => {
          setTimeout(() => Lightbox.open(idx), 120);
        });
      },
    },
    {
      id: 'btn-contrast',
      onClick: () => {
        const root = document.documentElement;
        applyContrast(root.getAttribute('data-theme') !== 'highcontrast');
      },
    },
    {
      id: 'btn-sound',
      onClick: () => AudioFXService.toggle(),
    },
  ];
  ButtonManager.register(buttons);

  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const mob = isMobile();
      const wasMob = document.documentElement.getAttribute('data-mobile') === 'true';
      if (mob !== wasMob) {
        document.documentElement.setAttribute('data-mobile', mob ? 'true' : 'false');
        renderSpread();
      }
    }, 150);
  });

  Logger.info('Main', 'Application initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
