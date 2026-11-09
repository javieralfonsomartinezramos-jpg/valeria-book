# VALERIA — Diseño y Arquitectura Visual — Parte 2

## 11. Libro Cerrado

### 11.1 Descripción General

El libro cerrado es un objeto tridimensional realista. Reposa sobre una superficie texturada con iluminación radial. Ligeramente inclinado (5-8° en X).

### 11.2 Dimensiones

```yaml
closed-book:
  width: 480px
  height: 340px              # Proporción √2
  depth: 48px                 # Grosor del lomo
  perspective:
    rotateX: -5deg
    rotateY: 0deg
  position: 50% 50%, translate(-50%, -50%)
```

### 11.3 Portada (Cuero)

```yaml
cover:
  gradient: 'linear-gradient(180deg, #2A2520 0%, #3A342C 30%, #2A2520 70%, #221E1A 100%)'
  texture: url("textures/leather.jpg")  # multiply, opacity 0.15
  title-text: 'VALERIA'
  title-font: Playfair Display 28px 700
  title-color: '#C9A96E'
  title-shadow: 0 1px 2px rgba(92,74,40,0.6)
  corners: radius-book (2px / 6px)
  corner-gold: true (filete 0.5px)
```

### 11.4 Lomo

```yaml
spine:
  width: 48px
  gradient: 'linear-gradient(90deg, #1A1614 0%, #2A2520 30%, #3A342C 50%, #2A2520 70%, #1A1614 100%)'
  ribs:
    count: 3, height: 2px, color: '#2A2520'
    shadow: 0 1px 2px rgba(0,0,0,0.3) inset
  spine-title: 'VALERIA' vertical, Inter 9px 600, color '#C9A96E' opacity 0.7
```

### 11.5 Canto de Páginas

```yaml
page-edges:
  gradient: 'linear-gradient(90deg, #D4C9B6 0%, #E8DFCF 30%, #EDE6D8 50%, #E8DFCF 70%, #D4C9B6 100%)'
  page-lines: 20 líneas de 1px, rgba(0,0,0,0.03), spacing 2px
  edge-glow: specular a 30°
```

### 11.6 Técnica de Textura (Cuero)

```yaml
leather-texture:
  layers:
    - background: gradient portada
    - filter: feTurbulence (baseFrequency 0.6, octaves 3, opacity 0.08)
    - overlay: leather-grain.png, multiply, 0.12
    - gradient: radial specular highlight
    - gradient: edge wear (esquinas más oscuras)
```

### 11.7 Iluminación

```yaml
lighting:
  key-light: radial 30% 25%, rgba(255,248,240,0.08)→transparent
  drop-shadow:
    - 4px 12px 32px -4px rgba(0,0,0,0.5)
    - 0 4px 12px 2px rgba(0,0,0,0.3)
  specular: linear 30°, width 40%
```

---

## 12. Libro Abierto

### 12.1 Contenedor

```yaml
open-book:
  width: 90vw
  max-width: 960px
  min-width: 320px
  aspect-ratio: 1.414 / 1
  margin: auto
  margin-top: 5vh
  perspective: 1200px
  transform-style: preserve-3d
```

### 12.2 Doble Página (Spread)

```yaml
spread:
  display: flex
  flex-direction: row
  width: 100%
  height: 100%
  
  gutter:
    width: 12px
    background: 'linear-gradient(90deg, paper-edge, paper-aged, paper-edge)'
    shadow: inset 2px 0 8px rgba(0,0,0,0.12)
    crease-line: 1px rgba(0,0,0,0.06) centrada
```

### 12.3 Página Izquierda vs Derecha

```yaml
page-left:
  width: calc(50% - 6px)
  background: '#F0EADE'              # Más sombra (lomo)
  padding: 40px 32px 40px 40px
  lighting: 'linear-gradient(90deg, rgba(196,184,165,0.08), transparent 25%)'
  page-shadow: 0 2px 4px inset rgba(0,0,0,0.04), 0 -1px 2px inset rgba(255,248,240,0.15)
  texture: paper-fibers.jpg, overlay 0.03

page-right:
  width: calc(50% - 6px)
  background: '#EDE6D8'              # Más clara
  padding: 40px 40px 40px 32px
  lighting: 'radial-gradient(ellipse at 70% 50%, rgba(255,248,240,0.04), transparent 60%)'
  page-shadow: igual que izquierda
  texture: paper-fibers.jpg, overlay 0.02
```

### 12.4 Técnica de Textura (Papel)

```yaml
paper-texture:
  layers:
    - background-color: --color-paper
    - filter: feTurbulence (baseFrequency 0.8 0.4, octaves 2, opacity 0.04)
    - overlay: paper-aged-stains.png, multiply, 0.02
    - gradient: page-lighting
```

### 12.5 Números de Página

```yaml
page-numbers:
  position: abajo-centro, margen exterior
  margin-bottom: 16px
  font: Inter 11px 400
  color: '--color-mist'
  letter-spacing: 0.08em
  opacity: 0.6
  hover: opacity 0.9, transition 200ms
```

---

## 13. Sistema de Páginas (Contenido)

### 13.1 Estructura General

```yaml
page-content:
  content-area:
    height: 100%
    display: flex
    flex-direction: column
    justify-content: flex-start   # Arriba texto, centro imágenes
  
  section-title:
    font: Playfair Display 36px 600
    color: '--color-ink-deep'
    margin-bottom: 24px
    divider: 60px × 1px, gold, margin 12px 0 24px
  
  body:
    font: Cormorant Garamond 18px 400
    line-height: 1.6
    color: '--color-ink-soft'
    max-width: 420px
  
  metadata:
    font: Inter 12px 400
    color: '--color-mist'
    letter-spacing: 0.04em
    uppercase
```

### 13.2 Página de Carta

```yaml
letter-page:
  layout: página derecha
  
  date:
    font: Cormorant Garamond 16px italic
    color: '--color-storm'
    text-align: right
    margin-bottom: 32px
  
  greeting:
    font: Playfair Display 24px 500
    color: '--color-ink-warm'
    margin-bottom: 16px
  
  body:
    font: Cormorant Garamond 18px 400
    line-height: 1.65
    color: '--color-ink-soft'
    first-letter: true, 3.2em, gold-dark, Playfair
  
  signature:
    font: Lavishly Yours 32px
    color: '--color-ink-warm'
    text-align: right
    margin-top: 40px
  
  seal:
    position: abajo-izquierda
    size: 48px
    color: '--color-rose-wine'
    opacity: 0.2
    type: círculo con textura de lacre
```

### 13.3 Página de Fotos (Galería)

```yaml
photo-gallery:
  title: 'Fotografías', Playfair 28px 600, arriba-izquierda
  
  grid:
    columns: 2 (izquierda) o 3 (doble página)
    gap: 12px
    padding: 8px
    
    photo:
      aspect-ratio: 4/3
      object-fit: cover
      border-radius: 4px
      box-shadow: shadow-paper-subtle
      cursor: pointer
      transition: transform 300ms, box-shadow 300ms
      hover: scale(1.02), shadow-paper-raised
      border: 1px solid --color-pearl
      padding: 3px (borde blanco como foto impresa)
    
    featured:
      column-span: 2
      row-span: 2
```

### 13.4 Página de Música

```yaml
music-page:
  title: 'Música', Playfair 28px 600
  
  song-list:
    gap: 16px
    
    song-item:
      display: flex
      align-items: center
      gap: 16px
      padding: 12px 16px
      border-radius: 8px
      cursor: pointer
      transition: background 200ms
      hover: background rgba(245,225,228,0.3)
      active: background rgba(232,196,204,0.2)
      
      cover-art: 48×48px, radius 4px
      title: Cormorant 18px 600
      artist: Inter 12px 400, --color-storm
      duration: Inter 12px, --color-mist
      play-icon: 32×32px, gold, opacity 0→0.7 on hover
    
    now-playing:
      background: rgba(245,225,228,0.3)
      play-icon: opacity 1
      progress-bar: 2px, gold, margin-top 8px
```

### 13.5 Página de Notas

```yaml
notes-page:
  layout: doble página, scroll vertical
  title: 'Notas', Playfair 28px 600
  
  note-card:
    background: rgba(255,248,240,0.15)
    border-left: 2px solid --color-gold-light
    padding: 20px 24px
    border-radius: 0 8px 8px 0
    box-shadow: shadow-paper-subtle
    margin-bottom: 16px
    
    decoration: washi tape simulation (rótulo adhesivo)
      position: top-center
      width: 60px, height: 8px
      background: --color-rose-petal
      opacity: 0.5
      rotate: -2deg
    
    text: Cormorant 16px 400, line-height 1.55
    date: Inter 11px, --color-mist, text-align right
    hover: translateX(4px), transition 200ms
```

### 13.6 Página Final / Agradecimientos

```yaml
closing-page:
  layout: doble página, centrado vertical y horizontalmente
  max-width: 440px
  margin: 0 auto
  
  title: 'Gracias', Playfair 42px 700, --color-ink-deep
  divider: 80px × 1px, gold, margin 24px auto
  
  body: Cormorant 18px, line-height 1.65
  signature: Lavishly Yours 36px
  date: Inter 11px, uppercase, margin-top 48px
  
  petals: active (ver animación pétalos)
  
  close-button: Inter 12px 500, gold, uppercase
    opacity 0.6 → 1 on hover
    cursor: pointer
```

---

## 14. Navegación y Sidebar

### 14.1 Top Bar

```yaml
topbar:
  position: fixed top
  width: 100%
  height: 48px
  background: rgba(18,18,20,0.75)
  backdrop-filter: blur(20px)
  border-bottom: 1px solid rgba(255,248,240,0.06)
  z-index: 10
  
  transition: opacity 400ms, transform 400ms
  hidden: opacity 0, translateY(-100%)
  visible: opacity 1, translateY(0)
  
  inner:
    display: flex
    align-items: center
    justify-content: space-between
    max-width: 1280px
    margin: 0 auto
    padding: 0 24px
  
  page-title:
    font: Cormorant Garamond 16px 500
    color: rgba(255,248,240,0.8)
    white-space: nowrap
    text-overflow: ellipsis
  
  menu-button:
    width: 32px
    height: 32px
    cursor: pointer
    opacity: 0.7
    transition: opacity 200ms
    border-radius: 6px
    hover: opacity 1, bg rgba(255,248,240,0.06)
  
  page-number:
    font: Inter 11px 400
    color: '--color-mist'
    letter-spacing: 0.08em
  
  progress-bar:
    position: absolute bottom 0
    height: 1px
    background: '--color-gold'
    transition: width 300ms ease-out
```

### 14.2 Botones de Navegación

```yaml
nav-buttons:
  nav-next:
    position: fixed right 0, top 50%, translateY(-50%)
    width: 64px, height: 120px
    z-index: 5
    cursor: pointer
    
    icon: 40×40px, radius 12px 0 0 12px
    bg: rgba(255,248,240,0.04)
    opacity: 0 → 1 on hover
    transition: all 300ms
  
  nav-prev:
    position: fixed left 0, top 50%
    similar, radius 0 12px 12px 0
  
  disabled:
    opacity: 0.2
    cursor: default
    pointer-events: none
```

### 14.3 Sidebar

```yaml
sidebar:
  container:
    position: fixed left 0, top 0
    width: 320px, height: 100vh
    background: rgba(18,18,20,0.92)
    backdrop-filter: blur(32px)
    z-index: 40
    transform: translateX(-100%)
    transition: transform 400ms ease-out
    border-right: 1px solid rgba(255,248,240,0.06)
    box-shadow: shadow-elevated
    
    open: translateX(0)
  
  overlay:
    position: fixed, inset: 0
    background: rgba(10,10,11,0.6)
    z-index: 35
    opacity: 0
    pointer-events: none
    transition: opacity 400ms
    open: opacity 1, pointer-events: all
  
  header:
    padding: 20px 24px
    border-bottom: 1px solid rgba(255,248,240,0.06)
    display: flex
    justify-content: space-between
    title: Playfair 20px 600, --color-ivory
    close: 32px, opacity 0.6 → 1
  
  nav:
    flex: 1, overflow-y: auto, padding: 16px 0
    
    section-item:
      display: flex
      align-items: center
      gap: 12px
      padding: 10px 24px
      cursor: pointer
      transition: background 200ms
      hover: bg rgba(255,248,240,0.04)
      active: bg rgba(255,248,240,0.08)
      
      current-indicator: 2px × 20px, gold
      name: Inter 14px 500, --color-ivory
      current: color gold, weight 600
      page-num: Inter 11px, --color-mist, margin-left auto
  
  footer:
    padding: 16px 24px
    border-top: 1px solid rgba(255,248,240,0.06)
    
    control-item:
      display: flex
      justify-content: space-between
      padding: 8px 0
      label: Inter 13px 500, opacity 0.7
      toggle: 40×22px, radius 11px, gold on active
    
    surprise-button:
      display: flex
      align-items: center
      justify-content: center
      gap: 8px
      padding: 12px
      margin-top: 8px
      background: rgba(201,169,110,0.1)
      border: 1px solid rgba(201,169,110,0.2)
      border-radius: 8px
      cursor: pointer
      transition: all 200ms
      hover: bg rgba(201,169,110,0.15)
      text: Inter 13px 600, gold
```

---

## 15. Galería de Fotos y Lightbox

### 15.1 Miniaturas

```yaml
photo-thumbnail:
  aspect-ratio: 4/3
  object-fit: cover
  border-radius: 4px
  box-shadow: shadow-paper-subtle
  border: 1px solid --color-pearl
  padding: 3px  # Borde blanco (foto impresa)
  
  default: filter none, scale(1)
  hover: scale(1.03), brightness(1.05) contrast(1.02)
  loading: blur(8px) brightness(0.8), bg paper-aged
  loaded: blur(0), transition filter 400ms
  error: bg rose-petal, icon image-off
```

### 15.2 Lightbox

```yaml
lightbox:
  overlay:
    position: fixed, inset: 0
    background: rgba(10,10,11,0.92)
    backdrop-filter: blur(8px)
    z-index: 70
    display: flex
    align-items: center
    justify-content: center
    opacity: 0 → 1 (400ms)
  
  image-container:
    max-width: 90vw
    max-height: 85vh
    
    image:
      max-width: 100%
      max-height: 100%
      object-fit: contain
      border-radius: 4px
      box-shadow: shadow-elevated
      border: 1px solid rgba(255,248,240,0.1)
      loading: blur(16px) brightness(0.6)
      loaded: blur(0), transition 500ms
  
  controls:
    position: absolute bottom 32px, left 50%, translateX(-50%)
    display: flex, gap: 16px
    padding: 8px 16px
    background: rgba(18,18,20,0.6)
    backdrop-filter: blur(12px)
    border-radius: 12px
    opacity: 0 → 1 (400ms)
    
    button: 36×36px, radius 8px
    icon: 18px, color rgba(255,248,240,0.7)
    counter: Inter 12px 500, opacity 0.5
  
  close:
    position: fixed top 24px right 24px
    width: 40px, height: 40px
    border-radius: 12px
    background: rgba(18,18,20,0.6)
    backdrop-filter: blur(12px)
    opacity: 0 → 1 (400ms)
    z-index: 75
  
  touch:
    swipe-to-dismiss: true
    swipe-to-navigate: true
    pinch-to-zoom: true (1×–4×)
    double-tap-zoom: true
```

---

## 16. Reproductor de Música

### 16.1 Sistema (Dos Modos)

```yaml
music-player-system:
  mini-player:
    position: fixed bottom 0
    width: 100%, height: 64px
    background: rgba(18,18,20,0.85)
    backdrop-filter: blur(24px)
    border-top: 1px solid rgba(255,248,240,0.06)
    z-index: 20
    display: none → flex (cuando música activa)
    transition: transform 400ms
    hidden: translateY(100%)
    visible: translateY(0)
    
    inner:
      display: flex, align-items: center
      max-width: 1280px, margin auto
      padding: 0 24px, gap: 16px
    
    cover-art: 40×40px, radius 4px
    song-title: Inter 14px 500, ellipsis
    artist: Inter 11px 400, --color-mist
    
    controls:
      display: flex, gap: 12px
      button: 32×32px, opacity 0.7→1
      icon: 18px, --color-ivory
    
    progress-bar:
      position: absolute top 0
      height: 2px
      background: rgba(255,248,240,0.06)
      fill: linear-gradient(90deg, gold-dark, gold)
      width: 0%, transition: width 300ms linear
    
    time: Inter 11px, --color-mist, min-width 36px
  
  full-player:
    layout: flex column centered
    padding: 48px 32px
    
    cover-art-large:
      width: min(320px, 60vw)
      border-radius: 12px
      box-shadow: shadow-elevated
      rotating: spin 8s linear infinite (solo si play)
    
    main-controls:
      display: flex, gap: 24px
      button: 48×48px, radius 50%, hover bg(0.06)
      play-pause: 64×64px, bg gold, hover scale(1.05)
    
    progress-container:
      width: 100%, max-width: 480px
      display: flex, gap: 12px
      time: Inter 12px, --color-mist
      track: height 4px, bg rgba(255,248,240,0.08), radius 2px
      fill: gradient gold, width 0%
      thumb: 12px, gold, radius 50%, opacity 0→1 on hover
    
    secondary-controls:
      display: flex, gap: 32px
      button: 36×36px, opacity 0.5→0.9
      active: color gold, opacity 1
    
    song-list: (misma especificación que 13.4)
```

### 16.2 Estados del Player

```yaml
idle:    mini hidden, full lista sin selección
playing: mini visible, cover rotando, barra avanzando
paused:  cover estática, barra detenida
loading: opacity 0.6, skeleton en portada
error:   mensaje de error, timeout 10s
ended:   icono play, barra 100%, auto-next
```

---

## 17. Sección de Notas

```yaml
notes-section:
  layout: scroll vertical
  max-height: 100%
  
  entrance: appear-lift, stagger 80ms
  
  note-card:
    padding: 20px 24px
    margin-bottom: 16px
    background: rgba(255,248,240,0.04)
    border-left: 2px solid --color-gold-light
    border-radius: 0 8px 8px 0
    position: relative
    
    tape:
      position: absolute top -4px, left 50%
      width: 48px, height: 8px
      background: linear-gradient rgba rose → transparent
      rotate: -2deg
      border-radius: 0 0 2px 2px
      colors: rose, gold, green, wine variants
    
    text: Cormorant 16px, line-height 1.6
    date: Inter 11px, --color-mist, text-align right
    hover: translateX(4px), transition 200ms
```

---

## 18. Efectos Decorativos

### 18.1 Pétalos

```yaml
petals:
  container: position fixed, inset 0, pointer-events none, z-index 1
  max: 12 simultáneos
  spawn rate: cada 800ms
  
  petal:
    shape: SVG path (pétalo genérico)
    width: clamp(12px, 3vw, 28px)
    colors: rose-petal, rose, rose-deep
    opacity: 0.08–0.2
    
    animation:
      fall-speed: 40–80 px/s
      horizontal-swing: amplitude 30–70px, frequency 0.3–0.7Hz
      rotation: 0.5–2.5 rev/s, direction random
      drift: x -5 to 5 px/s
    
    performance:
      mobile-max: 6
      low-perf: disabled
      reduced-motion: disabled
```

### 18.2 Partículas de Fondo

```yaml
particles:
  container: fixed, inset 0, z-index 0
  count: 30 (mobile: 12, low-perf: disabled)
  
  particle:
    width: 1.5px, height: 1.5px
    background: '#FFF8EB'
    border-radius: 50%
    opacity: 0.03
    movement: browniano, 0.3–1.5 px/s
```

### 18.3 Brillo Dorado

```yaml
gold-gleam:
  trigger: hover
  duration: 1500ms (una iteración)
  técnica: pseudo-elemento con gradient 45° barrido
  aplicaciones: títulos portada, grabados, botones gold, números página
```

---

## 19. Componentes Reutilizables

### 19.1 Botones

```yaml
button-system:
  height: 40px, padding: 0 20px
  border-radius: 8px
  font: Inter 13px 600, uppercase, tracking 0.04em
  transition: all 200ms
  display: inline-flex, align-items center, gap: 8px
  
  variants:
    primary:
      bg: gold, color: #1A1A1E
      hover: gold-light + glow
      active: gold-dark + scale(0.98)
      disabled: opacity 0.3 gold
    
    secondary:
      bg: transparent, color: ivory
      border: 1px solid rgba(255,248,240,0.15)
      hover: bg 0.04, border 0.25
    
    ghost:
      bg: transparent, color: ivory
      hover: bg 0.04
    
    icon:
      square: 40×40px (sm: 32, lg: 48)
      radius: 10px
    
    text:
      bg: transparent, color: gold
      padding: 0, height: auto
  
  sizes:
    sm: 32px, padding 0 14px, font 11px
    md: 40px, padding 0 20px, font 13px, radius 8px
    lg: 48px, padding 0 28px, font 14px, radius 10px
```

### 19.2 Cards

```yaml
card-system:
  base:
    bg: --color-paper-ivory
    radius: 12px
    padding: 24px
    box-shadow: shadow-paper-raised
    border: 1px solid --color-paper-edge
    
    dark: bg rgba(255,248,240,0.04), border 0.06
  
  variants:
    note: border-left 2px gold, radius 0 12px 12px 0
    photo: padding 4px, bg white, radius 4px
    song: padding 12px 16px, radius 8px, flex row
    menu-item: padding 10px 24px, bg transparent, radius 0
```

### 19.3 Loader (Reutilizable)

```yaml
loader-component:
  variants:
    page: spinner circular 32px, gold
    inline: spinner 16px, gold
    skeleton: shimmer gradient, 1.5s infinite
```

### 19.4 Badges

```yaml
badge:
  base: inline-flex, padding 2px 8px, radius 4px
  font: Inter 10px 600, uppercase
  
  gold: bg rgba(201,169,110,0.15), color gold
  rose: bg rgba(232,196,204,0.15), color rose-deep
  neutral: bg rgba(255,248,240,0.06), color ivory
  dot: 8×8px, radius 50%, gold
```

### 19.5 Tooltips

```yaml
tooltip:
  bg: rgba(26,26,30,0.92)
  backdrop-filter: blur(8px)
  color: --color-ivory
  font: Inter 12px
  padding: 6px 10px
  radius: 6px
  border: 1px solid rgba(255,248,240,0.06)
  
  enter: 150ms, opacity 0→1, translateY(4px→0)
  exit: 100ms, opacity 1→0
```

### 19.6 Modales

```yaml
modal:
  overlay: bg rgba(10,10,11,0.7), backdrop-filter blur(4px)
  
  container:
    bg: --color-eclipse
    border: 1px solid rgba(255,248,240,0.06)
    radius: 16px
    padding: 32px
    max-width: 480px, width: 90vw
    box-shadow: shadow-elevated
    
    enter: 300ms, scale(0.95→1), ease-spring-light
    exit: 200ms, scale(1→0.98), ease-in-smooth
  
  title: Playfair 20px 600, --color-ivory
  body: Cormorant 16px, line-height 1.5
  footer: flex end, gap 12px, margin-top 24px
```
