# Design System TIC v3 — Guía de Implementación

**Fuente:** Design System Área de Soporte y Desarrollo - División TIC - Universidad del Cauca, Versión 3, Julio 2024  
**Fecha de aplicación:** 2026-05-08  
**Autor:** Daniel Felipe Contreras Tobar

---

## Principios aplicados

El sistema de diseño de la Universidad del Cauca define los estándares visuales aprobados por el Consejo Superior. Su aplicación en los módulos `gestion-matricula-financiera` y `gestion-informacion-presupuestaria` garantiza consistencia institucional.

---

## Colores institucionales

| Token | Hex | Uso en los módulos |
|-------|-----|--------------------|
| Primario | `#000066` | Headers de tarjetas, títulos de página, encabezados de tabla |
| Primario Light | `#5056AC` | Badge de período, encabezados de tabla secundarios |
| Secundario Light | `#DB141C` | Línea decorativa bajo el título de página |
| Error/Advertencia | `#FF6D0A` | Íconos y textos de estado "no pagó" |
| Warning | `#FFB000` | Estado "pendiente" (null) |
| Success | `#5BAE40` | Estado "al día", egresado Unicauca |
| Info | `#1D72D3` | Banners informativos, estado vacío |
| Texto general | `#454444` | Valores de campos |
| Texto secundario | `#777680` | Etiquetas de campos |

> ⚠️ El rojo institucional (`#9D0311`, `#DB141C`) **NO se usa como color de error**. Para errores se usa naranja `#FF6D0A`.

---

## Tipografía

Según la tabla de desarrollo del Design System TIC v3:

| Escala | Familia | Peso | Tamaño | Uso |
|--------|---------|------|--------|-----|
| H2 | Titillium Web | Bold 700 | 22px | Títulos de página |
| H3 | Titillium Web | SemiBold 600 | 18px | Títulos de tarjeta |
| H4 | Titillium Web | Bold 700 | 16px | Badge de período, subtítulos |
| Body 1 | Open Sans | Bold 700 | 14px | Valores destacados |
| Body 3 | Open Sans | Regular 400 | 12px | Etiquetas de campo |
| Button 1 | Open Sans | SemiBold 600 | 12px | Texto de botones |

**Fuentes cargadas en `index.html`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700;900&family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
```

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-full` | `9999px` | Botones, badges, barra de progreso |
| `--radius-xl` | `28px` | Diálogos (`p-dialog`, `p-confirmDialog`) |
| `--radius-md` | `12px` | Tarjetas (`p-card`) |
| `--radius-xs` | `4px` | Inputs, snackbars |

---

## Íconos

**Librería:** Material Symbols Rounded (Google Fonts CDN)  
**Tamaño estándar:** 24px  
**Tamaño inline con texto (badges):** 18px

```html
<span class="material-symbols-rounded">calendar_month</span>
```

> Los íconos de PrimeNG (`pi pi-*`) se mantienen en tablas y botones donde ya estaban integrados con PrimeNG.

---

## Componente de carga

El Design System especifica `mat-progress-bar` (barra lineal) en lugar de spinner circular. Se implementó como `app-uni-progress-bar` con CSS puro:

- Color: `#000066` sobre fondo `#E0E0FF`
- Animación: deslizamiento horizontal indeterminado
- Sin dependencia de Angular Material ni PrimeNG

---

## Estados de pago (`estaPago`)

El campo `estaPago: boolean | undefined` tiene 3 estados reales:

| Valor | Label coordinador | Label estudiante | Color | Severity PrimeNG |
|-------|-------------------|------------------|-------|-----------------|
| `true` | AL DÍA | Su matrícula está al día. | `#5BAE40` | `success` |
| `false` | No pagó | Su matrícula tiene un saldo pendiente. | `#DB141C` | `danger` |
| `null/undefined` | Pendiente | Su matrícula está pendiente de proceso. | `#FFB000` | `warning` |

> El tipo `EstadoMatricula` como enum de strings fue eliminado por no corresponder a la realidad del API.

---

## Textos — Ustedeo

Todos los textos de UI usan tercera persona formal (ustedeo) según el Design System TIC v3:

- ✅ "No fue posible cargar su información de matrícula."
- ✅ "Si considera que esto es un error, puede solicitar una revisión."
- ✅ "Su matrícula está al día."
- ❌ ~~"No pudimos cargar tu información."~~
