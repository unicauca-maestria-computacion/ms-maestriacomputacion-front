# Catálogo de Edge Cases — ms-maestriacomputacion-front

**Fecha:** 2026-05-04
**Módulos:** gestion-matricula-financiera, gestion-informacion-presupuestaria
**Herramienta recomendada:** Playwright (E2E) + Jasmine (unitarios)

---

## Introducción

Un edge case es un escenario en los límites del comportamiento esperado del sistema. Documentarlos antes de ir a producción permite anticipar fallos que las pruebas funcionales normales no detectan. Este catálogo cubre los dos módulos del anteproyecto.

---

## MÁ“DULO 1: gestion-matricula-financiera

### EC-MF-01 — Lista de estudiantes vacía

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-01 |
| **Categoría** | Datos extremos |
| **Escenario** | El backend retorna un array vacío `[]` para el período seleccionado |
| **Entrada** | `GET /api/matricula-financiera/estudiantes` → `[]` |
| **Resultado esperado** | La tabla muestra el mensaje "No se encontraron estudiantes matriculados" sin errores de renderizado |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | MEDIO — puede romper el filtrado si `estudiantesFiltrados` no se inicializa correctamente |

---

### EC-MF-02 — Estudiante sin becas ni descuentos

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-02 |
| **Categoría** | Datos extremos |
| **Escenario** | El DTO del estudiante llega con `becas: null`, `descuentos: null`, `becasDescuentos: null` |
| **Entrada** | `EstudianteDTORespuesta` con colecciones nulas |
| **Resultado esperado** | El mapper convierte los nulos a `[]`. El componente de detalle muestra secciones vacías sin errores |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por test `TC-MF-M-09` |
| **Riesgo** | ALTO — un `null.map()` en el mapper causaría error en runtime |

---

### EC-MF-03 — Estudiante con `valorEnSMLV = null`

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-03 |
| **Categoría** | Datos extremos |
| **Escenario** | El campo `valorEnSMLV` llega como `null` desde el backend |
| **Entrada** | `EstudianteDTORespuesta.valorEnSMLV = null` |
| **Resultado esperado** | El mapper preserva el `null`. El template muestra `â€“` o campo vacío sin error |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por mapper (preserva `null`) |
| **Riesgo** | BAJO |

---

### EC-MF-04 — Período académico sin `anio` en el DTO

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-04 |
| **Categoría** | Datos extremos |
| **Escenario** | El backend retorna un período sin el campo `anio` pero con `fechaInicio` |
| **Entrada** | `PeriodoAcademicoDTORespuesta.anio = undefined`, `fechaInicio = '2023-07-10'` |
| **Resultado esperado** | El mapper deriva el año de `fechaInicio` → `año = 2023` |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por test `TC-MF-M-02` |
| **Riesgo** | ALTO — sin año, el filtro de período no funciona |

---

### EC-MF-05 — Sin períodos académicos disponibles

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-05 |
| **Categoría** | Datos extremos |
| **Escenario** | El backend retorna `[]` para la lista de períodos |
| **Entrada** | `GET /api/matricula-financiera/periodos` → `[]` |
| **Resultado esperado** | El dropdown de períodos queda vacío. No se intenta cargar estudiantes. No hay error en consola |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | ALTO — `periodos[0]` causaría `undefined` si no se valida |

---

### EC-MF-06 — Error de red al cargar estudiantes

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-06 |
| **Categoría** | Red |
| **Escenario** | La petición al backend falla con error HTTP 500 |
| **Entrada** | `POST /api/matricula-financiera/estudiantes` → HTTP 500 |
| **Resultado esperado** | Se muestra toast de error "No se pudieron cargar los estudiantes". `loading` vuelve a `false`. La tabla queda vacía |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por test `TC-MF-F-06` y `TC-MF-F-07` |
| **Riesgo** | ALTO — sin manejo, el spinner quedaría activo indefinidamente |

---

### EC-MF-07 — Sesión expirada (HTTP 401) al cargar detalle

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-07 |
| **Categoría** | Sesión |
| **Escenario** | El token JWT expira mientras el usuario navega al detalle de un estudiante |
| **Entrada** | `GET /api/matricula-financiera/estudiantes/{codigo}` → HTTP 401 |
| **Resultado esperado** | El `AuthInterceptor` detecta el 401, intenta refresh. Si falla, redirige a `/login` |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual (depende del interceptor global) |
| **Riesgo** | CRÁTICO — sin manejo, el usuario ve pantalla en blanco |

---

### EC-MF-08 — Código de estudiante con caracteres especiales en la URL

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-08 |
| **Categoría** | Datos extremos |
| **Escenario** | El código del estudiante contiene caracteres como `/`, `?`, `#` |
| **Entrada** | `router.navigate(['detalle', 'EST/001'])` |
| **Resultado esperado** | El código se encodea correctamente en la URL. El backend recibe el código sin corrupción |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | MEDIO |

---

### EC-MF-09 — Acceso directo a `/detalle/:id` sin ID válido

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-09 |
| **Categoría** | Seguridad / Navegación |
| **Escenario** | El usuario accede directamente a `/gestion-matricula-financiera/detalle/` con ID vacío o espacios |
| **Entrada** | URL: `/gestion-matricula-financiera/detalle/   ` |
| **Resultado esperado** | El componente detecta el ID inválido, muestra toast de error y redirige a la lista |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `DetalleEstudianteComponent.ngOnInit()` (validación `id.trim() === ''`) |
| **Riesgo** | MEDIO |

---

### EC-MF-10 — Estudiante con `estaPago = null` (estado indeterminado)

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-10 |
| **Categoría** | Datos extremos |
| **Escenario** | El campo `estaPago` llega como `null` o `undefined` desde el backend |
| **Entrada** | `EstudianteDTORespuesta.estaPago = null` |
| **Resultado esperado** | El template muestra badge "PENDIENTE" (tercer caso del `*ngIf` en el template) |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en el template con `*ngIf="estudiante.estaPago === null || estudiante.estaPago === undefined"` |
| **Riesgo** | BAJO |

---

### EC-MF-11 — Doble clic en "Ver detalle"

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-11 |
| **Categoría** | Acciones concurrentes |
| **Escenario** | El usuario hace doble clic rápido en el botón "Ver detalle" |
| **Entrada** | Dos clics en `verDetalle(estudiante)` en menos de 200ms |
| **Resultado esperado** | Solo se navega una vez. No se hacen dos peticiones al backend |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | BAJO — la navegación de Angular previene duplicados |

---

### EC-MF-12 — Filtro de semestre con valor 0 (Todos)

| Campo | Detalle |
|-------|---------|
| **ID** | EC-MF-12 |
| **Categoría** | Filtros |
| **Escenario** | El usuario selecciona "Todos" en el filtro de semestre (valor `0`) |
| **Entrada** | `semestreSeleccionado = 0` |
| **Resultado esperado** | `aplicarFiltros()` muestra todos los estudiantes sin filtrar |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `aplicarFiltros()` con condición `semestreSeleccionado === 0` |
| **Riesgo** | BAJO |

---

## MÁ“DULO 2: gestion-informacion-presupuestaria

### EC-IP-01 — Sin períodos activos disponibles

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-01 |
| **Categoría** | Datos extremos |
| **Escenario** | El backend retorna `[]` para períodos activos en la proyección |
| **Entrada** | `GET /api/info-presupuestaria/periodos/activos` → `[]` |
| **Resultado esperado** | El selector de período muestra mensaje "No hay períodos académicos activos". El reporte no se carga |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | ALTO |

---

### EC-IP-02 — Reporte de proyección con lista de estudiantes vacía

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-02 |
| **Categoría** | Datos extremos |
| **Escenario** | El período activo existe pero no tiene estudiantes matriculados |
| **Entrada** | `ReporteProyeccionEstudiantesDTORespuesta.estudiantes = []` |
| **Resultado esperado** | La tabla muestra "No hay datos disponibles". Los totales muestran `$0` |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | MEDIO |

---

### EC-IP-03 — Porcentaje de beca mayor a 100%

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-03 |
| **Categoría** | Validación de entrada |
| **Escenario** | El usuario intenta guardar un porcentaje de beca de 150% en la proyección |
| **Entrada** | `estudiante.porcentajeBeca = 150` en `onRowEditSave()` |
| **Resultado esperado** | Se muestra toast de error "el porcentaje de beca no puede superar 100%". No se llama al backend |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `ProyeccionReporteComponent.onRowEditSave()` |
| **Riesgo** | ALTO — sin validación, el backend recibiría datos inválidos |

---

### EC-IP-04 — Porcentaje de beca negativo

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-04 |
| **Categoría** | Validación de entrada |
| **Escenario** | El usuario ingresa un porcentaje de beca negativo (-5%) |
| **Entrada** | `estudiante.porcentajeBeca = -5` |
| **Resultado esperado** | Se muestra toast de error "el porcentaje de beca no puede ser negativo". Se revierte la edición |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `ProyeccionReporteComponent.onRowEditSave()` |
| **Riesgo** | ALTO |

---

### EC-IP-05 — Edición concurrente de cabecera y fila

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-05 |
| **Categoría** | Acciones concurrentes |
| **Escenario** | El usuario intenta editar la configuración de cabecera mientras hay una fila en edición |
| **Entrada** | `editingRowKey !== null` cuando se llama `onHeaderEditInit()` |
| **Resultado esperado** | Se muestra toast de advertencia indicando que debe guardar o cancelar la fila primero |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `ProyeccionReporteComponent.onHeaderEditInit()` con validación `isAnyEditActive` |
| **Riesgo** | ALTO — sin control, dos peticiones simultáneas podrían corromper el estado |

---

### EC-IP-06 — Error al guardar configuración de proyección

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-06 |
| **Categoría** | Red |
| **Escenario** | El backend retorna error al actualizar la configuración del reporte |
| **Entrada** | `PUT /api/info-presupuestaria/configuracion-reporte-financiero/{id}` → HTTP 500 |
| **Resultado esperado** | Toast de error. El spinner se oculta. Los datos en pantalla no se modifican |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por `catchError` en el Facade |
| **Riesgo** | ALTO |

---

### EC-IP-07 — Reporte por grupos sin grupos de investigación

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-07 |
| **Categoría** | Datos extremos |
| **Escenario** | El backend retorna `reportesPorGrupo: []` |
| **Entrada** | `ConsultaReportePorGruposDTORespuesta.reportesPorGrupo = []` |
| **Resultado esperado** | La tabla muestra una columna "Total" en lugar de columnas por grupo. El gráfico no se renderiza |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `procesarDatosTabla()` con fallback `[{ nombre: 'Total', grupoId: 0 }]` |
| **Riesgo** | MEDIO |

---

### EC-IP-08 — Suma de porcentajes de participación supera 100%

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-08 |
| **Categoría** | Validación de entrada |
| **Escenario** | El usuario edita la participación de un grupo y la suma total supera 100% |
| **Entrada** | Grupo A = 60%, Grupo B = 60% (suma = 120%) |
| **Resultado esperado** | El input limita el valor máximo permitido. `getMaxPercent()` calcula el máximo disponible |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `onPercentInput()` con `getMaxPercent()` |
| **Riesgo** | ALTO — datos inválidos al backend |

---

### EC-IP-09 — Gastos generales con monto cero

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-09 |
| **Categoría** | Datos extremos |
| **Escenario** | Se crea un gasto general con monto `0` |
| **Entrada** | `GastoGeneralDTOPeticion.monto = 0` |
| **Resultado esperado** | El gasto se crea correctamente. El total de gastos generales no cambia |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | BAJO |

---

### EC-IP-10 — Reporte por grupos con `gastosGenerales: null`

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-10 |
| **Categoría** | Datos extremos |
| **Escenario** | El backend retorna `gastosGenerales: null` en lugar de `[]` |
| **Entrada** | `ConsultaReportePorGruposDTORespuesta.gastosGenerales = null` |
| **Resultado esperado** | El mapper convierte `null` a `[]`. El modal de gastos muestra lista vacía |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por test `TC-IP-M-11` |
| **Riesgo** | ALTO — `null.reduce()` en `totalGastosGenerales` causaría error |

---

### EC-IP-11 — Período de proyección no encontrado

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-11 |
| **Categoría** | Red |
| **Escenario** | No existe período de proyección activo en el backend |
| **Entrada** | `GET /api/info-presupuestaria/periodos/proyeccion` → HTTP 404 |
| **Resultado esperado** | Toast de error. La pantalla de proyección muestra estado vacío |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto por `catchError` en el Facade |
| **Riesgo** | ALTO |

---

### EC-IP-12 — Cancelar edición de fila restaura valores originales

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-12 |
| **Categoría** | Flujo de usuario |
| **Escenario** | El usuario edita una fila, cambia valores y luego cancela |
| **Entrada** | `onRowEditCancel(estudiante, index)` |
| **Resultado esperado** | Los valores de la fila vuelven exactamente a los valores antes de la edición |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto en `onRowEditCancel()` con `clonedEstudiantes` |
| **Riesgo** | MEDIO |

---

### EC-IP-13 — Valor SMLV igual a cero

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-13 |
| **Categoría** | Datos extremos |
| **Escenario** | La configuración tiene `valorSMLV = 0` |
| **Entrada** | `ConfiguracionReporteFinanciero.valorSMLV = 0` |
| **Resultado esperado** | Los cálculos de matrícula resultan en `$0`. No hay división por cero |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | ALTO — si hay divisiones por SMLV en el backend, puede causar errores |

---

### EC-IP-14 — Porcentaje AUI + Excedentes supera ingresos disponibles

| Campo | Detalle |
|-------|---------|
| **ID** | EC-IP-14 |
| **Categoría** | Validación de negocio |
| **Escenario** | AUI = 80% y Excedentes = 5.000.000 cuando los ingresos son 4.000.000 |
| **Entrada** | Valores que hacen `valorADistribuir` negativo |
| **Resultado esperado** | El backend calcula y retorna `valorADistribuir = 0` o negativo. El frontend muestra el valor sin error |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | MEDIO |

---

## EDGE CASES COMPARTIDOS (ambos módulos)

### EC-COM-01 — Pérdida de conexión durante guardado

| Campo | Detalle |
|-------|---------|
| **ID** | EC-COM-01 |
| **Categoría** | Red |
| **Escenario** | La conexión se pierde justo cuando se envía una petición PUT/POST |
| **Entrada** | `navigator.onLine = false` durante operación |
| **Resultado esperado** | El `AuthInterceptor` captura el error. Toast de error. El spinner se oculta |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | ALTO |

---

### EC-COM-02 — Acceso sin rol autorizado

| Campo | Detalle |
|-------|---------|
| **ID** | EC-COM-02 |
| **Categoría** | Seguridad |
| **Escenario** | Un estudiante intenta acceder a `/gestion-matricula-financiera` (solo ROLE_COORDINADOR) |
| **Entrada** | Usuario con `ROLE_ESTUDIANTE` navega a ruta protegida |
| **Resultado esperado** | `RoleGuard` bloquea el acceso y redirige a `/forbidden` |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | CRÁTICO — exposición de datos financieros |

---

### EC-COM-03 — Token JWT expirado

| Campo | Detalle |
|-------|---------|
| **ID** | EC-COM-03 |
| **Categoría** | Sesión |
| **Escenario** | El token JWT expira mientras el usuario está en la aplicación |
| **Entrada** | Cualquier petición HTTP con token expirado → HTTP 401 |
| **Resultado esperado** | El `AuthInterceptor` intenta refresh. Si falla, redirige a `/login` |
| **Resultado real** | — |
| **Estado** | Pendiente validación manual |
| **Riesgo** | CRÁTICO |

---

### EC-COM-04 — Recarga de página (F5) en ruta con estado

| Campo | Detalle |
|-------|---------|
| **ID** | EC-COM-04 |
| **Categoría** | Navegación |
| **Escenario** | El usuario recarga la página estando en `/detalle/EST001` |
| **Entrada** | F5 en `/gestion-matricula-financiera/detalle/EST001` |
| **Resultado esperado** | El componente lee el ID de la URL y recarga los datos del estudiante |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto — `ngOnInit` lee `route.paramMap` |
| **Riesgo** | BAJO |

---

### EC-COM-05 — Respuesta del backend con campos adicionales no esperados

| Campo | Detalle |
|-------|---------|
| **ID** | EC-COM-05 |
| **Categoría** | Compatibilidad |
| **Escenario** | El backend agrega nuevos campos al DTO que el frontend no conoce |
| **Entrada** | DTO con campos extra `{ ...camposConocidos, campoNuevo: 'valor' }` |
| **Resultado esperado** | TypeScript ignora los campos extra. El mapper solo mapea los campos conocidos |
| **Resultado real** | — |
| **Estado** | ✅ Cubierto — TypeScript con interfaces no falla por campos extra |
| **Riesgo** | BAJO |

---

## Resumen de Edge Cases

| Módulo | Total EC | Cubiertos | Pendientes | Críticos |
|--------|----------|-----------|------------|---------|
| gestion-matricula-financiera | 12 | 7 | 5 | 2 |
| gestion-informacion-presupuestaria | 14 | 8 | 6 | 4 |
| Compartidos | 5 | 2 | 3 | 2 |
| **TOTAL** | **31** | **17** | **14** | **8** |

---

## Criterios de Producción

Para considerar el código listo para producción, los siguientes edge cases **críticos** deben estar validados manualmente:

- [ ] EC-MF-07 — Sesión expirada al cargar detalle
- [ ] EC-IP-06 — Error al guardar configuración de proyección
- [ ] EC-COM-02 — Acceso sin rol autorizado
- [ ] EC-COM-03 — Token JWT expirado
- [ ] EC-IP-03 — Porcentaje de beca > 100%
- [ ] EC-IP-08 — Suma de porcentajes > 100%
- [ ] EC-MF-05 — Sin períodos académicos disponibles
- [ ] EC-IP-11 — Período de proyección no encontrado
