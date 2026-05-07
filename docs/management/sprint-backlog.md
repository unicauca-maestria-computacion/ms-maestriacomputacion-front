# Sprint Backlog — ms-maestriacomputacion-front

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Metodología:** Scrum Lite (equipo de 3 personas)
**Duración de sprint:** 2 semanas
**Capacidad estimada:** ~35 Story Points por sprint

---

## Equipo

| Rol Scrum | Persona | Responsabilidad |
|-----------|---------|-----------------|
| Product Owner + Scrum Master | Director de Grupo | Priorización, facilitación, aceptación |
| Developer Backend | Desarrollador Backend | API REST, lógica de negocio, base de datos |
| Developer Frontend | Daniel Felipe Contreras Tobar | Angular SPA, módulos asignados |

---

## Sprint 0 — Configuración y Arquitectura Base

**Período:** Semanas 1-2
**Sprint Goal:** Tener el proyecto Angular configurado con la arquitectura base, autenticación funcional y los módulos lazy-loaded registrados.

### Tareas

| T-ID | HU | Tarea | Asignado | SP | Estado |
|------|-----|-------|----------|----|--------|
| T-001 | — | Configurar proyecto Angular 13 con PrimeNG 13 y PrimeFlex | Frontend | 2 | ✅ Done |
| T-002 | — | Configurar estructura de módulos (Core, Shared, Feature) | Frontend | 2 | ✅ Done |
| T-003 | — | Implementar AppRoutingModule con lazy loading | Frontend | 2 | ✅ Done |
| T-004 | — | Implementar AuthInterceptor con manejo de JWT | Frontend | 3 | ✅ Done |
| T-005 | — | Implementar AuthGuard y RoleGuard | Frontend | 2 | ✅ Done |
| T-006 | — | Configurar SharedModule con pipes y componentes base | Frontend | 2 | ✅ Done |
| T-007 | — | Definir constantes de URLs del backend (`api-url.ts`) | Frontend | 1 | ✅ Done |

**SP Comprometidos:** 14 | **SP Completados:** 14 | **Velocidad:** 100%

---

## Sprint 1 — Módulo Gestión Matrícula Financiera (Parte 1)

**Período:** Semanas 3-4
**Sprint Goal:** El Coordinador puede consultar la lista de estudiantes matriculados con filtros por período y semestre.

### Tareas

| T-ID | HU | Tarea | Asignado | SP | Estado |
|------|-----|-------|----------|----|--------|
| T-008 | HU-001 | Crear `domain-models.ts` (Estudiante, PeriodoAcademico, BecaFinanciera...) | Frontend | 2 | ✅ Done |
| T-009 | HU-001 | Crear DTOs del módulo (estudiante, periodo, beca, materia, docente) | Frontend | 2 | ✅ Done |
| T-010 | HU-001 | Implementar `GestionMatriculaFinancieraApiService` | Frontend | 2 | ✅ Done |
| T-011 | HU-001 | Implementar `GestionMatriculaFinancieraMapperService` | Frontend | 3 | ✅ Done |
| T-012 | HU-001 | Implementar `GestionMatriculaFinancieraFacadeService` | Frontend | 3 | ✅ Done |
| T-013 | HU-001 | Implementar `MatriculaFinancieraComponent` (listado) | Frontend | 3 | ✅ Done |
| T-014 | HU-002 | Agregar dropdown de período académico con restauración de filtro | Frontend | 2 | ✅ Done |
| T-015 | HU-003 | Agregar filtro por semestre financiero (extracción dinámica) | Frontend | 2 | ✅ Done |
| T-016 | HU-004 | Agregar búsqueda global en tabla con paginación | Frontend | 2 | ✅ Done |

**SP Comprometidos:** 21 | **SP Completados:** 21 | **Velocidad:** 100%

---

## Sprint 2 — Módulo Gestión Matrícula Financiera (Parte 2)

**Período:** Semanas 5-6
**Sprint Goal:** El Coordinador puede ver el detalle de un estudiante y el Estudiante puede consultar su propia matrícula.

### Tareas

| T-ID | HU | Tarea | Asignado | SP | Estado |
|------|-----|-------|----------|----|--------|
| T-017 | HU-005 | Implementar `DetalleEstudianteComponent` con validación de ID | Frontend | 3 | ✅ Done |
| T-018 | HU-005 | Implementar `TablaMatriculaEstudianteComponent` (shared) | Frontend | 3 | ✅ Done |
| T-019 | HU-006 | Implementar `ResumenMatriculaEstudianteComponent` | Frontend | 3 | ✅ Done |
| T-020 | HU-007 | Integrar botón "Solicitar Revisión" con módulo de solicitudes | Frontend | 2 | ✅ Done |
| T-021 | HU-001 | Implementar `MatriculaStatusBadgeComponent` (dumb, OnPush) | Frontend | 2 | ✅ Done |
| T-022 | HU-022 | Integrar `LoadingService` en todos los componentes del módulo | Frontend | 2 | ✅ Done |
| T-023 | — | Configurar routing del módulo con RoleGuard | Frontend | 1 | ✅ Done |
| T-024 | — | Registrar módulo en `app-routing.module.ts` con lazy loading | Frontend | 1 | ✅ Done |

**SP Comprometidos:** 17 | **SP Completados:** 17 | **Velocidad:** 100%

---

## Sprint 3 — Módulo Información Presupuestaria (Parte 1)

**Período:** Semanas 7-8
**Sprint Goal:** El Coordinador puede consultar el reporte financiero final y la proyección del período activo.

### Tareas

| T-ID | HU | Tarea | Asignado | SP | Estado |
|------|-----|-------|----------|----|--------|
| T-025 | HU-008 | Crear estructura base del módulo (domain-models, DTOs, routing) | Frontend | 3 | ✅ Done |
| T-026 | HU-008 | Implementar `GestionInformacionPresupuestariaApiService` | Frontend | 3 | ✅ Done |
| T-027 | HU-008 | Implementar `GestionInformacionPresupuestariaMapperService` | Frontend | 3 | ✅ Done |
| T-028 | HU-008 | Implementar `GestionInformacionPresupuestariaFacadeService` | Frontend | 3 | ✅ Done |
| T-029 | HU-009 | Implementar `PeriodoFinancieroSelectorComponent` con modos | Frontend | 3 | ✅ Done |
| T-030 | HU-008 | Implementar `OpcionesPresupuestoComponent` (tabs de navegación) | Frontend | 2 | ✅ Done |
| T-031 | HU-010 | Implementar `ReporteFinalComponent` con `ReporteFinalVM` | Frontend | 5 | ✅ Done |
| T-032 | HU-010 | Implementar `TotalesReporteService` | Frontend | 1 | ✅ Done |

**SP Comprometidos:** 23 | **SP Completados:** 23 | **Velocidad:** 100%

---

## Sprint 4 — Módulo Información Presupuestaria (Parte 2)

**Período:** Semanas 9-10
**Sprint Goal:** El Coordinador puede editar la proyección del período activo y gestionar la distribución por grupos.

### Tareas

| T-ID | HU | Tarea | Asignado | SP | Estado |
|------|-----|-------|----------|----|--------|
| T-033 | HU-011 | Implementar edición de cabecera en `ProyeccionReporteComponent` | Frontend | 3 | ✅ Done |
| T-034 | HU-012 | Implementar edición inline de filas de estudiantes con validación | Frontend | 5 | ✅ Done |
| T-035 | HU-012 | Implementar control de edición concurrente (`isAnyEditActive`) | Frontend | 2 | ✅ Done |
| T-036 | HU-013 | Implementar `ReportePorGruposComponent` con gráfico de barras | Frontend | 5 | ✅ Done |
| T-037 | HU-014 | Implementar edición de porcentajes de participación por grupo | Frontend | 3 | ✅ Done |
| T-038 | HU-015 | Implementar edición de AUI y Excedentes | Frontend | 2 | ✅ Done |
| T-039 | HU-016 | Implementar edición de ítems del presupuesto | Frontend | 2 | ✅ Done |
| T-040 | HU-017 | Implementar edición de imprevistos | Frontend | 2 | ✅ Done |
| T-041 | HU-018 | Implementar edición de vigencias anteriores por grupo | Frontend | 2 | ✅ Done |

**SP Comprometidos:** 26 | **SP Completados:** 26 | **Velocidad:** 100%

---

## Sprint 5 — Gastos Generales, Excel y Calidad

**Período:** Semanas 11-12
**Sprint Goal:** CRUD de gastos generales, exportación a Excel, tests unitarios y documentación completa.

### Tareas

| T-ID | HU | Tarea | Asignado | SP | Estado |
|------|-----|-------|----------|----|--------|
| T-042 | HU-019 | Implementar `GastosGeneralesDialogComponent` (CRUD completo) | Frontend | 5 | ✅ Done |
| T-043 | HU-020 | Implementar `ExcelService` con ExcelJS (3 tipos de reporte) | Frontend | 8 | ✅ Done |
| T-044 | HU-020 | Implementar `DescargarReporteDialogComponent` | Frontend | 3 | ✅ Done |
| T-045 | — | Crear pipes compartidos `FormatCurrencyPipe` y `FormatPercentPipe` | Frontend | 2 | ✅ Done |
| T-046 | — | Escribir tests unitarios: Facade matrícula financiera (16 tests) | Frontend | 3 | ✅ Done |
| T-047 | — | Escribir tests unitarios: Mapper matrícula financiera (10 tests) | Frontend | 2 | ✅ Done |
| T-048 | — | Escribir tests unitarios: Facade presupuestaria (16 tests) | Frontend | 3 | ✅ Done |
| T-049 | — | Escribir tests unitarios: Mapper presupuestaria (11 tests) | Frontend | 2 | ✅ Done |
| T-050 | — | Escribir tests unitarios: MatriculaStatusBadge + pipes (18 tests) | Frontend | 2 | ✅ Done |
| T-051 | — | Generar documentación técnica completa (`docs/`) | Frontend | 3 | ✅ Done |

**SP Comprometidos:** 33 | **SP Completados:** 33 | **Velocidad:** 100%

---

## Resumen de Velocidad por Sprint

| Sprint | SP Comprometidos | SP Completados | Velocidad |
|--------|-----------------|----------------|-----------|
| Sprint 0 | 14 | 14 | 100% |
| Sprint 1 | 21 | 21 | 100% |
| Sprint 2 | 17 | 17 | 100% |
| Sprint 3 | 23 | 23 | 100% |
| Sprint 4 | 26 | 26 | 100% |
| Sprint 5 | 33 | 33 | 100% |
| **Total** | **134** | **134** | **100%** |

**Velocidad promedio:** 22.3 SP/sprint (excluyendo Sprint 0 de setup)
