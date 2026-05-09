# Atomic Design — Componentes Compartidos

**Módulo:** SharedModule  
**Fecha:** 2026-05-08  
**Autor:** Daniel Felipe Contreras Tobar  
**Stack:** Angular 13, PrimeNG 13, PrimeFlex

---

## Introducción

Se aplicó Atomic Design para eliminar duplicación de HTML en los módulos `gestion-matricula-financiera` y `gestion-informacion-presupuestaria`. Los patrones repetidos se extrajeron a componentes reutilizables registrados en `SharedModule`.

---

## Átomos

Elementos simples sin lógica de negocio. Reciben datos por `@Input` y no emiten eventos.

### `app-uni-progress-bar`

**Archivo:** `src/app/shared/components/uni-progress-bar/uni-progress-bar.component.ts`

Reemplaza `p-progressSpinner` de PrimeNG. Implementa la barra de progreso lineal indeterminada del Design System TIC v3 (`mat-progress-bar` equivalente).

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `'Cargando...'` | Texto para `aria-label` |

```html
<app-uni-progress-bar label="Cargando matrículas financieras"></app-uni-progress-bar>
```

**Estilos:** `.uni-progress-bar` y `.uni-progress-bar__track` definidos globalmente en `styles.scss`.  
**Color:** `#000066` (primario institucional) sobre fondo `#E0E0FF` (primary-90 M3).

---

### `app-periodo-badge`

**Archivo:** `src/app/shared/components/periodo-badge/periodo-badge.component.ts`

Badge de período académico con ícono de calendario. Corresponde al componente visual del Design System TIC v3 con `border-radius: 9999px` y color `#5056AC` (primary-40 M3).

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Texto del período (ej: `"2026-1"`) |

```html
<app-periodo-badge label="2026-1"></app-periodo-badge>
```

**Estilos:** `.periodo-badge` definido en `styles.scss`.  
**Ícono:** `calendar_month` de Material Symbols Rounded.

---

### `app-campo-dato`

**Archivo:** `src/app/shared/components/campo-dato/campo-dato.component.ts`

Par label/valor para mostrar datos en tarjetas de detalle. Reemplaza el patrón repetido `campo-label` + `campo-valor`.

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Etiqueta del campo |
| `valor` | `string \| number \| null \| undefined` | `''` | Valor a mostrar. Si es `null/undefined` muestra `'-'` |
| `colClass` | `string` | `'col-12 md:col-4'` | Clase PrimeFlex de columna |

```html
<app-campo-dato label="Nombre completo" [valor]="est.nombre + ' ' + est.apellido"></app-campo-dato>
<app-campo-dato label="Semestre" [valor]="est.semestreFinanciero" colClass="col-12 md:col-3"></app-campo-dato>
```

**Estilos:** `.campo-label` y `.campo-valor` definidos globalmente en `styles.scss`.

---

## Moléculas

Combinaciones de átomos o elementos simples que forman un bloque funcional.

### `app-page-header`

**Archivo:** `src/app/shared/components/page-header/page-header.component.ts`

Encabezado de página institucional con línea roja `#DB141C` en la parte inferior. Aparecía duplicado en los 5 componentes feature de ambos módulos.

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `titulo` | `string` | `''` | Título principal de la página |

Usa `ng-content` para el slot derecho (badges, botones, etc.).

```html
<!-- Sin acciones -->
<app-page-header titulo="Gestión de Matrícula Financiera"></app-page-header>

<!-- Con badge de período -->
<app-page-header titulo="Mi Matrícula Financiera">
  <app-periodo-badge [label]="getPeriodoLabel(vm.periodos)"></app-periodo-badge>
</app-page-header>

<!-- Con botón de acción -->
<app-page-header titulo="Reporte Financiero Final">
  <p-button label="Descargar Excel" icon="pi pi-file-excel"
            styleClass="p-button-rounded p-button-outlined"
            (onClick)="descargarExcel()">
  </p-button>
</app-page-header>
```

---

### `app-estado-vacio`

**Archivo:** `src/app/shared/components/estado-vacio/estado-vacio.component.ts`

Estado vacío con ícono centrado y mensaje descriptivo. Reemplaza el bloque repetido en todos los componentes feature.

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `icono` | `string` | `'pi pi-inbox'` | Clase PrimeIcons del ícono |
| `mensaje` | `string` | `'No se encontraron datos.'` | Texto descriptivo en ustedeo |

Usa `ng-content` para botones de acción opcionales (ej: "Volver al listado").

```html
<!-- Básico -->
<app-estado-vacio
  icono="pi pi-inbox"
  mensaje="No se encontró reporte para el período seleccionado.">
</app-estado-vacio>

<!-- Con botón de acción -->
<app-estado-vacio
  icono="pi pi-user-minus"
  mensaje="No se encontró información de matrícula para este estudiante.">
  <p-button label="Volver al listado" styleClass="p-button-rounded p-button-outlined"
            (onClick)="volverAlListado()">
  </p-button>
</app-estado-vacio>
```

---

### `app-uni-card-header`

**Archivo:** `src/app/shared/components/uni-card-header/uni-card-header.component.ts`

Header de tarjeta institucional con fondo `#000066`. Reemplaza el bloque `<ng-template pTemplate="header">` repetido en todas las `p-card` de ambos módulos.

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `titulo` | `string` | `''` | Título de la tarjeta |
| `icono` | `string` | `''` | Clase PrimeIcons. Dejar vacío para omitir |

Usa `ng-content` para acciones opcionales en el lado derecho (ej: botón "Nuevo gasto").

```html
<!-- Sin acciones -->
<p-card styleClass="mb-3 uni-card">
  <ng-template pTemplate="header">
    <app-uni-card-header titulo="Información Personal" icono="pi pi-user">
    </app-uni-card-header>
  </ng-template>
  ...
</p-card>

<!-- Con botón de acción -->
<p-card styleClass="uni-card">
  <ng-template pTemplate="header">
    <app-uni-card-header titulo="Gastos Generales">
      <p-button *ngIf="esEditable" label="Nuevo gasto" icon="pi pi-plus"
                styleClass="p-button-rounded p-button-sm"
                (onClick)="abrirDialogoCrear()">
      </p-button>
    </app-uni-card-header>
  </ng-template>
  ...
</p-card>
```

---

## Registro en SharedModule

Todos los componentes están declarados y exportados en `src/app/shared/shared.module.ts`. Cualquier módulo que importe `SharedModule` tiene acceso a todos los selectores.

```typescript
// En el módulo feature
@NgModule({
  imports: [SharedModule, ...]
})
export class GestionMatriculaFinancieraModule {}
```

---

## Estilos globales (styles.scss)

Los siguientes estilos son globales y no requieren importación en componentes:

| Clase | Uso |
|-------|-----|
| `.uni-progress-bar` | Contenedor de la barra de progreso |
| `.uni-progress-bar__track` | Track animado de la barra |
| `.periodo-badge` | Badge de período académico |
| `.campo-label` | Etiqueta de campo en tarjetas de detalle |
| `.campo-valor` | Valor de campo en tarjetas de detalle |

---

## Componentes Organismos (ya existentes)

Estos componentes ya existían como organismos antes de la refactorización:

| Selector | Archivo | Descripción |
|----------|---------|-------------|
| `app-periodo-financiero-selector` | `gestion-informacion-presupuestaria/feature/periodo-financiero-selector/` | Dropdown de período financiero (dumb) |
| `app-gastos-generales-dialog` | `gestion-informacion-presupuestaria/feature/gastos-generales-dialog/` | Diálogo CRUD de gastos generales (dumb) |
