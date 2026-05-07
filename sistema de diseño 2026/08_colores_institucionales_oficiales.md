# 08 — Colores Institucionales Oficiales (Design System TIC v3)

> Fuente: **Design System Área de Soporte y Desarrollo - División TIC - Universidad del Cauca**
> Versión 3, Julio 2024
> ⚠️ Este documento complementa `01_design_tokens.md` con los colores **oficialmente aprobados** por el Consejo Superior de la Universidad del Cauca.

---

## 🏛️ Jerarquía de autoridad de colores

| Fuente | Autoridad | Uso |
|--------|-----------|-----|
| Consejo Superior Unicauca | **Oficial** | Color primario `#000066` y secundario `#9D0311` — no modificar |
| Design System TIC v3 (este doc) | **Institucional** | Variantes light/dark + paletas tonales |
| Figma Sistema de Diseño 2026 | **Implementación** | Tokens M3, escala tonal completa |

---

## 🎨 Color Institucional Primario

| Variante | Hex | Uso |
|----------|-----|-----|
| **Primario** | `#000066` | Header, iconos, títulos de página, cuadros de texto, botones contenedores, acordeones |
| **Primario Light** | `#5056AC` | Tarjetas en hover, botones en hover, textos e iconos destacados, contenedores destacados |
| **Primario Dark** | `#07184A` | Contenedores de texto, fondos de página, iconografía específica |

---

## 🔴 Color Institucional Secundario

| Variante | Hex | Uso |
|----------|-----|-----|
| **Secundario** | `#9D0311` | Elementos de menor énfasis, subtítulos o textos destacados |
| **Secundario Light** | `#DB141C` | Miga de pan, línea de título de página, subtítulos, textos destacados, iconografía específica |
| **Secundario Dark** | `#690007` | Contenedores de texto, cuadros de texto, iconografía específica |

> ⚠️ **Nota importante:** El rojo **NO se usa como color de error** en los sistemas, ya que hace parte de la identidad institucional. Para errores se usa el color naranja `#FF6D0A`.

---

## ♿ Colores de Accesibilidad Web

| Token | Hex | Uso |
|-------|-----|-----|
| **Accesibilidad web** | `#249300` | Botón contenedor de accesibilidad, ícono de accesibilidad en hover |
| **Neutro hover** | `#F6F6F6` | Posicionamiento del cursor en herramientas de accesibilidad |
| **Neutro texto** | `#454444` | Textos de herramientas de accesibilidad |

---

## 🌈 Otros Colores Destacados

| Token | Hex | Uso |
|-------|-----|-----|
| **Color de seguridad** | `#FF554C` | Notificaciones de seguridad (tono 60 de la paleta secundaria) |
| **Color terciario** | `#1D72D3` | Refuerzo de identidad en subtítulos, textos destacados, imágenes/fotoilustraciones |
| **Color de error** | `#FF6D0A` | Iconografía, textos de error, alertas de advertencia del sistema |

---

## 🏳️‍🌈 Colores del Plan de Desarrollo Institucional

Usados para diversidad visual: imágenes, calendarios, iconografía específica, etiquetas, textos destacados específicos.

| Color | Hex |
|-------|-----|
| **Rojo** | `#DB141C` |
| **Naranja** | `#FF6C08` |
| **Amarillo** | `#FFB000` |
| **Verde** | `#5BAE40` |
| **Azul** | `#00AAE5` |
| **Morado** | `#5A00BA` |

---

## 📊 Pruebas de Contraste — Color Primario

| Fondo | Texto | Resultado |
|-------|-------|-----------|
| `#000066` (Primario) | Blanco | Min 37% opacidad — **NOT LEGIBLE** sin ajuste |
| `#5056AC` (P-Light) | Blanco | Min 60% opacidad Large / Min 82% Normal |
| `#5056AC` (P-Light) | Negro | Min 90% opacidad |
| `#07184A` (P-Dark) | Blanco | Min 36% Large / Min 48% Normal |

> 💡 **Recomendación:** Usar siempre texto blanco `#FFFFFF` sobre el color primario `#000066` con opacidad completa, o usar el primario light `#5056AC` como fondo alternativo.

## 📊 Pruebas de Contraste — Color Secundario

| Fondo | Texto | Resultado |
|-------|-------|-----------|
| `#9D0311` (Secundario) | Blanco | Min 69% Large / Min 90% Normal |
| `#DB141C` (S-Light) | Blanco | Min 94% Large / Min 98% Normal |
| `#DB141C` (S-Light) | Negro | Min 90% opacidad |
| `#690007` (S-Dark) | Blanco | Min 40% Large / Min 50% Normal |
