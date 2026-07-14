import { CFG, IMAGES, IMAGE_CAPTIONS, THANKS_MESSAGES, MOVIE_QUOTES, IMAGE_COUNT, SPREAD_MOVIE_START, SPREAD_MOVIE_COUNT, SPREAD_IMAGE_START, SPREAD_MUSIC, SPREAD_NOTES, SPREAD_CLOSING, ROMANTIC_PHRASES } from '../config.js';

let pageImgData = [];
let lightboxOpenFn = null;

export function setLightboxOpenFn(fn) {
  lightboxOpenFn = fn;
}

export function initPageImages() {
  pageImgData = IMAGES.map((name, i) => ({
    name,
    path: CFG.imgDir + encodeURIComponent(name),
    index: i,
  }));
}

export function getPageImgData() {
  return pageImgData;
}

function $(sel, ctx) {
  return (ctx || document).querySelector(sel);
}

function cloneTemplate(selector) {
  const tmpl = $(selector);
  if (!tmpl || !tmpl.content) return null;
  try { return tmpl.content.cloneNode(true); }
  catch { return null; }
}

function injectPhrase(container, pageIndex) {
  const idx = pageIndex % ROMANTIC_PHRASES.length;
  const phrase = document.createElement('p');
  phrase.className = 'p-phrase';
  phrase.textContent = ROMANTIC_PHRASES[idx];
  container.appendChild(phrase);
}

function createLetterPage(html, phraseIdx) {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-letter';
  div.innerHTML = html;
  if (phraseIdx !== undefined) injectPhrase(div, phraseIdx);
  frag.appendChild(div);
  return frag;
}

function createMoviePage(quote, char, film, phraseIdx) {
  if (!quote) return null;
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-movie';
  div.innerHTML =
    `<div class="p-movie-quote">${quote}</div>` +
    `<div class="p-movie-attr">\u2014 ${char}</div>` +
    `<div class="p-movie-film">${film}</div>`;
  if (phraseIdx !== undefined) injectPhrase(div, phraseIdx);
  frag.appendChild(div);
  return frag;
}

function createImagePage(imgIdx) {
  const img = pageImgData[imgIdx];
  if (!img) return null;
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-image';
  div.tabIndex = 0;
  div.setAttribute('role', 'button');
  div.setAttribute('aria-label', `Abrir recuerdo ${imgIdx + 1}`);
  div.addEventListener('click', () => { if (lightboxOpenFn) lightboxOpenFn(imgIdx); });
  div.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (lightboxOpenFn) lightboxOpenFn(imgIdx);
    }
  });
  const el = document.createElement('img');
  el.src = img.path;
  el.alt = `Recuerdo ${imgIdx + 1}`;
  el.loading = 'lazy';
  el.addEventListener('error', function() {
    this.alt = 'Recuerdo no disponible';
    this.style.opacity = '0.5';
  }, { once: true });
  div.appendChild(el);
  const cap = document.createElement('p');
  cap.className = 'p-image-caption';
  cap.textContent = IMAGE_CAPTIONS[imgIdx % IMAGE_CAPTIONS.length];
  div.appendChild(cap);
  frag.appendChild(div);
  return frag;
}

function createThanksPage(imgIdx) {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'p-thanks';
  const icon = document.createElement('span');
  icon.className = 'p-thanks-icon';
  icon.textContent = '\u2665';
  const text = document.createElement('p');
  text.className = 'p-thanks-text';
  text.textContent = THANKS_MESSAGES[imgIdx % THANKS_MESSAGES.length];
  div.appendChild(icon);
  div.appendChild(text);
  frag.appendChild(div);
  return frag;
}

export function createPageContent(pageIndex) {
  if (pageIndex === 0 || pageIndex === 1) {
    return cloneTemplate('template[data-page="0"]');
  }

  if (pageIndex >= 2 && pageIndex <= 9) {
    if (pageIndex === 2) {
      const frag = cloneTemplate('template[data-page="1"]');
      if (frag) injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 3) {
      const frag = cloneTemplate('template[data-page="2"]');
      if (frag) injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 4) {
      const frag = cloneTemplate('template[data-page="3"]');
      if (frag) injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 5) {
      const frag = cloneTemplate('template[data-page="4"]');
      if (frag) injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 6) {
      const frag = cloneTemplate('template[data-page="5"]');
      if (frag) injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 7) {
      const frag = cloneTemplate('template[data-page="6"]');
      if (frag) injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 8) {
      const full = cloneTemplate('template[data-page="7"]');
      if (!full) return null;
      const container = document.createElement('div');
      container.appendChild(full);
      const paras = container.querySelectorAll('.p-letter p:not(.p-signature)');
      const filtered = document.createElement('div');
      filtered.className = 'p-letter';
      for (let i = 0; i < Math.min(2, paras.length); i++) {
        filtered.appendChild(paras[i].cloneNode(true));
      }
      const frag = document.createDocumentFragment();
      frag.appendChild(filtered);
      injectPhrase(frag, pageIndex);
      return frag;
    }
    if (pageIndex === 9) {
      return createLetterPage(
        '<p>Y perdón si me disculpo demasiado, es que a veces mi cabeza me juega en contra y siento que la estoy molestando o que mi manera de actuar no siempre es la mejor; entonces empiezo a pensar demasiado y termino creyendo cosas que probablemente ni siquiera son verdad, pero prefiero pedirle perdón antes que hacerla sentir mal.</p>' +
        '<p>Y por favor, nunca dude de lo que siento, porque la amo con todo lo que soy y con todo lo que tengo, y la voy a seguir amando cada día un poquito más aunque pase el tiempo.</p>' +
        '<p class="p-signature">\u2014 Javi</p>',
        pageIndex
      );
    }
    return null;
  }

  const movieStart = SPREAD_MOVIE_START * 2;
  const movieEnd = movieStart + SPREAD_MOVIE_COUNT * 2;
  if (pageIndex >= movieStart && pageIndex < movieEnd) {
    const mq = MOVIE_QUOTES[pageIndex - movieStart];
    if (!mq) return null;
    return createMoviePage(mq.quote, mq.char, mq.film, pageIndex);
  }

  const imgSP = SPREAD_IMAGE_START * 2;
  const imgEP = imgSP + IMAGE_COUNT * 2;
  if (pageIndex >= imgSP && pageIndex < imgEP) {
    const offset = pageIndex - imgSP;
    const imgIdx = Math.floor(offset / 2);
    return (offset % 2 === 0) ? createImagePage(imgIdx) : createThanksPage(imgIdx);
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

export function hasPageContent(pageIndex) {
  const totalPages = (SPREAD_CLOSING + 1) * 2;
  if (pageIndex < 0 || pageIndex >= totalPages) return false;
  return createPageContent(pageIndex) !== null;
}
