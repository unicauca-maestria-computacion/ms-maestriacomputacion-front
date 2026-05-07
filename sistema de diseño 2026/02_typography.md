# 02 — Tipografía

> Fuente: Figma node `2025:677` (Slide 16:9 - 3)

---

## 🔤 Familias Tipográficas

### 1. Titillium Web — Headings / Display
- **Diseñada por:** Accademia di Belle Arti di Urbino
- **Google Fonts:** `https://fonts.google.com/specimen/Titillium+Web`
- **Pesos disponibles:** Regular (400), Semibold (600), Bold (700), Black (800)
- **Uso:** Títulos, encabezados de sección, display text
- **Multilenguaje:** Soporta caracteres extendidos (ắ y otros)

```css
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700;900&display=swap');
```

### 2. Open Sans — Body / UI
- **Diseñada por:** Accademia di Belle Arti di Urbino
- **Google Fonts:** `https://fonts.google.com/specimen/Open+Sans`
- **Pesos disponibles:** Regular (400), Semibold (600), Bold (700), Black (800)
- **Uso:** Cuerpo de texto, etiquetas, botones, inputs

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap');
```

---

## 📏 Criterios de Elección Tipográfica

El sistema fue diseñado con estos criterios:
1. **Tipografía para pantallas** (display-first)
2. **Multilenguaje** — amplia variedad de signos y glifos
3. **Mínimo 6 variables** en la familia tipográfica
4. **Contraforma amplia** (no geométrica)
5. **Legible en tamaños pequeños** — mínimo 16px según norma
6. **Versalitas**

> ⚠️ La tipografía del manual de identidad UNIR no se usa en web, ya que no cumple estos criterios y es de pago.

---

## 📊 Escala Tipográfica — Material Theme

Categoría, tamaño en px y line-height:

| Categoría UI | Scale M3 | Tamaño / Line-height | Uso |
|---|---|---|---|
| H1 | `display.large` | 57px / 64px | Titulares principales de página |
| H2 | `display.medium` | 45px / 52px | Títulos de sección mayor |
| H3 | `display.small` | 36px / 44px | Subtítulos de sección |
| H4 | `headline.large` | 32px / 40px | Títulos de tarjeta/modal |
| H5 | `headline.medium` | 28px / 36px | Subtítulos de tarjeta |
| H6 | `headline.small` | 24px / 32px | Labels de sección |
| Body text | `body.large` | 16px / 24px | Cuerpo principal de texto |
| Subtitle | `body.medium` | 14px / 20px | Texto secundario / metadata |
| Subscript | `body.small` | 12px / 16px | Notas, pie de página |
| Overline | `label.small` | 11px / 16px | Etiquetas superiores, tags |
| Button | `body.button` | 16px / 20px | Texto de botones |
| Big date | `title.large` | 22px / 28px | Fechas destacadas, datos grandes |

---

## 🎨 Asignación de Familia por Escala

| Escala | Familia | Peso |
|--------|---------|------|
| display.large → headline.large | Titillium Web | 700 (Bold) |
| headline.medium → headline.small | Titillium Web | 600 (SemiBold) |
| body.large → body.small | Open Sans | 400 (Regular) |
| body.button | Open Sans | 600 (SemiBold) |
| label.small | Open Sans | 500 (Medium) |
| title.large (fechas) | Open Sans | 700 (Bold) |

---

## 💻 CSS Variables Recomendadas

```css
:root {
  /* Familias */
  --font-heading: 'Titillium Web', sans-serif;
  --font-body: 'Open Sans', sans-serif;

  /* Display */
  --text-display-lg: 57px;
  --lh-display-lg: 64px;
  --text-display-md: 45px;
  --lh-display-md: 52px;
  --text-display-sm: 36px;
  --lh-display-sm: 44px;

  /* Headline */
  --text-headline-lg: 32px;
  --lh-headline-lg: 40px;
  --text-headline-md: 28px;
  --lh-headline-md: 36px;
  --text-headline-sm: 24px;
  --lh-headline-sm: 32px;

  /* Body */
  --text-body-lg: 16px;
  --lh-body-lg: 24px;
  --text-body-md: 14px;
  --lh-body-md: 20px;
  --text-body-sm: 12px;
  --lh-body-sm: 16px;

  /* Utilidades */
  --text-button: 16px;
  --lh-button: 20px;
  --text-label: 11px;
  --lh-label: 16px;
  --text-title-lg: 22px;
  --lh-title-lg: 28px;
}
```

---

## 📱 Ejemplo de uso en componente de artículo

```html
<!-- Fecha de publicación (Big date text) -->
<span class="title-large">30 de Agosto de 2025</span>

<!-- Título del artículo (H2 → display.medium) -->
<h2 class="display-medium">
  Programas de Pregrado de la Universidad ajustan su pensum
</h2>

<!-- Cuerpo (Body text) -->
<p class="body-large">
  La Universidad del Cauca se acerca a su Bicentenario e inicia 
  la Acreditación de sus programas de Pregrado.
</p>

<!-- CTA -->
<button class="button-text">Ver más</button>
```

---

## 📐 Espaciado entre elementos tipográficos

Observado en el diseño:
- Entre fecha y título: **4px**
- Entre título y separador: la línea visual divide con `border-top`
- Entre separador y cuerpo: **8px**
- Entre cuerpo y subtítulo/label: **12px**
- Entre secciones: **24px**
