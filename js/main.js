import { detectLowPerf, isMobile } from './core/Utils.js';
import { Logger } from './core/Logger.js';
import { StorageManager } from './core/StorageManager.js';
import { Loader } from './ui/Loader.js';
import { initBook, navigateToSpreadAnimated, renderSpread } from './components/BookEngine.js';
import { getIsFlipping } from './core/BookState.js';
import { getPageImgData, setLightboxOpenFn } from './components/PageRenderer.js';
import { CFG, SPREAD_IMAGE_START } from './config.js';
import { Portal } from './components/Portal.js';
import { Sidebar } from './components/Sidebar.js';
import { Lightbox } from './components/Lightbox.js';
import { MusicPlayer } from './components/MusicPlayer.js';
import { Notes } from './components/Notes.js';
import { AudioFXService } from './services/AudioFXService.js';
import { Petals } from './components/Petals.js';
import { startParticles } from './components/Particles.js';
import { ButtonManager } from './ui/ButtonManager.js';

function applyContrast(enabled) {
  const root = document.documentElement;
  root.setAttribute('data-theme', enabled ? 'highcontrast' : 'dark');
  StorageManager.setContrast(enabled);
  const btn = document.getElementById('btn-contrast');
  if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
}

async function init() {
  Loader.init();

  StorageManager.getContrast() ? applyContrast(true) : applyContrast(false);
  detectLowPerf();
  document.documentElement.setAttribute('data-mobile', isMobile() ? 'true' : 'false');

  await Loader.getPromise();

  Portal.init();
  initBook();
  Sidebar.init();
  Lightbox.init();

  setLightboxOpenFn((idx) => Lightbox.open(idx));

  AudioFXService.init();
  MusicPlayer.init();
  Notes.init();
  Petals.init();
  startParticles();

  const buttons = [
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

  let resizeTimer;
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

  Logger.info('Main', 'Application initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
