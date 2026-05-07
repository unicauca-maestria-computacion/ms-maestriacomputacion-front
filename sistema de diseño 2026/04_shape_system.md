# 04 — Sistema de Formas y Componentes UI

> ⚠️ Colores corregidos según **Design System TIC v3 (oficial)**
> Fuente visual: Figma node `2048:556` + PDF TIC v3

---

## 🔲 Filosofía de Formas

Los estilos de contenedor siguen el **Sistema M3 de Material Design**, pero los colores siguen los definidos oficialmente por la División TIC. Las formas pueden ser simétricas (mismo radio en todas las esquinas) o asimétricas (valores distintos por dirección).

---

## 📦 Tabla de Estilos de Contenedor

> ⚠️ Usar los radios del **TIC v3** (columna TIC v3). Los valores de Figma 2026 se incluyen solo como referencia.

| Estilo | Radio TIC v3 | Radio Figma 2026 | Componentes |
|--------|-------------|-----------------|-------------|
| **Ninguno** | 0px | 0px | Pancartas, barras inferiores, diálogos full screen, listas, barras de navegación, rieles de nav, indicadores de progreso, búsqueda full screen, hojas laterales ancladas, pestañas, barras superiores, menú estándar |
| **Extra pequeño** | 4px | 4px | Menú autocompletar, seleccionar menú, **Snackbars**, **Campos de texto** |
| **Pequeño** | 8px | 14px | Tooltips ricos en fichas |
| **Medio** | 12px | 18px | **Tarjetas**, FAB pequeñas, barra de búsqueda |
| **Largo** | 16px | 22px | FAB extendidos, FAB, cajones de navegación |
| **Extra grande** | 28px | 36px | Hojas inferiores, **diálogos**, hojas flotantes, FAB grandes, selector de tiempo |
| **Lleno** | 9999px (full) | 9999px | **Botones**, insignias, controles deslizantes, botones de íconos interruptores |

---

## 📐 Formas Asimétricas

| Nombre | Radius |
|--------|--------|
| Redondo Extra Largo Arriba | Top: 22px / Bottom: 0px |
| Redondo Largo Arriba | Top: 16px / Bottom: 0px |
| Redondo Extra Pequeño Arriba | Top: 4px / Bottom: 0px |
| Final Redondeado Largo | Start: 0px / End: 16px |
| Inicio Redondeado Largo | Start: 14px / End: 0px |
| Final Redondo Largo | Start: 0px / End: 14px |

---

## 🔘 Escala de Tamaños de Botón

| Tamaño | Width | Height |
|--------|-------|--------|
| XS | 100px | 32px |
| S | 140px | 42px |
| M (default) | 160px | 52px |
| Icon button | 52×52px | — |

---

## 🎛️ Botones — Tipos y Estados (colores oficiales TIC v3)

### Botón Primario (Solid)

| Estado | Fondo | Texto |
|--------|-------|-------|
| Default | `#000066` | `#FFFFFF` |
| Hover | `#5056AC` | `#FFFFFF` |
| Pressed | `#828AE3` | `#FFFFFF` |
| Disabled | `#C9C8CC` | `#777680` |

### Botón Secundario (Outline)

| Estado | Fondo | Borde (2px) | Texto |
|--------|-------|------------|-------|
| Default | Transparente | `#000066` | `#000066` |
| Hover | `#5056AC` 20% | `#000066` | `#000066` |
| Pressed | `#828AE3` 50% | `#000066` | `#000066` |
| Disabled | `#C9C8CC` | — | `#777680` |

### Botón Terciario (Text)

| Estado | Fondo | Texto |
|--------|-------|-------|
| Default | Transparente | `#000066` |
| Hover | `#5056AC` 20% | `#000066` |
| Pressed | `#828AE3` 50% | `#000066` |
| Disabled | Transparente | `#777680` |

### Botón Menú Principal (Sidebar)

| Estado | Fondo | Ícono + Texto |
|--------|-------|--------------|
| Default | `#000066` | `#FFFFFF` |
| Hover | `#828AE3` | `#FFFFFF` |
| Select | `#5056AC` | `#FFFFFF` |

---

## 📝 Cajas de Texto (Inputs)

- **Dimensiones:** 270 × 50px (default)
- **Border radius:** 4px (Extra Pequeño — TIC v3)
- **Fuente placeholder:** Open Sans Regular, color `#777680`
- **Padding interno:** 12px horizontal
- **Borde default:** 1px solid `#C9C8CC`
- **Borde activo:** 2px solid `#000066`
- **Borde error:** 2px solid `#FF6D0A` ← naranja (no rojo — el rojo es institucional)

### Estados de Input

| Estado | Borde | Ícono trailing | Helper text |
|--------|-------|---------------|-------------|
| Default | 1px `#C9C8CC` | — | — |
| Hover | 1px `#000066` | — | — |
| Focus/Typing | 2px `#000066` | — | — |
| Filled | 1px `#C9C8CC` | — | — |
| Disabled | 1px dashed `#C9C8CC` | — | — |
| Success | 2px `#5BAE40` | `check_circle` verde | Color `#5BAE40` |
| Error | 2px `#FF6D0A` | `error` naranja | Color `#FF6D0A` |
| Warning | 2px `#FFB000` | `warning` amarillo | Color `#FFB000` |

---

## ✅ Selectores

### Checkbox — Material Angular
- Hit target: `40 × 40px`
- Color activo: `#000066`
- 4 estados: default, hover, pressed, disabled

### Radio Button — Material Angular
- Hit target: `40 × 40px`
- Color activo: `#000066`
- 4 estados: default, hover, pressed, disabled

### Switch/Toggle — Material Angular
- Tamaño: `48 × 48px`
- Iconos: `toggle_on` / `toggle_off`
- Color ON: `#000066`
- 3 estados: off, on, disabled

---

## 🔔 Notificaciones / Snackbars

Ver especificaciones completas en `10_botones_notificaciones_oficiales.md`.

Resumen rápido:

| Tipo | Fondo | Color acento | Posición |
|------|-------|-------------|---------|
| Confirmación ✅ | `#EFF7EC` | `#5BAE40` | Top-right, bajo header |
| Advertencia ⚠️ | `#FFF7E5` | `#FFB000` | Top-right, bajo header |
| Información ℹ️ | `#E8F1FB` | `#1D72D3` | Top-right, bajo header |
| Error 🔴 | `#FDF2EA` | `#ED7D31` | Top-right, bajo header |
| Seguridad 🔒 | `#FFEEED` | `#FF554C` | Top-right, bajo header |

---

## 📋 Lista / Dropdown

- Contenedor: `308 × 387px`, border-radius: `12px`
- Cada ítem: `308 × 33px`
- Hasta 9 ítems visibles (scroll interno)

---

## 💬 Tooltip

- Tamaño: `72 × 32px`
- Border-radius: `8px`
- Fondo: `#3C3B3F` (oscuro)
- Texto: Open Sans 12px, `#FFFFFF`
