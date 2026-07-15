console.log(`%c[FORENSIC] MODULE LOADED — js/components/Particles.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = (fn, label, path) => function(...args) {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${e?.message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { AnimationManager } from '../managers/AnimationManager.js';

let container = null;
let running = false;
let rafId = 0;
const particles = [];

function _f_spawn(initial) {
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
const spawn = _fW(_f_spawn, 'spawn', 'js/components/Particles.js');

function _f_loop() {
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
const loop = _fW(_f_loop, 'loop', 'js/components/Particles.js');

function _f_startParticles() {
  if (running) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  container = document.createElement('div');
  container.className = 'particle-field';
  container.setAttribute('aria-hidden', 'true');
  console.log(`%c[FORENSIC] getElementById('app') — js/components/Particles.js`, 'color:#f28b9e;font-weight:bold');
  const app = document.getElementById('app');
  if (app) { console.log(`%c[FORENSIC] getElementById('app') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('app') → NULL`, 'color:#e67e22;font-weight:bold'); }
  if (!app) { container = null; return; }
  app.appendChild(container);
  running = true;
  const count = window.innerWidth < 640 ? 8 : 16;
  for (let i = 0; i < count; i++) spawn(true);
  rafId = requestAnimationFrame(loop);
  AnimationManager.register('particles', rafId);
}
export const startParticles = _fW(_f_startParticles, 'startParticles', 'js/components/Particles.js');
