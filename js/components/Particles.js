import { AnimationManager } from '../managers/AnimationManager.js';

let container = null;
let running = false;
let rafId = 0;
const particles = [];

function spawn(initial) {
  if (!container) return;
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = '\u2665';
  el.style.left = Math.random() * 100 + '%';
  el.style.top = initial ? Math.random() * 100 + '%' : '-5%';
  el.style.fontSize = (0.4 + Math.random() * 0.6) + 'rem';
  el.style.opacity = String(0.08 + Math.random() * 0.12);
  el.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
  container.appendChild(el);

  particles.push({
    el,
    x: parseFloat(el.style.left),
    y: parseFloat(el.style.top) || -5,
    speed: 0.15 + Math.random() * 0.35,
    drift: (Math.random() - 0.5) * 0.3,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 2,
    life: 0,
    maxLife: 800 + Math.random() * 600,
  });
}

function loop() {
  if (!running || AnimationManager.isPaused()) { rafId = requestAnimationFrame(loop); return; }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.y += p.speed;
    p.x += p.drift;
    p.rot += p.rotSpeed;
    p.life++;
    if (p.y > 105 || p.life > p.maxLife) {
      p.el.remove();
      particles.splice(i, 1);
      spawn(false);
      continue;
    }
    p.el.style.transform = 'translate3d(' + (p.drift * p.life) + 'px, ' + (p.speed * p.life) + 'px, 0) rotate(' + p.rot + 'deg)';
    const opacity = p.y < 10 ? (p.y / 10) * 0.2 : p.y > 90 ? ((100 - p.y) / 10) * 0.2 : 0.08 + Math.random() * 0.12;
    p.el.style.opacity = String(Math.min(opacity, 0.2));
  }
  rafId = requestAnimationFrame(loop);
}

export function startParticles() {
  if (running) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  container = document.createElement('div');
  container.className = 'particle-field';
  container.setAttribute('aria-hidden', 'true');
  const app = document.getElementById('app');
  if (!app) { container = null; return; }
  app.appendChild(container);
  running = true;
  const count = window.innerWidth < 640 ? 8 : 16;
  for (let i = 0; i < count; i++) spawn(true);
  rafId = requestAnimationFrame(loop);
  AnimationManager.register('particles', rafId);
}
