# 06 — Set de Iconos (Producción)

> Fuente: **Material Symbols — Google Fonts**
> Verificar en: **https://fonts.google.com/icons**
> Filtrar por: Style = Rounded, Weight = 400, Grade = 0

---

## ⚙️ Especificaciones del Set

| Propiedad | Valor |
|-----------|-------|
| Librería | Material Symbols |
| Estilo | **Rounded** |
| Weight | 400 |
| Grade | Normal (0) |
| Fill | 0 = outline / 1 = filled |
| Tamaños admitidos | 18dp, 20dp, 24dp, 40dp, 48dp |
| Tamaño estándar UI | **24dp** |

---

## 🚀 Implementación en Producción

### Opción A — CDN Google Fonts (más simple)

```html
<!-- En index.html -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">

<!-- Uso en HTML -->
<span class="material-symbols-rounded">school</span>

<!-- Fill On (relleno) -->
<span class="material-symbols-rounded" style="font-variation-settings: 'FILL' 1">school</span>
```

### Opción B — Angular Material (recomendado para Angular 13+)

```bash
npm install @angular/material @angular/cdk
```

```typescript
// app.module.ts
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [MatIconModule]
})
export class AppModule {
  constructor(registry: MatIconRegistry, sanitizer: DomSanitizer) {
    registry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
```

```html
<!-- En templates Angular -->
<mat-icon>school</mat-icon>
<mat-icon fontSet="material-symbols-rounded">play_lesson</mat-icon>
```

```scss
/* En styles.scss global */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0');

.material-symbols-rounded {
  font-size: 24px;
  line-height: 1;
  user-select: none;
}
```

### Opción C — Descargar SVG individual (sin dependencia de red)

```
# Patrón de URL para descarga directa:
https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/{nombre}/default/24px.svg

# Ejemplos:
https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/school/default/24px.svg
https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/play_lesson/default/24px.svg
```

---

## 🔎 Cómo verificar cualquier ícono

1. Ir a **https://fonts.google.com/icons**
2. En el buscador escribir el nombre (ej: `school`)
3. Filtrar: **Style → Rounded**
4. Click en el ícono → panel derecho muestra el código listo para copiar
5. El string dentro del `<span>` es exactamente el nombre a usar

---

## 🎓 Catálogo — Iconos de Educación

> Todos son **Material Symbols Rounded**
> Uso: `<span class="material-symbols-rounded">NOMBRE</span>`

### Asignaciones y tareas

| Ícono | Nombre (string) |
|-------|----------------|
| Asignación | `assignment` |
| Asignación + agregar | `assignment_add` |
| Asignación devuelta | `assignment_returned` |
| Asignación completada | `assignment_turned_in` |
| Audio descripción | `audio_description` |
| Auto historias | `auto_stories` |
| Mochila | `backpack` |

### Libros

| Ícono | Nombre (string) |
|-------|----------------|
| Inicio | `home` |
| Libro | `book` |
| Libro 2 | `book_2` |
| Libro 3 | `book_3` |
| Libro 4 | `book_4` |
| Libro 5 | `book_5` |
| Libro 6 | `book_6` |
| Libro con cinta | `book_ribbon` |

### Recursos educativos

| Ícono | Nombre (string) |
|-------|----------------|
| Libros, películas y música | `books_movies_and_music` |
| Transmitir para educación | `cast_for_education` |
| Co-presentar | `co_present` |
| Crucigrama | `crossword` |
| Diccionario | `dictionary` |
| Idioma | `language` |
| Globo terráqueo | `globe_uk` |
| Historia educativa | `history_edu` |
| Espacio interactivo | `interactive_space` |
| 3 personas | `3p` |
| Radiología | `radiology` |
| Libros de biblioteca | `library_books` |
| Bombilla circular | `lightbulb_circle` |
| Biblioteca local | `local_library` |
| Libro de menú | `menu_book` |
| Museo | `museum` |
| Entrenamiento en dispositivo | `on_device_training` |
| Búho | `owl` |
| Persona con libro | `person_book` |
| Bolsa personal | `personal_bag` |
| Reproducir lección | `play_lesson` |
| Cuestionario | `quiz` |
| Inicio de sesión TV | `tv_signin` |
| Escuela | `school` |
| Ciencia | `science` |
| Pantalla inteligente | `smart_display` |
| Juguetes y juegos | `toys_and_games` |

---

## 🔘 Iconos de UI — Controles y Sistema

| Ícono | Nombre (string) | Uso en el Design System |
|-------|----------------|------------------------|
| Check círculo | `check_circle` | Notificación de confirmación |
| Cancelar | `cancel` | Notificación de error |
| Error / Advertencia | `error` | Notificación de advertencia |
| Ayuda | `help` | Notificación de información |
| **Candado** | `lock` | **Seguridad — obligatorio** |
| Cerrar | `close` | Cerrar notificaciones |
| Inicio | `home` | Nav principal |
| Configuración | `settings` | Botón Configuración en menú |
| Visibilidad | `visibility` | Mostrar contraseña |
| Ocultar | `visibility_off` | Ocultar contraseña |
| Calendario | `calendar_today` | Fechas en artículos |
| Adjuntar | `attach_file` | Botón con ícono derecho |
| Checkbox vacío | `check_box_outline_blank` | Selector default |
| Checkbox marcado | `check_box` | Selector activo |
| Radio desmarcado | `radio_button_unchecked` | Radio default |
| Radio marcado | `radio_button_checked` | Radio activo |
| Toggle ON | `toggle_on` | Switch activado |
| Toggle OFF | `toggle_off` | Switch desactivado |
| Persona | `person` | Perfil de usuario |
| Subir archivo | `upload` | Zona de carga de documentos |
| Agregar | `add_circle` | Acción de agregar |

---

## 📐 Tamaños

```css
.icon-18 { font-size: 18px; }  /* inline con texto, badges */
.icon-20 { font-size: 20px; }  /* inline con body text */
.icon-24 { font-size: 24px; }  /* ESTÁNDAR */
.icon-40 { font-size: 40px; }  /* cards destacadas */
.icon-48 { font-size: 48px; }  /* empty states */
```
