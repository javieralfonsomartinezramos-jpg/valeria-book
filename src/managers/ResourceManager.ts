let verificado = false;
let progress = 0;
let barFill: HTMLElement | null = null;
let barPct: HTMLElement | null = null;
let loaderEl: HTMLElement | null = null;
let messageEl: HTMLElement | null = null;
let messageTimer: ReturnType<typeof setInterval> | null = null;

const loadingMessages = [
  'Preparando un lugar bonito para tu historia...',
  'Acomodando cada recuerdo con cariño...',
  'Encendiendo las luces de este pequeño libro...',
  'Guardando un espacio para todo lo que sientes...',
  'Ya casi: las páginas están tomando forma...',
];

const MAX_VERIFY_RETRIES = 30;

export class ResourceManager {
  static init(): void {
    barFill = document.getElementById('loader-fill');
    barPct = document.getElementById('loader-pct');
    loaderEl = document.getElementById('loader');
    messageEl = document.getElementById('loader-message');
    let messageIndex = 0;
    messageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      if (messageEl) {
        messageEl.classList.remove('is-changing');
        requestAnimationFrame(() => {
          if (!messageEl) return;
          messageEl.textContent = loadingMessages[messageIndex];
          messageEl.classList.add('is-changing');
        });
      }
    }, 1800);
  }

  static getProgress(): number {
    return progress;
  }

  static getPromise(): Promise<void> {
    if (verificado) return Promise.resolve();
    verificado = true;
    return new Promise<void>(resolve => {
      this._setProgress(30);
      this._verifyCSS(() => {
        this._setProgress(50);
        this._verifyDOM(() => {
          this._setProgress(80);
          this._setProgress(100);
          if (loaderEl) loaderEl.classList.add('loaded');
          if (messageTimer) { clearInterval(messageTimer); messageTimer = null; }
          resolve();
        });
      });
    });
  }

  static _setProgress(v: number): void {
    progress = v;
    if (loaderEl) loaderEl.setAttribute('aria-valuenow', String(v));
    if (barFill) {
      barFill.style.width = v + '%';
    }
    if (barPct) {
      barPct.textContent = v + '%';
    }
  }

  static _verifyCSS(done: () => void, retries = 0): void {
    const test = getComputedStyle(document.documentElement);
    const rose = test.getPropertyValue('--rose');
    if (rose || retries >= MAX_VERIFY_RETRIES) {
      done();
      return;
    }
    setTimeout(() => this._verifyCSS(done, retries + 1), 100);
  }

  static _verifyDOM(done: () => void, retries = 0): void {
    const book = document.getElementById('book');
    const portal = document.getElementById('portal');
    if ((book && portal) || retries >= MAX_VERIFY_RETRIES) {
      done();
      return;
    }
    setTimeout(() => this._verifyDOM(done, retries + 1), 100);
  }
}
