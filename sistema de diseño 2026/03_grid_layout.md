# 03 — Sistema de Rejilla y Layout

> Fuente: Figma node `2044:719` (Slide 16:9 - 4)

---

## 🏗️ Filosofía de la Rejilla

La cuadrícula se compone de **columnas, medianiles y márgenes** que estructuran la disposición de los elementos en una página. Se utiliza para colocar texto, imágenes y funciones de forma coherente en todo el diseño del producto o sitio web.

---

## 📱 Rejilla Base (Mobile)

### Especificaciones:
- **Columns:** 4
- **Width por columna:** 69px
- **Gutter:** 16px
- **Margin:** 16px

---

## 📱 Dispositivos Móviles Soportados

### iPhone 16 Pro Max
- **Resolución:** 440 × 956px (escalado)
- **Columns:** 4
- **Column width:** ~90px
- **Gutter:** 16px

### Android Compact
- **Resolución:** 412 × 917px (escalado)
- **Columns:** 4
- **Column width:** ~83px
- **Gutter:** 16px

### iPhone 16
- **Resolución:** 393 × 852px (escalado)
- **Columns:** 4
- **Column width:** ~78px
- **Gutter:** 16px

---

## 💻 Desktop 1440×1024

- **Columns:** 12
- **Column width:** 87px
- **Gutter:** 20px
- **Margin lateral:** 88px

---

## 🖥️ Desktop 1920×1080

- **Columns:** 12
- **Column width:** 122px
- **Gutter:** 20px
- **Margin lateral:** 104px

---

## 📊 Tabla de Breakpoints

| Breakpoint | Nombre | Columns | Gutter | Margin |
|-----------|--------|---------|--------|--------|
| 360–412px | Mobile S | 4 | 16px | 16px |
| 412–440px | Mobile L | 4 | 16px | 16px |
| 768px | Tablet | 8 | 16px | 24px |
| 1024px | Tablet L | 12 | 20px | 48px |
| 1440px | Desktop | 12 | 20px | 88px |
| 1920px | Desktop XL | 12 | 20px | 104px |

---

## 🧩 Implementación CSS Grid

```css
/* Mobile (default) */
.layout-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
}

/* Desktop 1440 */
@media (min-width: 1440px) {
  .layout-grid {
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
    padding: 0 88px;
  }
}

/* Desktop 1920 */
@media (min-width: 1920px) {
  .layout-grid {
    padding: 0 104px;
  }
}
```

---

## 📐 Implementación Angular (CSS Grid)

```scss
// _grid.scss
$grid-mobile-cols: 4;
$grid-desktop-cols: 12;
$grid-gutter: 16px;
$grid-gutter-desktop: 20px;
$grid-margin-mobile: 16px;
$grid-margin-1440: 88px;
$grid-margin-1920: 104px;

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 $grid-margin-mobile;

  @media (min-width: 1440px) {
    padding: 0 $grid-margin-1440;
  }

  @media (min-width: 1920px) {
    padding: 0 $grid-margin-1920;
  }
}

.grid {
  display: grid;
  gap: $grid-gutter;
  grid-template-columns: repeat($grid-mobile-cols, 1fr);

  @media (min-width: 1024px) {
    gap: $grid-gutter-desktop;
    grid-template-columns: repeat($grid-desktop-cols, 1fr);
  }
}
```
