import { Logger } from '../core/Logger.js';

let verificado = false;
let progress = 0;
let barFill = null;
let barPct = null;
let loaderEl = null;

export class ResourceManager {
  static init() {
    barFill = document.getElementById('loader-fill');
    barPct = document.getElementById('loader-pct');
    loaderEl = document.getElementById('loader');
  }

  static getProgress() { return progress; }

  static getPromise() {
    if (verificado) return Promise.resolve();
    verificado = true;
    return new Promise(resolve => {
      this._setProgress(30);
      this._verifyCSS(() => {
        this._setProgress(50);
        this._verifyDOM(() => {
          this._setProgress(80);
          setTimeout(() => {
            this._setProgress(100);
            setTimeout(() => {
              if (loaderEl) loaderEl.classList.add('loaded');
              setTimeout(resolve, 200);
            }, 250);
          }, 100);
        });
      });
    });
  }

  static _setProgress(v) {
    progress = v;
    if (barFill) barFill.style.width = v + '%';
    if (barPct) barPct.textContent = v + '%';
  }

  static _verifyCSS(done) {
    const test = getComputedStyle(document.documentElement);
    if (test.getPropertyValue('--rose')) { done(); return; }
    Logger.warn('ResourceManager', 'CSS vars not found, retrying...');
    setTimeout(() => this._verifyCSS(done), 100);
  }

  static _verifyDOM(done) {
    const book = document.getElementById('book');
    const portal = document.getElementById('portal');
    if (book && portal) { done(); return; }
    Logger.warn('ResourceManager', 'DOM elements not ready, retrying...');
    setTimeout(() => this._verifyDOM(done), 100);
  }
}
