# Documento de Diseno Tecnico
## Modulos: gestion-matricula-financiera y gestion-informacion-presupuestaria

**Feature:** matricula-financiera-info-presupuestaria
**Stack:** Angular 13, TypeScript, PrimeNG, RxJS
**Arquitectura:** Hexagonal Pattern B
**Sistema de Diseno:** Unicauca 2026 (TIC v3)

---

## Resumen

Este documento describe el diseno tecnico para la implementacion completa de los modulos
**gestion-matricula-financiera** e **gestion-informacion-presupuestaria** del frontend Angular 13
del sistema de gestion de la Maestria en Computacion de la Universidad del Cauca.

Ambos modulos cuentan con estructura base (rutas, DTOs, modelos de dominio, ApiService, FacadeService
y MapperService). El objetivo es implementar la logica de presentacion, interaccion y estado reactivo
completos, siguiendo la arquitectura hexagonal Pattern B, el Sistema de Diseno Unicauca 2026 y los
lineamientos de accesibilidad WCAG 2.1 AA.

---
## Overview

### Objetivo

Implementar la capa de presentacion (componentes Smart y Dumb) de dos modulos Angular que ya tienen
su capa de datos completa. El trabajo consiste en:

1. **Agregar ViewModels (vm$)** al `GestionMatriculaFinancieraFacadeService` (actualmente no los tiene).
2. **Implementar los componentes vacios** de ambos modulos con logica reactiva completa.
3. **Aplicar el Sistema de Diseno Unicauca 2026** en todos los templates.
4. **Garantizar accesibilidad WCAG 2.1 AA** en todos los componentes.

### Restricciones de implementacion

| Restriccion | Detalle |
|-------------|---------|
| NO crear nuevos servicios | Usar Facade, ApiService, MapperService, ExcelService existentes |
| NO modificar DTOs ni modelos de dominio | Ya estan correctos |
| NO modificar el routing | Ya esta configurado con RoleGuard |
| SI agregar vm$ al Facade de matricula | No existe aun |
| SI implementar componentes vacios | Con logica completa |
| SI aplicar Sistema de Diseno Unicauca 2026 | En todos los templates |

---

## Architecture

### Diagrama de modulos

```
src/app/modules/
├── gestion-matricula-financiera/
│   ├── data/
│   │   ├── api.service.ts          [EXISTENTE - no modificar]
│   │   ├── facade.service.ts       [MODIFICAR - agregar vm$, vmDetalle$, vmResumen$]
│   │   └── mapper.service.ts       [EXISTENTE - no modificar]
│   ├── dto/                        [EXISTENTE - no modificar]
│   ├── models/domain-models.ts     [EXISTENTE - no modificar]
│   └── feature/
│       ├── matricula-financiera/   [REFACTORIZAR - migrar a vm$ pattern]
│       ├── detalle-estudiante/     [IMPLEMENTAR - vacio]
│       └── resumen-matricula-estudiante/ [REFACTORIZAR - migrar a vm$ pattern]
│
└── gestion-informacion-presupuestaria/
    ├── data/
    │   ├── api.service.ts          [EXISTENTE - no modificar]
    │   ├── facade.service.ts       [EXISTENTE - no modificar]
    │   ├── mapper.service.ts       [EXISTENTE - no modificar]
    │   ├── excel.service.ts        [EXISTENTE - no modificar]
    │   └── totales-reporte.service.ts [EXISTENTE - no modificar]
    ├── dto/                        [EXISTENTE - no modificar]
    ├── models/domain-models.ts     [EXISTENTE - no modificar]
    └── feature/
        ├── proyeccion-reporte/     [REFACTORIZAR - migrar a vm$ pattern]
        ├── reporte-final/          [IMPLEMENTAR - vacio]
        ├── reporte-por-grupos/     [IMPLEMENTAR - vacio]
        ├── gastos-generales-dialog/ [IMPLEMENTAR - vacio]
        └── periodo-financiero-selector/ [IMPLEMENTAR - vacio]
```

### Flujo de datos general

```
API Backend
    |
    v
ApiService (HTTP)
    |
    v
MapperService (DTO -> Domain)
    |
    v
FacadeService (BehaviorSubject + vm$)
    |
    v
Smart Component (vm$ | async)
    |
    v (via @Input/@Output)
Dumb Components (presentacion pura)
```

### Patron de comunicacion entre componentes

- **Smart -> Dumb**: via `@Input` con datos del vm$
- **Dumb -> Smart**: via `@Output` con eventos de usuario
- **Smart -> Facade**: llamadas a metodos del Facade
- **Facade -> Smart**: via `vm$ | async` en el template
- **Maximo 2 niveles** de @Input/@Output antes de usar Facade directamente

---

## Components and Interfaces

### Modulo: gestion-matricula-financiera

#### Arbol de componentes

```
MatriculaFinancieraComponent (Smart/Page)
├── [p-dropdown] Selector de periodo
├── [p-inputText] Campo de busqueda (debounce 300ms)
├── [p-dropdown] Selector de estado de matricula
├── [p-table] Tabla de estudiantes
│   └── [p-tag] Etiqueta de estado por fila
├── [p-progressSpinner] Estado de carga
├── [p-message] Estado de error
└── [p-confirmDialog] Dialogo de confirmacion "Iniciar matricula"

DetalleEstudianteComponent (Smart/Page)
├── [p-card] Informacion personal del estudiante
├── [p-card] Informacion financiera (valor SMLV, becas, descuentos)
├── [p-table] Materias matriculadas
├── [p-progressSpinner] Estado de carga
└── [p-message] Estado de error / vacio

ResumenMatriculaEstudianteComponent (Smart/Page)
├── [p-tag] Etiqueta de periodo activo
├── [p-card] Resumen financiero (valor, estado de pago)
├── [p-table] Materias del periodo activo
├── [p-table] Becas y descuentos aplicados
├── [p-button] "Solicitar Revision" (siempre visible)
└── [p-progressSpinner] Estado de carga
```

#### Responsabilidades por componente

| Componente | Tipo | Responsabilidad |
|-----------|------|-----------------|
| `MatriculaFinancieraComponent` | Smart | Orquesta carga de periodos y estudiantes; gestiona filtros; delega al Facade |
| `DetalleEstudianteComponent` | Smart | Carga detalle de un estudiante por codigo; muestra informacion completa |
| `ResumenMatriculaEstudianteComponent` | Smart | Carga datos del estudiante autenticado; muestra resumen de matricula |

Todos los componentes son **Smart** (no hay Dumb separados en este modulo por la simplicidad de la
estructura). La comunicacion con el Facade es directa via `vm$ | async`.

### Modulo: gestion-informacion-presupuestaria

#### Arbol de componentes

```
ProyeccionReporteComponent (Smart/Page)
├── PeriodoFinancieroSelectorComponent (Dumb)
│   └── [p-dropdown] Selector de periodo financiero
├── [p-panel] Panel de configuracion (colapsable)
│   └── [p-inputNumber] Campos de configuracion editables
├── [p-table] Tabla de proyeccion con edicion en linea
│   ├── [p-inputNumber] Edicion de valor SMLV por fila
│   └── [p-tag] Estado de matricula financiera
├── [p-progressSpinner] Estado de carga
└── [p-message] Estado de error

ReporteFinalComponent (Smart/Page)
├── PeriodoFinancieroSelectorComponent (Dumb)
├── [p-panel] Panel de configuracion (solo lectura o editable segun estado)
├── [p-table] Tabla del reporte final
├── [p-button] "Descargar Excel"
├── [p-progressSpinner] Estado de carga
└── [p-message] Estado de error / vacio

ReportePorGruposComponent (Smart/Page)
├── [p-dropdown] Selector de anio
├── [p-panel] Panel de parametros globales (AUI, excedentes, items, imprevistos)
├── [p-table] Tabla de grupos con edicion en linea
├── [p-table] Tabla de gastos generales
│   └── [p-button] Crear / Editar / Eliminar gasto
├── GastosGeneralesDialogComponent (Dumb)
├── [p-button] "Descargar Excel"
├── [p-progressSpinner] Estado de carga
└── [p-confirmDialog] Confirmacion de eliminacion

GastosGeneralesDialogComponent (Dumb)
├── [p-dialog] Contenedor del dialogo (border-radius: 28px)
├── [p-inputText] Campo categoria
├── [p-inputText] Campo descripcion
├── [p-inputNumber] Campo monto
└── [p-button] Guardar / Cancelar

PeriodoFinancieroSelectorComponent (Dumb)
└── [p-dropdown] Selector de periodo financiero
    @Input: periodos, periodoSeleccionado, disabled
    @Output: periodoChange
```

#### Responsabilidades por componente

| Componente | Tipo | Responsabilidad |
|-----------|------|-----------------|
| `ProyeccionReporteComponent` | Smart | Carga proyeccion del periodo activo; gestiona edicion en linea con exhaustMap |
| `ReporteFinalComponent` | Smart | Carga reporte final por periodo; gestiona descarga Excel |
| `ReportePorGruposComponent` | Smart | Carga reporte por grupos por anio; gestiona edicion de parametros y gastos |
| `GastosGeneralesDialogComponent` | Dumb | Formulario de creacion/edicion de gasto general; emite eventos al padre |
| `PeriodoFinancieroSelectorComponent` | Dumb | Selector reutilizable de periodo financiero |

---

## Data Models

### ViewModels del Facade de Matricula Financiera (NUEVOS)

Estos ViewModels se agregan al `GestionMatriculaFinancieraFacadeService` existente:

```typescript
// ViewModel para MatriculaFinancieraComponent
export interface MatriculaFinancieraVM {
  loading: boolean;
  error: ApiError | null;
  estudiantes: Estudiante[];
  periodos: PeriodoAcademico[];
  periodoSeleccionado: PeriodoAcademico | null;
  isEmpty: boolean;
}

// ViewModel para DetalleEstudianteComponent
export interface DetalleEstudianteVM {
  loading: boolean;
  error: ApiError | null;
  estudiante: Estudiante | null;
  isEmpty: boolean;
}

// ViewModel para ResumenMatriculaEstudianteComponent
export interface ResumenMatriculaVM {
  loading: boolean;
  error: ApiError | null;
  estudiante: Estudiante | null;
  periodos: PeriodoAcademico[];
  isEmpty: boolean;
}
```

### ViewModels del Facade de Informacion Presupuestaria (NUEVOS)

Estos ViewModels se agregan al `GestionInformacionPresupuestariaFacadeService` existente:

```typescript
// ViewModel para ProyeccionReporteComponent y ReporteFinalComponent
export interface ProyeccionReporteVM {
  loading: boolean;
  error: ApiError | null;
  reporte: ReporteProyeccionEstudiantes | null;
  isEmpty: boolean;
}

// ViewModel para ReportePorGruposComponent
export interface ReporteGruposVM {
  loading: boolean;
  error: ApiError | null;
  reporte: ReportePorGrupos | null;
  isEmpty: boolean;
}
```

### Interfaces de @Input/@Output para componentes Dumb

```typescript
// PeriodoFinancieroSelectorComponent
@Input() periodos: PeriodoAcademicoDto[] = [];
@Input() periodoSeleccionado: PeriodoAcademicoDto | null = null;
@Input() disabled: boolean = false;
@Output() periodoChange = new EventEmitter<PeriodoAcademicoDto>();

// GastosGeneralesDialogComponent
@Input() visible: boolean = false;
@Input() gasto: GastoGeneral | null = null;  // null = modo creacion
@Input() loading: boolean = false;
@Output() guardar = new EventEmitter<GastoGeneralDTOPeticion>();
@Output() cancelar = new EventEmitter<void>();
```

### Funcion de mapeo de estado de matricula a severity (PrimeNG)

```typescript
// Funcion pura - candidata a propiedad de corrección P5
export function getEstadoMatriculaSeverity(
  estado: EstadoMatricula | string | undefined
): 'success' | 'warning' | 'secondary' | 'info' {
  switch (estado) {
    case 'AL_DIA':
    case 'EXONERADO':
    case 'BECADO':
      return 'success';   // verde #5BAE40
    case 'PENDIENTE':
    case 'MORA':
      return 'warning';   // naranja #FF6D0A
    case 'ANULADO':
      return 'secondary'; // gris
    default:
      return 'info';
  }
}
```

---
## Diseno de ViewModels (vm$)

### GestionMatriculaFinancieraFacadeService — Adicion de vm$

Se agregan tres BehaviorSubjects nuevos y tres vm$ al Facade existente:

```typescript
// Agregar en GestionMatriculaFinancieraFacadeService

// --- ViewModel para MatriculaFinancieraComponent ---
readonly vm$ = combineLatest({
  loading: this._loading,
  error: this._error,
  estudiantes: this._estudiantes,
  periodos: this._periodos,
  periodoSeleccionado: this._periodoSeleccionadoFiltro
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.estudiantes.length === 0
  }))
);

// --- ViewModel para DetalleEstudianteComponent ---
readonly vmDetalle$ = combineLatest({
  loading: this._loading,
  error: this._error,
  estudiante: this._estudianteSeleccionado
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.estudiante === null
  }))
);

// --- ViewModel para ResumenMatriculaEstudianteComponent ---
readonly vmResumen$ = combineLatest({
  loading: this._loading,
  error: this._error,
  estudiante: this._estudianteSeleccionado,
  periodos: this._periodos
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.estudiante === null
  }))
);
```

**Razon de diseno:** Los tres vm$ comparten los mismos BehaviorSubjects subyacentes del Facade.
No se crean nuevos BehaviorSubjects — solo se combinan los existentes de forma diferente para
cada vista. Esto mantiene una unica fuente de verdad.

### GestionInformacionPresupuestariaFacadeService — Adicion de vm$

```typescript
// Agregar en GestionInformacionPresupuestariaFacadeService

// --- ViewModel para ProyeccionReporteComponent y ReporteFinalComponent ---
readonly vmProyeccion$ = combineLatest({
  loading: this._loading,
  error: this._error,
  reporte: this._reporteProyeccionEstudiantes
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.reporte === null
  }))
);

// --- ViewModel para ReportePorGruposComponent ---
readonly vmGrupos$ = combineLatest({
  loading: this._loading,
  error: this._error,
  reporte: this._reporteGrupos
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.reporte === null
  }))
);
```

---

## Diseno de Templates con Sistema de Diseno Unicauca 2026

### Tokens de diseno aplicados

| Token | Valor | Uso en templates |
|-------|-------|-----------------|
| Color primario | `#000066` | Encabezados de tabla, botones primarios, titulos |
| Color primario-light | `#5056AC` | Hover de botones, elementos destacados |
| Color error | `#FF6D0A` | Notificaciones de error, estados PENDIENTE/MORA |
| Color success | `#5BAE40` | Notificaciones de exito, estados AL_DIA/EXONERADO/BECADO |
| Color warning | `#FFB000` | Notificaciones de advertencia |
| Color info | `#1D72D3` | Notificaciones informativas |
| Border-radius botones | `9999px` | Todos los `p-button` |
| Border-radius tarjetas | `12px` | Todos los `p-card` |
| Border-radius dialogos | `28px` | Todos los `p-dialog` |
| Tipografia headings | Titillium Web | `h1`-`h4` |
| Tipografia body | Open Sans 14px | Textos de cuerpo |
| Tamano minimo texto | 12px | Resolución 1519 de 2020 |

### Estructura de template Smart Component (patron base)

```html
<!-- Patron base para todos los Smart Components -->
<ng-container *ngIf="vm$ | async as vm">

  <!-- Estado: Cargando -->
  <div *ngIf="vm.loading" class="flex justify-content-center align-items-center p-4">
    <p-progressSpinner
      strokeWidth="4"
      [style]="{ width: '48px', height: '48px' }"
      aria-label="Cargando informacion">
    </p-progressSpinner>
  </div>

  <!-- Estado: Error -->
  <p-message
    *ngIf="vm.error && !vm.loading"
    severity="error"
    [text]="vm.error.mensaje + ' Por favor, intente nuevamente o contacte al administrador.'"
    styleClass="w-full mb-3">
  </p-message>

  <!-- Estado: Vacio -->
  <div *ngIf="vm.isEmpty" class="flex flex-column align-items-center p-6 gap-3">
    <span class="material-symbols-rounded" style="font-size: 48px; color: #5056AC;" aria-hidden="true">
      inbox
    </span>
    <p class="text-center" style="font-family: 'Open Sans', sans-serif; font-size: 14px; color: #454444;">
      No se encontraron registros para el periodo seleccionado.
    </p>
  </div>

  <!-- Estado: Datos -->
  <ng-container *ngIf="!vm.loading && !vm.isEmpty">
    <!-- Contenido especifico de la vista -->
  </ng-container>

</ng-container>

<!-- Toast institucional (posicion top-right) -->
<p-toast position="top-right"></p-toast>
```

### MatriculaFinancieraComponent — Estructura de template

```html
<div class="surface-0 p-4">
  <!-- Encabezado con color primario -->
  <div class="flex align-items-center justify-content-between mb-4">
    <h2 style="font-family: 'Titillium Web', sans-serif; color: #000066; font-size: 24px; margin: 0;">
      Matricula Financiera
    </h2>
    <p-button
      *ngIf="esCoordinador"
      label="Iniciar nueva matricula"
      icon="pi pi-plus"
      styleClass="p-button-rounded"
      style="border-radius: 9999px;"
      aria-label="Iniciar nueva matricula financiera para el periodo activo"
      (onClick)="confirmarIniciarMatricula()">
    </p-button>
  </div>

  <!-- Filtros -->
  <div class="grid mb-3">
    <div class="col-12 md:col-4">
      <label for="periodo-selector" style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        Periodo academico
      </label>
      <p-dropdown
        inputId="periodo-selector"
        [options]="(vm$ | async)?.periodos | periodoDropdown"
        [(ngModel)]="periodoSeleccionado"
        [disabled]="(vm$ | async)?.loading"
        placeholder="Seleccione un periodo"
        (onChange)="onPeriodoChange($event)"
        aria-label="Selector de periodo academico">
      </p-dropdown>
    </div>
    <div class="col-12 md:col-4">
      <label for="busqueda" style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        Buscar estudiante
      </label>
      <input
        pInputText
        id="busqueda"
        type="text"
        placeholder="Nombre o codigo"
        (input)="onBusquedaChange($event)"
        aria-label="Buscar por nombre o codigo de estudiante">
    </div>
    <div class="col-12 md:col-4">
      <label for="estado-selector" style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        Estado de matricula
      </label>
      <p-dropdown
        inputId="estado-selector"
        [options]="estadosMatricula"
        [(ngModel)]="estadoFiltro"
        placeholder="Todos los estados"
        (onChange)="onEstadoChange()"
        aria-label="Filtrar por estado de matricula">
      </p-dropdown>
    </div>
  </div>

  <!-- Tabla de estudiantes -->
  <p-table
    [value]="estudiantesFiltrados"
    [loading]="(vm$ | async)?.loading"
    [paginator]="true"
    [rows]="10"
    styleClass="p-datatable-sm"
    [trackBy]="trackByEstudiante">

    <ng-template pTemplate="caption">
      <span style="font-family: 'Open Sans', sans-serif; font-size: 14px; color: #000066;">
        Total: {{ estudiantesFiltrados.length }} estudiantes
      </span>
    </ng-template>

    <ng-template pTemplate="header">
      <tr style="background-color: #000066;">
        <th style="color: #FFFFFF; font-family: 'Open Sans', sans-serif;">Codigo</th>
        <th style="color: #FFFFFF; font-family: 'Open Sans', sans-serif;">Nombre completo</th>
        <th style="color: #FFFFFF; font-family: 'Open Sans', sans-serif;">Semestre</th>
        <th style="color: #FFFFFF; font-family: 'Open Sans', sans-serif;">Valor SMLV</th>
        <th style="color: #FFFFFF; font-family: 'Open Sans', sans-serif;">Estado</th>
        <th style="color: #FFFFFF; font-family: 'Open Sans', sans-serif;">Acciones</th>
      </tr>
    </ng-template>

    <ng-template pTemplate="body" let-estudiante>
      <tr>
        <td>{{ estudiante.codigo }}</td>
        <td>{{ estudiante.nombre }} {{ estudiante.apellido }}</td>
        <td>{{ estudiante.semestreFinanciero }}</td>
        <td>{{ estudiante.valorEnSMLV | number:'1.2-2' }}</td>
        <td>
          <p-tag
            [value]="estudiante.estaPago ? 'AL DIA' : 'PENDIENTE'"
            [severity]="getEstadoSeverity(estudiante)"
            [rounded]="true">
          </p-tag>
        </td>
        <td>
          <p-button
            icon="pi pi-eye"
            styleClass="p-button-text p-button-rounded"
            aria-label="Ver detalle del estudiante {{ estudiante.nombre }}"
            (onClick)="verDetalle(estudiante)">
          </p-button>
        </td>
      </tr>
    </ng-template>

    <ng-template pTemplate="emptymessage">
      <tr>
        <td colspan="6" class="text-center p-4">
          No se encontraron estudiantes para los filtros seleccionados.
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-confirmDialog
  [style]="{ 'border-radius': '28px', width: '450px' }"
  acceptLabel="Confirmar"
  rejectLabel="Cancelar"
  acceptButtonStyleClass="p-button-rounded"
  rejectButtonStyleClass="p-button-rounded p-button-outlined">
</p-confirmDialog>
<p-toast position="top-right"></p-toast>
```

### DetalleEstudianteComponent — Estructura de template

```html
<div class="surface-0 p-4">
  <ng-container *ngIf="vmDetalle$ | async as vm">

    <!-- Boton volver -->
    <p-button
      label="Volver al listado"
      icon="pi pi-arrow-left"
      styleClass="p-button-text p-button-rounded mb-3"
      aria-label="Volver al listado de matriculas financieras"
      (onClick)="volverAlListado()">
    </p-button>

    <!-- Cargando -->
    <div *ngIf="vm.loading" class="flex justify-content-center p-6">
      <p-progressSpinner aria-label="Cargando detalle del estudiante"></p-progressSpinner>
    </div>

    <!-- Error -->
    <p-message *ngIf="vm.error && !vm.loading" severity="error"
      [text]="vm.error.mensaje + ' Por favor, intente nuevamente.'">
    </p-message>

    <!-- Vacio (404) -->
    <div *ngIf="vm.isEmpty" class="flex flex-column align-items-center p-6 gap-3">
      <span class="material-symbols-rounded" style="font-size: 48px; color: #5056AC;" aria-hidden="true">
        person_off
      </span>
      <p style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        No se encontro informacion de matricula para este estudiante.
      </p>
      <p-button label="Volver al listado" styleClass="p-button-rounded p-button-outlined"
        (onClick)="volverAlListado()">
      </p-button>
    </div>

    <!-- Datos del estudiante -->
    <ng-container *ngIf="!vm.loading && vm.estudiante as est">
      <h2 style="font-family: 'Titillium Web', sans-serif; color: #000066;">
        {{ est.nombre }} {{ est.apellido }}
      </h2>

      <!-- Tarjeta informacion personal -->
      <p-card styleClass="mb-3" [style]="{ 'border-radius': '12px', 'box-shadow': '0px 2px 8px rgba(99,99,99,0.20)' }">
        <ng-template pTemplate="header">
          <div class="p-3" style="background-color: #000066; border-radius: 12px 12px 0 0;">
            <h3 style="color: #FFFFFF; font-family: 'Titillium Web', sans-serif; margin: 0;">
              Informacion Personal
            </h3>
          </div>
        </ng-template>
        <div class="grid">
          <div class="col-6 md:col-3"><strong>Codigo:</strong> {{ est.codigo }}</div>
          <div class="col-6 md:col-3"><strong>Identificacion:</strong> {{ est.identificacion }}</div>
          <div class="col-6 md:col-3"><strong>Cohorte:</strong> {{ est.cohorte }}</div>
          <div class="col-6 md:col-3"><strong>Periodo ingreso:</strong> {{ est.periodoIngreso }}</div>
          <div class="col-6 md:col-3"><strong>Semestre financiero:</strong> {{ est.semestreFinanciero }}</div>
          <div class="col-6 md:col-3"><strong>Semestre academico:</strong> {{ est.semestreAcademico }}</div>
        </div>
      </p-card>

      <!-- Tarjeta informacion financiera -->
      <p-card styleClass="mb-3" [style]="{ 'border-radius': '12px', 'box-shadow': '0px 2px 8px rgba(99,99,99,0.20)' }">
        <ng-template pTemplate="header">
          <div class="p-3" style="background-color: #000066; border-radius: 12px 12px 0 0;">
            <h3 style="color: #FFFFFF; font-family: 'Titillium Web', sans-serif; margin: 0;">
              Informacion Financiera
            </h3>
          </div>
        </ng-template>
        <div class="grid">
          <div class="col-6"><strong>Valor en SMLV:</strong> {{ est.valorEnSMLV | number:'1.2-2' }}</div>
          <div class="col-6">
            <strong>Estado de pago:</strong>
            <p-tag [value]="est.estaPago ? 'Al dia' : 'Pendiente'"
              [severity]="est.estaPago ? 'success' : 'warning'" [rounded]="true" class="ml-2">
            </p-tag>
          </div>
        </div>

        <!-- Becas y descuentos -->
        <p-table [value]="est.becasDescuentos" *ngIf="est.becasDescuentos?.length"
          styleClass="p-datatable-sm mt-3" [trackBy]="trackByBeca">
          <ng-template pTemplate="header">
            <tr>
              <th>Tipo</th><th>Porcentaje</th><th>Resolucion</th><th>Estado</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-beca>
            <tr>
              <td>{{ beca.tipo }}</td>
              <td>{{ beca.porcentaje | percent:'1.0-2' }}</td>
              <td>{{ beca.resolucion }}</td>
              <td>{{ beca.estado }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Materias matriculadas -->
      <p-card [style]="{ 'border-radius': '12px', 'box-shadow': '0px 2px 8px rgba(99,99,99,0.20)' }">
        <ng-template pTemplate="header">
          <div class="p-3" style="background-color: #000066; border-radius: 12px 12px 0 0;">
            <h3 style="color: #FFFFFF; font-family: 'Titillium Web', sans-serif; margin: 0;">
              Materias Matriculadas
            </h3>
          </div>
        </ng-template>
        <p-table [value]="est.materias" styleClass="p-datatable-sm" [trackBy]="trackByMateria">
          <ng-template pTemplate="header">
            <tr>
              <th>Codigo</th><th>Materia</th><th>Docente</th><th>Grupo</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-materia>
            <tr>
              <td>{{ materia.codigo_oid }}</td>
              <td>{{ materia.materia }}</td>
              <td>{{ materia.objDocente.nombre }} {{ materia.objDocente.apellido }}</td>
              <td>{{ materia.grupoClase }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </ng-container>
  </ng-container>
</div>
<p-toast position="top-right"></p-toast>
```

### GastosGeneralesDialogComponent — Estructura de template

```html
<p-dialog
  [visible]="visible"
  [header]="gasto ? 'Editar gasto general' : 'Nuevo gasto general'"
  [modal]="true"
  [style]="{ width: '480px', 'border-radius': '28px' }"
  [draggable]="false"
  (onHide)="cancelar.emit()">

  <form [formGroup]="form" class="flex flex-column gap-3 p-2">

    <div class="flex flex-column gap-1">
      <label for="categoria" style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        Categoria <span style="color: #FF6D0A;">*</span>
      </label>
      <input pInputText id="categoria" formControlName="categoria"
        placeholder="Ej. Servicios, Materiales"
        aria-label="Categoria del gasto general">
      <small *ngIf="form.get('categoria')?.invalid && form.get('categoria')?.touched"
        style="color: #FF6D0A; font-size: 12px;">
        La categoria es obligatoria.
      </small>
    </div>

    <div class="flex flex-column gap-1">
      <label for="descripcion" style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        Descripcion <span style="color: #FF6D0A;">*</span>
      </label>
      <input pInputText id="descripcion" formControlName="descripcion"
        placeholder="Descripcion del gasto"
        aria-label="Descripcion del gasto general">
      <small *ngIf="form.get('descripcion')?.invalid && form.get('descripcion')?.touched"
        style="color: #FF6D0A; font-size: 12px;">
        La descripcion es obligatoria.
      </small>
    </div>

    <div class="flex flex-column gap-1">
      <label for="monto" style="font-family: 'Open Sans', sans-serif; font-size: 14px;">
        Monto <span style="color: #FF6D0A;">*</span>
      </label>
      <p-inputNumber id="monto" formControlName="monto"
        mode="currency" currency="COP" locale="es-CO"
        [min]="0.01"
        aria-label="Monto del gasto general en pesos colombianos">
      </p-inputNumber>
      <small *ngIf="form.get('monto')?.invalid && form.get('monto')?.touched"
        style="color: #FF6D0A; font-size: 12px;">
        El monto debe ser un valor positivo.
      </small>
    </div>
  </form>

  <ng-template pTemplate="footer">
    <p-button
      label="Cancelar"
      styleClass="p-button-rounded p-button-outlined"
      aria-label="Cancelar y cerrar el dialogo"
      (onClick)="cancelar.emit()">
    </p-button>
    <p-button
      label="Guardar"
      styleClass="p-button-rounded"
      [loading]="loading"
      [disabled]="form.invalid"
      aria-label="Guardar el gasto general"
      (onClick)="onGuardar()">
    </p-button>
  </ng-template>
</p-dialog>
```

---
## Patrones RxJS a Aplicar

### 1. exhaustMap — Operaciones de guardado (evitar doble envio)

Se usa en todos los botones de guardado para ignorar clics adicionales mientras hay una operacion activa.

```typescript
// En MatriculaFinancieraComponent — Iniciar nueva matricula
private iniciarMatricula$ = new Subject<void>();

// Declarado en ngOnInit
this.iniciarMatricula$.pipe(
  exhaustMap(() =>
    this.facade.iniciarNuevaMatriculaFinanciera().pipe(
      tap(() => this.messageService.add({
        severity: 'success',
        summary: 'Matricula iniciada',
        detail: 'El proceso de matricula financiera se inicio correctamente.'
      })),
      catchError(err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al iniciar matricula',
          detail: 'No fue posible iniciar la matricula. Por favor, intente nuevamente.'
        });
        return EMPTY;
      })
    )
  ),
  takeUntil(this.destroy$)
).subscribe();

// En el template: (onClick)="iniciarMatricula$.next()"
```

```typescript
// En ProyeccionReporteComponent — Guardar cambio de proyeccion
private guardarProyeccion$ = new Subject<ProyeccionEstudianteDTOPeticion>();

this.guardarProyeccion$.pipe(
  exhaustMap(dto =>
    this.facade.actualizarProyeccionEstudiante(dto, tagPeriodo, anio).pipe(
      tap(data => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Estudiante actualizado correctamente.' });
      }),
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible guardar los cambios. Por favor, intente nuevamente.' });
        return EMPTY;
      })
    )
  ),
  takeUntil(this.destroy$)
).subscribe();
```

```typescript
// En GastosGeneralesDialogComponent — Guardar gasto
private guardarGasto$ = new Subject<GastoGeneralDTOPeticion>();

this.guardarGasto$.pipe(
  exhaustMap(dto =>
    this.operacion === 'crear'
      ? this.facade.crearGastoGeneral(this.periodoId, dto)
      : this.facade.actualizarGastoGeneral(this.gastoId, this.periodoId, dto)
  ),
  takeUntil(this.destroy$)
).subscribe({
  next: () => { this.guardar.emit(); },
  error: () => { /* mantener dialogo abierto, mostrar error */ }
});
```

### 2. switchMap — Busqueda con debounce

```typescript
// En MatriculaFinancieraComponent — Filtro de busqueda reactivo
private busqueda$ = new Subject<string>();

readonly estudiantesFiltrados$ = combineLatest({
  estudiantes: this.facade.estudiantes$,
  termino: this.busqueda$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('')
  )
}).pipe(
  map(({ estudiantes, termino }) => {
    if (!termino.trim()) return estudiantes;
    const t = termino.toLowerCase();
    return estudiantes.filter(e =>
      e.nombre.toLowerCase().includes(t) ||
      e.apellido.toLowerCase().includes(t) ||
      e.codigo.toLowerCase().includes(t)
    );
  })
);
```

### 3. takeUntil(destroy$) — Cleanup de suscripciones

Todos los componentes que usan suscripciones imperativas implementan el patron:

```typescript
export class MiComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.facade.vm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(vm => { /* solo si es necesario imperativo */ });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Regla:** Preferir `async pipe` en templates sobre suscripciones imperativas.
Solo usar `takeUntil` cuando se necesita logica imperativa en el componente.

### 4. async pipe — Suscripciones en templates

```html
<!-- Patron preferido: una sola suscripcion para todo el estado -->
<ng-container *ngIf="facade.vm$ | async as vm">
  <!-- vm.loading, vm.error, vm.estudiantes, vm.isEmpty disponibles -->
</ng-container>

<!-- Para listas con trackBy (obligatorio segun Req. 10.10) -->
<tr *ngFor="let item of vm.items; trackBy: trackById">
```

### 5. combineLatest — Composicion de estado

```typescript
// Patron para vm$ con estado derivado
readonly vm$ = combineLatest({
  loading: this.facade.loading$,
  error: this.facade.error$,
  reporte: this.facade.reporteProyeccionEstudiantes$
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.reporte === null,
    totalEstudiantes: vm.reporte?.estudiantes?.length ?? 0
  }))
);
```

---

## Cambios Necesarios en el Facade de Matricula Financiera

### Resumen de cambios

El `GestionMatriculaFinancieraFacadeService` actual no tiene `vm$`. Se deben agregar:

| Cambio | Tipo | Descripcion |
|--------|------|-------------|
| `vm$` | Observable | ViewModel para `MatriculaFinancieraComponent` |
| `vmDetalle$` | Observable | ViewModel para `DetalleEstudianteComponent` |
| `vmResumen$` | Observable | ViewModel para `ResumenMatriculaEstudianteComponent` |

### Codigo a agregar en facade.service.ts (matricula)

```typescript
// Agregar imports
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// Agregar despues de los BehaviorSubjects existentes:

readonly vm$ = combineLatest({
  loading: this._loading,
  error: this._error,
  estudiantes: this._estudiantes,
  periodos: this._periodos,
  periodoSeleccionado: this._periodoSeleccionadoFiltro
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.estudiantes.length === 0
  }))
);

readonly vmDetalle$ = combineLatest({
  loading: this._loading,
  error: this._error,
  estudiante: this._estudianteSeleccionado
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.estudiante === null
  }))
);

readonly vmResumen$ = combineLatest({
  loading: this._loading,
  error: this._error,
  estudiante: this._estudianteSeleccionado,
  periodos: this._periodos
}).pipe(
  map(vm => ({
    ...vm,
    isEmpty: !vm.loading && vm.estudiante === null
  }))
);
```

**Nota:** No se modifican los BehaviorSubjects existentes ni los metodos del Facade.
Solo se agregan los tres `vm$` como propiedades de solo lectura.

---

## Correctness Properties

*Una propiedad es una caracteristica o comportamiento que debe ser verdadero en todas las ejecuciones
validas de un sistema — esencialmente, una declaracion formal sobre lo que el sistema debe hacer.
Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantias
de corrección verificables por maquina.*

### Property 1: Mapper round-trip de Estudiante preserva identidad

*Para todo* `EstudianteDTORespuesta` valido `dto`, el resultado de
`mapper.mappearDeRespuestaAEstudiante(dto)` debe preservar el campo `codigo` identico al original,
y todos los campos obligatorios del modelo `Estudiante` deben estar definidos (sin `undefined`).

**Validates: Requirements 11.4, 11.5**

### Property 2: Mapper round-trip de ReporteProyeccionEstudiantes preserva longitud

*Para todo* `ReporteProyeccionEstudiantesDTORespuesta` valido `dto`,
`mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto).estudiantes.length`
debe ser igual a `dto.estudiantes.length`.

**Validates: Requirements 11.4, 11.5**

### Property 3: Facade emite estado antes de completar el Observable

*Para toda* operacion del `GestionMatriculaFinancieraFacadeService` que modifica estado
(obtenerEstudiantes, obtenerEstudiante, obtenerPeriodosAcademicos), el `BehaviorSubject`
correspondiente debe emitir el nuevo valor ANTES de que el Observable complete.

**Validates: Requirements 11.6**

### Property 4: Estado vacio correcto en vm$

*Para todo* estado del Facade donde `estudiantes.length === 0` y `loading === false`,
`vm$.isEmpty` debe ser `true`. Inversamente, cuando `estudiantes.length > 0`,
`vm$.isEmpty` debe ser `false` independientemente del valor de `loading`.

**Validates: Requirements 1.9, 2.7, 3.7**

### Property 5: Colores semanticos de estado de matricula

*Para todo* valor de `EstadoMatricula`, la funcion `getEstadoMatriculaSeverity()` debe retornar:
- `'success'` para `AL_DIA`, `EXONERADO`, `BECADO`
- `'warning'` para `PENDIENTE`, `MORA`
- `'secondary'` para `ANULADO`

**Validates: Requirements 1.11, 10.1**

### Property 6: Filtro de busqueda retorna subconjunto valido

*Para toda* lista de estudiantes y todo termino de busqueda no vacio, todos los elementos
del resultado filtrado deben contener el termino en su `nombre`, `apellido` o `codigo`
(comparacion case-insensitive). El resultado filtrado es siempre un subconjunto de la lista original.

**Validates: Requirements 1.6**

### Property 7: Validacion de gasto general rechaza entradas invalidas

*Para todo* `GastoGeneralDTOPeticion` con `categoria` vacia, `descripcion` vacia o `monto <= 0`,
la validacion del formulario debe retornar `invalid`. Para todo gasto con los tres campos
validos (categoria no vacia, descripcion no vacia, monto > 0), la validacion debe retornar `valid`.

**Validates: Requirements 7.2, 7.3**

### Property 8: Nombre de archivo Excel sigue el formato especificado

*Para todo* par valido de `(anio: number, tagPeriodo: number)`, el nombre del archivo Excel
generado para el reporte financiero debe ser exactamente `reporte-financiero-{anio}-{tagPeriodo}.xlsx`,
y para el reporte por grupos debe ser exactamente `reporte-grupos-{anio}.xlsx`.

**Validates: Requirements 8.3**

---

## Error Handling

### Estrategia general de manejo de errores

Todos los errores siguen el patron institucional de ustedeo: siempre proponer una solucion.

| Tipo de error | Severidad PrimeNG | Color | Patron de mensaje |
|--------------|-------------------|-------|-------------------|
| Error HTTP generico | `error` | `#FF6D0A` | "No fue posible [accion]. Por favor, intente nuevamente." |
| Error HTTP 404 | `info` | `#1D72D3` | "No se encontro [recurso] para el periodo seleccionado." |
| Error de validacion | Inline (campo) | `#FF6D0A` | "[Campo] es obligatorio." / "[Campo] debe ser [condicion]." |
| Exito de operacion | `success` | `#5BAE40` | "[Accion] realizada correctamente." |
| Advertencia | `warning` | `#FFB000` | "Tenga en cuenta que [condicion]." |

### Manejo de errores en el Facade

El Facade ya implementa el patron correcto:
1. `_loading.next(true)` al inicio
2. `_error.next(null)` al inicio (reset)
3. `catchError` captura y emite en `_error`
4. `finalize` siempre ejecuta `_loading.next(false)`

Los componentes consumen `vm$.error` via `async pipe` y muestran el mensaje correspondiente.

### Manejo de errores en componentes Dumb

Los componentes Dumb (GastosGeneralesDialogComponent, PeriodoFinancieroSelectorComponent)
no manejan errores directamente. Emiten eventos al padre via `@Output` y el Smart Component
es responsable del manejo de errores.

### Mensajes de error especificos por operacion

```typescript
// Mensajes de error institucionales (ustedeo)
const MENSAJES_ERROR = {
  cargarEstudiantes: 'No fue posible cargar las matriculas financieras. Por favor, intente nuevamente o contacte al administrador.',
  cargarPeriodos: 'No fue posible cargar los periodos academicos. Por favor, intente nuevamente.',
  cargarDetalle: 'No fue posible cargar el detalle del estudiante. Por favor, intente nuevamente.',
  iniciarMatricula: 'No fue posible iniciar el proceso de matricula. Por favor, intente nuevamente.',
  actualizarProyeccion: 'No fue posible guardar los cambios de la proyeccion. Por favor, intente nuevamente.',
  cargarReporte: 'No fue posible cargar el reporte financiero. Por favor, intente nuevamente.',
  cargarReporteGrupos: 'No fue posible cargar el reporte por grupos. Por favor, intente nuevamente.',
  crearGasto: 'No fue posible registrar el gasto general. Por favor, verifique los datos e intente nuevamente.',
  actualizarGasto: 'No fue posible actualizar el gasto general. Por favor, intente nuevamente.',
  eliminarGasto: 'No fue posible eliminar el gasto general. Por favor, intente nuevamente.',
  descargarExcel: 'No fue posible generar el archivo Excel. Por favor, asegurese de que el reporte este cargado e intente nuevamente.',
};
```

---

## Testing Strategy

### Enfoque dual: pruebas unitarias + pruebas basadas en propiedades

Se aplica un enfoque de doble cobertura:
- **Pruebas unitarias (Jasmine/Karma)**: ejemplos especificos, casos borde, flujos de error
- **Pruebas basadas en propiedades (fast-check)**: propiedades universales con 100+ iteraciones

### Libreria de PBT: fast-check

```bash
npm install --save-dev fast-check
```

fast-check es la libreria de property-based testing para TypeScript/JavaScript mas madura,
con soporte nativo para generadores de tipos TypeScript y shrinking automatico.

### Estructura de archivos de prueba

```
gestion-matricula-financiera/
├── data/
│   ├── facade.service.spec.ts      [pruebas unitarias del Facade]
│   └── mapper.service.spec.ts      [pruebas unitarias + PBT del Mapper]
└── feature/
    ├── matricula-financiera/
    │   └── matricula-financiera.component.spec.ts
    ├── detalle-estudiante/
    │   └── detalle-estudiante.component.spec.ts
    └── resumen-matricula-estudiante/
        └── resumen-matricula-estudiante.component.spec.ts

gestion-informacion-presupuestaria/
├── data/
│   ├── facade.service.spec.ts      [pruebas unitarias del Facade]
│   └── mapper.service.spec.ts      [pruebas unitarias + PBT del Mapper]
└── feature/
    ├── proyeccion-reporte/
    │   └── proyeccion-reporte.component.spec.ts
    ├── reporte-final/
    │   └── reporte-final.component.spec.ts
    ├── reporte-por-grupos/
    │   └── reporte-por-grupos.component.spec.ts
    └── gastos-generales-dialog/
        └── gastos-generales-dialog.component.spec.ts
```

### Pruebas basadas en propiedades — Implementacion

Cada propiedad de corrección se implementa con un unico test de fast-check con minimo 100 iteraciones.

```typescript
// mapper.service.spec.ts — Property 1: Mapper round-trip de Estudiante
import fc from 'fast-check';

describe('GestionMatriculaFinancieraMapperService', () => {
  // Feature: matricula-financiera-info-presupuestaria, Property 1: Mapper round-trip de Estudiante preserva identidad
  it('P1: para todo EstudianteDTORespuesta valido, el mapper preserva codigo y no produce undefined en campos obligatorios', () => {
    fc.assert(
      fc.property(
        fc.record({
          codigo: fc.string({ minLength: 1 }),
          nombre: fc.string({ minLength: 1 }),
          apellido: fc.string({ minLength: 1 }),
          identificacion: fc.integer({ min: 1 }),
          cohorte: fc.integer({ min: 1 }),
          periodoIngreso: fc.string({ minLength: 1 }),
          semestreFinanciero: fc.integer({ min: 1 }),
          becasDescuentos: fc.array(fc.record({
            resolucion: fc.string(),
            porcentaje: fc.float({ min: 0, max: 1 }),
            tipo: fc.string(),
            estado: fc.string(),
            avaladoConcejo: fc.option(fc.string(), { nil: null })
          })),
          materias: fc.array(fc.record({
            codigoOid: fc.string(),
            materia: fc.string(),
            grupoClase: fc.string(),
            docente: fc.option(fc.record({ nombre: fc.string(), apellido: fc.string() }), { nil: undefined })
          }))
        }),
        (dto) => {
          const result = mapper.mappearDeRespuestaAEstudiante(dto as any);
          // Preserva codigo
          expect(result.codigo).toBe(dto.codigo);
          // Campos obligatorios no son undefined
          expect(result.nombre).toBeDefined();
          expect(result.apellido).toBeDefined();
          expect(result.identificacion).toBeDefined();
          expect(result.semestreFinanciero).toBeDefined();
          expect(result.becasDescuentos).toBeDefined();
          expect(result.materias).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

```typescript
// mapper.service.spec.ts — Property 2: Mapper round-trip de ReporteProyeccionEstudiantes
// Feature: matricula-financiera-info-presupuestaria, Property 2: Mapper round-trip de ReporteProyeccionEstudiantes preserva longitud
it('P2: para todo ReporteProyeccionEstudiantesDTORespuesta, la longitud de estudiantes se preserva', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        codigoEstudiante: fc.string({ minLength: 1 }),
        nombre: fc.string(),
        apellido: fc.string(),
        identificacion: fc.string(),
        estaPago: fc.boolean(),
        aplicaVotacion: fc.boolean(),
        porcentajeBeca: fc.float({ min: 0, max: 1 }),
        aplicaEgresado: fc.boolean(),
        grupoInvestigacion: fc.string(),
        materias: fc.array(fc.record({ codigo: fc.string(), nombre: fc.string(), creditos: fc.integer() }))
      })),
      (estudiantes) => {
        const dto = buildReporteDto(estudiantes);
        const result = mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto);
        expect(result.estudiantes.length).toBe(dto.estudiantes.length);
      }
    ),
    { numRuns: 100 }
  );
});
```

```typescript
// facade.service.spec.ts — Property 3: Facade emite estado antes de completar
// Feature: matricula-financiera-info-presupuestaria, Property 3: Facade emite estado antes de completar el Observable
it('P3: obtenerEstudiantes emite en _estudiantes antes de completar el Observable', (done) => {
  fc.assert(
    fc.asyncProperty(
      fc.array(fc.record({ codigo: fc.string({ minLength: 1 }), nombre: fc.string(), apellido: fc.string() })),
      async (estudiantesData) => {
        const emisionesAntesDel Complete: Estudiante[][] = [];
        let completado = false;

        apiServiceMock.obtenerEstudiantes.and.returnValue(of(estudiantesData));

        facade.estudiantes$.pipe(skip(1), takeUntil(facade.loading$.pipe(filter(l => !l), skip(1)))).subscribe(e => {
          if (!completado) emisionesAntesDel Complete.push(e);
        });

        await facade.obtenerEstudiantes(periodoMock).toPromise();
        completado = true;

        expect(emisionesAntesDel Complete.length).toBeGreaterThan(0);
      }
    ),
    { numRuns: 20 }
  );
});
```

```typescript
// facade.service.spec.ts — Property 4: Estado vacio correcto en vm$
// Feature: matricula-financiera-info-presupuestaria, Property 4: Estado vacio correcto en vm$
it('P4: vm$.isEmpty es true cuando estudiantes esta vacio y loading es false', (done) => {
  fc.assert(
    fc.property(
      fc.boolean(), // loading
      fc.array(fc.record({ codigo: fc.string({ minLength: 1 }), nombre: fc.string(), apellido: fc.string() })),
      (loading, estudiantes) => {
        facade['_loading'].next(loading);
        facade['_estudiantes'].next(estudiantes as any);

        facade.vm$.pipe(take(1)).subscribe(vm => {
          const expectedIsEmpty = !loading && estudiantes.length === 0;
          expect(vm.isEmpty).toBe(expectedIsEmpty);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

```typescript
// Funcion pura testeable — Property 5: Colores semanticos de estado
// Feature: matricula-financiera-info-presupuestaria, Property 5: Colores semanticos de estado de matricula
describe('getEstadoMatriculaSeverity', () => {
  it('P5: para todo EstadoMatricula, retorna el severity semantico correcto', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('AL_DIA', 'EXONERADO', 'BECADO', 'PENDIENTE', 'MORA', 'ANULADO'),
        (estado: EstadoMatricula) => {
          const severity = getEstadoMatriculaSeverity(estado);
          if (['AL_DIA', 'EXONERADO', 'BECADO'].includes(estado)) {
            expect(severity).toBe('success');
          } else if (['PENDIENTE', 'MORA'].includes(estado)) {
            expect(severity).toBe('warning');
          } else if (estado === 'ANULADO') {
            expect(severity).toBe('secondary');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

```typescript
// Property 6: Filtro de busqueda retorna subconjunto valido
// Feature: matricula-financiera-info-presupuestaria, Property 6: Filtro de busqueda retorna subconjunto valido
it('P6: para toda lista de estudiantes y termino de busqueda, el resultado es subconjunto valido', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        codigo: fc.string({ minLength: 1 }),
        nombre: fc.string({ minLength: 1 }),
        apellido: fc.string({ minLength: 1 })
      })),
      fc.string({ minLength: 1 }),
      (estudiantes, termino) => {
        const resultado = filtrarEstudiantes(estudiantes as any, termino);
        // Es subconjunto
        resultado.forEach(e => expect(estudiantes).toContain(e));
        // Todos contienen el termino
        const t = termino.toLowerCase();
        resultado.forEach(e => {
          const contiene = e.nombre.toLowerCase().includes(t) ||
                          e.apellido.toLowerCase().includes(t) ||
                          e.codigo.toLowerCase().includes(t);
          expect(contiene).toBeTrue();
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

```typescript
// Property 7: Validacion de gasto general
// Feature: matricula-financiera-info-presupuestaria, Property 7: Validacion de gasto general rechaza entradas invalidas
it('P7: para todo gasto con campos invalidos, la validacion retorna invalid', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        // Categoria vacia
        fc.record({ categoria: fc.constant(''), descripcion: fc.string({ minLength: 1 }), monto: fc.float({ min: 0.01 }) }),
        // Descripcion vacia
        fc.record({ categoria: fc.string({ minLength: 1 }), descripcion: fc.constant(''), monto: fc.float({ min: 0.01 }) }),
        // Monto invalido
        fc.record({ categoria: fc.string({ minLength: 1 }), descripcion: fc.string({ minLength: 1 }), monto: fc.float({ max: 0 }) })
      ),
      (gasto) => {
        const form = buildGastoForm(gasto);
        expect(form.valid).toBeFalse();
      }
    ),
    { numRuns: 100 }
  );
});
```

```typescript
// Property 8: Nombre de archivo Excel
// Feature: matricula-financiera-info-presupuestaria, Property 8: Nombre de archivo Excel sigue el formato especificado
it('P8: para todo par (anio, tagPeriodo), el nombre del archivo sigue el formato correcto', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 2020, max: 2030 }),
      fc.integer({ min: 1, max: 2 }),
      (anio, tagPeriodo) => {
        const nombreFinanciero = generarNombreArchivoFinanciero(anio, tagPeriodo);
        const nombreGrupos = generarNombreArchivoGrupos(anio);
        expect(nombreFinanciero).toBe(`reporte-financiero-${anio}-${tagPeriodo}.xlsx`);
        expect(nombreGrupos).toBe(`reporte-grupos-${anio}.xlsx`);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Pruebas unitarias complementarias

Ademas de las propiedades, se incluyen pruebas unitarias para:

- **Facade**: carga exitosa de estudiantes, manejo de error HTTP, reset de estado entre operaciones
- **Mapper**: mapeo de campos opcionales (undefined/null), mapeo de listas vacias
- **Componentes**: renderizado de estados (loading, error, vacio, datos), interacciones de usuario
- **GastosGeneralesDialogComponent**: pre-poblado en modo edicion, emision de eventos correctos

### Cobertura objetivo

| Archivo | Cobertura minima |
|---------|-----------------|
| `facade.service.ts` (matricula) | 80% |
| `mapper.service.ts` (matricula) | 80% |
| `facade.service.ts` (presupuestaria) | 80% |
| `mapper.service.ts` (presupuestaria) | 80% |
| Componentes Smart | 70% |
| Componentes Dumb | 80% |

---

## Decisiones de Diseno

### D1: vm$ en el Facade vs vm$ en el componente

**Decision:** Agregar `vm$` directamente al Facade de matricula.

**Razon:** El Facade ya tiene todos los BehaviorSubjects necesarios. Agregar `vm$` al Facade
permite que multiples componentes compartan el mismo estado combinado sin duplicar logica.
Ademas, facilita las pruebas unitarias del Facade de forma aislada.

### D2: No crear componentes Dumb adicionales en matricula

**Decision:** Los componentes de matricula son todos Smart (no se crean Dumb separados).

**Razon:** La estructura de las vistas de matricula es suficientemente simple para no justificar
la separacion Smart/Dumb. Los tres componentes (listado, detalle, resumen) son vistas completas
con logica de estado propia. Crear Dumb adicionales aumentaria la complejidad sin beneficio real.

### D3: exhaustMap en Subject vs en el template

**Decision:** Usar `Subject` + `exhaustMap` en el componente, no `(click)` directo.

**Razon:** El patron `Subject.pipe(exhaustMap(...))` es mas testeable y declarativo que
manejar el estado de "guardando" con variables booleanas locales. Permite cancelar operaciones
en curso de forma limpia y evita doble envio sin necesidad de deshabilitar botones manualmente.

### D4: Funcion pura getEstadoMatriculaSeverity

**Decision:** Extraer la logica de mapeo de estado a una funcion pura exportable.

**Razon:** Una funcion pura es directamente testeable con property-based testing (Property 5).
Si estuviera embebida en el componente como metodo, seria mas dificil de testear de forma aislada.

### D5: Validacion de formulario con ReactiveFormsModule

**Decision:** Usar `ReactiveFormsModule` en `GastosGeneralesDialogComponent`.

**Razon:** Los formularios reactivos son mas testeables que los template-driven. Permiten
validar el estado del formulario de forma programatica (Property 7) y son el patron
recomendado en la arquitectura hexagonal Pattern B del proyecto.

---
