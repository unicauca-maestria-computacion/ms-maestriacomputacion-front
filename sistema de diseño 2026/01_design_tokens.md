# 01 — Design Tokens: Colores, Sombras y Espaciado

> Basado en Material Theme. Paleta tonal con 18 pasos (0–100).
> Fuente: Figma node `2001:1693` (Slide 16:9 - 2)

---

## 🎨 Paleta de Color — Sistema Tonal M3

### Primary (Azul-Violeta Unicauca)
El color principal de la identidad institucional.

| Token | Tono | Hex |
|-------|------|-----|
| `primary-0` | 0 | `#000000` |
| `primary-5` | 5 | `#00004E` |
| `primary-10` | 10 | `#030568` |
| `primary-15` | 15 | `#121771` |
| `primary-20` | 20 | `#1F247B` |
| `primary-25` | 25 | `#2B3186` |
| `primary-30` | 30 | `#373D92` |
| `primary-35` | 35 | `#43499F` |
| `primary-40` | 40 | `#5056AC` |
| `primary-50` | 50 | `#696FC7` |
| `primary-60` | 60 | `#8289E3` |
| `primary-70` | 70 | `#9DA3FF` |
| `primary-80` | 80 | `#BFC2FF` |
| `primary-90` | 90 | `#E0E0FF` |
| `primary-95` | 95 | `#F1EFFF` |
| `primary-98` | 98 | `#FBF8FF` |
| `primary-99` | 99 | `#FFFBFF` |
| `primary-100` | 100 | `#FFFFFF` |

**Uso semántico M3:**
- `--md-sys-color-primary`: `#5056AC` (primary-40)
- `--md-sys-color-on-primary`: `#FFFFFF` (primary-100)
- `--md-sys-color-primary-container`: `#E0E0FF` (primary-90)
- `--md-sys-color-on-primary-container`: `#030568` (primary-10)
- `--md-sys-color-inverse-primary`: `#BFC2FF` (primary-80)
- `--md-sys-color-surface-tint`: `#565992`

---

### Secondary (Rojo institucional)
Color de acento y alertas.

| Token | Tono | Hex |
|-------|------|-----|
| `secondary-0` | 0 | `#000000` |
| `secondary-5` | 5 | `#2D0001` |
| `secondary-10` | 10 | `#410003` |
| `secondary-15` | 15 | `#540004` |
| `secondary-20` | 20 | `#690007` |
| `secondary-25` | 25 | `#7D000A` |
| `secondary-30` | 30 | `#93000E` |
| `secondary-35` | 35 | `#A60E16` |
| `secondary-40` | 40 | `#B81F21` |
| `secondary-50` | 50 | `#DB3A36` |
| `secondary-60` | 60 | `#FF544C` |
| `secondary-70` | 70 | `#FF897F` |
| `secondary-80` | 80 | `#FFB4AC` |
| `secondary-90` | 90 | `#FFDAD6` |
| `secondary-95` | 95 | `#FFEDEA` |
| `secondary-98` | 98 | `#FFF8F7` |
| `secondary-99` | 99 | `#FFFBFF` |
| `secondary-100` | 100 | `#FFFFFF` |

---

### Tertiary (Azul profundo)
Links, información, énfasis terciario.

| Token | Tono | Hex |
|-------|------|-----|
| `tertiary-0` | 0 | `#000000` |
| `tertiary-5` | 5 | `#00112A` |
| `tertiary-10` | 10 | `#001B3D` |
| `tertiary-15` | 15 | `#00254F` |
| `tertiary-20` | 20 | `#003062` |
| `tertiary-25` | 25 | `#003B76` |
| `tertiary-30` | 30 | `#00468B` |
| `tertiary-35` | 35 | `#0052A0` |
| `tertiary-40` | 40 | `#005DB5` |
| `tertiary-50` | 50 | `#2577D8` |
| `tertiary-60` | 60 | `#4991F4` |
| `tertiary-70` | 70 | `#78ACFF` |
| `tertiary-80` | 80 | `#A9C8FF` |
| `tertiary-90` | 90 | `#D6E3FF` |
| `tertiary-95` | 95 | `#ECF0FF` |
| `tertiary-98` | 98 | `#F9F9FF` |
| `tertiary-99` | 99 | `#FDFBFF` |
| `tertiary-100` | 100 | `#FFFFFF` |

**Colores de contraste verificados (WCAG 2.1 AA):**
- Texto `#ECF0FF` sobre fondo `#00254F` → **13.71:1** ✅ (AAA)
- Texto `#272B60` sobre fondo `#BFC2FF` → **7.73:1** ✅ (AAA)
- Texto `#264777` sobre fondo `#D6E3FF` → **7.24:1** ✅ (AAA)
- Texto `#FFFFFF` sobre fondo `#696FC7` → **4.47:1** ✅ (AA)
- Texto `#565992` sobre fondo `#FCFDFD` → **6.48:1** ✅ (AAA)

---

### Error (Naranja-Marrón)
Estados de error en formularios y alertas críticas.

| Token | Tono | Hex |
|-------|------|-----|
| `error-10` | 10 | `#351000` |
| `error-20` | 20 | `#561F00` |
| `error-30` | 30 | `#7A3000` |
| `error-40` | 40 | `#A04100` |
| `error-50` | 50 | `#C85300` |
| `error-60` | 60 | `#F26500` |
| `error-70` | 70 | `#FF8C51` |
| `error-80` | 80 | `#FFB693` |
| `error-90` | 90 | `#FFDBCC` |
| `error-95` | 95 | `#FFEDE6` |
| `error-99` | 99 | `#FFFBFF` |

---

### Neutral (Grises)
Fondos, bordes, texto secundario.

| Token | Tono | Hex |
|-------|------|-----|
| `neutral-10` | 10 | `#1C1B1B` |
| `neutral-20` | 20 | `#313030` |
| `neutral-30` | 30 | `#484646` |
| `neutral-40` | 40 | `#605E5E` |
| `neutral-50` | 50 | `#797676` |
| `neutral-60` | 60 | `#939090` |
| `neutral-70` | 70 | `#ADAAAA` |
| `neutral-80` | 80 | `#C9C6C5` |
| `neutral-90` | 90 | `#E5E2E1` |
| `neutral-95` | 95 | `#F4F0EF` |
| `neutral-98` | 98 | `#FDF8F8` |
| `neutral-99` | 99 | `#FFFBFF` |

---

### Neutral Variant (Gris-violeta)
Variantes de superficies con matiz del primary.

| Token | Tono | Hex |
|-------|------|-----|
| `neutral-variant-10` | 10 | `#1B1B23` |
| `neutral-variant-20` | 20 | `#303038` |
| `neutral-variant-30` | 30 | `#46464F` |
| `neutral-variant-40` | 40 | `#5E5D67` |
| `neutral-variant-50` | 50 | `#777680` |
| `neutral-variant-60` | 60 | `#918F9A` |
| `neutral-variant-70` | 70 | `#ACAAB4` |
| `neutral-variant-80` | 80 | `#C7C5D0` |
| `neutral-variant-90` | 90 | `#E4E1EC` |
| `neutral-variant-95` | 95 | `#F2EFFA` |
| `neutral-variant-99` | 99 | `#FFFBFF` |

---

### Colores Extendidos (Alert / Success)

| Token | Hex | Uso |
|-------|-----|-----|
| `alert-container-light` | `#FFDF9F` | Fondo de alerta light |
| `alert-value` | `#FBBF24` | Color de alerta normal |
| `alert-medium-contrast` | `#785A0B` | Alerta con hover |
| `alert-dark-on-color` | `#402D00` | Alerta activa/pressed |
| `success-container` | `#B4F1BE` | Fondo de éxito light |
| `success-value` | `#4ADE80` | Color de éxito normal |
| `success-on-container` | `#17512B` | Texto sobre contenedor de éxito |

---

## 🌑 Drop Shadows

Los 7 niveles de sombra disponibles:

| Nivel | CSS Shadow |
|-------|-----------|
| 0 (inner) | `inset 0px 4px 4px 0px rgba(13,39,80,0.16)` |
| 1 | `1.95px 1.95px 2.6px 0px rgba(0,0,0,0.15)` |
| 2 | `0px 1px 4px 0px rgba(0,0,0,0.16)` |
| 3 | `0px 2px 8px 0px rgba(99,99,99,0.20)` |
| 4 | `0px 5px 15px 0px rgba(0,0,0,0.25)` |
| 5 | `0px 7px 29px 0px rgba(100,100,111,0.20)` |
| 6 | `0px 48px 100px 0px rgba(17,12,46,0.15)` |

---

## 📐 Escala de Espaciado

Escala base 4px:

| Token | px |
|-------|----|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-14` | 56px |
| `space-16` | 64px |
| `space-18` | 72px |
| `space-20` | 80px |
