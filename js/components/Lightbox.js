import { StorageManager } from '../core/StorageManager.js';
import { FocusTrap } from '../ui/FocusTrap.js';
import { ImageManager } from '../managers/ImageManager.js';
import { assertGesture, allowGesture } from '../core/gesture.js';

let currentIdx = null;
let touchX = 0;
let touchY = 0;
let releaseFocus = null;
let prevFocus = null;
let pendingLoad = 0;
let built = false;

function buildDOM() {
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

  lb.querySelector('#lb-close').addEventListener('click', () => Lightbox.close());
  lb.querySelector('#lb-prev').addEventListener('click', () => Lightbox.prev());
  lb.querySelector('#lb-next').addEventListener('click', () => Lightbox.next());
  lb.querySelector('#lb-fav').addEventListener('click', () => {
    if (currentIdx !== null) {
      const favs = StorageManager.getFavs();
      const p = favs.indexOf(currentIdx);
      if (p >= 0) favs.splice(p, 1); else favs.push(currentIdx);
      StorageManager.setFavs(favs);
      updateFav();
    }
  });
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lb-bg')) Lightbox.close();
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

function setImage(src, idx) {
  const lbImg = document.getElementById('lb-img');
  const lbLoader = document.getElementById('lb-loading');
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

function updateCounter() {
  const c = document.getElementById('lb-counter');
  const data = ImageManager.getData();
  if (c) c.textContent = ((currentIdx ?? 0) + 1) + ' / ' + data.length;
}

function updateFav() {
  const btn = document.getElementById('lb-fav');
  if (!btn || currentIdx === null) return;
  const favs = StorageManager.getFavs();
  const isFav = favs.indexOf(currentIdx) >= 0;
  btn.classList.toggle('is-fav', isFav);
  btn.setAttribute('aria-label', isFav ? 'Quitar favorita' : 'A\u00F1adir favorita');
}

export class Lightbox {
  static open(idx) {
    if (!assertGesture()) { console.warn('[VBook][Lightbox] open blocked — no gesture'); return; }
    buildDOM();
    const data = ImageManager.getData();
    const img = data[idx];
    if (!img) return;
    prevFocus = document.activeElement;
    currentIdx = idx;
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    if (!lb || !lbImg) return;
    setImage(img.path, idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    releaseFocus = FocusTrap.trap(lb, document.getElementById('lb-close'));
    updateCounter();
    updateFav();
  }

  static close() {
    currentIdx = null;
    const lb = document.getElementById('lightbox');
    if (lb) lb.hidden = true;
    document.body.style.overflow = '';
    if (releaseFocus) { releaseFocus(); releaseFocus = null; }
    if (prevFocus) { prevFocus.focus(); prevFocus = null; }
  }

  static prev() {
    const data = ImageManager.getData();
    if (data.length === 0 || currentIdx === null) return;
    currentIdx = (currentIdx - 1 + data.length) % data.length;
    const img = data[currentIdx];
    if (img) setImage(img.path, currentIdx);
    updateCounter();
    updateFav();
  }

  static next() {
    const data = ImageManager.getData();
    if (data.length === 0 || currentIdx === null) return;
    currentIdx = (currentIdx + 1) % data.length;
    const img = data[currentIdx];
    if (img) setImage(img.path, currentIdx);
    updateCounter();
    updateFav();
  }

  static handleKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); Lightbox.close(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); Lightbox.prev(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); Lightbox.next(); }
  }

  static renderFavs() {
    const section = document.getElementById('g-favs');
    const grid = document.getElementById('g-favs-grid');
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
