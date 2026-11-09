# VALERIA — Diseño y Arquitectura Visual — Parte 3

## 20. Sistema de Estados

### 20.1 Estados por Componente

```yaml
component-states:
  default:
    description: 'Reposo, sin interacción'
  
  hover:
    duration: 150ms, ease-out-smooth
    props: opacity, bg, transform
  
  active / pressed:
    duration: 80ms
    props: transform scale(0.97), bg más oscuro
  
  focus:
    outline: 2px solid --color-gold
    outline-offset: 2px
  
  focus-visible:
    outline: 2px solid --color-gold (solo teclado)
  
  disabled:
    opacity: 0.3
    cursor: default, pointer-events: none
  
  loading:
    pointer-events: none
    opacity: 0.7
    indicator: spinner
  
  error:
    border-color: --color-rose-wine
    bg: rgba(139,74,92,0.08)
  
  success:
    border-color: --color-rose-stem
    bg: rgba(74,107,90,0.08)
  
  selected:
    bg: rgba(201,169,110,0.1)
    border: 1px solid rgba(201,169,110,0.2)
```

### 20.2 Micro-interacciones

```yaml
button-press:   80ms, scale(0.97)
button-release: 150ms, scale(1), spring overshoot 5%

ripple (opcional):
  trigger: click, duration: 500ms
  color: rgba(255,248,240,0.15)
  transform: scale(0→2), opacity: 0.3→0

shimmer:
  duration: 1.5s, infinite
  gradient: paper-aged → paper-warm → paper-aged
  background-size: 200%
```

---

## 21. Comportamiento Responsive

### 21.1 Breakpoints

| Label | Width | Device |
|-------|-------|--------|
| xl | 1440px+ | Ultra-wide desktop |
| lg | 1024–1439px | Desktop |
| md | 768–1023px | Tablet landscape |
| sm | 480–767px | Tablet portrait / Mobile landscape |
| xs | 320–479px | Mobile portrait |

### 21.2 Adaptaciones

```yaml
desktop (lg):
  book-width: 90vw (max 960px)
  page-padding: 40px
  font-body: 18px
  font-title: 36px
  photo-grid: 3 columns
  sidebar: 320px

tablet-landscape (md):
  book-width: 94vw (max 800px)
  page-padding: 32px
  font-body: 17px
  font-title: 28px
  photo-grid: 2 columns
  sidebar: 300px

tablet-portrait (sm):
  book: single-page (no doble)
  page-padding: 24px
  font-body: 16px
  font-title: 24px
  photo-grid: 2 columns
  topbar: 44px
  nav-buttons: hit area 48px

mobile (xs):
  book: 100vw, single-page
  page-padding: 20px
  font-body: 15px
  font-title: 22px
  photo-grid: 1 column
  sidebar: 100vw (full screen)
  topbar: 40px
  mini-player: 56px
  nav-buttons: hidden (swipe only)
  swipe-threshold: 40px
  tap-target: 44px minimum
```

### 21.3 Mobile-Specific

```yaml
mobile-nav:
  type: swipe horizontal
  threshold: 40px
  indicator: peek arrows in edges
  feedback: haptic (if supported)

mobile-sidebar:
  width: 100vw
  backdrop-filter: blur(20px)
  header-padding: 16px 20px

mobile-lightbox:
  controls: bottom 40px
  close: top-right 16px
  swipe-to-dismiss: true
  swipe-to-navigate: true
  pinch-to-zoom: true (1×–4×)
  double-tap-zoom: true

mobile-petals:
  max: 6, size: 0.7×

mobile-particles:
  disabled: true
```

---

## 22. Accesibilidad

### 22.1 Navegación por Teclado

| Tecla | Acción |
|-------|--------|
| ArrowRight / ArrowDown | Siguiente página |
| ArrowLeft / ArrowUp | Página anterior |
| Home | Primera página |
| End | Última página |
| Escape | Cerrar sidebar/lightbox/modal |
| Tab | Navegar elementos enfocables |
| Enter / Space | Activar elemento |
| M | Toggle menú (sidebar) |
| C | Toggle contraste |
| S | Toggle sonido |
| F | Toggle fullscreen |

### 22.2 Focus Management

```yaml
focus-trap:
  sidebar: true
  lightbox: true
  modal: true

focus-order:
  description: 'Orden lógico: contenido principal → navegación → sidebar → controles'
  visible-focus: always (outline gold 2px)

skip-link:
  text: 'Saltar al contenido'
  visible-only-on-focus: true
```

### 22.3 ARIA

```yaml
roles:
  book: role="main" aria-label="Libro interactivo Valeria"
  page: role="region" aria-label="Página {n}"
  nav: role="navigation" aria-label="Navegación del libro"
  sidebar: role="dialog" aria-label="Menú de navegación"
  lightbox: role="dialog" aria-label="Visor de imágenes"
  player: role="region" aria-label="Reproductor de música"
  loader: role="progressbar" aria-label="Cargando recursos"

properties:
  - current-page: aria-current="page"
  - expanded/collapsed: aria-expanded en menús
  - hidden: aria-hidden en elementos decorativos
  - labels: aria-label en todos los botones icono
  - live: aria-live="polite" en cambios dinámicos
  - describedby: aria-describedby para descripciones
```

### 22.4 Reducción de Movimiento

```yaml
reduced-motion:
  query: '@media (prefers-reduced-motion: reduce)'
  effects:
    - disable all page flip animations (instant transitions)
    - disable petal fall
    - disable particles
    - disable gold gleam
    - disable parallax
    - disable spinner rotations
    - reduce all durations to 50ms max
    - keep opacity transitions (needed for functional visibility)
    - keep transform for functional layout (not decorative)
```

### 22.5 Contraste y Escalado

```yaml
contrast:
  normal: theme-dark
  high: theme-highcontrast (toggle en sidebar)
  
  thresholds:
    text-on-paper: 4.5:1 minimum (WCAG AA)
    text-on-dark: 4.5:1 minimum
    large-text: 3:1 minimum (18px+ bold or 24px+ regular)
    ui-components: 3:1 minimum

text-scaling:
  query: '@media (prefers-reduced-transparency: reduce)'
  - reducir backdrop-filter
  - reducir glass effects
  
  query: '@media (forced-colors: active)'
  - mantener bordes visibles
  - usar system colors
```

---

## 23. Rendimiento y Carga

### 23.1 Estrategia de Carga

```yaml
loading-strategy:
  critical (carga inmediata, bloqueante):
    - index.html
    - CSS inicial (layout, tipografía base)
    - StartupManager.js, Portal.js
    - Playfair Display (solo weights 400, 700)
    - textures/leather-dark.jpg (fondo)
  
  high-priority (carga asíncrona, prioritaria):
    - Cormorant Garamond (todos weights)
    - Inter (todos weights)
    - Lavishly Yours
    - textures/paper-fibers.jpg
    - textures/leather-grain.png
    - imágenes de portada
    - primeras 2 fotos del libro
  
  deferred (carga bajo demanda):
    - Audio files (primer click)
    - Fotos de galería (lazy loading en scroll)
    - Pétalos (solo cuando se llega a la página)
    - Partículas (después de render completo)
    - Mini player (solo si hay música)
    - Lightbox (solo cuando se abre)
    - Sidebar content (después de paint)
    - GSAP (diferido, solo para flip)
  
  never-block:
    - Analytics
    - Fonts display swap
    - Secondary textures
```

### 23.2 Imágenes

```yaml
images:
  format: WebP (con fallback JPEG)
  sizes:
    thumbnail: 240px (grid, border 3px = 234px content)
    medium: 800px (lightbox default)
    large: 1600px (lightbox full, retina)
    original: 2400px (descarga)
  
  loading: lazy (native + IntersectionObserver fallback)
  decoding: async
  preload: primeras 2 fotos (rel="preload" as="image")
  
  placeholder:
    technique: LQIP (Low Quality Image Placeholder)
    size: 20px width, blur(12px)
    transition: 500ms ease-out (blur→clear)
```

### 23.3 Audio

```yaml
audio:
  format: MP3 (192kbps) + AAC/OGG fallback
  loading: on-demand (no precarga)
  preload-metadata: true (duración, portada)
  streaming: true (para canciones largas)
  cache: session-cache
```

### 23.4 Métricas Objetivo

```yaml
performance-targets:
  FCP: < 1.5s
  LCP: < 2.5s
  TTI: < 3.0s
  TBT: < 100ms
  CLS: < 0.05
  
  bundle-size:
    JS inicial: < 50KB (gzipped)
    CSS inicial: < 15KB (gzipped)
    Fonts: < 100KB total
  
  time-to-interactive: < 2s (click para abrir libro)
  flip-animation: 60fps (no jank)
  memory: < 100MB (sin lightbox abierto)
```

---

## 24. Arquitectura del Proyecto

### 24.1 Estructura de Carpetas

```
valeria-book/
├── index.html
├── design/                    # Documentos de diseño
│   ├── SPECIFICATION_PART1.md
│   ├── SPECIFICATION_PART2.md
│   ├── SPECIFICATION_PART3.md
│   └── figma/                 # Exportaciones de Figma
│       ├── tokens.json
│       └── components/
│
├── css/
│   ├── tokens.css              # Design tokens (variables CSS)
│   ├── reset.css               # Normalize / reset
│   ├── typography.css          # Font-face, escalas
│   ├── portal.css              # Pantalla de entrada
│   ├── loader.css              # Barra de progreso
│   ├── book.css                # Libro cerrado + abierto
│   ├── pages.css               # Sistema de páginas
│   ├── navigation.css          # Topbar, botones nav
│   ├── sidebar.css             # Menú lateral
│   ├── gallery.css             # Grid de fotos
│   ├── lightbox.css            # Visor de imágenes
│   ├── player.css              # Reproductor de música
│   ├── notes.css               # Sección de notas
│   ├── particles.css           # Pétalos, partículas
│   ├── animations.css          # Keyframes globales
│   ├── responsive.css          # Media queries
│   ├── accessibility.css       # Reduced motion, contraste
│   └── utilities.css           # Clases helper
│
├── js/
│   ├── main.js                 # Entry point
│   ├── core/
│   │   ├── EventBus.js         # Sistema de eventos
│   │   ├── Logger.js           # Logging
│   │   ├── StorageManager.js   # LocalStorage
│   │   └── Utils.js            # Utilidades
│   │
│   ├── managers/
│   │   ├── StartupManager.js   # Orquestador de fases
│   │   ├── DOMManager.js       # Manipulación DOM
│   │   ├── ResourceManager.js  # Carga de recursos
│   │   ├── ImageManager.js     # Gestión de imágenes
│   │   └── AnimationManager.js # RAF, visibilidad
│   │
│   ├── components/
│   │   ├── Portal.js           # Pantalla de entrada
│   │   ├── Loader.js           # Barra de progreso
│   │   ├── BookEngine.js       # Motor del libro
│   │   ├── FlipEngine.js       # Animación de páginas
│   │   ├── PageRenderer.js     # Render de páginas
│   │   ├── Lightbox.js         # Visor de imágenes
│   │   ├── Sidebar.js          # Menú lateral
│   │   ├── MusicPlayer.js      # Reproductor
│   │   ├── Notes.js            # Sección de notas
│   │   ├── Particles.js        # Partículas fondo
│   │   └── Petals.js           # Pétalos animados
│   │
│   ├── services/
│   │   ├── AudioManager.js     # Gestión de audio
│   │   └── AudioFXService.js   # Efectos de sonido
│   │
│   └── core/
│       ├── BookState.js        # Estado del libro
│       ├── gesture.js          # Gestos táctiles
│       └── FocusTrap.js        # Trampa de foco
│
├── assets/
│   ├── fonts/
│   │   ├── PlayfairDisplay-Variable.woff2
│   │   ├── CormorantGaramond-Variable.woff2
│   │   ├── Inter-Variable.woff2
│   │   └── LavishlyYours.woff2
│   │
│   ├── images/
│   │   ├── photos/             # Fotos del libro
│   │   │   ├── thumb/          # Miniaturas 240px
│   │   │   ├── medium/         # 800px
│   │   │   └── full/           # 1600px
│   │   └── covers/             # Portadas de música
│   │
│   ├── audio/
│   │   ├── songs/              # Canciones
│   │   └── fx/                 # Efectos de sonido
│   │
│   └── textures/
│       ├── leather.jpg         # Textura cuero portada
│       ├── leather-dark.jpg    # Textura cuero oscuro
│       ├── leather-grain.png   # Grano de cuero
│       ├── paper-fibers.jpg    # Fibras de papel
│       └── paper-aged-stains.png # Manchas de edad
│
└── textures/                   # (raíz legacy)
```

### 24.2 Responsabilidades de Módulos

| Módulo | Responsabilidad |
|--------|----------------|
| **StartupManager** | Orquestar 9 fases de inicio con aislamiento de errores |
| **DOMManager** | Abstraer querySelector, eventos, caché de elementos |
| **ResourceManager** | Verificar CSS y DOM listos, barra de progreso |
| **ImageManager** | Cargar imágenes lazy/sizes, caché, datos de galería |
| **AnimationManager** | RAF loop, pausar en background, throttle |
| **Portal** | Pantalla de entrada, animación de tinta |
| **Loader** | Barra de progreso, partículas de polvo |
| **BookEngine** | Render spread, navegación, init book layout |
| **FlipEngine** | Animación 3D de volteo de páginas |
| **PageRenderer** | Renderizar contenido de cada sección |
| **Lightbox** | Visor de imágenes, zoom, navegación |
| **Sidebar** | Menú de navegación, controles |
| **MusicPlayer** | Mini player + full player, playlist |
| **Notes** | Render y scroll de notas |
| **Particles** | Partículas de fondo (polvo de luz) |
| **Petals** | Pétalos animados en página de cierre |
| **AudioManager** | Reproducción, media session, estado |
| **AudioFXService** | Efectos de sonido (clic, página) |
| **EventBus** | Comunicación desacoplada entre módulos |
| **BookState** | Estado inmutable del libro (spread, flipping) |
| **StorageManager** | LocalStorage wrapper con fallback |
| **gesture** | Detección de gestos táctiles (swipe) |
| **FocusTrap** | Mantener foco dentro de modales/sidebar |

---

## 25. Checklist de Implementación

### 25.1 Fase 0 — Setup
- [ ] Crear estructura de carpetas
- [ ] Configurar build tool (Vite recomendado)
- [ ] Configurar fuentes (WOFF2, variable)
- [ ] Crear tokens.css con todas las variables
- [ ] Crear reset.css
- [ ] Crear typography.css (font-face + clases)
- [ ] Configurar meta tags, Open Graph, theme-color

### 25.2 Fase 1 — Portal + Loader
- [ ] Portal HTML structure
- [ ] Animación de entrada (4 fases)
- [ ] Loader track + fill + percentage
- [ ] Partículas de polvo en loader
- [ ] Transición portal→libro cerrado

### 25.3 Fase 2 — Libro Cerrado
- [ ] Superficie/mesa (fondo)
- [ ] Portada 3D con textura cuero
- [ ] Lomo con ribs y título
- [ ] Canto de páginas
- [ ] Sombra del libro
- [ ] Iluminación (key light + specular)
- [ ] Animación de apertura
- [ ] Click/tap para abrir

### 25.4 Fase 3 — Libro Abierto
- [ ] Layout doble página
- [ ] Gutter + pliegue central
- [ ] Página izquierda (iluminación lomo)
- [ ] Página derecha (más clara)
- [ ] Textura de papel (SVG filter + overlay)
- [ ] Sombras de página (inset)
- [ ] Números de página
- [ ] Animación de cierre

### 25.5 Fase 4 — Sistema de Páginas
- [ ] Carta (capitular, firma, sello)
- [ ] Fotos (grid, thumbnails, featured)
- [ ] Música (lista de canciones)
- [ ] Notas (cards con washi tape)
- [ ] Cierre (centrado, pétalos)
- [ ] Agradecimientos

### 25.6 Fase 5 — Navegación
- [ ] Topbar (título, menú, progreso)
- [ ] Botones de navegación (prev/next)
- [ ] Sidebar (full specification)
- [ ] Navegación por teclado
- [ ] Gestos táctiles (swipe)
- [ ] Deshabilitar botones en extremos

### 25.7 Fase 6 — Galería + Lightbox
- [ ] Thumbnails con loading/blur/error states
- [ ] Lightbox overlay + imagen
- [ ] Controles (navegación, contador)
- [ ] Zoom (pinch + double-tap)
- [ ] Swipe to dismiss
- [ ] Keyboard navigation
- [ ] Focus trap

### 25.8 Fase 7 — Música
- [ ] Playlist en página de música
- [ ] Mini player (inferior)
- [ ] Full player (portada, controles)
- [ ] Barra de progreso interactiva
- [ ] Control de volumen
- [ ] Shuffle + repeat
- [ ] Media Session API
- [ ] Estado now-playing

### 25.9 Fase 8 — Animaciones Decorativas
- [ ] Pétalos (cierre)
- [ ] Partículas fondo
- [ ] Brillo dorado (hover)
- [ ] Page flip animation (GSAP)
- [ ] Transiciones de sección

### 25.10 Fase 9 — Responsive
- [ ] Desktop (1024px+)
- [ ] Tablet landscape (768–1023px)
- [ ] Tablet portrait (480–767px)
- [ ] Mobile (320–479px)
- [ ] Modo single-page en móvil
- [ ] Touch targets 44px mínimo

### 25.11 Fase 10 — Accesibilidad
- [ ] Roles ARIA en todos los componentes
- [ ] Keyboard navigation + shortcuts
- [ ] Focus trap (sidebar, lightbox, modal)
- [ ] Skip link
- [ ] Reduced motion
- [ ] Alto contraste
- [ ] Screen reader testing
- [ ] Color contrast verification

### 25.12 Fase 11 — Rendimiento
- [ ] Images: WebP, lazy loading, LQIP
- [ ] Fonts: variable, display swap, subset
- [ ] Code splitting (lazy import)
- [ ] CSS minification + critical CSS
- [ ] Bundle analysis
- [ ] Lighthouse audit (targets above)
- [ ] Performance budget

### 25.13 Fase 12 — QA Final
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Tablet testing
- [ ] Ultra-wide desktop testing
- [ ] Load testing (slow network, many images)
- [ ] Accessibility audit (axe, Lighthouse)
- [ ] Performance audit (Lighthouse, Web Vitals)
- [ ] Bug bash

---

## 26. Apéndice: Notas Técnicas para Implementación

### 26.1 Textura Procedural (SVG Filters)

Para evitar dependencias de imágenes externas, las texturas de papel y cuero pueden generarse proceduralmente con SVG filters:

```svg
<!-- Textura de papel -->
<filter id="paper-fibers">
  <feTurbulence type="fractalNoise" baseFrequency="0.8 0.4"
    numOctaves="2" result="noise"/>
  <feColorMatrix type="matrix"
    values="0 0 0 0 0.93   0 0 0 0 0.90   0 0 0 0 0.85   0 0 0 0.04 0"
    in="noise"/>
</filter>

<!-- Textura de cuero -->
<filter id="leather-noise">
  <feTurbulence type="fractalNoise" baseFrequency="0.6"
    numOctaves="3" result="noise"/>
  <feColorMatrix type="matrix"
    values="0 0 0 0 0.16   0 0 0 0 0.14   0 0 0 0 0.12   0 0 0 0.08 0"
    in="noise"/>
</filter>
```

### 26.2 Glass Effect (Backdrop)

```css
.glass {
  background: rgba(18, 18, 20, 0.75);
  backdrop-filter: blur(20px) saturate(1.1);
  -webkit-backdrop-filter: blur(20px) saturate(1.1);
  border: 1px solid rgba(255, 248, 240, 0.06);
}
```

### 26.3 Book Shadow Mixin

```css
.book-shadow {
  box-shadow:
    0 8px 24px -4px rgba(10, 10, 11, 0.4),
    0 16px 48px -8px rgba(10, 10, 11, 0.25),
    0 40px 64px -12px rgba(10, 10, 11, 0.15);
}
```

### 26.4 Gold Gradient

```css
.gold-gradient {
  background: linear-gradient(
    90deg,
    var(--color-gold-dark) 0%,
    var(--color-gold) 40%,
    var(--color-gold-light) 60%,
    var(--color-gold) 100%
  );
}
```

### 26.5 Page Curl Animation Strategy

La animación de volteo debe implementarse con transformaciones CSS 3D:

1. Usar `transform-origin` en el borde izquierdo de la página
2. Rotar en Y de 0° a 180° con skew para simular curvatura
3. Sombra dinámica: box-shadow se mueve con la página
4. La página trasera se revela con un gradiente de opacidad
5. GSAP se recomienda para control preciso de easing y timeline
6. Fallback: transición CSS simple si JS no está disponible

### 26.6 Loading Order

```yaml
critical-path:
  1. index.html (con inline critical CSS para el portal)
  2. Fondo negro + título "Valeria" visible inmediatamente
  3. StartupManager.js (carga async, ejecuta fases)
  4. ResourceManager.init() → verifica CSS → verifica DOM
  5. ResourceManager.getPromise() → progreso 30%→50%→80%→100%
  6. Portal se pliega, libro aparece
  7. StartupManager.start() ejecuta 9 fases secuenciales
  8. Fase 3: ImageManager.init() carga primeras fotos
  9. Fase 4: initBook() renderiza primera página
  10. Fase 5: topbar, navegación, botones
  11. Fase 8-9: Sidebar, Audio, Partículas (diferidos)
```

---

*Fin del documento. Este documento contiene todas las especificaciones necesarias para reconstruir Valeria como un libro digital interactivo de calidad Awwwards. Ninguna decisión de diseño queda librada a la interpretación.*
