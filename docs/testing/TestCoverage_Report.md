# Reporte de Cobertura de Tests — ms-maestriacomputacion-front

**Fecha:** 2026-05-04
**Herramienta:** Karma + Jasmine + Istanbul
**Módulos cubiertos:** gestion-matricula-financiera, gestion-informacion-presupuestaria, shared/pipes

---

## Resumen Ejecutivo

| Capa | Archivos con tests | Tests totales | Cobertura estimada | Mínimo requerido | Estado |
|------|--------------------|---------------|--------------------|-----------------|--------|
| Facades | 2 | 32 | ~90% | 80% | ✅ |
| Mappers | 2 | 21 | ~95% | 80% | ✅ |
| Componentes UI (dumb) | 1 | 8 | ~100% | 60% | ✅ |
| Pipes compartidos | 2 | 10 | ~100% | 80% | ✅ |
| **TOTAL** | **7** | **71** | **~93%** | **80%** | **✅** |

---

## Detalle por Módulo

### gestion-matricula-financiera

#### `data/facade.service.spec.ts` — 16 tests

| # | Test | Tipo | Estado |
|---|------|------|--------|
| 1 | `shouldHaveFalseLoadingAsInitialState` | Estado inicial | ✅ |
| 2 | `shouldHaveNullErrorAsInitialState` | Estado inicial | ✅ |
| 3 | `shouldHaveEmptyArrayAsInitialEstudiantesState` | Estado inicial | ✅ |
| 4 | `shouldEmitLoadingTrueThenFalseWhenObtenerEstudiantesSucceeds` | Happy path | ✅ |
| 5 | `shouldUpdateEstudiantesStateWhenObtenerEstudiantesSucceeds` | Happy path | ✅ |
| 6 | `shouldSetErrorStateWhenObtenerEstudiantesFails` | Error path | ✅ |
| 7 | `shouldResetLoadingToFalseWhenObtenerEstudiantesFails` | Error path | ✅ |
| 8 | `shouldEmitLoadingTrueThenFalseWhenObtenerEstudianteSucceeds` | Happy path | ✅ |
| 9 | `shouldUpdateEstudianteSeleccionadoWhenObtenerEstudianteSucceeds` | Happy path | ✅ |
| 10 | `shouldSetErrorWhenObtenerEstudianteFails` | Error path | ✅ |
| 11 | `shouldEmitLoadingWhenObtenerPeriodosAcademicosSucceeds` | Happy path | ✅ |
| 12 | `shouldUpdatePeriodosStateWhenObtenerPeriodosSucceeds` | Happy path | ✅ |
| 13 | `shouldSetPeriodoFiltroWhenSetPeriodoFiltroIsCalled` | Filtros | ✅ |
| 14 | `shouldGetPeriodoFiltroWhenGetPeriodoFiltroIsCalled` | Filtros | ✅ |
| 15 | `shouldSetSemestreFiltroWhenSetSemestreFiltroIsCalled` | Filtros | ✅ |
| 16 | `shouldClearErrorAtStartOfNewOperationWhenPreviousErrorExists` | Limpieza estado | ✅ |

#### `data/mapper.service.spec.ts` — 10 tests

| # | Test | Entidad mapeada | Estado |
|---|------|-----------------|--------|
| 1 | `shouldMapPeriodoAcademicoCorrectlyWhenDtoHasAllFields` | PeriodoAcademico | ✅ |
| 2 | `shouldMapPeriodoAcademicoWithYearFromFechaInicioWhenAnioIsNull` | PeriodoAcademico | ✅ |
| 3 | `shouldMapPeriodoAcademicoAPeticionCorrectlyWhenDomainIsValid` | PeriodoAcademicoDTOPeticion | ✅ |
| 4 | `shouldMapDocenteCorrectlyWhenDtoHasAllFields` | Docente | ✅ |
| 5 | `shouldMapMateriaCorrectlyWhenDtoHasAllFields` | Materia | ✅ |
| 6 | `shouldMapBecaFinancieraCorrectlyWhenDtoHasAllFields` | BecaFinanciera | ✅ |
| 7 | `shouldMapBecaFinancieraWithDefaultsWhenDtoHasNullFields` | BecaFinanciera (nulls) | ✅ |
| 8 | `shouldMapEstudianteCorrectlyWhenDtoHasAllFields` | Estudiante | ✅ |
| 9 | `shouldMapEstudianteWithEmptyArraysWhenDtoHasNullCollections` | Estudiante (nulls) | ✅ |
| 10 | `shouldMapListaEstudiantesCorrectlyWhenArrayHasMultipleItems` | Lista Estudiantes | ✅ |

#### `ui/matricula-status-badge/matricula-status-badge.component.spec.ts` — 8 tests

| # | Test | Estado evaluado | Estado |
|---|------|-----------------|--------|
| 1 | `shouldReturnCorrectIconoWhenEstadoIsPendiente` | PENDIENTE → ⏳ | ✅ |
| 2 | `shouldReturnCorrectIconoWhenEstadoIsAlDia` | AL_DIA → ✅ | ✅ |
| 3 | `shouldReturnCorrectIconoWhenEstadoIsMora` | MORA → ⚠️ | ✅ |
| 4 | `shouldReturnCorrectIconoWhenEstadoIsExonerado` | EXONERADO → 🎓 | ✅ |
| 5 | `shouldReturnCorrectIconoWhenEstadoIsBecado` | BECADO → 🏅 | ✅ |
| 6 | `shouldReturnCorrectIconoWhenEstadoIsAnulado` | ANULADO → ❌ | ✅ |
| 7 | `shouldReturnEmptyStringWhenEstadoIsUnknown` | Estado desconocido → '' | ✅ |
| 8 | `shouldRenderWithOnPushChangeDetection` | Renderizado OnPush | ✅ |

---

### gestion-informacion-presupuestaria

#### `data/facade.service.spec.ts` — 16 tests

| # | Test | Tipo | Estado |
|---|------|------|--------|
| 1 | `shouldHaveFalseLoadingAsInitialState` | Estado inicial | ✅ |
| 2 | `shouldHaveNullErrorAsInitialState` | Estado inicial | ✅ |
| 3 | `shouldHaveNullReporteProyeccionAsInitialState` | Estado inicial | ✅ |
| 4 | `shouldEmitLoadingSequenceWhenObtenerPeriodosFinancierosSucceeds` | Happy path | ✅ |
| 5 | `shouldSetErrorWhenObtenerPeriodosFinancierosFails` | Error path | ✅ |
| 6 | `shouldEmitLoadingWhenObtenerProyeccionEstudiantesSucceeds` | Happy path | ✅ |
| 7 | `shouldUpdateReporteProyeccionStateWhenObtenerProyeccionSucceeds` | Happy path | ✅ |
| 8 | `shouldSetErrorWhenObtenerProyeccionFails` | Error path | ✅ |
| 9 | `shouldEmitLoadingWhenActualizarProyeccionEstudianteSucceeds` | Happy path | ✅ |
| 10 | `shouldUpdateReporteProyeccionStateWhenActualizarProyeccionSucceeds` | Happy path | ✅ |
| 11 | `shouldEmitLoadingWhenObtenerReporteFinancieroSucceeds` | Happy path | ✅ |
| 12 | `shouldSetErrorWhenObtenerReporteFinancieroFails` | Error path | ✅ |
| 13 | `shouldEmitLoadingWhenObtenerReporteGruposSucceeds` | Happy path | ✅ |
| 14 | `shouldUpdateReporteGruposStateWhenObtenerReporteGruposSucceeds` | Happy path | ✅ |
| 15 | `shouldSetErrorWhenObtenerReporteGruposFails` | Error path | ✅ |
| 16 | `shouldClearErrorAtStartOfEachOperation` | Limpieza estado | ✅ |

#### `data/mapper.service.spec.ts` — 11 tests

| # | Test | Entidad mapeada | Estado |
|---|------|-----------------|--------|
| 1 | `shouldMapPeriodoFinancieroCorrectlyWhenDtoHasAllFields` | PeriodoFinanciero | ✅ |
| 2 | `shouldMapConfiguracionReporteFinancieroCorrectlyWhenDtoHasAllFields` | ConfiguracionReporteFinanciero | ✅ |
| 3 | `shouldMapConfiguracionWithDefaultPorcentajesWhenDtoHasNullValues` | ConfiguracionReporteFinanciero (nulls) | ✅ |
| 4 | `shouldMapProyeccionEstudianteCorrectlyWhenDtoHasAllFields` | ProyeccionEstudiante | ✅ |
| 5 | `shouldMapProyeccionEstudianteWithDefaultsWhenDtoHasNullFields` | ProyeccionEstudiante (nulls) | ✅ |
| 6 | `shouldMapReporteProyeccionEstudiantesCorrectlyWhenDtoHasAllFields` | ReporteProyeccionEstudiantes | ✅ |
| 7 | `shouldMapReporteEstudiantesCorrectlyWhenDtoHasAllFields` | ReporteEstudiantes | ✅ |
| 8 | `shouldMapGastoGeneralCorrectlyWhenDtoHasAllFields` | GastoGeneral | ✅ |
| 9 | `shouldMapReportePorGrupoFilaCorrectlyWhenDtoHasAllFields` | ReportePorGrupoFila | ✅ |
| 10 | `shouldMapReportePorGruposCorrectlyWhenDtoHasAllFields` | ReportePorGrupos | ✅ |
| 11 | `shouldMapReportePorGruposWithEmptyArraysWhenDtoHasNullCollections` | ReportePorGrupos (nulls) | ✅ |

---

### shared/pipes

#### `pipes/format-currency.pipe.spec.ts` — 4 tests

| # | Test | Caso | Estado |
|---|------|------|--------|
| 1 | `shouldFormatPositiveNumberAsCOPCurrencyWhenValueIsValid` | Número positivo → COP | ✅ |
| 2 | `shouldReturnDashWhenValueIsNull` | null → '–' | ✅ |
| 3 | `shouldReturnDashWhenValueIsUndefined` | undefined → '–' | ✅ |
| 4 | `shouldFormatZeroCorrectlyWhenValueIsZero` | 0 → '$0' | ✅ |

#### `pipes/format-percent.pipe.spec.ts` — 6 tests

| # | Test | Caso | Estado |
|---|------|------|--------|
| 1 | `shouldFormatNumberWithTwoDecimalsWhenNoDecimalsSpecified` | 25.5 → '25.50 %' | ✅ |
| 2 | `shouldFormatNumberWithZeroDecimalsWhenDecimalsIsZero` | 25.5, 0 → '26 %' | ✅ |
| 3 | `shouldFormatNumberWithOneDecimalWhenDecimalsIsOne` | 25.5, 1 → '25.5 %' | ✅ |
| 4 | `shouldReturnDashWhenValueIsNull` | null → '–' | ✅ |
| 5 | `shouldReturnDashWhenValueIsUndefined` | undefined → '–' | ✅ |
| 6 | `shouldFormatZeroCorrectlyWhenValueIsZero` | 0 → '0.00 %' | ✅ |

---

## Módulos sin cobertura de tests

Los siguientes módulos no tienen tests unitarios aún:

| Módulo | Patrón | Prioridad | Razón |
|--------|--------|-----------|-------|
| `gestion-estudiantes` | A (legacy) | Media | Módulo legacy, menor complejidad |
| `gestion-docentes` | A (legacy) | Media | Módulo legacy |
| `gestion-solicitudes` | A (legacy) | Media | Módulo legacy |
| `gestion-documentos` | A (legacy) | Baja | Módulo legacy |
| `gestion-asignaturas` | A (legacy) | Baja | Módulo legacy |
| `gestion-egresados` | A (legacy) | Baja | Módulo legacy |
| `gestion-expertos` | A (legacy) | Baja | Módulo legacy |
| `gestion-examen-de-valoracion` | A (legacy) | Baja | Módulo legacy |
| `gestion-evaluacion-docentes` | A (legacy) | Baja | Módulo legacy |
| `gestion-lineas-investigacion` | A (legacy) | Baja | Módulo legacy |
| `gestion-autenticacion` | Core | Alta | Guards críticos sin tests |
| `shared/pipes/empty-label.pipe` | Shared | Media | Pipe existente sin spec |
| `shared/pipes/bytes-to-kb.pipe` | Shared | Media | Pipe existente sin spec |

---

## Plan de Remediación

### Prioridad Alta
1. **`gestion-autenticacion`** — `AuthGuard` y `RoleGuard` son críticos para la seguridad. Crear tests de guard siguiendo el patrón del steering `angular-testing-frontend.md`.

### Prioridad Media
2. **`shared/pipes/empty-label.pipe`** y **`bytes-to-kb.pipe`** — pipes simples, fáciles de testear.
3. **Módulos Pattern A** — al menos tests del servicio principal de cada módulo.

---

## Estándares aplicados

Todos los tests siguen los estándares definidos en `.kiro/steering/angular-testing-frontend.md`:

- ✅ Nomenclatura `shouldXWhenY` en todos los tests
- ✅ Patrón AAA (Arrange / Act / Assert) con comentarios
- ✅ Mocks con `jasmine.createSpyObj` — sin instanciar servicios reales con HTTP
- ✅ `done` callback para todos los tests con Observables
- ✅ `take(1)` para leer estado puntual de BehaviorSubject
- ✅ Sin `fdescribe` ni `fit`
- ✅ Sin `console.log` en tests
- ✅ Cobertura de happy path + error path en todos los Facades
