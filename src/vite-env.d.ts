/// <reference types="vite/client" />

interface Window {
  gsap?: typeof gsap;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}
