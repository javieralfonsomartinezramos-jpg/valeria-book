# VALERIA — Diseño y Arquitectura Visual

## Documento de Especificación de Diseño

> Versión 1.0 — Julio 2026
> Estilo: Cinematográfico · Elegante · Premium · Awwwards-caliber

---

## Índice

1. [Manifiesto de Diseño](#1-manifiesto-de-diseño)
2. [Experiencia de Primer Contacto](#2-experiencia-de-primer-contacto)
3. [Sistema de Diseño (Design Tokens)](#3-sistema-de-diseño)
4. [Paleta Completa](#4-paleta-completa)
5. [Tipografía](#5-tipografía)
6. [Iconografía](#6-iconografía)
7. [Espaciado y Layout](#7-espaciado-y-layout)
8. [Animaciones y Motion Design](#8-animaciones-y-motion-design)
9. [Arquitectura de Pantallas](#9-arquitectura-de-pantallas)
10. [Portal de Entrada](#10-portal-de-entrada)
11. [Loader](#11-loader)
12. [Libro Cerrado](#12-libro-cerrado)
13. [Libro Abierto](#13-libro-abierto)
14. [Sistema de Páginas](#14-sistema-de-páginas)
15. [Navegación y Sidebar](#15-navegación-y-sidebar)
16. [Galería de Fotos y Lightbox](#16-galería-y-lightbox)
17. [Reproductor de Música](#17-reproductor-de-música)
18. [Sección de Notas](#18-sección-de-notas)
19. [Efectos Decorativos](#19-efectos-decorativos)
20. [Componentes Reutilizables](#20-componentes-reutilizables)
21. [Sistema de Estados](#21-sistema-de-estados)
22. [Comportamiento Responsive](#22-responsive)
23. [Accesibilidad](#23-accesibilidad)
24. [Rendimiento y Carga](#24-rendimiento)
25. [Arquitectura del Proyecto](#25-arquitectura-del-proyecto)
26. [Checklist de Implementación](#26-checklist)

---

## 1. Manifiesto de Diseño

### 1.1 Concepto Central

Valeria es un libro de artista digital. No es un eBook, no es una página web, no es una app. Es un **objeto emocional**. Cada interacción debe sentirse como tocar papel de algodón, como abrir un diario íntimo, como sostener un recuerdo entre las manos.

El diseño debe transmitir:
- **Atemporalidad** — Sin referencias a tecnología moderna. Sin flat design frío.
- **Tactilidad** — Cada superficie debe sugerir su textura: papel, cuero, tela, tinta.
- **Intimidad** — El usuario no está navegando, está hojeando recuerdos. La luz es tenue.
- **Cinematografía** — Cada transición es un corte de película. Cada página es un plano.

### 1.2 Inspiraciones Visuales

- Cine: *Amélie* (calidez), *Her* (tipografía), *Portrait of a Lady on Fire* (iluminación)
- Diseño editorial: *Cereal Magazine*, *Kinfolk* (minimalismo texturado)
- Premios: Awwwards Site of the Day, CSS Design Awards, FWA
- Producto: Apple Books (gestos), Paper by WeTransfer (ilustración)

### 1.3 Principios de Diseño

1. **El contenido es la interfaz** — No hay decoración vacía.
2. **La textura es emoción** — Sin textura no hay alma.
3. **La luz guía la mirada** — Sombras sutiles, iluminación direccional.
4. **El movimiento cuenta historias** — Cada animación tiene intención.
5. **El silencio es diseño** — El espacio vacío es respiro cinematográfico.

---

## 2. Experiencia de Primer Contacto

### 2.1 Secuencia de Bienvenida

El usuario llega a la URL. Lo primero que ve es una **pantalla completamente negra** durante 400ms.

| Tiempo | Evento | Descripción |
|--------|--------|-------------|
| 0ms | Negro total | Pantalla #000000, sin contenido ni UI |
| 400ms | Portal aparece | Fundido desde negro al Portal (1.2s ease-out) |
| 400–2400ms | Título se revela | "Valeria" aparece con animación de tinta (2s) |
| 2400–3400ms | Pausa dramática | Solo el título, sin movimiento (1s) |
| 3400ms | Loader aparece | Barra fina desde el centro (600ms ease-out) |
| 3400ms–fin | Carga | Loader progresa, partículas de polvo flotan |
| fin+200ms | Portal se pliega | El portal se desvanece hacia el centro |
| fin+1200ms | Libro aparece | El libro se materializa desde el centro (1s) |

### 2.2 Storyboard de la Experiencia

1. Usuario entra → negro (anticipación)
2. Portal con animación de tinta (revelación)
3. Loader progresa con poesía visual (expectativa)
4. Portal se pliega hacia el libro (transición)
5. Libro cerrado sobre superficie texturada (presentación)
6. Click/tap para abrir (invitación)
7. Libro se abre con animación realista (inmersión)
8. Primera página visible con navegación (exploración)

---

## 3. Sistema de Diseño (Design Tokens)

### 3.1 Arquitectura de Tokens

Tres niveles:
```
Global Tokens    → Colores base, fuentes, tamaños atómicos
Semantic Tokens  → Propósito: color-text-primary, spacing-card-padding
Component Tokens → Valores específicos: button-height-primary
```

### 3.2 Global Tokens — Color

```yaml
# FONDO Y OSCUROS
color-black-absolute:  '#000000'
color-black-rich:      '#0A0A0B'
color-black-soft:      '#121214'
color-eclipse:         '#1A1A1E'
color-shadow:          '#1C1C22'
color-charcoal:        '#2A2A32'

# NEUTRALES CÁLIDOS
color-raisin:          '#3A3A44'
color-storm:           '#5A5A66'
color-mist:            '#8A8A96'
color-cloud:           '#B0B0BC'
color-pearl:           '#D4D4DE'
color-ivory:           '#E8E8F0'

# PAPEL
color-paper-light:     '#F5F0E8'
color-paper:           '#EDE6D8'
color-paper-warm:      '#E8DFCF'
color-paper-aged:      '#D4C9B6'
color-paper-cream:     '#F0EADE'
color-paper-ivory:     '#F8F4EC'
color-paper-edge:      '#C4B8A5'

# DORADO / ORO
color-gold-light:      '#F0DFB8'
color-gold:            '#C9A96E'
color-gold-dark:       '#A8874A'
color-gold-deep:       '#8B6F3A'
color-gold-shadow:     '#5C4A28'

# ROSA / FLORAL
color-rose-petal:      '#F5E1E4'
color-rose:            '#E8C4CC'
color-rose-deep:       '#D4A0AC'
color-rose-wine:       '#8B4A5C'
color-rose-stem:       '#4A6B5A'

# TINTA
color-ink-soft:        '#2C2C30'
color-ink:             '#1C1C20'
color-ink-deep:        '#121216'
color-ink-warm:        '#2A2520'

# LUZ
color-light-warm:      rgba(255, 248, 235, 0.6)
color-light-gold:      rgba(201, 169, 110, 0.3)
color-light-ambient:   rgba(255, 248, 240, 0.08)
```

### 3.3 Semantic Tokens

```yaml
# SUPERFICIES
surface-primary:        '--color-paper'
surface-secondary:      '--color-paper-warm'
surface-tertiary:       '--color-paper-aged'
surface-elevated:       '--color-paper-ivory'
surface-dark:           '--color-eclipse'
surface-overlay:        '--color-shadow'        # rgba(26,26,30,0.85)
surface-glass:          rgba(245,240,232,0.15)
surface-glass-dark:     rgba(10,10,11,0.6)

# TEXTO
text-primary:           '--color-ink-deep'
text-secondary:         '--color-storm'
text-tertiary:          '--color-mist'
text-inverse:           '--color-ivory'
text-accent:            '--color-gold'
text-disabled:          '--color-cloud'

# ACENTOS
accent-primary:         '--color-gold'
accent-secondary:       '--color-rose'
accent-tertiary:        '--color-rose-wine'

# BORDES
border-subtle:          '--color-paper-edge'
border-light:           '--color-pearl'
border-accent:          '--color-gold-light'
border-focus:           '--color-gold'
```

### 3.4 Superficies y Texturas

```yaml
# Fondo de pantalla
screen-bg:             '#121214'
screen-bg-gradient:    'radial-gradient(ellipse at 50% 60%, #1A1A1E 0%, #121214 60%, #0A0A0B 100%)'

# Mesa / superficie
table-surface:         '#1A1A1E'
table-gradient:        'linear-gradient(180deg, #1C1C22 0%, #121214 100%)'
table-texture:         url("textures/leather-dark.jpg")  # opacity 0.04

# Portada (cuero)
cover-leather:         '#2A2520'
cover-leather-light:   '#3A342C'
cover-embossing:       '#C9A96E'
cover-embossing-shadow:'#5C4A28'

# Lomo
spine-leather:         '#221E1A'
spine-ribs:            '#3A342C'

# Páginas
page-surface:          '#EDE6D8'
page-shadow:           '#D4C9B6'
page-edge-top:         '#F5F0E8'
page-edge-side:        '#E0D8C8'

# Doble página
spread-left:           '#F0EADE'
spread-right:          '#EDE6D8'
spread-gutter:         '#C4B8A5'
```

### 3.5 Iluminación

```yaml
ambient-light:         'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.06) 0%, transparent 60%)'
page-left-light:       'linear-gradient(90deg, rgba(196,184,165,0.12) 0%, transparent 30%)'
page-right-light:      'linear-gradient(270deg, rgba(245,240,232,0.08) 0%, transparent 20%)'
book-specular:         'linear-gradient(180deg, rgba(255,248,240,0.04) 0%, transparent 50%)'
edge-glow-flip:        'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.1) 20%, transparent 40%)'
page-focus:            'radial-gradient(ellipse at 50% 50%, rgba(245,240,232,0.03) 0%, transparent 70%)'
```

### 3.6 Alto Contraste

```yaml
theme-highcontrast:
  screen-bg:             '#000000'
  cover-leather:         '#1A1410'
  page-surface:          '#FFFFFF'
  text-primary:          '#000000'
  text-secondary:        '#333333'
  accent-primary:        '#B8860B'
```

---

## 4. Tipografía

### 4.1 Fuentes

| Fuente | Uso | Weights |
|--------|-----|---------|
| **Playfair Display** | Títulos, números de sección, portada | 400, 500, 600, 700, 800 |
| **Cormorant Garamond** | Cuerpo de texto, cartas, notas | 300, 400, 500, 600, 700 |
| **Inter** | UI, botones, etiquetas, metadatos | 300, 400, 500, 600, 700 |
| **Lavishly Yours** | Firmas, rúbricas, títulos especiales | 400 |

### 4.2 Escala Tipográfica

| Nivel | Size | Line-Height | Font | Weight | Tracking | Uso |
|-------|------|-------------|------|--------|----------|-----|
| Display XL | 96px | 1.0 | Playfair | 700 | -0.02em | Portada, hero |
| Display L | 72px | 1.05 | Playfair | 700 | -0.02em | Título del libro |
| Display M | 48px | 1.1 | Playfair | 700 | -0.01em | Títulos de sección |
| Display S | 36px | 1.15 | Playfair | 600 | 0 | Títulos de página |
| Heading L | 28px | 1.2 | Playfair | 600 | 0 | Subtítulos |
| Heading M | 24px | 1.25 | Playfair | 600 | 0 | Títulos de card |
| Heading S | 20px | 1.3 | Cormorant | 700 | 0.01em | Entradas de diario |
| Body XL | 22px | 1.6 | Cormorant | 400 | 0.01em | Carta, narrativa |
| Body L | 18px | 1.55 | Cormorant | 400 | 0.01em | Cuerpo de página |
| Body M | 16px | 1.5 | Cormorant | 400 | 0.01em | Texto secundario |
| Body S | 14px | 1.45 | Cormorant | 400 | 0.02em | Notas |
| Caption | 12px | 1.4 | Inter | 500 | 0.04em | Etiquetas |
| Button | 14px | 1 | Inter | 600 | 0.04em | Botones (uppercase) |
| Nav | 13px | 1 | Inter | 500 | 0.06em | Navegación (uppercase) |
| Page-Num | 11px | 1 | Inter | 400 | 0.08em | Números de página |
| Script | 32px | 1.3 | Lavishly | 400 | 0.04em | Firmas |

### 4.3 Reglas Tipográficas

1. Máximo 2 fuentes por vista
2. Lavishly Yours solo en contenido narrativo, nunca en UI
3. Justificar texto a la izquierda en narrativa (nunca centrar bloques largos)
4. Máximo 70 caracteres por línea (óptimo: 55–60)
5. Mínimo 1.5 line-height en cuerpo
6. Usar números elzevirianos (onum) en texto narrativo
7. Usar tabular numbers (tnum) en UI

---

## 5. Iconografía

### 5.1 Sistema

SVG inline, viewBox 24×24, stroke 1.5px, stroke-linecap round, stroke-linejoin round.
Todos outline, sin rellenos.

### 5.2 Tamaños

| Tamaño | Uso |
|--------|-----|
| 12px | Badges, decorativo |
| 16px | Botones pequeños |
| 20px | Botones estándar |
| 24px | Botones grandes, sidebar |
| 32px | Acciones principales |
| 40px | Hero, portada |
| 56px | Portal, estados vacíos |

---

## 6. Espaciado y Layout

### 6.1 Escala de Espaciado

```yaml
space-2:   2px    # Micro-ajustes
space-4:   4px    # Padding mínimo
space-8:   8px    # Espaciado base
space-12:  12px   # Padding botones
space-16:  16px   # Padding estándar
space-20:  20px   # Separación elementos
space-24:  24px   # Padding secciones
space-32:  32px   # Separación componentes
space-40:  40px   # Margen sección
space-48:  48px   # Padding página
space-56:  56px   # Separación bloques
space-64:  64px   # Margen pantalla
space-80:  80px   # Separación hero
space-96:  96px   # Padding extremo
space-128: 128px  # Margen completo
space-160: 160px  # Espacio ceremonial
```

### 6.2 Radios

```yaml
radius-none:  0px
radius-sm:    2px
radius-md:    4px
radius-lg:    8px
radius-xl:    12px
radius-2xl:   16px
radius-3xl:   24px
radius-pill:  9999px
radius-book:  2px / 6px  # Asimétrico como papel real
```

### 6.3 Grid

```yaml
grid:
  columns: 12
  gutter: 24px
  margin-desktop: 64px
  margin-laptop: 48px
  margin-tablet: 32px
  margin-mobile: 20px
  max-width: 1280px
```

### 6.4 Layout del Libro (Doble Página)

```yaml
book-spread:
  aspect-ratio: 1.414 : 1       # √2:1 como libro real
  left-page-width: 50%
  right-page-width: 50%
  gutter-width: 12px
  page-margin-top: 48px
  page-margin-bottom: 40px
  page-margin-inner: 32px
  page-margin-outer: 40px
  content-padding: 24px
  text-max-width: 420px          # 55-70 caracteres
  paragraph-spacing: 1.6em
```

### 6.5 Z-Index System

```yaml
z-decorative:      -1
z-content:         0
z-element:         1
z-sticky:          10
z-overlay-page:    20
z-flip:            30
z-sidebar:         40
z-sidebar-overlay: 45
z-loader:          50
z-portal:          60
z-lightbox:        70
z-lightbox-overlay:75
z-modal:           80
z-toast:           90
z-tooltip:         100
```

### 6.6 Opacidades

```yaml
opacity-4:   0.04
opacity-8:   0.08
opacity-12:  0.12
opacity-16:  0.16
opacity-20:  0.20
opacity-24:  0.24
opacity-32:  0.32
opacity-40:  0.40
opacity-48:  0.48
opacity-56:  0.56
opacity-64:  0.64
opacity-80:  0.80
opacity-92:  0.92
opacity-100: 1
```

### 6.7 Sombras

```yaml
shadow-paper-subtle:
  - 0 1px 2px rgba(26,26,30,0.06)
  - 0 2px 4px -1px rgba(26,26,30,0.04)

shadow-paper-raised:
  - 0 2px 8px -1px rgba(26,26,30,0.1)
  - 0 4px 12px -2px rgba(26,26,30,0.06)

shadow-book:
  - 0 8px 24px -4px rgba(10,10,11,0.4)
  - 0 16px 48px -8px rgba(10,10,11,0.25)
  - 0 40px 64px -12px rgba(10,10,11,0.15)

shadow-flip:
  - -4px 4px 16px -2px rgba(10,10,11,0.25)
  - -8px 8px 32px -4px rgba(10,10,11,0.12)

shadow-elevated:
  - 0 4px 16px -2px rgba(10,10,11,0.2)
  - 0 16px 48px -8px rgba(10,10,11,0.15)
  - 0 32px 64px -12px rgba(10,10,11,0.1)

shadow-glow-subtle:
  - 0 0 8px rgba(201,169,110,0.15)
  - 0 0 16px rgba(201,169,110,0.08)

shadow-glow-medium:
  - 0 0 12px rgba(201,169,110,0.25)
  - 0 0 24px rgba(201,169,110,0.12)
  - 0 0 48px rgba(201,169,110,0.06)
```

---

## 7. Animaciones y Motion Design

### 7.1 Filosofía

Basado en movimiento natural del papel y la luz. Nada digital, nada lineal. Todo físico.

Inspiración: Apple Pages / iBooks, Paper de FiftyThree, The New York Times.

### 7.2 Curvas de Easing

```yaml
ease-out-smooth:        cubic-bezier(0.25, 0.1, 0.25, 1)
ease-out-emphatic:      cubic-bezier(0.0, 0.0, 0.2, 1)
ease-in-smooth:         cubic-bezier(0.4, 0.0, 1, 1)
ease-in-out-smooth:     cubic-bezier(0.4, 0.0, 0.2, 1)
ease-in-out-emphatic:   cubic-bezier(0.0, 0.0, 0.2, 1.2)

# Físicos (papel)
ease-paper-lift:        cubic-bezier(0.15, 0.75, 0.35, 1)
ease-paper-fall:        cubic-bezier(0.55, 0.0, 0.75, 0.25)
ease-paper-turn:        cubic-bezier(0.25, 0.0, 0.35, 1)
ease-paper-settle:      cubic-bezier(0.25, 0.1, 0.25, 0.95)

# Luz
ease-light-in:          cubic-bezier(0.0, 0.0, 0.4, 1)
ease-light-out:         cubic-bezier(0.2, 0.0, 0.8, 0.3)
ease-light-fade:        cubic-bezier(0.0, 0.0, 1, 0.0)

# Spring (Apple)
ease-spring-light:      cubic-bezier(0.25, 0.5, 0.35, 1.15)
ease-spring-medium:     cubic-bezier(0.2, 0.6, 0.3, 1.2)
ease-spring-strong:     cubic-bezier(0.15, 0.7, 0.25, 1.25)
```

### 7.3 Duración

```yaml
instant:      50ms    # Feedback táctil
micro:        100ms   # Hover, active
fast:         200ms   # Transiciones pequeñas
quick:        300ms   # Aparición elementos pequeños
normal:       400ms   # Transición estándar
deliberate:   600ms   # Cambios de estado significativos
slow:         800ms   # Apertura/cierre paneles
cinematic:    1200ms  # Transiciones narrativas
ceremonial:   2000ms  # Apertura/cierre del libro
epic:         3000ms  # Bienvenida/despedida
```

### 7.4 Catálogo de Animaciones

#### Apertura del Libro

```
Duración: 1200ms  |  Easing: ease-paper-turn
Fases:
  1. (0–200ms)   Portada se inclina 5° — anticipación
  2. (200–700ms)  Tapa se abre, páginas se separan del lomo
  3. (700–1100ms) Páginas se estabilizan, doble página visible
  4. (1100–1200ms) Micro-settle — última vibración del papel
Sensación: Pesado pero fluido. Como abrir un libro de tapa dura.
Reflejos: Destello dorado cruza la portada en el momento exacto (400ms).
```

#### Cierre del Libro

```
Duración: 800ms  |  Easing: ease-paper-fall
Fases:
  1. (0–100ms)   Páginas empiezan a juntarse
  2. (100–500ms)  Tapa se cierra, páginas colapsan
  3. (500–700ms)  Contacto final — compresión
  4. (700–800ms)  Polvo de papel se asienta
Sensación: Suave, definitivo. Como cerrar un diario.
```

#### Volteo de Página

```
Duración: 600ms  |  Easing: ease-paper-turn
Fases:
  1. (0–50ms)    Esquina se levanta 2px
  2. (50–150ms)   Página se eleva, curvatura comienza
  3. (150–350ms)  Página se desplaza, pliegue avanza
  4. (350–500ms)  Pasa punto medio, gravedad empuja
  5. (500–580ms)  Toca lado izquierdo, sombra se comprime
  6. (580–600ms)  Micro-rebote, página se asienta

Efectos: Sombra dinámica en pliegue, reflejo en curvatura,
texto siguiente página visible gradualmente.
Sensación: Papel de alta calidad (120gsm+).
```

#### Aparición de Elementos

| Nombre | Props | Duración | Easing |
|--------|-------|----------|--------|
| appear-lift | opacity + translateY(8px→0) | 400ms | ease-spring-light |
| appear-draw | clip-path inset reveal | 800ms | ease-out-smooth |
| appear-blur | opacity + blur(8px→0) | 600ms | ease-light-in |

#### Sidebar

```
Apertura: 500ms, ease-out-smooth, translateX(-100%→0)
Cierre: 400ms, ease-in-smooth, translateX(0→-100%)
Overlay: opacity 0→0.6, 400ms
```

#### Lightbox

```
Apertura: 600ms, ease-out-emphatic
  - (0–100ms)  Overlay aparece
  - (0–150ms)  Miniatura se expande desde su posición
  - (150–500ms) Imagen se desblurrea (blur 12px→0)
  - (300–500ms) Controles aparecen
  - (500–600ms) Micro-settle
```

### 7.5 Animaciones Decorativas

#### Pétalos (Cierre)

```
Tipo: Simulación física
Tamaño: 12–28px | Opacidad: 0.08–0.2
Velocidad: 40–80px/s | Rotación: 0.5–2.5 rev/s
Oscilación: seno, amplitud 0.3–0.7
Máximo: 12 simultáneos
Colores: --color-rose-petal, --color-rose, --color-rose-deep
Se pausan con visibility API. Se desactivan en low-perf.
```

#### Partículas (Fondo)

```
Tamaño: 1–3px | Opacidad: 0.02–0.06
Velocidad: 0.5–2px/s | Color: #FFF8EB
Movimiento: browniano | Máximo: 30
Se desactivan en low-perf y móvil.
```

#### Brillo Dorado

```
Trigger: hover sobre elementos gold
Duración: 1500ms | Una iteración
Técnica: pseudo-elemento con gradient 45° barrido
```

---

## 8. Arquitectura de Pantallas

### 8.1 Mapa de Navegación

```
Portal → Loader → Libro Cerrado → Libro Abierto
  ├── Siguiente/Anterior página
  ├── Sidebar (menú ☰)
  │     ├── Ir a sección
  │     ├── Contraste
  │     ├── Sonido
  │     └── Sorpresa
  ├── Lightbox (click en foto)
  │     ├── ← → Navegar
  │     └── Cerrar (ESC)
  ├── Player (click en canción)
  └── Página final → Pétalos
```

### 8.2 Diagrama de Flujo

```
[URL] → PORTAL (fundido desde negro)
       → LOADER (progreso)
       → LIBRO CERRADO
         → Click → LIBRO ABIERTO
               → Navegación: click bordes, teclado, swipe
               → Sidebar: menú contextual
               → Galería: grid + lightbox
               → Música: lista + player
               → Notas: scroll vertical
               → Cierre: agradecimientos + pétalos
```

---

## 9. Portal de Entrada

### 9.1 Descripción Visual

- Fondo: Negro absoluto (#000000)
- Título: "Valeria" — Playfair Display 96px, weight 700, --color-ivory
- Línea decorativa: 1px, --color-gold, 60% del ancho del título
- Frase (opcional): Cormorant Garamond 18px, --color-gold-light
- Loader: Barra 2px × 160px, centrada

### 9.2 Dimensiones

```yaml
portal:
  background: '#000000'
  z-index: 60
  
  title:
    size: clamp(48px, 8vw, 96px)
    weight: 700
    color: '--color-ivory'
    tracking: -0.02em
    position: center 45%
  
  divider:
    width: clamp(100px, 30vw, 360px)
    height: 1px
    background: '--color-gold'
    margin: 24px auto
  
  subtitle:
    font: Cormorant Garamond
    size: clamp(16px, 2vw, 22px)
    color: '--color-gold-light'
    opacity: 0.8
```

### 9.3 Animación de Entrada

1. Fondo fundido desde negro (1200ms)
2. Título: clip-path reveal izquierda→derecha (800ms, delay 400ms)
3. Línea: scaleX 0→1 (600ms, delay 1200ms)
4. Frase: opacity + blur (600ms, delay 1600ms)
5. Loader: fundido (400ms, delay 2000ms)

---

## 10. Loader

### 10.1 Especificación

```yaml
loader:
  container:
    display: flex
    flex-direction: column
    align-items: center
    gap: 12px
    position: absolute
    bottom: 15%
  
  track:
    width: 160px
    height: 2px
    background: rgba(255,248,240,0.08)
    border-radius: 1px
    overflow: hidden
  
  fill:
    width: 0% → 100%
    height: 100%
    background: 'linear-gradient(90deg, gold-dark, gold, gold-light)'
    border-radius: 1px
    transition: width 300ms ease-out
  
  percentage:
    font: Inter 12px 500
    color: rgba(255,248,240,0.4)
    letter-spacing: 0.08em
```

### 10.2 Estados

```yaml
idle:    fill 0%, partículas lentas
loading: fill 30%→50%→80%→100%
complete: fill 100%, pausa 200ms
transition: opacity 1→0 (800ms, ease-light-out), scale 1→0.95, blur 0→4px
```
