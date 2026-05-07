# 10 — Botones y Notificaciones Oficiales (Design System TIC v3)

> Fuente: **Design System TIC v3, secciones "Contenedores", "Botones" y "Notificaciones"**
> Complementa `04_shape_system.md` con los colores **exactos por estado** y los 5 tipos de notificaciones.

---

## 🔘 Sistema de Botones Institucionales

Todos los botones tienen `border-radius: full (9999px)` según el sistema de contenedores M3.

---

### Botón Primario (Solid)

| Estado | Color contenedor | Color texto |
|--------|-----------------|-------------|
| **Button** (default) | `#000066` | `#FFFFFF` |
| **Hover** | `#5056AC` | `#FFFFFF` |
| **Pressed** | `#828AE3` | `#FFFFFF` |
| **Disabled** | `#C9C8CC` | `#777680` |

```css
.btn-primary {
  background-color: #000066;
  color: #FFFFFF;
  border: none;
  border-radius: 9999px;
}
.btn-primary:hover { background-color: #5056AC; }
.btn-primary:active { background-color: #828AE3; }
.btn-primary:disabled { background-color: #C9C8CC; color: #777680; }
```

---

### Botón Secundario (Outline)

| Estado | Color contenedor | Stroke (2px) | Color texto |
|--------|-----------------|--------------|-------------|
| **Button** (default) | Transparente | `#000066` | `#000066` |
| **Hover** | `#5056AC` al 20% | `#000066` | `#000066` |
| **Pressed** | `#828AE3` al 50% | `#000066` | `#000066` |
| **Disabled** | `#C9C8CC` | — | `#777680` |

```css
.btn-secondary {
  background-color: transparent;
  color: #000066;
  border: 2px solid #000066;
  border-radius: 9999px;
}
.btn-secondary:hover {
  background-color: rgba(80, 86, 172, 0.20);
}
.btn-secondary:active {
  background-color: rgba(130, 138, 227, 0.50);
}
.btn-secondary:disabled {
  background-color: #C9C8CC;
  border-color: transparent;
  color: #777680;
}
```

---

### Botón Terciario (Text)

| Estado | Color contenedor | Color texto |
|--------|-----------------|-------------|
| **Button** (default) | Transparente | `#000066` |
| **Hover** | `#5056AC` al 20% | `#000066` |
| **Pressed** | `#828AE3` al 50% | `#000066` |
| **Disabled** | Transparente | `#777680` |

```css
.btn-tertiary {
  background-color: transparent;
  color: #000066;
  border: none;
  border-radius: 9999px;
}
.btn-tertiary:hover { background-color: rgba(80, 86, 172, 0.20); }
.btn-tertiary:active { background-color: rgba(130, 138, 227, 0.50); }
.btn-tertiary:disabled { color: #777680; }
```

---

### Botón del Menú Principal (Sidebar Nav)

| Estado | Color contenedor | Ícono + Texto |
|--------|-----------------|---------------|
| **Default** | `#000066` | `#FFFFFF` |
| **Hover** | `#828AE3` | `#FFFFFF` |
| **Select (activo)** | `#5056AC` | `#FFFFFF` |

**Sub-ítems desplegables:**

| Estado | Color |
|--------|-------|
| Item desplegable default | `#000066` (más oscuro, anidado) |
| Item desplegable hover | `#828AE3` |
| Item desplegable select | `#5056AC` |

```css
/* Sidebar nav item */
.nav-item {
  background-color: #000066;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-item:hover { background-color: #828AE3; }
.nav-item.active, .nav-item.selected { background-color: #5056AC; }
```

---

## 🔔 Sistema de Notificaciones (5 tipos)

Todas las notificaciones comparten:
- **Border radius:** 4px
- **Drop shadow:** `4px 4px 4px rgba(0,0,0,0.1)` (x=4, y=4, blur=4)
- **Posición:** Esquina superior derecha, debajo del header
- **Ícono de cierre:** `close` (Material Symbols) color `#A7A6B0`, esquina superior derecha
- **Texto de detalle:** color `#3C3B3F`
- **Línea lateral izquierda:** del color del tipo

---

### 1. Notificación de Confirmación ✅

| Elemento | Valor |
|----------|-------|
| Fondo contenedor | `#EFF7EC` |
| Título + línea lateral | `#5BAE40` |
| Texto detalle | `#3C3B3F` |
| Ícono close | `#A7A6B0` |

**Ejemplo de texto:**
- Título: "Solicitud guardada"
- Detalle: "Usted ha generado una nueva solicitud."

```css
.notification-success {
  background-color: #EFF7EC;
  border-left: 4px solid #5BAE40;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.1);
}
.notification-success .notification-title { color: #5BAE40; }
.notification-success .notification-body { color: #3C3B3F; }
```

---

### 2. Notificación de Advertencia ⚠️

| Elemento | Valor |
|----------|-------|
| Fondo contenedor | `#FFF7E5` |
| Título + línea lateral | `#FFB000` |
| Texto detalle | `#3C3B3F` |
| Ícono close | `#A7A6B0` |

**Ejemplo de texto:**
- Título: "Completar registro"
- Detalle: "Complete el formulario para finalizar su registro en la plataforma."

```css
.notification-warning {
  background-color: #FFF7E5;
  border-left: 4px solid #FFB000;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.1);
}
.notification-warning .notification-title { color: #FFB000; }
```

---

### 3. Notificación de Información ℹ️

| Elemento | Valor |
|----------|-------|
| Fondo contenedor | `#E8F1FB` |
| Título + línea lateral | `#1D72D3` |
| Texto detalle | `#3C3B3F` |
| Ícono close | `#A7A6B0` |

**Ejemplo de texto:**
- Título: "Ya se encuentra inscrito en este curso"
- Detalle: "Para conocer más información sobre este programa haga clic en **Mis Cursos.**"

```css
.notification-info {
  background-color: #E8F1FB;
  border-left: 4px solid #1D72D3;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.1);
}
.notification-info .notification-title { color: #1D72D3; }
```

---

### 4. Notificación de Error del Sistema 🔴

| Elemento | Valor |
|----------|-------|
| Fondo contenedor | `#FDF2EA` |
| Título + línea lateral | `#ED7D31` |
| Texto detalle | `#3C3B3F` |
| Ícono close | `#A7A6B0` |

**Ejemplo de texto:**
- Título: "Datos no registrados"
- Detalle: "Error en el Sistema. Por favor, intente más tarde."

```css
.notification-error {
  background-color: #FDF2EA;
  border-left: 4px solid #ED7D31;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.1);
}
.notification-error .notification-title { color: #ED7D31; }
```

---

### 5. Notificación de Seguridad 🔒

| Elemento | Valor |
|----------|-------|
| Fondo contenedor | `#FFEEED` |
| Título + línea lateral | `#FF554C` |
| Texto detalle | `#3C3B3F` |
| Ícono close | `#A7A6B0` |
| **Ícono especial** | `candado` (lock) — reemplaza al ícono estándar |

**Ejemplos de texto:**
- Título: "Alerta de seguridad"
- Detalle: "Por su seguridad, cambie la contraseña de su cuenta."

```css
.notification-security {
  background-color: #FFEEED;
  border-left: 4px solid #FF554C;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.1);
}
.notification-security .notification-title { color: #FF554C; font-weight: 700; }
/* Incluye ícono candado (lock) de Material Symbols antes del título */
```

> 🔑 Las notificaciones de seguridad usan el ícono **candado** en lugar del ícono de tipo genérico. Se posicionan en la parte superior derecha del dispositivo y son responsive.

---

## 🏗️ Componente Angular — Notificación Reutilizable

```typescript
// notification.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

type NotificationType = 'success' | 'warning' | 'info' | 'error' | 'security';

@Component({
  selector: 'uni-notification',
  template: `
    <div [class]="'notification notification--' + type" role="alert">
      <div class="notification__sidebar"></div>
      <span class="material-symbols-rounded notification__icon">
        {{ type === 'security' ? 'lock' : iconMap[type] }}
      </span>
      <div class="notification__content">
        <strong class="notification__title">{{ title }}</strong>
        <p class="notification__body" [innerHTML]="body"></p>
      </div>
      <button class="notification__close" (click)="dismiss.emit()" aria-label="Cerrar notificación">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>
  `
})
export class UniNotificationComponent {
  @Input() type: NotificationType = 'info';
  @Input() title: string = '';
  @Input() body: string = '';
  @Output() dismiss = new EventEmitter<void>();

  iconMap: Record<NotificationType, string> = {
    success: 'check_circle',
    warning: 'warning',
    info: 'info',
    error: 'error',
    security: 'lock'
  };
}
```

```scss
// notification.component.scss
.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: 4px;
  padding: 12px 16px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.10);
  position: relative;
  min-width: 300px;
  max-width: 400px;

  &__sidebar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 4px 0 0 4px;
  }

  &__title {
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }

  &__body {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    color: #3C3B3F;
    margin-top: 4px;
  }

  &__close {
    position: absolute;
    top: 8px; right: 8px;
    background: none; border: none;
    color: #A7A6B0; cursor: pointer;
    font-size: 16px;
  }

  // Variantes de color
  &--success  { background: #EFF7EC; .notification__sidebar, .notification__title, .notification__icon { color: #5BAE40; background-color: #5BAE40; } }
  &--warning  { background: #FFF7E5; .notification__sidebar, .notification__title, .notification__icon { color: #FFB000; background-color: #FFB000; } }
  &--info     { background: #E8F1FB; .notification__sidebar, .notification__title, .notification__icon { color: #1D72D3; background-color: #1D72D3; } }
  &--error    { background: #FDF2EA; .notification__sidebar, .notification__title, .notification__icon { color: #ED7D31; background-color: #ED7D31; } }
  &--security { background: #FFEEED; .notification__sidebar, .notification__title, .notification__icon { color: #FF554C; background-color: #FF554C; font-weight: 700; } }
}
```
