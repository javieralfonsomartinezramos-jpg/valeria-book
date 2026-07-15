console.log(`%c[FORENSIC] MODULE LOADED — js/core/Utils.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = (fn, label, path) => function(...args) {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${e?.message||e}`); console.trace(); console.groupEnd(); throw e; }
};

function _f_isMobile() {
  return window.innerWidth < 640;
}

function _f_detectLowPerf() {
  const isLow = (navigator.hardwareConcurrency || 8) <= 4
                || /Android|iPhone|iPod/i.test(navigator.userAgent);
  document.documentElement.setAttribute('data-perf', isLow ? 'low' : 'high');
  return isLow;
}

function _f_sanitize(str) {
  if (typeof str !== 'string') return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.textContent;
}

function _f_fmtTime(s) {
  if (isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

const SPANISH_FIXES = [
  [/\bCancion\b/g, 'Canción'],
  [/\bcancion\b/g, 'canción'],
  [/\bCorazon\b/g, 'Corazón'],
  [/\bcorazon\b/g, 'corazón'],
  [/\bNino\b/g, 'Niño'],
  [/\bnino\b/g, 'niño'],
  [/\bNina\b/g, 'Niña'],
  [/\bnina\b/g, 'niña'],
  [/\bMusica\b/g, 'Música'],
  [/\bmusica\b/g, 'música'],
  [/\bAlbum\b/g, 'Álbum'],
  [/\balbum\b/g, 'álbum'],
  [/\bPagina\b/g, 'Página'],
  [/\bpagina\b/g, 'página'],
  [/\bEmocion\b/g, 'Emoción'],
  [/\bemocion\b/g, 'emoción'],
  [/\bPeliculas\b/g, 'Películas'],
  [/\bpeliculas\b/g, 'películas'],
  [/\bPelicula\b/g, 'Película'],
  [/\bpelicula\b/g, 'película'],
  [/\bSueno\b/g, 'Sueño'],
  [/\bsueno\b/g, 'sueño'],
  [/\bAno\b/g, 'Año'],
  [/\bano\b/g, 'año'],
  [/\bExito\b/g, 'Éxito'],
  [/\bexito\b/g, 'éxito'],
  [/\bFeliz\b/g, 'Feliz'],
  [/\bDificil\b/g, 'Difícil'],
  [/\bdificil\b/g, 'difícil'],
  [/\bFacil\b/g, 'Fácil'],
  [/\bfacil\b/g, 'fácil'],
  [/\bUltimo\b/g, 'Último'],
  [/\bultimo\b/g, 'último'],
  [/\bImagen\b/g, 'Imagen'],
  [/\bMomentos\b/g, 'Momentos'],
  [/\bmomentos\b/g, 'momentos'],
  [/\bJoven\b/g, 'Joven'],
  [/\bjoven\b/g, 'joven'],
  [/\bLuna\b/g, 'Luna'],
  [/\bluna\b/g, 'luna'],
  [/\bInolvidable\b/g, 'Inolvidable'],
  [/\binolvidable\b/g, 'inolvidable'],
  [/\bFelicidad\b/g, 'Felicidad'],
  [/\bfelicidad\b/g, 'felicidad'],
];

function _f_cleanLabel(f) {
  let label = f.replace(/\.mp3$/i, '').replace(/[-_]/g, ' ')
               .replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  for (const [pattern, replacement] of SPANISH_FIXES) {
    label = label.replace(pattern, replacement);
  }
  return label;
}

export const isMobile = _fW(_f_isMobile, 'isMobile', 'js/core/Utils.js');
export const detectLowPerf = _fW(_f_detectLowPerf, 'detectLowPerf', 'js/core/Utils.js');
export const sanitize = _fW(_f_sanitize, 'sanitize', 'js/core/Utils.js');
export const fmtTime = _fW(_f_fmtTime, 'fmtTime', 'js/core/Utils.js');
export const cleanLabel = _fW(_f_cleanLabel, 'cleanLabel', 'js/core/Utils.js');
