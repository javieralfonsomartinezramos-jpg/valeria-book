export function isMobile(): boolean {
  return window.innerWidth < 640;
}

export function detectLowPerf(): boolean {
  const isLow = (navigator.hardwareConcurrency || 8) <= 4
                || /Android|iPhone|iPod/i.test(navigator.userAgent);
  document.documentElement.setAttribute('data-perf', isLow ? 'low' : 'high');
  return isLow;
}

export function sanitize(str: string): string {
  if (typeof str !== 'string') return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.textContent;
}

export function fmtTime(s: number): string {
  if (isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

const SPANISH_FIXES: [RegExp, string][] = [
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

export function cleanLabel(f: string): string {
  let label = f.replace(/\.mp3$/i, '').replace(/[-_]/g, ' ')
               .replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  for (const [pattern, replacement] of SPANISH_FIXES) {
    label = label.replace(pattern, replacement);
  }
  return label;
}
