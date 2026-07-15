import { CFG, IMAGES, IMAGE_CAPTIONS } from '../config.js';
import { allowGesture } from '../core/gesture.js';

let imgData = null;
let openFn = null;

export function setLightboxOpenFn(fn) { openFn = fn; }

export class ImageManager {
  static init() {
    if (imgData) return;
    imgData = IMAGES.map((name, i) => ({
      name,
      path: CFG.imgDir + encodeURIComponent(name),
      index: i
    }));
  }

  static getData() { return imgData || []; }
  static getCount() { return (imgData || []).length; }
  static getImage(idx) { return (imgData || [])[idx] || null; }

  static createElement(imgIdx) {
    const img = this.getImage(imgIdx);
    if (!img) return null;

    const div = document.createElement('div');
    div.className = 'p-image';
    div.tabIndex = 0;
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', 'Abrir recuerdo ' + (imgIdx + 1));

    const placeholder = document.createElement('div');
    placeholder.className = 'p-img-placeholder';
    placeholder.innerHTML = '<span class="p-img-loader"></span>';

    const imgEl = document.createElement('img');
    imgEl.dataset.src = img.path;
    imgEl.dataset.idx = String(imgIdx);
    imgEl.alt = 'Recuerdo ' + (imgIdx + 1);
    imgEl.className = 'p-img-lazy';

    imgEl.addEventListener('load', function onLoad() {
      this.classList.add('loaded');
      const ph = this.parentElement?.querySelector('.p-img-placeholder');
      if (ph) ph.remove();
    });
    imgEl.addEventListener('error', function onErr() {
      const ph = this.parentElement?.querySelector('.p-img-placeholder');
      if (ph) ph.innerHTML = '<span class="p-img-error">No disponible</span>';
    });

    div.addEventListener('click', () => { allowGesture(); if (openFn) openFn(imgIdx); });
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); allowGesture(); if (openFn) openFn(imgIdx); }
    });

    div.appendChild(placeholder);
    div.appendChild(imgEl);

    const cap = document.createElement('p');
    cap.className = 'p-image-caption';
    cap.textContent = IMAGE_CAPTIONS[imgIdx % IMAGE_CAPTIONS.length];
    div.appendChild(cap);

    return div;
  }

  static loadImage(el) {
    if (!el) return;
    const imgs = el.tagName === 'IMG' ? [el] : el.querySelectorAll('.p-img-lazy');
    for (const img of imgs) {
      if (img.src && img.src !== '') continue;
      const src = img.dataset.src;
      if (!src) continue;
      img.src = src;
    }
  }

  static destroyImage(el) {
    if (!el) return;
    const imgs = el.tagName === 'IMG' ? [el] : el.querySelectorAll('.p-img-lazy');
    imgs.forEach(img => {
      const src = img.src;
      img.removeAttribute('src');
      img.classList.remove('loaded');
      if (src) URL.revokeObjectURL?.(src);
    });
  }
}
