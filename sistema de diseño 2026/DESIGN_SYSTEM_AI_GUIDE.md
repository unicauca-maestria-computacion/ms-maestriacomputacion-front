# 🎓 Sistema de Diseño Unicauca 2026 — Guía Maestra para IA

> Este documento es la fuente de verdad del Sistema de Diseño de la Universidad del Cauca.
> Una IA que lea este archivo puede construir componentes correctos sin ver el archivo Figma.

---

## 📁 Estructura de Archivos

```
unicauca-design-system/
├── DESIGN_SYSTEM_AI_GUIDE.md              ← Este archivo (entrada principal)
│
│   ── EXTRAÍDOS DE FIGMA (Sistema de Diseño 2026) ──
├── 01_design_tokens.md                    ← Paleta tonal M3 completa (18 tonos × 6 colores)
├── 02_typography.md                       ← Escala tipográfica M3 (57px → 11px)
├── 03_grid_layout.md                      ← Rejilla y breakpoints mobile/desktop
├── 04_shape_system.md                     ← Formas, radios, todos los estados de componentes
├── 05_components.md                       ← Componentes Angular con código
├── 06_icons.md                            ← ~50 iconos educativos con URLs SVG
├── 07_accessibility.md                    ← Contraste WCAG 2.1 AA verificado
│
│   ── EXTRAÍDOS DEL PDF OFICIAL TIC v3 (Julio 2024) ──
├── 08_colores_institucionales_oficiales.md ← Colores aprobados por el Consejo Superior
├── 09_tipografia_tablas_oficiales.md       ← Tablas exactas diseño/desarrollo con Fira Sans
├── 10_botones_notificaciones_oficiales.md  ← Colores exactos por estado + 5 tipos notificaciones
├── 11_ux_writing_seguridad_contenedores.md ← UX Writing, ustedeo, seguridad, checklist
│
└── icons/                                 ← SVGs descargables (ver 06_icons.md)
```

### Fuentes de verdad

| Archivo | Fuente | Prioridad |
|---------|--------|-----------|
| `08_*` | Consejo Superior Unicauca + División TIC | **Oficial máxima** |
| `09_*`, `10_*`, `11_*` | Design System TIC v3 (PDF, Jul 2024) | **Institucional** |
| `01_*` a `07_*` | Figma Sistema de Diseño 2026 | **Implementación** |

> Cuando haya conflicto entre fuentes, respetar el orden de prioridad anterior.

---

## 🏛️ Identidad

- **Institución:** Universidad del Cauca (Unicauca)
- **Año:** 2026
- **Estándar base:** Material Design 3 (M3) / Material Theme
- **Tema de color:** Material You con paleta tonal personalizada
- **Tipografía principal:** Titillium Web + Open Sans
- **Iconos:** Material Symbols (Rounded, Weight 400, Grade Normal)

---

## ⚡ Reglas de uso rápido para IA

### Cuando construyas un componente:
1. Usa siempre los tokens de color de `01_design_tokens.md` — nunca valores hexadecimales hardcodeados
2. La tipografía de encabezados usa **Titillium Web**, el cuerpo usa **Open Sans**
3. El sistema de forma sigue M3: los botones siempre tienen `border-radius: full (46px)`
4. Los iconos son **Material Symbols Rounded** tamaño mínimo 18dp
5. Todo el texto debe pasar contraste WCAG 2.1 nivel AA (mínimo 4.5:1 para texto normal)

### Colores semánticos clave:
| Token | Uso | Hex |
|---|---|---|
| `primary` | Acciones principales, botones CTA | `#565992` (tono 50) |
| `on-primary` | Texto sobre primary | `#FFFFFF` |
| `secondary` | Acciones secundarias, alertas | `#B81F21` (tono 40) |
| `tertiary` | Acentos, links, info | `#005DB5` (tono 40) |
| `surface` | Fondos de tarjetas | `#FDFBFF` |
| `background` | Fondo de la app | `#FFFBFF` |
| `error` | Estados de error | `#A04100` (tono 40) |

---

## 🔗 Referencias externas
- Figma: `https://www.figma.com/design/t9Em2Irs4D07GZHypZfU2F/`
- Iconos: `https://fonts.google.com/icons` (Material Symbols Rounded)
- Tipografía: `https://fonts.google.com/specimen/Titillium+Web` y `https://fonts.google.com/specimen/Open+Sans`
