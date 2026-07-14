import { isMobile } from '../../core/Utils';

interface Particle {
  el: HTMLElement;
  x: number;
  y: number;
  speed: number;
  drift: number;
  rot: number;
  rotSpeed: number;
  life: number;
  maxLife: number;
}

const particles: Particle[] = [];
let container: HTMLElement | null = null;
let running = false;

function spawn(initial: boolean): void {
  if (!container) return;
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = '\u2665';
  el.style.left = `${Math.random() * 100}%`;
  el.style.top = initial ? `${Math.random() * 100}%` : '-5%';
  el.style.fontSize = `${0.4 + Math.random() * 0.6}rem`;
  el.style.opacity = String(0.08 + Math.random() * 0.12);
  el.style.transform = `rotate(${Math.random() * 360}deg)`;
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

function loop(): void {
  if (!running) return;
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

    p.el.style.top = `${p.y}%`;
    p.el.style.left = `${p.x}%`;
    p.el.style.transform = `rotate(${p.rot}deg)`;
    p.el.style.opacity = String(p.y < 10 ? (p.y / 10) * 0.2 : p.y > 90 ? ((100 - p.y) / 10) * 0.2 : 0.08 + Math.random() * 0.12);
  }
  requestAnimationFrame(loop);
}

export function startParticles(): void {
  if (running) return;
  container = document.createElement('div');
  container.className = 'particle-field';
  container.setAttribute('aria-hidden', 'true');
  document.getElementById('app')?.appendChild(container);
  running = true;
  for (let i = 0; i < (isMobile() ? 8 : 16); i++) spawn(true);
  loop();
}


