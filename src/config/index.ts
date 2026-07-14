import type { AppConfig } from '../types/config';

export const CFG: AppConfig = {
  imgDir: `${import.meta.env.BASE_URL}images/`,
  musicDir: `${import.meta.env.BASE_URL}music/`,
  flipThreshold: 0.35,
  flipDuration: 580,
  snapDuration: 250,
  saveDebounce: 3000,
  crossfadeDuration: 2000,
  lowPerfCores: 4,
};

export const IMAGES: string[] = [
  'para_mi_nino_lindo__2026-06-26_12.00.44_AM (2)_00001.webp',
  'para_mi_nino_lindo__2026-06-26_12.00.44_AM (2)_00002.webp',
  'para_mi_nino_lindo__2026-06-26_12.00.44_AM (2)_00003.webp',
  'para_mi_nino_lindo__2026-06-26_12.00.44_AM (2)_00004.webp',
  'para_mi_nino_lindo__2026-06-26_12.00.44_AM (2)_00005.webp',
  'para_mi_nino_lindo__2026-06-26_12.00.44_AM (2)_00006.webp',
];

export const IMAGE_CAPTIONS: string[] = [
  'Nuestro primer recuerdo',
  'Tu sonrisa que ilumina',
  'El dia que todo empezo',
  'Mi lugar favorito',
  'Contigo todo es mejor',
  'Eres mi persona favorita',
];

export const THANKS_MESSAGES: string[] = [
  'Gracias por este dibujo, tan detallado. No sabes cuánto me llena de emoción esto; me siento como un niño pequeño. Gracias.',
  'No entiendo a Garu... teniendo a alguien tan cariñosa y tan hermosa persiguiéndolo todo el tiempo, no es capaz de darse cuenta de lo afortunado que es.',
  'Este recuerdo me hace pensar en todas las veces que construimos algo bonito juntos.',
  'Tú no solo haces que me sienta como si estuviera entre las nubes, también me haces sentir parte de ellas. No podría prometerte bajarte el sol o las estrellas... porque para mí, tú ya eres una de ellas.',
  'Gracias por regalarme tu tiempo, tu arte y tu corazón... Soy un creeper que explota de amor por todo lo que recibe de ti.',
  'Desearía que esto fuera como un libro de cuentos de hadas, con un inicio, un nudo... pero nunca con un final.',
];

export interface MovieQuote {
  film: string;
  char: string;
  quote: string;
}

export const MOVIE_QUOTES: MovieQuote[] = [
  { film: 'Enredados', char: 'Flynn Rider', quote: '"Sabia quien era realmente el dia que deje todo atras para estar contigo. Tu eras mi nuevo sueno."' },
  { film: 'Princesa y el sapo', char: 'Prince Naveen', quote: '"Tiana, eres mi estrella Evangeline, la unica que brilla en mi cielo."' },
  { film: 'La bella y la bestia', char: 'Bestia', quote: '"Ella me miro de una manera que nadie me habia mirado antes."' },
  { film: 'La sirenita', char: 'Ariel', quote: '"Que daria yo por estar alli, en ese mundo del que tanto he sonado?"' },
  { film: 'Aladino', char: 'Aladino', quote: '"Te mostrare un mundo nuevo, donde brillan mil colores."' },
  { film: 'Cenicienta', char: 'Cenicienta', quote: '"Un sueño es un deseo que el corazón hace."' },
];

export const CHAPTERS: { name: string; spread: number }[] = [
  { name: 'Portada', spread: 0 },
  { name: 'Prologo', spread: 1 },
  { name: 'Lo que veo en ti', spread: 2 },
  { name: 'Nuestras peliculas', spread: 5 },
  { name: 'Nuestros recuerdos', spread: 8 },
  { name: 'Nuestra música', spread: 14 },
  { name: 'Dedicatoria y notas', spread: 15 },
  { name: 'Fin', spread: 16 },
];

export const MUSIC: string[] = [
  'AlvaroDiaz-ReinaPepiada.mp3',
  'A-Mi.mp3',
  'Arctic Monkeys - 505 (Lyric Video).mp3',
  'Arctic Monkeys - I Wanna Be Yours (Lyric Video).mp3',
  'Ariana Grande - Into You (Official Lyric Video).mp3',
  'Ariana Grande, The Weeknd - Love Me Harder (Official Lyric Video).mp3',
  'Baby-I.mp3',
  'BABYMONSTER - Really Like You (Color Coded Lyrics).mp3',
  'Bad Bunny - DAKITI (Letra) ft. Jhayco.mp3',
  "BLACKPINK 'Forever Young' (Color Coded Lyrics).mp3",
  'Bon Iver & St. Vincent - Roslyn (Lyrics).mp3',
  'BoyWithLuv.mp3',
  'BTS-TDNKBU.mp3',
  'Chinita-Linda.mp3',
  'Damn-Right.mp3',
  'Die-For-You.mp3',
  'Die-With-A-Smile.mp3',
  'Doja Cat - Streets (Lyrics) Silhouette Remix.mp3',
  'DOYALIKE.mp3',
  'Dutty Love.mp3',
  'Forever-Young.mp3',
  'Gigi Perez - Sailor Song (Lyrics).mp3',
  'Heartbeat.mp3',
  'Jenni Rivera - De Contrabando (letra).mp3',
  'Jung Kook - 3D (Lyrics) ft. Jack Harlow.mp3',
  'Jungkook-Seven.mp3',
  'Michael Jackson - Chicago (Lyrics).mp3',
  'MMAG-My_Favorite_Part.mp3',
  'sombr - back to friends (Lyrics).mp3',
  'Sunsetz - Cigarettes After Sex (Lyrics).mp3',
  'The Weeknd - DIE FOR YOU (Lyrics).mp3',
  'Tormenta.mp3',
  'Tyler, The Creator - See You Again (Lyrics) ft. Kali Uchis.mp3',
];

export const ROMANTIC_PHRASES: string[] = [
  'Cada página guarda un pedacito de nosotros.',
  'Hay recuerdos que el tiempo nunca podrá borrar.',
  'Mi lugar favorito siempre será donde estés tú.',
  'Nuestro mejor capítulo aún sigue escribiéndose.',
  'Contigo los días comunes se volvieron extraordinarios.',
  'Gracias por convertir momentos simples en recuerdos inolvidables.',
  'Eres la casualidad más bonita que me ha regalado la vida.',
  'No necesito un cuento perfecto, solo seguir escribiendo esta historia contigo.',
  'Algunas personas llegan para quedarse en el corazón para siempre.',
  'No importa cuánto pase el tiempo, siempre elegiría volver a ti.',
  'Tus abrazos son mi lugar en el mundo.',
  'Desde que llegaste, todo tiene más color.',
  'A tu lado, el silencio también es música.',
  'Eres mi persona favorita y mi mejor decisión.',
  'Qué suerte la mía haberte encontrado en este mundo tan grande.',
  'Gracias por existir y por cruzarte en mi camino.',
  'Cada día a tu lado es un regalo que no merezco.',
  'Eres la inspiración detrás de cada palabra bonita que escribo.',
  'Si el amor se escribe con letras, tú serías mi poema favorito.',
  'No hay distancia que pueda con lo que siento por ti.',
  'A veces la persona que buscas siempre ha estado a un mensaje de distancia.',
  'Eres mi lugar seguro, mi paz, mi todo.',
  'Tu sonrisa es la luz que ilumina incluso mis días más grises.',
  'Me gustas más que las palabras pueden decir y menos de lo que mereces.',
  'Contigo entendí que el amor no busca la perfección, sino la conexión.',
  'Eres la canción que siempre quiero escuchar.',
  'Si pudiera pedir un deseo, sería despertar a tu lado cada mañana.',
  'No hay atardecer más bonito que el que imagino contigo.',
  'Eres mi refugio en medio del caos.',
  'Tu nombre siempre tendrá un espacio especial en mi corazón.',
  'Ojalá pudieras verte a través de mis ojos para que supieras lo hermosa que eres.',
  'Amar es encontrar en otra persona lo que tu alma necesitaba.',
  'La suerte no existe, pero si existiera, tú serías la mía.',
  'Nunca supe lo que era sentir paz hasta que llegaste tú.',
  'No hay destino, solo caminos que se cruzan. El nuestro fue el más bonito.',
  'Quiero envejecer a tu lado y recordar todo lo que vivimos juntos.',
  'Tus mensajes son lo mejor de mi día.',
  'Eres la parte más bonita de mi historia.',
  'Contigo cada instante es eterno.',
  'No hay forma de explicarlo, simplemente eres tú.',
];

export const IMAGE_COUNT = IMAGES.length;
export const SPREAD_LETTER_START = 1;
export const SPREAD_LETTER_COUNT = 4;
export const SPREAD_MOVIE_START = SPREAD_LETTER_START + SPREAD_LETTER_COUNT;
export const SPREAD_MOVIE_COUNT = 3;
export const SPREAD_IMAGE_START = SPREAD_MOVIE_START + SPREAD_MOVIE_COUNT;
export const SPREAD_MUSIC = SPREAD_IMAGE_START + IMAGE_COUNT;
export const SPREAD_NOTES = SPREAD_MUSIC + 1;
export const SPREAD_CLOSING = SPREAD_NOTES + 1;
export const TOTAL_SPREADS = SPREAD_CLOSING + 1;
