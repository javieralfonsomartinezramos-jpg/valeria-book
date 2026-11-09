console.log(`%c[FORENSIC] MODULE LOADED — js/components/PageRenderer.js`, 'color:#27ae60;font-weight:bold');

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

import { THANKS_MESSAGES, MOVIE_QUOTES, ROMANTIC_PHRASES, IMAGE_COUNT, SPREAD_MOVIE_START, SPREAD_MOVIE_COUNT, SPREAD_IMAGE_START, SPREAD_MUSIC, SPREAD_NOTES, SPREAD_CLOSING } from '../config.js';
import { ImageManager } from '../managers/ImageManager.js';

interface MovieQuote {
  film: string;
  char: string;
  quote: string;
}

function _f_cloneTemplate(selector: string): DocumentFragment | null {
  const tmpl = document.querySelector<HTMLTemplateElement>(selector);
  if (!tmpl || !tmpl.content) return null;
  try { return tmpl.content.cloneNode(true) as DocumentFragment; } catch { return null; }
}
const cloneTemplate = _fW(_f_cloneTemplate, 'cloneTemplate', 'js/components/PageRenderer.js');

function _f_getPhrase(pageIndex: number): string {
  return ROMANTIC_PHRASES[pageIndex % ROMANTIC_PHRASES.length];
}
const getPhrase = _fW(_f_getPhrase, 'getPhrase', 'js/components/PageRenderer.js');

function _f_createLetterPage(html: string, pageIndex?: number): DocumentFragment {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-letter';
  div.innerHTML = html;
  if (pageIndex !== undefined) {
    const p = document.createElement('p');
    p.className = 'p-phrase';
    p.textContent = getPhrase(pageIndex);
    div.appendChild(p);
  }
  frag.appendChild(div);
  return frag;
}
const createLetterPage = _fW(_f_createLetterPage, 'createLetterPage', 'js/components/PageRenderer.js');

function _f_createMoviePage(quote: string, char: string, film: string, pageIndex?: number): DocumentFragment | null {
  if (!quote) return null;
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-movie';
  div.innerHTML = '<div class="p-movie-quote">' + quote + '</div><div class="p-movie-attr">\u2014 ' + char + '</div><div class="p-movie-film">' + film + '</div>';
  if (pageIndex !== undefined) {
    const p = document.createElement('p');
    p.className = 'p-phrase';
    p.textContent = getPhrase(pageIndex);
    div.appendChild(p);
  }
  frag.appendChild(div);
  return frag;
}
const createMoviePage = _fW(_f_createMoviePage, 'createMoviePage', 'js/components/PageRenderer.js');

function _f_createThanksPage(imgIdx: number): DocumentFragment {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-thanks';
  div.innerHTML = '<span class="p-thanks-icon">\u2665</span><p class="p-thanks-text">' + THANKS_MESSAGES[imgIdx % THANKS_MESSAGES.length] + '</p>';
  frag.appendChild(div);
  return frag;
}
const createThanksPage = _fW(_f_createThanksPage, 'createThanksPage', 'js/components/PageRenderer.js');

function _f_createPageContent(pageIndex: number): DocumentFragment | null {
  if (pageIndex === 0) {
    return cloneTemplate('template[data-page="0"]');
  }

  if (pageIndex === 1) {
    return cloneTemplate('template[data-page="cover-note"]');
  }

  if (pageIndex >= 2 && pageIndex <= 7) {
    const f = cloneTemplate('template[data-page="' + (pageIndex - 1) + '"]');
    if (f) {
      const p = document.createElement('p');
      p.className = 'p-phrase';
      p.textContent = getPhrase(pageIndex);
      f.querySelector('.p-letter')?.appendChild(p);
    }
    return f;
  }

  if (pageIndex === 8) {
    const full = cloneTemplate('template[data-page="7"]');
    if (!full) return null;
    const container = document.createElement('div');
    container.appendChild(full);
    const paras = container.querySelectorAll<HTMLElement>('.p-letter p:not(.p-signature)');
    const filtered = document.createElement('div');
    filtered.className = 'p-letter';
    for (let i = 0; i < Math.min(2, paras.length); i++) filtered.appendChild(paras[i].cloneNode(true));
    const frag = document.createDocumentFragment();
    frag.appendChild(filtered);
    const p = document.createElement('p'); p.className = 'p-phrase'; p.textContent = getPhrase(pageIndex); filtered.appendChild(p);
    return frag;
  }

  if (pageIndex === 9) {
    return createLetterPage(
      '<p>Y perd\u00F3n si me disculpo demasiado, es que a veces mi cabeza me juega en contra y siento que la estoy molestando o que mi manera de actuar no siempre es la mejor; entonces empiezo a pensar demasiado y termino creyendo cosas que probablemente ni siquiera son verdad, pero prefiero pedirle perd\u00F3n antes que hacerla sentir mal.</p><p>Y por favor, nunca dude de lo que siento, porque la amo con todo lo que soy y con todo lo que tengo, y la voy a seguir amando cada d\u00EDa un poquito m\u00E1s aunque pase el tiempo.</p><p class="p-signature">\u2014 Javi</p>',
      pageIndex
    );
  }

  const movieStart = SPREAD_MOVIE_START * 2;
  const movieEnd = movieStart + SPREAD_MOVIE_COUNT * 2;
  if (pageIndex >= movieStart && pageIndex < movieEnd) {
    const mq = (MOVIE_QUOTES as MovieQuote[])[pageIndex - movieStart];
    if (!mq) return null;
    return createMoviePage(mq.quote, mq.char, mq.film, pageIndex);
  }

  const imgSP = SPREAD_IMAGE_START * 2;
  const imgEP = imgSP + IMAGE_COUNT * 2;
  if (pageIndex >= imgSP && pageIndex < imgEP) {
    const offset = pageIndex - imgSP;
    const imgIdx = Math.floor(offset / 2);
    if (offset % 2 === 0) {
      const el = ImageManager.createElement(imgIdx);
      if (!el) return null;
      const frag = document.createDocumentFragment();
      frag.appendChild(el);
      return frag;
    }
    return createThanksPage(imgIdx);
  }

  const musicP = SPREAD_MUSIC * 2;
  if (pageIndex === musicP) return cloneTemplate('template[data-name="music"]');
  const notesP = SPREAD_NOTES * 2;
  if (pageIndex === notesP) return cloneTemplate('template[data-name="notes"]');
  if (pageIndex === notesP + 1) return cloneTemplate('template[data-name="thanks-page"]');
  const closeP = SPREAD_CLOSING * 2;
  if (pageIndex === closeP) return cloneTemplate('template[data-name="closing"]');

  return null;
}
export const createPageContent = _fW(_f_createPageContent, 'createPageContent', 'js/components/PageRenderer.js');
