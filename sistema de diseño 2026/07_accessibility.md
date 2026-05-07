# 07 — Accesibilidad y Contraste

> Fuente: Figma node `2001:1693` — Sección "Pruebas de Accesibilidad" y "Pruebas de Contraste"
> Nivel certificado: **WCAG 2.1: AA**

---

## 📋 Estándar Aplicado

El Sistema de Diseño Unicauca cumple con **WCAG 2.1 Nivel AA**:
- Relación de contraste mínima para **texto normal** (< 18pt): **4.5:1**
- Relación de contraste mínima para **texto grande** (≥ 18pt o ≥ 14pt en negrita): **3:1**
- Relación de contraste para **iconos y gráficos procesables**: **3:1**

---

## ✅ Combinaciones Verificadas

| Color de texto | Color de fondo | Contraste | Nivel | Uso |
|----------------|---------------|-----------|-------|-----|
| `#ECF0FF` | `#00254F` | **13.71 : 1** | AAA ✅ | Texto claro sobre azul oscuro |
| `#272B60` | `#BFC2FF` | **7.73 : 1** | AAA ✅ | Azul oscuro sobre primary-80 |
| `#264777` | `#D6E3FF` | **7.24 : 1** | AAA ✅ | Azul medio sobre tertiary-90 |
| `#FFFFFF` | `#696FC7` | **4.47 : 1** | AA ✅ | Blanco sobre primary-50 |
| `#565992` | `#FCFDFD` | **6.48 : 1** | AAA ✅ | primary-50 sobre casi-blanco |

---

## 📐 Reglas de aplicación por tamaño

### Para texto ≤ 17pt (texto pequeño)
Se requiere mínimo **4.5:1** → Usar combinaciones AAA de la tabla anterior.

### Para texto ≥ 18pt o ≥ 14pt en negrita (texto grande)
Se admite mínimo **3:1** → Cualquier combinación AA o superior.

### Para iconos y gráficos procesables
Se requiere mínimo **3:1** → Los iconos deben tener suficiente contraste con su fondo.

---

## 🎨 Paleta de Uso Seguro

### Modo claro (Light)

| Elemento | Color | Sobre fondo | Contraste |
|----------|-------|-------------|-----------|
| Texto principal | `#1C1B1B` (neutral-10) | `#FFFBFF` | ~20:1 ✅ |
| Texto secundario | `#605E5E` (neutral-40) | `#FFFBFF` | ~7:1 ✅ |
| Primary button text | `#FFFFFF` | `#5056AC` | ~5.5:1 ✅ |
| Links | `#373D92` (primary-30) | `#FFFBFF` | ~8:1 ✅ |
| Error text | `#7A3000` (error-30) | `#FFFBFF` | ~8.5:1 ✅ |

---

## ⚠️ Combinaciones a EVITAR

| Color de texto | Color de fondo | Contraste | Problema |
|----------------|---------------|-----------|---------|
| `#FFFFFF` | `#BFC2FF` | ~1.5:1 | ❌ Insuficiente |
| `#696FC7` | `#E0E0FF` | ~2.2:1 | ❌ Insuficiente |
| `#9DA3FF` | `#FFFFFF` | ~2.8:1 | ❌ Insuficiente (solo AA para iconos grandes) |
| texto gris `#939090` | `#FFFFFF` | ~2.8:1 | ❌ Solo válido para decorativo |

---

## 🛠️ Verificación en desarrollo

```javascript
// Función para calcular ratio de contraste (WCAG 2.1)
function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Herramientas recomendadas:
// - https://webaim.org/resources/contrastchecker/
// - https://contrast-ratio.com/
// - Chrome DevTools → Accessibility → Color Contrast
```

---

## 📱 Consideraciones adicionales

1. **Tamaño mínimo de toque:** 44 × 44px para elementos interactivos (WCAG 2.5.5)
2. **Espaciado de texto:** El interlineado mínimo es 1.5x el tamaño de fuente
3. **Foco visible:** Los estados `:focus` deben tener outline visible con contraste ≥ 3:1
4. **Íconos sin texto:** Siempre incluir `aria-label` o texto alternativo oculto
5. **Animaciones:** Respetar `prefers-reduced-motion` para usuarios con sensibilidad al movimiento
