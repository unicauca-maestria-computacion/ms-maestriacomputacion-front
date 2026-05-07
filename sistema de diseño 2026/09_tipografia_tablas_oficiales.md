# 09 — Tablas Tipográficas Oficiales (Design System TIC v3)

> Fuente: **Design System TIC v3, Figuras 5 y 6**
> Complementa `02_typography.md` con las tablas exactas de **diseño** y **desarrollo**.

---

## 🔤 Tres Tipografías del Sistema

El Design System TIC v3 define **tres** familias tipográficas (no dos):

| Tipografía | Rol | Carácter |
|-----------|-----|---------|
| **Titillium Web** | Principal — Headings | Institucional, formal |
| **Open Sans** | Principal — Body/UI | Legible, universal |
| **Fira Sans** | Secundaria (alternativa) | Amigable, cercana, emocional |

### Cuándo usar Fira Sans (en lugar de Titillium Web):
Se usa en proyectos que buscan **empatizar más con el usuario**, mostrando una cara amigable y cercana al producto, sin dejar de lado la institucionalidad. Reemplaza completamente a Titillium Web cuando se usa.

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;600;700&display=swap');
```

---

## 📐 Tabla Tipográfica para DISEÑO UX-UI (Figma)

> Tamaños en pantalla de diseño (ligeramente más grandes que desarrollo)

| Scale | Typeface | Weight | Size (px) | Letter Spacing | Interlinea | Componentes |
|-------|----------|--------|-----------|---------------|------------|-------------|
| **H1** | Titillium Web / Fira Sans | Bold | **34** | 0.25 | 41 | Título principal de página |
| **H2** | Titillium Web / Fira Sans | Bold | **24** | 0.25 | 30 | Nombre de sistema (header), Título 2 footer |
| **H3** | Titillium Web / Fira Sans | Semibold | **20** | 0.35 | 22.5 | Menú principal, Título de tarjetas, Botón título sección, Categoría filtro, Nombre de documentos |
| **H4** | Titillium Web / Fira Sans | Bold | **18** | 0.15 | 30 | Tarjetas con iconos |
| **H5** | Titillium Web / Fira Sans | Semibold | **18** | 0.15 | 30 | Menú secundario, Nit Footer, Título tabla |
| **H6** | Titillium Web / Fira Sans | Regular | **16** | 0.1 | 23 | Título de filtro, Componente de tablas, Buscador |
| **Body 1** | Open Sans | Bold | **16** | 0.5 | 26 | Título documento eventos, Título menú desplegable |
| **Body 2** | Open Sans | Semibold | **16** | 0.5 | 26 | Cuerpo de texto, Descriptor documento, Título contenedor formulario |
| **Body 3** | Open Sans | Regular | **14** | 0.25 | 21 | Cuerpo de texto, Enlaces footer, Miga de pan, Contenedor filtros |
| **Button 1** | Open Sans | Semibold | **14** | 1.25 | 19 | Botón primario, Botón secundario, Botón terciario |
| **Caption** | Open Sans | Regular | **14** | 0.5 | 17 | Pie de footer, Pie de fotografías, Etiquetas |
| **Overline** | Open Sans | Regular | **12** | 1.5 | 15 | _(en mayúsculas)_ |

---

## 📐 Tabla Tipográfica para DESARROLLO (implementación real)

> Tamaños en código — ligeramente reducidos respecto al diseño para mejor renderizado en pantalla

| Scale | Typeface | Weight | Size (px) | Letter Spacing | Interlinea | Componentes |
|-------|----------|--------|-----------|---------------|------------|-------------|
| **H1** | Titillium Web / Fira Sans | Bold | **32** | 0.25 | 41 | Título principal de página |
| **H2** | Titillium Web / Fira Sans | Bold | **22** | 0.25 | 30 | Nombre de sistema (header), Título 2 footer |
| **H3** | Titillium Web / Fira Sans | Semibold | **18** | 0.35 | 22.5 | Menú principal, Título de tarjetas, Botón título sección, Categoría filtro, Nombre de documentos |
| **H4** | Titillium Web / Fira Sans | Bold | **16** | 0.15 | 30 | Tarjetas con iconos |
| **H5** | Titillium Web / Fira Sans | Semibold | **16** | 0.15 | 30 | Menú secundario, Nit Footer, Título tabla |
| **H6** | Titillium Web / Fira Sans | Regular | **14** | 0.1 | 23 | Título de filtro, Componente de tablas, Buscador |
| **Body 1** | Open Sans | Bold | **14** | 0.5 | 26 | Título documento eventos, Título menú desplegable |
| **Body 2** | Open Sans | Semibold | **14** | 0.5 | 26 | Cuerpo de texto, Descriptor documento, Título contenedor formulario |
| **Body 3** | Open Sans | Regular | **12** | 0.25 | 21 | Cuerpo de texto, Enlaces footer, Miga de pan, Contenedor filtros |
| **Button 1** | Open Sans | Semibold | **12** | 1.25 | 19 | Botón primario, Botón secundario, Botón terciario |
| **Caption** | Open Sans | Regular | **12** | 0.5 | 17 | Pie de footer, Pie de fotografías, Etiquetas |
| **Overline** | Open Sans | Regular | **10** | 1.5 | 15 | _(en mayúsculas)_ |

> ⚠️ **Tamaño mínimo legal:** 12px según la **Resolución 1519 de 2020** del Ministerio TIC de Colombia (accesibilidad web obligatoria para entidades públicas).

---

## 💻 CSS Variables para Desarrollo

```css
:root {
  /* === TIPOGRAFÍAS === */
  --font-heading: 'Titillium Web', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  --font-alt: 'Fira Sans', sans-serif; /* alternativa amigable */

  /* === HEADINGS (tamaños desarrollo) === */
  --text-h1: 32px;  --lh-h1: 41px;  --ls-h1: 0.25px;
  --text-h2: 22px;  --lh-h2: 30px;  --ls-h2: 0.25px;
  --text-h3: 18px;  --lh-h3: 22.5px; --ls-h3: 0.35px;
  --text-h4: 16px;  --lh-h4: 30px;  --ls-h4: 0.15px;
  --text-h5: 16px;  --lh-h5: 30px;  --ls-h5: 0.15px;
  --text-h6: 14px;  --lh-h6: 23px;  --ls-h6: 0.1px;

  /* === BODY === */
  --text-body1: 14px; --lh-body1: 26px; --ls-body1: 0.5px;
  --text-body2: 14px; --lh-body2: 26px; --ls-body2: 0.5px;
  --text-body3: 12px; --lh-body3: 21px; --ls-body3: 0.25px;

  /* === UTILIDADES === */
  --text-button: 12px; --lh-button: 19px; --ls-button: 1.25px;
  --text-caption: 12px; --lh-caption: 17px; --ls-caption: 0.5px;
  --text-overline: 10px; --lh-overline: 15px; --ls-overline: 1.5px;
}
```

---

## 🅰️ Angular — Implementación de estilos tipográficos

```scss
// _typography.scss

// Headings con Titillium Web (o Fira Sans como alternativa)
h1, .h1 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
  letter-spacing: var(--ls-h1);
}

h2, .h2 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
  letter-spacing: var(--ls-h2);
}

h3, .h3 {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  letter-spacing: var(--ls-h3);
}

// Body con Open Sans
.body-1 {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-body1);
  line-height: var(--lh-body1);
}

.body-2 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-body2);
  line-height: var(--lh-body2);
}

.body-3 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-body3);
  line-height: var(--lh-body3);
}

.btn-text {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-button);
  line-height: var(--lh-button);
  letter-spacing: var(--ls-button);
}

.overline {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-overline);
  line-height: var(--lh-overline);
  letter-spacing: var(--ls-overline);
  text-transform: uppercase;
}
```
