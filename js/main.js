import { Portal } from './components/Portal.js';
import { StartupManager } from './managers/StartupManager.js';

function init() {
  Portal.init();
  const btn = document.getElementById('portal-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      Portal.close();
      StartupManager.start();
    }, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
