import { IMAGES, CFG } from '../config.js';

export class Loader {
  static fill = null;
  static pct = null;
  static el = null;
  static total = 0;
  static loaded = 0;

  static init() {
    this.el = document.getElementById('loader');
    this.fill = document.getElementById('loader-fill');
    this.pct = document.getElementById('loader-pct');
  }

  static getPromise() {
    return new Promise((resolve) => {
      this.total = IMAGES.length + 1;
      this.loaded = 0;
      this.advance();

      if (this.total === 0) { this.done(resolve); return; }

      IMAGES.forEach((name) => {
        const img = new Image();
        img.onload = () => { this.advance(); if (this.loaded >= this.total) this.done(resolve); };
        img.onerror = () => { this.advance(); if (this.loaded >= this.total) this.done(resolve); };
        img.src = CFG.imgDir + encodeURIComponent(name);
      });
    });
  }

  static advance() {
    this.loaded++;
    const p = Math.round((this.loaded / this.total) * 100);
    if (this.fill) this.fill.style.width = p + '%';
    if (this.pct) this.pct.textContent = p + '%';
  }

  static done(resolve) {
    this.advance();
    setTimeout(() => {
      if (this.el) this.el.classList.add('loaded');
      setTimeout(resolve, 600);
    }, 300);
  }
}
