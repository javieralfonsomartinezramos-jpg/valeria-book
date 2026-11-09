console.log(`%c[FORENSIC] MODULE LOADED — js/components/Lightbox.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, label: string, path: string) => function(this: unknown, ...args: TArgs): TReturn {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${(e as Error).message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${(e as Error).message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { StorageManager } from '../core/StorageManager.js';
import { FocusTrap } from '../core/FocusTrap.js';
import { ImageManager } from '../managers/ImageManager.js';
import { assertGesture, allowGesture } from '../core/gesture.js';

let currentIdx: number | null = null;
let touchX = 0;
let touchY = 0;
let releaseFocus: (() => void) | null = null;
let prevFocus: HTMLElement | null = null;
let pendingLoad = 0;
let built = false;

function _f_buildDOM(): void {
  if (built) return;
  built = true;

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', 'Visor de imagenes');
  lb.hidden = true;
  lb.innerHTML =
    '<div class="lb-bg"></div>' +
    '<div class="lb-inner">' +
      '<button class="lb-close" id="lb-close" aria-label="Cerrar visor">&times;</button>' +
      '<button class="lb-nav lb-prev" id="lb-prev" aria-label="Imagen anterior">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<div class="lb-loading" id="lb-loading" aria-hidden="true"></div>' +
      '<img class="lb-img" id="lb-img" src="" alt="Fotograf\u00EDa">' +
      '<button class="lb-nav lb-next" id="lb-next" aria-label="Imagen siguiente">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</button>' +
      '<span class="lb-counter" id="lb-counter" aria-live="polite"></span>' +
      '<button class="lb-fav" id="lb-fav" aria-label="A\u00F1adir a favoritos">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
      '</button>' +
    '</div>';

  (lb.querySelector('#lb-close') as HTMLElement).addEventListener('click', () => Lightbox.close());
  (lb.querySelector('#lb-prev') as HTMLElement).addEventListener('click', () => Lightbox.prev());
  (lb.querySelector('#lb-next') as HTMLElement).addEventListener('click', () => Lightbox.next());
  (lb.querySelector('#lb-fav') as HTMLElement).addEventListener('click', () => {
    if (currentIdx !== null) {
      const idx = currentIdx;
      const favs = StorageManager.getFavs();
      const p = favs.indexOf(idx);
      if (p >= 0) favs.splice(p, 1); else favs.push(idx);
      StorageManager.setFavs(favs);
      updateFav();
    }
  });
  lb.addEventListener('click', e => {
    if (e.target === lb || (e.target as HTMLElement).classList.contains('lb-bg')) Lightbox.close();
  });
  lb.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchX;
    const dy = e.changedTouches[0].screenY - touchY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) Lightbox.next(); else Lightbox.prev();
    }
  }, { passive: true });

  document.body.appendChild(lb);
}
const buildDOM = _fW(_f_buildDOM, 'buildDOM', 'js/components/Lightbox.js');

function _f_setImage(src: string, idx: number): void {
  console.log(`%c[FORENSIC] getElementById('lb-img') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
  const lbImg = document.getElementById('lb-img') as HTMLImageElement | null;
  if (lbImg) { console.log(`%c[FORENSIC] getElementById('lb-img') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lb-img') → NULL`, 'color:#e67e22;font-weight:bold'); }
  console.log(`%c[FORENSIC] getElementById('lb-loading') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
  const lbLoader = document.getElementById('lb-loading');
  if (lbLoader) { console.log(`%c[FORENSIC] getElementById('lb-loading') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lb-loading') → NULL`, 'color:#e67e22;font-weight:bold'); }
  if (!lbImg) return;

  const loadId = ++pendingLoad;
  lbImg.onerror = null;
  lbImg.onload = null;
  lbImg.classList.add('loading');
  if (lbLoader) lbLoader.hidden = false;

  lbImg.onerror = function() {
    if (loadId !== pendingLoad) return;
    lbImg.alt = 'Imagen no disponible';
    lbImg.classList.remove('loading');
    if (lbLoader) lbLoader.hidden = true;
  };
  lbImg.onload = function() {
    if (loadId !== pendingLoad) return;
    lbImg.classList.remove('loading');
    if (lbLoader) lbLoader.hidden = true;
  };
  lbImg.src = src;
  lbImg.alt = 'Fotograf\u00EDa ' + (idx + 1);
}
const setImage = _fW(_f_setImage, 'setImage', 'js/components/Lightbox.js');

function _f_updateCounter(): void {
  console.log(`%c[FORENSIC] getElementById('lb-counter') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
  const c = document.getElementById('lb-counter');
  if (c) { console.log(`%c[FORENSIC] getElementById('lb-counter') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lb-counter') → NULL`, 'color:#e67e22;font-weight:bold'); }
  const data = ImageManager.getData();
  if (c) c.textContent = ((currentIdx ?? 0) + 1) + ' / ' + data.length;
}
const updateCounter = _fW(_f_updateCounter, 'updateCounter', 'js/components/Lightbox.js');

function _f_updateFav(): void {
  console.log(`%c[FORENSIC] getElementById('lb-fav') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
  const btn = document.getElementById('lb-fav');
  if (btn) { console.log(`%c[FORENSIC] getElementById('lb-fav') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lb-fav') → NULL`, 'color:#e67e22;font-weight:bold'); }
  if (!btn || currentIdx === null) return;
  const favs = StorageManager.getFavs();
  const isFav = favs.indexOf(currentIdx) >= 0;
  btn.classList.toggle('is-fav', isFav);
  btn.setAttribute('aria-label', isFav ? 'Quitar favorita' : 'A\u00F1adir favorita');
}
const updateFav = _fW(_f_updateFav, 'updateFav', 'js/components/Lightbox.js');

export class Lightbox {
  static open(idx: number): void {
    if (!assertGesture()) { console.warn('[VBook][Lightbox] open blocked — no gesture'); return; }
    buildDOM();
    const data = ImageManager.getData();
    const img = data[idx];
    if (!img) return;
    prevFocus = document.activeElement as HTMLElement | null;
    currentIdx = idx;
    console.log(`%c[FORENSIC] getElementById('lightbox') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
    const lb = document.getElementById('lightbox');
    if (lb) { console.log(`%c[FORENSIC] getElementById('lightbox') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lightbox') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('lb-img') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
    const lbImg = document.getElementById('lb-img');
    if (lbImg) { console.log(`%c[FORENSIC] getElementById('lb-img') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lb-img') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!lb || !lbImg) return;
    setImage(img.path, idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    console.log(`%c[FORENSIC] getElementById('lb-close') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
    const _lbClose = document.getElementById('lb-close');
    if (_lbClose) { console.log(`%c[FORENSIC] getElementById('lb-close') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lb-close') → NULL`, 'color:#e67e22;font-weight:bold'); }
    releaseFocus = FocusTrap.trap(lb, _lbClose ?? undefined);
    updateCounter();
    updateFav();
  }

  static close(): void {
    currentIdx = null;
    console.log(`%c[FORENSIC] getElementById('lightbox') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
    const lb = document.getElementById('lightbox');
    if (lb) { console.log(`%c[FORENSIC] getElementById('lightbox') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('lightbox') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (lb) lb.hidden = true;
    document.body.style.overflow = '';
    if (releaseFocus) { releaseFocus(); releaseFocus = null; }
    if (prevFocus) { prevFocus.focus(); prevFocus = null; }
  }

  static prev(): void {
    const data = ImageManager.getData();
    if (data.length === 0 || currentIdx === null) return;
    currentIdx = (currentIdx - 1 + data.length) % data.length;
    const img = data[currentIdx];
    if (img) setImage(img.path, currentIdx);
    updateCounter();
    updateFav();
  }

  static next(): void {
    const data = ImageManager.getData();
    if (data.length === 0 || currentIdx === null) return;
    currentIdx = (currentIdx + 1) % data.length;
    const img = data[currentIdx];
    if (img) setImage(img.path, currentIdx);
    updateCounter();
    updateFav();
  }

  static handleKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') { e.preventDefault(); Lightbox.close(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); Lightbox.prev(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); Lightbox.next(); }
  }

  static renderFavs(): void {
    console.log(`%c[FORENSIC] getElementById('g-favs') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
    const section = document.getElementById('g-favs');
    if (section) { console.log(`%c[FORENSIC] getElementById('g-favs') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('g-favs') → NULL`, 'color:#e67e22;font-weight:bold'); }
    console.log(`%c[FORENSIC] getElementById('g-favs-grid') — js/components/Lightbox.js`, 'color:#f28b9e;font-weight:bold');
    const grid = document.getElementById('g-favs-grid');
    if (grid) { console.log(`%c[FORENSIC] getElementById('g-favs-grid') → FOUND`, 'color:#27ae60;font-weight:bold'); } else { console.warn(`%c[FORENSIC] ⚠ getElementById('g-favs-grid') → NULL`, 'color:#e67e22;font-weight:bold'); }
    if (!section || !grid) return;
    const favs = StorageManager.getFavs();
    const data = ImageManager.getData();
    if (favs.length === 0) { section.hidden = true; return; }
    section.hidden = false;
    grid.innerHTML = '';
    favs.forEach(idx => {
      const img = data[idx];
      if (!img) return;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'g-item g-item-sm';
      item.setAttribute('aria-label', 'Abrir favorita ' + (idx + 1));
      const el = document.createElement('img');
      el.loading = 'lazy';
      el.src = img.path;
      el.alt = 'Favorita';
      el.addEventListener('error', function() { this.alt = 'Sin imagen'; this.style.display = 'none'; }, { once: true });
      item.appendChild(el);
      item.addEventListener('click', () => { allowGesture(); Lightbox.open(idx); });
      grid.appendChild(item);
    });
  }
}

Lightbox.open = _fW(Lightbox.open.bind(Lightbox), 'open', 'js/components/Lightbox.js');
Lightbox.close = _fW(Lightbox.close.bind(Lightbox), 'close', 'js/components/Lightbox.js');
Lightbox.prev = _fW(Lightbox.prev.bind(Lightbox), 'prev', 'js/components/Lightbox.js');
Lightbox.next = _fW(Lightbox.next.bind(Lightbox), 'next', 'js/components/Lightbox.js');
Lightbox.handleKey = _fW(Lightbox.handleKey.bind(Lightbox), 'handleKey', 'js/components/Lightbox.js');
Lightbox.renderFavs = _fW(Lightbox.renderFavs.bind(Lightbox), 'renderFavs', 'js/components/Lightbox.js');
