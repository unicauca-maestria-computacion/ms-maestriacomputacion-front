# Plan de Implementación: Matrícula Financiera e Información Presupuestaria

## Descripción general

Implementar la capa de presentación completa de los módulos `gestion-matricula-financiera` y
`gestion-informacion-presupuestaria`, siguiendo la arquitectura hexagonal Pattern B, el Sistema
de Diseño Unicauca 2026 y los lineamientos de accesibilidad WCAG 2.1 AA.

La capa de datos (ApiService, MapperService, DTOs, modelos de dominio, routing) ya existe y no
debe modificarse. El trabajo consiste en agregar ViewModels (vm$) a los Facades, implementar
los componentes vacíos y refactorizar los existentes al patrón vm$.

**Lenguaje:** TypeScript (Angular 13)
**Framework de pruebas:** Jasmine/Karma + fast-check (PBT)

---

## Tareas

- [x] 1. Crear función pura `getEstadoMatriculaSeverity` y sus pruebas
  - [x] 1.1 Crear el archivo `estado-matricula.utils.ts` en `gestion-matricula-financiera/utils/`
    - Exportar la función `getEstadoMatriculaSeverity(estado: EstadoMatricula | string | undefined): 'success' | 'warning' | 'secondary' | 'info'`
    - Implementar el switch con los casos: `AL_DIA`/`EXONERADO`/`BECADO` → `'success'`; `PENDIENTE`/`MORA` → `'warning'`; `ANULADO` → `'secondary'`; default → `'info'`
    - _Requisitos: 1.11, 10.1_

  - [ ]* 1.2 Escribir prueba de propiedad para `getEstadoMatriculaSeverity`
    - **Propiedad 5: Colores semánticos de estado de matrícula**
    - Usar fast-check: generar valores arbitrarios de `EstadoMatricula` y verificar que el severity retornado sea siempre uno de los cuatro valores válidos
    - Verificar exhaustivamente los 6 estados conocidos con ejemplos concretos
    - **Valida: Requisitos 1.11, 10.1**

- [x] 2. Agregar ViewModels (vm$) al `GestionMatriculaFinancieraFacadeService`
  - [x] 2.1 Modificar `gestion-matricula-financiera/data/facade.service.ts`
    - Agregar imports: `combineLatest` de `rxjs` y `map` de `rxjs/operators`
    - Agregar `readonly vm$` con `combineLatest({ loading, error, estudiantes, periodos, periodoSeleccionado })` y campo derivado `isEmpty: !vm.loading && vm.estudiantes.length === 0`
    - Agregar `readonly vmDetalle$` con `combineLatest({ loading, error, estudiante })` y `isEmpty: !vm.loading && vm.estudiante === null`
    - Agregar `readonly vmResumen$` con `combineLatest({ loading, error, estudiante, periodos })` y `isEmpty: !vm.loading && vm.estudiante === null`
    - No modificar BehaviorSubjects ni métodos existentes
    - _Requisitos: 1.3, 2.6, 2.11, 3.8, 3.9, 11.6_

  - [ ]* 2.2 Escribir prueba de propiedad para el Facade de matrícula (vm$)
    - **Propiedad 3: Facade emite estado antes de completar el Observable**
    - Usar fast-check: para operaciones `obtenerEstudiantes`, `obtenerEstudiante`, `obtenerPeriodosAcademicos`, verificar que el BehaviorSubject correspondiente emite el nuevo valor antes de que el Observable complete
    - **Propiedad 4: Estado vacío correcto en vm$**
    - Verificar que `vm$.isEmpty === true` cuando `estudiantes.length === 0 && loading === false`
    - Verificar que `vm$.isEmpty === false` cuando `estudiantes.length > 0`
    - **Valida: Requisitos 11.1, 11.6, 1.9**

- [x] 3. Refactorizar `MatriculaFinancieraComponent` al patrón vm$
  - [x] 3.1 Reescribir `matricula-financiera.component.ts`
    - Eliminar estado local `estudiantes`, `estudiantesFiltrados`, `periodos`, `periodosDropdown` — reemplazar con `vm$ | async`
    - Agregar `busqueda$: Subject<string>` y `estadoFiltro$: BehaviorSubject<string>` para filtros reactivos
    - Implementar `estudiantesFiltrados$` con `combineLatest({ estudiantes: facade.estudiantes$, termino: busqueda$.pipe(debounceTime(300), distinctUntilChanged(), startWith('')) })` y filtro case-insensitive por nombre/apellido/código
    - Agregar filtro por estado de matrícula usando `getEstadoMatriculaSeverity` importado desde `utils/`
    - Implementar `iniciarMatricula$: Subject<void>` con `exhaustMap` para evitar doble envío
    - Inyectar `ConfirmationService` y `MessageService`; implementar `confirmarIniciarMatricula()` con diálogo de confirmación en ustedeo
    - Agregar `trackByEstudiante(index, e): string { return e.codigo; }`
    - Mantener `ChangeDetectionStrategy.OnPush`
    - _Requisitos: 1.1–1.15, 10.6, 10.10_

  - [x] 3.2 Reescribir `matricula-financiera.component.html`
    - Aplicar patrón base `<ng-container *ngIf="vm$ | async as vm">` con estados: cargando (p-progressSpinner), error (p-message con ustedeo), vacío (ícono + mensaje), datos
    - Encabezado con `color: #000066`, tipografía Titillium Web
    - Tres filtros en grid: selector de período (p-dropdown), búsqueda (pInputText con debounce), selector de estado (p-dropdown con opciones de `EstadoMatricula`)
    - Tabla p-table con encabezado `background-color: #000066`, columnas: código, nombre, semestre, valor SMLV, estado (p-tag con severity de `getEstadoMatriculaSeverity`), acciones
    - `trackBy`, `aria-label` en todos los botones de acción
    - Botón "Iniciar nueva matrícula" con `p-button-rounded`, visible solo para coordinador
    - `p-confirmDialog` con `border-radius: 28px` y textos en ustedeo
    - `p-toast position="top-right"`
    - _Requisitos: 1.1–1.15, 10.1–10.10_

  - [ ]* 3.3 Escribir prueba de propiedad para el filtro de búsqueda
    - **Propiedad 6: Filtro de búsqueda retorna subconjunto válido**
    - Usar fast-check: generar listas arbitrarias de estudiantes y términos de búsqueda; verificar que el resultado siempre es subconjunto de la lista original y que todos los elementos contienen el término en nombre/apellido/código
    - **Valida: Requisito 1.6**

- [x] 4. Implementar `DetalleEstudianteComponent` con patrón vm$
  - [x] 4.1 Reescribir `detalle-estudiante.component.ts`
    - Reemplazar estado local `estudiante: Estudiante | null` y `loading: boolean` con `vmDetalle$ = this.facade.vmDetalle$`
    - En `ngOnInit`, suscribirse a `route.paramMap` con `switchMap` para llamar `facade.obtenerEstudiante(id)` al cambiar el parámetro
    - Implementar `volverAlListado()` que navega a `/gestion-matricula-financiera`
    - Agregar `trackByBeca`, `trackByMateria` para los `*ngFor`
    - Mantener `ChangeDetectionStrategy.OnPush` y `takeUntil(destroy$)`
    - _Requisitos: 2.1–2.11_

  - [x] 4.2 Implementar `detalle-estudiante.component.html`
    - Aplicar patrón base con `vmDetalle$ | async as vm`
    - Botón "Volver al listado" con `p-button-text p-button-rounded` y `aria-label`
    - Estado cargando: p-progressSpinner centrado
    - Estado error: p-message con texto en ustedeo y propuesta de solución
    - Estado vacío (404): ícono `person_off`, mensaje en ustedeo, botón volver
    - Estado datos: h2 con nombre del estudiante (color `#000066`, Titillium Web)
    - Tarjeta "Información Personal" con p-card (`border-radius: 12px`, encabezado `#000066`): código, identificación, cohorte, período ingreso, semestre financiero, semestre académico
    - Tarjeta "Información Financiera": valor SMLV, estado de pago (p-tag), tabla de becas/descuentos con `trackBy`
    - Tarjeta "Materias Matriculadas": tabla con columnas código, materia, docente, grupo; `trackBy`
    - `p-toast position="top-right"`
    - _Requisitos: 2.1–2.11, 10.1–10.10_

- [x] 5. Refactorizar `ResumenMatriculaEstudianteComponent` al patrón vm$
  - [x] 5.1 Reescribir `resumen-matricula-estudiante.component.ts`
    - Reemplazar estado local `estudiante` y `periodoActual` con `vmResumen$ = this.facade.vmResumen$`
    - Simplificar `cargarDatosIniciales()`: llamar `facade.obtenerPeriodosAcademicos()` y luego `facade.obtenerEstudiante(id)` con `switchMap`; manejar error 404 sin redirigir (mostrar estado vacío)
    - Mantener `solicitarRevision()` con `RadicarService` y código `RE_MATR`
    - Mantener `ChangeDetectionStrategy.OnPush` y `takeUntil(destroy$)`
    - _Requisitos: 3.1–3.10_

  - [x] 5.2 Implementar `resumen-matricula-estudiante.component.html`
    - Aplicar patrón base con `vmResumen$ | async as vm`
    - Encabezado con p-tag del período activo (extraído de `vm.periodos[0]`)
    - Estado cargando: p-progressSpinner
    - Estado vacío: mensaje en ustedeo; botón "Solicitar Revisión" siempre visible
    - Estado datos: p-card con valor SMLV, estado de pago con ícono y texto descriptivo en ustedeo ("Su matrícula está al día" / "Su matrícula tiene un saldo pendiente")
    - Tabla de becas/descuentos con `trackBy`
    - Tabla de materias matriculadas con `trackBy`
    - Botón "Solicitar Revisión" siempre visible (`p-button-rounded`, `aria-label`)
    - `p-toast position="top-right"`
    - _Requisitos: 3.1–3.10, 10.1–10.10_

- [x] 6. Checkpoint — Módulo matrícula financiera completo
  - Verificar que todos los tests del módulo `gestion-matricula-financiera` pasan.
  - Verificar que `vm$`, `vmDetalle$` y `vmResumen$` están disponibles en el Facade.
  - Preguntar al usuario si hay ajustes antes de continuar con el módulo presupuestario.

- [ ] 7. Agregar ViewModels (vm$) al `GestionInformacionPresupuestariaFacadeService`
  - [x] 7.1 Modificar `gestion-informacion-presupuestaria/data/facade.service.ts`
    - Agregar `readonly vmProyeccion$` con `combineLatest({ loading, error, reporte: _reporteProyeccionEstudiantes })` y `isEmpty: !vm.loading && vm.reporte === null`
    - Agregar `readonly vmGrupos$` con `combineLatest({ loading, error, reporte: _reporteGrupos })` y `isEmpty: !vm.loading && vm.reporte === null`
    - No modificar BehaviorSubjects ni métodos existentes
    - _Requisitos: 4.12, 5.12, 6.17, 11.6_

  - [ ]* 7.2 Escribir prueba de propiedad para el Facade de presupuestaria (vmProyeccion$)
    - **Propiedad 3 (presupuestaria): Facade emite estado antes de completar el Observable**
    - Verificar que `_reporteProyeccionEstudiantes` emite el nuevo valor antes de que `obtenerProyeccionEstudiantes` complete
    - Verificar que `vmProyeccion$.isEmpty === true` cuando `reporte === null && loading === false`
    - **Valida: Requisito 11.6**

- [x] 8. Implementar `PeriodoFinancieroSelectorComponent` (Dumb)
  - [x] 8.1 Implementar `periodo-financiero-selector.component.ts`
    - Declarar `@Input() periodos: PeriodoAcademicoDto[] = []`
    - Declarar `@Input() periodoSeleccionado: PeriodoAcademicoDto | null = null`
    - Declarar `@Input() disabled: boolean = false`
    - Declarar `@Output() periodoChange = new EventEmitter<PeriodoAcademicoDto>()`
    - Agregar método `onCambio(periodo: PeriodoAcademicoDto): void { this.periodoChange.emit(periodo); }`
    - Aplicar `ChangeDetectionStrategy.OnPush`
    - _Requisitos: 4.1, 5.1_

  - [x] 8.2 Implementar `periodo-financiero-selector.component.html`
    - Un único `p-dropdown` con `[options]="periodos"`, `[(ngModel)]="periodoSeleccionado"`, `[disabled]="disabled"`, `(onChange)="onCambio($event.value)"`
    - `optionLabel` mostrando `año-tagPeriodo`
    - `aria-label="Selector de período financiero"`
    - _Requisitos: 4.1, 5.1_

- [ ] 9. Refactorizar `ProyeccionReporteComponent` al patrón vm$
  - [x] 9.1 Reescribir `proyeccion-reporte.component.ts`
    - Reemplazar estado local `cargando`, `guardando`, `configuracion`, `estudiantes` con `vmProyeccion$ = this.facade.vmProyeccion$`
    - Agregar `guardarProyeccion$: Subject<ProyeccionEstudianteDTOPeticion>` con `exhaustMap` para evitar doble guardado
    - Agregar `guardarConfig$: Subject<ConfiguracionReporteFinancieroDTOPeticion>` con `exhaustMap` para guardar configuración
    - Mantener lógica de edición en línea (`onRowEditInit`, `onRowEditSave`, `onRowEditCancel`) y `clonedEstudiantes`
    - Mantener `trackByEstudiante`, `ChangeDetectionStrategy.OnPush`, `takeUntil(destroy$)`
    - Usar `PeriodoFinancieroSelectorComponent` para el selector de período
    - _Requisitos: 4.1–4.12_

  - [x] 9.2 Actualizar `proyeccion-reporte.component.html`
    - Reemplazar variables locales de carga/error por patrón `vmProyeccion$ | async as vm`
    - Integrar `<app-periodo-financiero-selector>` con `[periodos]`, `[periodoSeleccionado]`, `[disabled]="vm.loading"`, `(periodoChange)="onPeriodoChange($event)"`
    - Mantener panel de configuración colapsable (p-panel) con campos p-inputNumber
    - Mantener tabla de proyección con edición en línea, p-tag de estado con `getEstadoMatriculaSeverity`
    - Aplicar encabezado de tabla `#000066`, `trackBy`, `aria-label` en botones
    - `p-toast position="top-right"`
    - _Requisitos: 4.1–4.12, 10.1–10.10_

- [x] 10. Implementar `ReporteFinalComponent`
  - [x] 10.1 Implementar `reporte-final.component.ts`
    - Declarar `vmProyeccion$ = this.facade.vmProyeccion$`
    - En `ngOnInit`, cargar períodos activos y cerrados con `facade.obtenerPeriodosActivosYCerrados()`
    - Implementar `onPeriodoChange(periodo)` que llama `facade.obtenerReporteFinanciero(tagPeriodo, anio)`
    - Implementar `descargarExcel()` que usa `ExcelService` con los datos del reporte actual; nombre de archivo `reporte-financiero-{anio}-{tagPeriodo}.xlsx`
    - Mostrar mensaje en ustedeo si no hay datos al intentar descargar
    - Mantener `ChangeDetectionStrategy.OnPush`, `takeUntil(destroy$)`
    - _Requisitos: 5.1–5.12, 8.1, 8.3, 8.4, 8.6_

  - [x] 10.2 Implementar `reporte-final.component.html`
    - Patrón base con `vmProyeccion$ | async as vm`
    - `<app-periodo-financiero-selector>` para selección de período
    - Panel de configuración (p-panel): solo lectura o editable según estado del período
    - Tabla del reporte: columnas nombre, identificación, grupo, valor SMLV, descuentos, valor neto; encabezado `#000066`; fila de totales al pie; `trackBy`
    - Botón "Descargar Excel" con `p-button-rounded`, `aria-label`
    - Estados: cargando, error (ustedeo), vacío (ustedeo), datos
    - `p-toast position="top-right"`
    - _Requisitos: 5.1–5.12, 8.1–8.6, 10.1–10.10_

- [x] 11. Implementar `GastosGeneralesDialogComponent` (Dumb)
  - [x] 11.1 Implementar `gastos-generales-dialog.component.ts`
    - Declarar `@Input() visible: boolean = false`
    - Declarar `@Input() gasto: GastoGeneral | null = null` (null = modo creación)
    - Declarar `@Input() loading: boolean = false`
    - Declarar `@Output() guardar = new EventEmitter<GastoGeneralDTOPeticion>()`
    - Declarar `@Output() cancelar = new EventEmitter<void>()`
    - Crear `FormGroup` con `FormControl` para `categoria` (required), `descripcion` (required), `monto` (required, min: 0.01)
    - En `ngOnChanges`, pre-poblar el formulario cuando `gasto !== null`
    - Implementar `onGuardar()`: si `form.valid`, emitir `guardar` con los valores del formulario
    - Aplicar `ChangeDetectionStrategy.OnPush`
    - _Requisitos: 7.1–7.8_

  - [x] 11.2 Implementar `gastos-generales-dialog.component.html`
    - `p-dialog` con `[visible]="visible"`, `[modal]="true"`, `[style]="{ width: '480px', 'border-radius': '28px' }"`, `(onHide)="cancelar.emit()"`
    - Header dinámico: "Editar gasto general" / "Nuevo gasto general" según `gasto`
    - Formulario reactivo con tres campos: categoría (pInputText), descripción (pInputText), monto (p-inputNumber, mode="currency", currency="COP")
    - Mensajes de validación en color `#FF6D0A` con texto en ustedeo, visibles al tocar el campo
    - Footer: botón "Cancelar" (`p-button-rounded p-button-outlined`) y "Guardar" (`p-button-rounded`, `[loading]="loading"`, `[disabled]="form.invalid"`)
    - `aria-label` en todos los campos y botones
    - _Requisitos: 7.1–7.8, 10.1–10.10_

  - [ ]* 11.3 Escribir prueba de propiedad para validación de `GastosGeneralesDialogComponent`
    - **Propiedad 7: Validación de gasto general rechaza entradas inválidas**
    - Usar fast-check: generar combinaciones arbitrarias de (categoría, descripción, monto); verificar que el formulario es `invalid` cuando algún campo está vacío o monto ≤ 0, y `valid` cuando todos son válidos
    - **Valida: Requisitos 7.2, 7.3**

- [x] 12. Implementar `ReportePorGruposComponent`
  - [x] 12.1 Implementar `reporte-por-grupos.component.ts`
    - Declarar `vmGrupos$ = this.facade.vmGrupos$`
    - En `ngOnInit`, cargar el reporte del año más reciente con `facade.obtenerReporteGrupos(anioActual)`
    - Implementar `onAnioChange(anio)` que llama `facade.obtenerReporteGrupos(anio)`
    - Implementar edición en línea de participación de grupos con `exhaustMap` (Subject por operación)
    - Implementar métodos para parámetros globales: `guardarAUI`, `guardarExcedentes`, `guardarItems`, `guardarImprevistos`, `guardarVigenciasAnteriores` — cada uno con `exhaustMap`
    - Implementar gestión de gastos generales: `abrirDialogoCrear()`, `abrirDialogoEditar(gasto)`, `onGuardarGasto(dto)`, `confirmarEliminarGasto(gasto)`, `onEliminarGasto(id)`
    - Implementar `descargarExcel()` con nombre `reporte-grupos-{anio}.xlsx`
    - Inyectar `ConfirmationService` para confirmación de eliminación
    - Mantener `ChangeDetectionStrategy.OnPush`, `takeUntil(destroy$)`
    - _Requisitos: 6.1–6.17, 8.2, 8.3, 8.4, 8.6_

  - [x] 12.2 Implementar `reporte-por-grupos.component.html`
    - Patrón base con `vmGrupos$ | async as vm`
    - Selector de año (p-dropdown) en encabezado
    - Panel de parámetros globales (p-panel colapsable): campos p-inputNumber para AUI, excedentes, ítems, imprevistos; botones guardar con `p-button-rounded`
    - Tabla de grupos con edición en línea (p-table): columnas nombre, porcentaje participación, aportes por semestre, vigencias anteriores, presupuesto, imprevistos; encabezado `#000066`; `trackBy`
    - Tabla de gastos generales: columnas categoría, descripción, monto; botones crear/editar/eliminar con `aria-label`; `trackBy`
    - `<app-gastos-generales-dialog>` con bindings `[visible]`, `[gasto]`, `[loading]`, `(guardar)`, `(cancelar)`
    - `p-confirmDialog` con `border-radius: 28px` y textos en ustedeo
    - Botón "Descargar Excel" con `p-button-rounded`, `aria-label`
    - `p-toast position="top-right"`
    - _Requisitos: 6.1–6.17, 8.2–8.6, 10.1–10.10_

- [x] 13. Checkpoint — Módulo información presupuestaria completo
  - Verificar que todos los tests del módulo `gestion-informacion-presupuestaria` pasan.
  - Verificar que `vmProyeccion$` y `vmGrupos$` están disponibles en el Facade.
  - Preguntar al usuario si hay ajustes antes de continuar con las pruebas de mapper.

- [ ] 14. Escribir pruebas de propiedad para los Mappers
  - [ ]* 14.1 Escribir prueba de propiedad para `GestionMatriculaFinancieraMapperService`
    - **Propiedad 1: Mapper round-trip de Estudiante preserva identidad**
    - Usar fast-check: generar `EstudianteDTORespuesta` arbitrarios; verificar que `mapper.mappearDeRespuestaAEstudiante(dto).codigo === dto.codigo`
    - Verificar que todos los campos obligatorios del modelo `Estudiante` están definidos (sin `undefined`)
    - **Valida: Requisitos 11.2, 11.5**

  - [ ]* 14.2 Escribir prueba de propiedad para `GestionInformacionPresupuestariaMapperService`
    - **Propiedad 2: Mapper round-trip de ReporteProyeccionEstudiantes preserva longitud**
    - Usar fast-check: generar `ReporteProyeccionEstudiantesDTORespuesta` arbitrarios con listas de estudiantes de longitud variable; verificar que `mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto).estudiantes.length === dto.estudiantes.length`
    - **Valida: Requisitos 11.4, 11.5**

- [ ]* 15. Escribir prueba de propiedad para utilidades Excel
  - **Propiedad 8: Nombre de archivo Excel sigue el formato especificado**
  - Usar fast-check: generar pares arbitrarios `(anio: number, tagPeriodo: number)`; verificar que el nombre generado para reporte financiero es exactamente `reporte-financiero-{anio}-{tagPeriodo}.xlsx` y para reporte por grupos es `reporte-grupos-{anio}.xlsx`
  - **Valida: Requisito 8.3**

- [x] 16. Checkpoint final — Verificación integral
  - Ejecutar `ng test --include="**/gestion-matricula-financiera/**" --run` y verificar que todos los tests pasan.
  - Ejecutar `ng test --include="**/gestion-informacion-presupuestaria/**" --run` y verificar que todos los tests pasan.
  - Verificar que no hay errores de compilación TypeScript en los archivos modificados.
  - Preguntar al usuario si hay ajustes finales antes de cerrar la implementación.

---

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido.
- El orden de implementación sigue el Pattern B obligatorio: función pura → Facade (vm$) → componentes Dumb → componentes Smart (Page) → pruebas.
- Cada tarea referencia los requisitos específicos para trazabilidad.
- Los checkpoints garantizan validación incremental antes de avanzar al siguiente módulo.
- Las propiedades de corrección (P1–P8) están distribuidas cerca de la implementación que validan para detectar errores temprano.
- **No crear nuevos servicios**: usar únicamente `FacadeService`, `ApiService`, `MapperService`, `ExcelService` y `TotalesReporteService` existentes.
- **No modificar** DTOs, modelos de dominio ni routing.
