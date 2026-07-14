import { StorageManager } from '../../core/StorageManager';
import { FocusTrap } from '../../ui/FocusTrap';
import { getPageImgData } from '../Book/PageRenderer';

export class Lightbox {
  static currentIdx: number | null = null;
  private static touchX = 0;
  private static releaseFocus: (() => void) | null = null;
  private static prevFocus: HTMLElement | null = null;

  static init(): void {
    document.getElementById('lb-close')?.addEventListener('click', () => this.close());
    document.getElementById('lb-prev')?.addEventListener('click', () => this.prev());
    document.getElementById('lb-next')?.addEventListener('click', () => this.next());
    document.getElementById('lb-fav')?.addEventListener('click', () => {
      if (this.currentIdx !== null) this.toggleFav(this.currentIdx);
    });

    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.addEventListener('click', (e) => {
        if (e.target === lb || (e.target as HTMLElement).classList.contains('lb-bg')) this.close();
      });
      lb.addEventListener('touchstart', (e) => {
        this.touchX = (e as TouchEvent).changedTouches[0].screenX;
      }, { passive: true });
      lb.addEventListener('touchend', (e) => {
        const dx = (e as TouchEvent).changedTouches[0].screenX - this.touchX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) this.next(); else this.prev();
        }
      }, { passive: true });
    }
  }

  static open(idx: number): void {
    const data = getPageImgData();
    const img = data[idx];
    if (!img) return;
    this.prevFocus = document.activeElement as HTMLElement;
    this.currentIdx = idx;
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img') as HTMLImageElement | null;
    if (!lb || !lbImg) return;
    this.setImage(img.path, idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    this.releaseFocus = FocusTrap.trap(lb, document.getElementById('lb-close'));
    this.updateCounter();
    this.updateFav();
  }

  static close(): void {
    this.currentIdx = null;
    const lb = document.getElementById('lightbox');
    if (lb) lb.hidden = true;
    document.body.style.overflow = '';
    if (this.releaseFocus) { this.releaseFocus(); this.releaseFocus = null; }
    if (this.prevFocus) { this.prevFocus.focus(); this.prevFocus = null; }
  }

  static prev(): void {
    const data = getPageImgData();
    if (data.length === 0 || this.currentIdx === null) return;
    this.currentIdx = (this.currentIdx - 1 + data.length) % data.length;
    const img = data[this.currentIdx];
    if (img) this.setImage(img.path, this.currentIdx);
    this.updateCounter();
    this.updateFav();
  }

  static next(): void {
    const data = getPageImgData();
    if (data.length === 0 || this.currentIdx === null) return;
    this.currentIdx = (this.currentIdx + 1) % data.length;
    const img = data[this.currentIdx];
    if (img) this.setImage(img.path, this.currentIdx);
    this.updateCounter();
    this.updateFav();
  }

  static handleKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
  }

  private static setImage(src: string, idx: number): void {
    const lbImg = document.getElementById('lb-img') as HTMLImageElement | null;
    const lbLoader = document.getElementById('lb-loading');
    if (!lbImg) return;
    lbImg.classList.add('loading');
    if (lbLoader) lbLoader.hidden = false;
    lbImg.onerror = function() {
      lbImg.alt = 'Imagen no disponible';
      lbImg.classList.remove('loading');
      if (lbLoader) lbLoader.hidden = true;
    };
    lbImg.onload = function() {
      lbImg.classList.remove('loading');
      if (lbLoader) lbLoader.hidden = true;
    };
    lbImg.src = src;
    lbImg.alt = `Fotografia ${idx + 1}`;
  }

  private static updateCounter(): void {
    const c = document.getElementById('lb-counter');
    const data = getPageImgData();
    if (c) c.textContent = `${(this.currentIdx ?? 0) + 1} / ${data.length}`;
  }

  private static updateFav(): void {
    const btn = document.getElementById('lb-fav');
    if (!btn || this.currentIdx === null) return;
    const favs = StorageManager.getFavs();
    const isFav = favs.indexOf(this.currentIdx) >= 0;
    btn.classList.toggle('is-fav', isFav);
    btn.setAttribute('aria-label', isFav ? 'Quitar favorita' : 'Añadir favorita');
  }

  private static toggleFav(idx: number): void {
    const favs = StorageManager.getFavs();
    const p = favs.indexOf(idx);
    if (p >= 0) { favs.splice(p, 1); } else { favs.push(idx); }
    StorageManager.setFavs(favs);
    this.updateFav();
  }

  static renderFavs(): void {
    const section = document.getElementById('g-favs');
    const grid = document.getElementById('g-favs-grid');
    if (!section || !grid) return;
    const favs = StorageManager.getFavs();
    const data = getPageImgData();
    if (favs.length === 0) { section.hidden = true; return; }
    section.hidden = false;
    grid.innerHTML = '';
    favs.forEach((idx) => {
      const img = data[idx];
      if (!img) return;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'g-item g-item-sm';
      item.setAttribute('aria-label', `Abrir favorita ${idx + 1}`);
      const el = document.createElement('img');
      el.loading = 'lazy';
      el.src = img.path;
      el.alt = 'Favorita';
      el.addEventListener('error', function() {
        this.alt = 'Sin imagen';
        this.style.display = 'none';
      }, { once: true });
      item.appendChild(el);
      item.addEventListener('click', () => Lightbox.open(idx));
      grid.appendChild(item);
    });
  }
}
