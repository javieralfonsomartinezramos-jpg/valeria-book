import { CFG, IMAGES, IMAGE_CAPTIONS } from '../config';
import { allowGesture } from '../core/gesture';

interface ImageItem {
  name: string;
  path: string;
  index: number;
}

let imgData: ImageItem[] | null = null;
let openFn: ((idx: number) => void) | null = null;

function _f_setLightboxOpenFn(fn: (idx: number) => void): void {
  openFn = fn;
}
export const setLightboxOpenFn = _f_setLightboxOpenFn;

export class ImageManager {
  static init(): void {
    if (imgData) return;
    imgData = IMAGES.map((name, i) => ({
      name,
      path: CFG.imgDir + encodeURIComponent(name),
      index: i,
    }));
  }

  static getData(): ImageItem[] {
    return imgData || [];
  }

  static getCount(): number {
    return (imgData || []).length;
  }

  static getImage(idx: number): ImageItem | null {
    return (imgData || [])[idx] || null;
  }

  static createElement(imgIdx: number): HTMLElement | null {
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
    imgEl.loading = 'lazy';
    imgEl.decoding = 'async';
    imgEl.fetchPriority = 'low';

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
    div.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        allowGesture();
        if (openFn) openFn(imgIdx);
      }
    });

    div.appendChild(placeholder);
    div.appendChild(imgEl);

    const cap = document.createElement('p');
    cap.className = 'p-image-caption';
    cap.textContent = IMAGE_CAPTIONS[imgIdx % IMAGE_CAPTIONS.length];
    div.appendChild(cap);

    return div;
  }

  static loadImage(el: HTMLElement | null): void {
    if (!el) return;
    const imgs = el.tagName === 'IMG' ? [el as HTMLImageElement] : Array.from(el.querySelectorAll<HTMLImageElement>('.p-img-lazy'));
    for (const img of imgs) {
      if (img.src && img.src !== '') continue;
      const src = img.dataset.src;
      if (!src) continue;
      img.removeAttribute('data-src');
      img.src = src;
    }
  }

  static destroyImage(el: HTMLElement | null): void {
    if (!el) return;
    const imgs = el.tagName === 'IMG' ? [el as HTMLImageElement] : Array.from(el.querySelectorAll<HTMLImageElement>('.p-img-lazy'));
    imgs.forEach(img => {
      const src = img.src;
      img.removeAttribute('src');
      img.dataset.src = src;
      img.classList.remove('loaded');
    });
  }
}
