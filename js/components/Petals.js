import { EventBus } from '../core/EventBus.js';

export class Petals {
  static init() {
    EventBus.on('ui:reach-closing', () => this.spawn());
  }

  static spawn() {
    const container = document.getElementById('close-petals');
    if (!container || container.children.length > 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const symbols = ['\u2665', '\u2661', '\u2726'];
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = symbols[i % symbols.length];
      p.style.left = Math.random() * 100 + '%';
      p.style.fontSize = (0.5 + Math.random() * 0.6) + 'rem';
      p.style.animationDuration = (6 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 6) + 's';
      container.appendChild(p);
    }
  }
}
