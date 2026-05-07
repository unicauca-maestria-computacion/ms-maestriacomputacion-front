# 05 — Componentes: Guía de Implementación Angular 13

> ⚠️ **Colores corregidos** según Design System TIC v3 oficial
> Stack: Angular 13, Angular Material, SCSS
> Todos los textos de UI usan **ustedeo** (tercera persona formal)

---

## 🧩 Inventario de Componentes

| Componente | Implementación base | Personalización |
|-----------|--------------------|--------------------|
| Button | HTML/SCSS custom | Colores TIC sobre border-radius full |
| Input / TextField | `mat-form-field` + `mat-input` | Colores TIC, border-radius 4px |
| Checkbox | `mat-checkbox` | Color primario `#000066` |
| Radio Button | `mat-radio-group` | Color primario `#000066` |
| Switch/Toggle | `mat-slide-toggle` | Color primario `#000066` |
| Select/Dropdown | `mat-select` | Colores TIC |
| Snackbar | `MatSnackBar` service | 5 tipos con colores TIC |
| Dialog | `MatDialog` | Border-radius 28px |
| Card | `mat-card` | Border-radius 12px, sombra TIC |
| Tooltip | `mat-tooltip` | Fondo `#3C3B3F` |
| Datepicker | `mat-datepicker` | Colores primario TIC |
| Progress bar | `mat-progress-bar` | Color `#000066` |
| Icons | Material Symbols Rounded (CDN) | — |
| Typography | Titillium Web + Open Sans | Tablas de `09_tipografia_tablas_oficiales.md` |

---

## ⚙️ Setup inicial Angular Material

```bash
ng add @angular/material
# Elegir: Custom theme (no usar los temas predefinidos)
```

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressBarModule,
  ]
})
export class AppModule {
  constructor(registry: MatIconRegistry, sanitizer: DomSanitizer) {
    // Registrar Material Symbols Rounded como font set por defecto
    registry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
```

```html
<!-- src/index.html — agregar en <head> -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700;900&family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
```

---

## 🎨 Tema Material — Tokens CSS Oficiales

```scss
// src/styles/_design-tokens.scss
// ⚠️ Colores oficiales aprobados por el Consejo Superior de la Universidad del Cauca

:root {
  // === COLORES PRIMARIOS (oficiales TIC v3) ===
  --color-primary:        #000066;   // Primario — botones, header, iconos
  --color-primary-light:  #5056AC;   // Hover de primary
  --color-primary-dark:   #07184A;   // Fondos oscuros
  --color-primary-pressed:#828AE3;   // Estado pressed

  // === COLORES SECUNDARIOS (oficiales TIC v3) ===
  --color-secondary:      #9D0311;   // Secundario
  --color-secondary-light:#DB141C;   // Miga de pan, subtítulos
  --color-secondary-dark: #690007;   // Contenedores oscuros

  // === COLORES SEMÁNTICOS ===
  --color-error:          #FF6D0A;   // ⚠️ NARANJA — no rojo (rojo es institucional)
  --color-warning:        #FFB000;   // Amarillo advertencia
  --color-success:        #5BAE40;   // Verde confirmación
  --color-info:           #1D72D3;   // Azul información (color terciario)
  --color-security:       #FF554C;   // Rojo-coral seguridad

  // === COLORES NEUTROS ===
  --color-text:           #454444;   // Texto general
  --color-text-secondary: #777680;   // Texto secundario / disabled
  --color-border:         #C9C8CC;   // Bordes y disabled
  --color-hover-bg:       #F6F6F6;   // Fondo hover neutro
  --color-surface:        #FFFFFF;   // Superficie de tarjetas
  --color-background:     #F6F6F6;   // Fondo de página

  // === COLORES ON (texto sobre color) ===
  --color-on-primary:     #FFFFFF;
  --color-on-secondary:   #FFFFFF;
  --color-on-error:       #FFFFFF;
  --color-on-success:     #FFFFFF;
  --color-disabled-bg:    #C9C8CC;
  --color-disabled-text:  #777680;

  // === TIPOGRAFÍA ===
  --font-heading: 'Titillium Web', sans-serif;
  --font-body:    'Open Sans', sans-serif;
  --font-alt:     'Fira Sans', sans-serif;

  // === TAMAÑOS TIPOGRÁFICOS (tabla desarrollo) ===
  --text-h1: 32px;  --lh-h1: 41px;
  --text-h2: 22px;  --lh-h2: 30px;
  --text-h3: 18px;  --lh-h3: 22.5px;
  --text-h4: 16px;  --lh-h4: 30px;
  --text-h5: 16px;  --lh-h5: 30px;
  --text-h6: 14px;  --lh-h6: 23px;
  --text-body1: 14px; --lh-body1: 26px;
  --text-body2: 14px; --lh-body2: 26px;
  --text-body3: 12px; --lh-body3: 21px;
  --text-button: 12px; --lh-button: 19px;
  --text-caption: 12px; --lh-caption: 17px;
  --text-overline: 10px; --lh-overline: 15px;

  // === BORDER RADIUS (TIC v3) ===
  --radius-none: 0px;
  --radius-xs:   4px;    // inputs, snackbars
  --radius-sm:   8px;    // tooltips ricos
  --radius-md:   12px;   // tarjetas, FAB pequeñas
  --radius-lg:   16px;   // FAB, cajones nav
  --radius-xl:   28px;   // diálogos, hojas inferiores
  --radius-full: 9999px; // botones, badges

  // === SOMBRAS ===
  --shadow-1: 1.95px 1.95px 2.6px rgba(0,0,0,0.15);
  --shadow-2: 0px 1px 4px rgba(0,0,0,0.16);
  --shadow-3: 0px 2px 8px rgba(99,99,99,0.20);
  --shadow-4: 0px 5px 15px rgba(0,0,0,0.25);
  --shadow-5: 0px 7px 29px rgba(100,100,111,0.20);

  // === NOTIFICACIONES ===
  --notif-success-bg:   #EFF7EC;
  --notif-warning-bg:   #FFF7E5;
  --notif-info-bg:      #E8F1FB;
  --notif-error-bg:     #FDF2EA;
  --notif-security-bg:  #FFEEED;
  --notif-close-icon:   #A7A6B0;
  --notif-body-text:    #3C3B3F;
}
```

---

## 🔘 Botones

```scss
// src/styles/_buttons.scss
.btn {
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-button); // 12px desarrollo
  font-weight: 600;
  line-height: var(--lh-button);
  letter-spacing: 1.25px;
  padding: 8px 16px;
  min-height: 40px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 150ms ease;
  border: none;

  // Primario
  &-primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    &:hover   { background-color: var(--color-primary-light); }
    &:active  { background-color: var(--color-primary-pressed); }
    &:disabled {
      background-color: var(--color-disabled-bg);
      color: var(--color-disabled-text);
      cursor: not-allowed;
    }
  }

  // Secundario (outline)
  &-secondary {
    background-color: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    &:hover  { background-color: rgba(80, 86, 172, 0.20); }
    &:active { background-color: rgba(130, 138, 227, 0.50); }
    &:disabled {
      background-color: var(--color-disabled-bg);
      border-color: transparent;
      color: var(--color-disabled-text);
      cursor: not-allowed;
    }
  }

  // Terciario (text)
  &-tertiary {
    background-color: transparent;
    color: var(--color-primary);
    &:hover  { background-color: rgba(80, 86, 172, 0.20); }
    &:active { background-color: rgba(130, 138, 227, 0.50); }
    &:disabled { color: var(--color-disabled-text); cursor: not-allowed; }
  }
}
```

```html
<!-- Uso en templates Angular -->
<button class="btn btn-primary">Iniciar sesión</button>
<button class="btn btn-secondary">Cancelar</button>
<button class="btn btn-tertiary">Ver más</button>

<!-- Con ícono -->
<button class="btn btn-primary">
  <span class="material-symbols-rounded">save</span>
  Guardar
</button>
```

---

## 📝 Formularios — Angular Material + Reactive Forms

```typescript
// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@unicauca\.edu\.co$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get emailError(): string {
    const ctrl = this.form.get('email');
    if (ctrl?.hasError('required')) return 'El correo institucional es requerido.';
    if (ctrl?.hasError('pattern')) return 'Este correo no es válido. Requiere @unicauca.edu.co';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.form.get('password');
    if (ctrl?.hasError('required')) return 'La contraseña es requerida.';
    if (ctrl?.hasError('minlength')) return 'La contraseña debe tener mínimo 8 caracteres.';
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      // lógica de login
    }
  }
}
```

```html
<!-- login.component.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

  <!-- Campo correo -->
  <mat-form-field appearance="outline" class="uni-field">
    <mat-label>Correo institucional</mat-label>
    <input matInput formControlName="email" type="email"
           placeholder="usuario@unicauca.edu.co" />
    <mat-icon matSuffix fontSet="material-symbols-rounded">mail</mat-icon>
    <mat-error *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
      {{ emailError }}
    </mat-error>
  </mat-form-field>

  <!-- Campo contraseña -->
  <mat-form-field appearance="outline" class="uni-field">
    <mat-label>Contraseña</mat-label>
    <input matInput formControlName="password"
           [type]="hidePassword ? 'password' : 'text'" />
    <button mat-icon-button matSuffix type="button"
            (click)="hidePassword = !hidePassword"
            [attr.aria-label]="hidePassword ? 'Mostrar contraseña' : 'Ocultar contraseña'">
      <mat-icon fontSet="material-symbols-rounded">
        {{ hidePassword ? 'visibility_off' : 'visibility' }}
      </mat-icon>
    </button>
    <mat-error *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
      {{ passwordError }}
    </mat-error>
  </mat-form-field>

  <!-- Botón submit -->
  <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
    Iniciar sesión
  </button>

</form>
```

```scss
// Sobrescribir estilos de mat-form-field con colores TIC
// src/styles/_forms.scss

.uni-field {
  width: 100%;

  // Borde default
  .mat-mdc-text-field-wrapper {
    border-radius: var(--radius-xs) !important; // 4px
  }

  // Color del label y borde activo
  &.mat-focused {
    .mat-mdc-form-field-label { color: var(--color-primary) !important; }
    .mdc-notched-outline__leading,
    .mdc-notched-outline__notch,
    .mdc-notched-outline__trailing {
      border-color: var(--color-primary) !important;
      border-width: 2px !important;
    }
  }

  // Estado error — naranja (no rojo)
  &.mat-form-field-invalid {
    .mdc-notched-outline__leading,
    .mdc-notched-outline__notch,
    .mdc-notched-outline__trailing {
      border-color: var(--color-error) !important; // #FF6D0A naranja
    }
    .mat-mdc-form-field-error {
      color: var(--color-error) !important;
    }
  }

  // Texto del input
  input.mat-mdc-input-element {
    font-family: var(--font-body);
    font-size: var(--text-body1); // 14px
    color: var(--color-text);     // #454444
  }
}
```

---

## ✅ Checkbox, Radio, Toggle

```html
<!-- Checkbox -->
<mat-checkbox formControlName="terms" class="uni-checkbox">
  Acepto los términos y condiciones.
</mat-checkbox>

<!-- Radio group -->
<mat-radio-group formControlName="tipo" class="uni-radio-group">
  <mat-radio-button value="estudiante">Estudiante</mat-radio-button>
  <mat-radio-button value="docente">Docente</mat-radio-button>
  <mat-radio-button value="administrativo">Administrativo</mat-radio-button>
</mat-radio-group>

<!-- Toggle -->
<mat-slide-toggle formControlName="activo" class="uni-toggle">
  Cuenta activa
</mat-slide-toggle>
```

```scss
// Colores primarios para selectores
// src/styles/_selectors.scss

.uni-checkbox,
.uni-radio-group,
.uni-toggle {
  font-family: var(--font-body);
  font-size: var(--text-body1);
  color: var(--color-text);

  // Color del control activo
  --mdc-checkbox-selected-checkmark-color: #FFFFFF;
  --mdc-checkbox-selected-focus-icon-color: var(--color-primary);
  --mdc-checkbox-selected-hover-icon-color: var(--color-primary-light);
  --mdc-checkbox-selected-icon-color: var(--color-primary);
  --mdc-checkbox-selected-pressed-icon-color: var(--color-primary-dark);

  --mat-radio-checked-ripple-color: var(--color-primary);
  --mdc-radio-selected-focus-icon-color: var(--color-primary);
  --mdc-radio-selected-hover-icon-color: var(--color-primary-light);
  --mdc-radio-selected-icon-color: var(--color-primary);
  --mdc-radio-selected-pressed-icon-color: var(--color-primary-dark);

  --mdc-switch-selected-track-color: var(--color-primary-light);
  --mdc-switch-selected-handle-color: var(--color-primary);
  --mdc-switch-selected-hover-track-color: var(--color-primary);
  --mdc-switch-selected-pressed-track-color: var(--color-primary-dark);
}
```

---

## 🃏 Card

```html
<mat-card class="uni-card">
  <mat-card-header>
    <mat-card-title>Título del contenido</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p class="body-2">Descripción del contenido de la tarjeta.</p>
  </mat-card-content>
  <mat-card-actions>
    <button class="btn btn-tertiary">Ver más</button>
  </mat-card-actions>
</mat-card>
```

```scss
.uni-card {
  border-radius: var(--radius-md) !important; // 12px TIC v3
  box-shadow: var(--shadow-3) !important;
  background: var(--color-surface);
  transition: box-shadow 150ms ease;

  &:hover {
    box-shadow: var(--shadow-4) !important;
  }

  mat-card-title {
    font-family: var(--font-heading);
    font-size: var(--text-h4);
    font-weight: 700;
    color: var(--color-primary);
  }
}
```

---

## 🔔 Snackbar — Servicio de notificaciones

```typescript
// notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotifType = 'success' | 'warning' | 'info' | 'error' | 'security';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snack: MatSnackBar) {}

  show(message: string, type: NotifType = 'info', duration = 5000): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`notif-${type}`]
    };
    this.snack.open(message, '✕', config);
  }

  success(msg: string)  { this.show(msg, 'success'); }
  warning(msg: string)  { this.show(msg, 'warning'); }
  info(msg: string)     { this.show(msg, 'info'); }
  error(msg: string)    { this.show(msg, 'error'); }
  security(msg: string) { this.show(msg, 'security', 8000); }
}
```

```scss
// Estilos globales de notificaciones en styles.scss
// (deben estar en global, no en component, porque MatSnackBar renderiza fuera del componente)

@each $type, $bg, $color in
  (success, #EFF7EC, #5BAE40),
  (warning, #FFF7E5, #FFB000),
  (info,    #E8F1FB, #1D72D3),
  (error,   #FDF2EA, #ED7D31),
  (security,#FFEEED, #FF554C) {

  .notif-#{$type} {
    background-color: $bg !important;
    border-left: 4px solid $color !important;
    border-radius: 4px !important;
    color: #3C3B3F !important;

    .mat-mdc-snack-bar-label { color: #3C3B3F; font-family: 'Open Sans', sans-serif; }
    .mat-mdc-button { color: $color !important; font-weight: 700; }
  }
}
```

```typescript
// Uso en cualquier componente
constructor(private notif: NotificationService) {}

onGuardar(): void {
  // ✅ Ustedeo — texto afirmativo
  this.notif.success('El formulario se diligenció exitosamente.');
}

onError(): void {
  // ✅ Ustedeo — propone solución
  this.notif.error('Los datos no pudieron registrarse. Por favor, intente más tarde.');
}
```

---

## 🔐 Login — Componente completo con seguridad

```html
<!-- Aviso de seguridad con ícono candado (obligatorio según TIC v3) -->
<div class="security-notice">
  <mat-icon fontSet="material-symbols-rounded">lock</mat-icon>
  <p>
    Recuerde que sus datos personales están protegidos por nuestra
    <a href="https://www.unicauca.edu.co/politica-datos" target="_blank">
      Política de Protección de Datos Personales
    </a>.
  </p>
</div>
```

```scss
.security-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--radius-xs);
  background: var(--color-hover-bg);
  font-family: var(--font-body);
  font-size: var(--text-body3); // 12px

  mat-icon {
    color: var(--color-primary);
    font-size: 18px;
    flex-shrink: 0;
  }

  a {
    color: var(--color-info); // #1D72D3
    font-weight: 600;
  }
}
```

---

## 📋 Menú lateral (Sidebar) — Patrón institucional

```html
<nav class="sidebar" role="navigation">
  <a class="nav-item" routerLink="/mis-cursos" routerLinkActive="active">
    <mat-icon fontSet="material-symbols-rounded">school</mat-icon>
    <span>Mis cursos</span>
  </a>
  <a class="nav-item" routerLink="/oferta" routerLinkActive="active">
    <mat-icon fontSet="material-symbols-rounded">menu_book</mat-icon>
    <span>Oferta académica</span>
  </a>
  <!-- Configuración — OBLIGATORIO según TIC v3 -->
  <a class="nav-item" routerLink="/configuracion" routerLinkActive="active">
    <mat-icon fontSet="material-symbols-rounded">settings</mat-icon>
    <span>Configuración</span>
  </a>
</nav>
```

```scss
.sidebar {
  background-color: var(--color-primary); // #000066
  width: 240px;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    color: #FFFFFF;
    text-decoration: none;
    font-family: var(--font-body);
    font-size: var(--text-h3); // 18px
    transition: background-color 150ms ease;

    mat-icon { font-size: 24px; }

    &:hover  { background-color: #828AE3; }
    &.active { background-color: var(--color-primary-light); } // #5056AC
  }
}
```
