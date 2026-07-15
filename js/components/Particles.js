import { EventBus } from '../core/EventBus.js';

let particleContainer = null;

export function startParticles() {
  if (particleContainer) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  particleContainer = document.createElement('div');
  particleContainer.className = 'particle-field';
  particleContainer.setAttribute('aria-hidden', 'true');
  const app = document.getElementById('app');
  if (app) app.appendChild(particleContainer);

  const mobile = window.innerWidth < 640;
  const count = mobile ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = '\u2665';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.fontSize = (0.4 + Math.random() * 0.6) + 'rem';
    el.style.opacity = String(0.08 + Math.random() * 0.12);
    el.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    el.style.animationDelay = (Math.random() * 10) + 's';
    el.style.animationDuration = (12 + Math.random() * 8) + 's';
    particleContainer.appendChild(el);
  }
}

export function stopParticles() {
  if (particleContainer) {
    particleContainer.innerHTML = '';
    particleContainer.remove();
    particleContainer = null;
  }
}
