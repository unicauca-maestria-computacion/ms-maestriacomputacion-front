tpod# Documentación — ms-maestriacomputacion-front

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Autor:** Daniel Felipe Contreras Tobar
**Fecha:** 2026-05-04
**Stack:** Angular 13, TypeScript 4.4, PrimeNG 13, RxJS 7.4

---

## Ándice de Documentación

### ðŸ—ï¸ Arquitectura y Decisiones Técnicas
| Documento | Descripción |
|-----------|-------------|
| [`management/frontend-architecture-decisions.md`](management/frontend-architecture-decisions.md) | Estrategia de Cliente Delgado, Migración Pattern B y Coexistencia Visual. |
| [`architecture/arquitectura-cero-logica.md`](architecture/arquitectura-cero-logica.md) | **[NUEVO]** Principios detallados de la delegación de lógica al Backend. |

### ðŸ”Œ API e Integración
| Documento | Descripción |
|-----------|-------------|
| [`integration/frontend-backend-integration.md`](integration/frontend-backend-integration.md) | Cómo se acordaron los contratos, responsabilidades y pruebas de integración. |
| [`api/contrato-backend-frontend.md`](api/contrato-backend-frontend.md) | **[NUEVO]** Detalle de endpoints y estructuras JSON con campos calculados. |
| [`api/API_Contracts.md`](api/API_Contracts.md) | Definiciones técnicas de las interfaces TypeScript para la API. |

### ðŸŽ¨ Sistemas de Diseño y Estado Visual
> [!IMPORTANT]
> Esta rama usa el **Estado Visual Legacy** (sin lineamientos TIC v3) para asegurar la compatibilidad con el resto del sistema maestro, aunque utiliza la **Lógica Pattern B** de última generación.

| Documento | Estado | Descripción |
|-----------|--------|-------------|
| [`design-system/legacy-visual-pattern.md`](design-system/legacy-visual-pattern.md) | **APLICADO** | Estándar visual de esta rama (Consistencia con Master). |
| [`design-system/design-system-tic-v3.md`](design-system/design-system-tic-v3.md) | **REFERENCIA** | Lineamientos oficiales TIC v3 2026 (No aplicados aquí). |
| [`modules/tic-v3-compliance-report.md`](modules/tic-v3-compliance-report.md) | **HISTÁ“RICO** | Justificación de la transición técnica y visual. |

### ðŸ“¦ Módulos Financieros
| Documento | Descripción |
|-----------|-------------|
| [`modules/gestion-matricula-financiera.md`](modules/gestion-matricula-financiera.md) | Detalle técnico del módulo de Matrícula (Lógica Pattern B). |
| [`modules/gestion-informacion-presupuestaria.md`](modules/gestion-informacion-presupuestaria.md) | Detalle técnico del módulo de Presupuesto y Reportes. |
| [`modules/solicitud-revision-matricula.md`](modules/solicitud-revision-matricula.md) | Proceso de integración con el módulo de Solicitudes (RE_MATR). |

### ðŸ“Š Gestión y Proceso Scrum

| Documento | Descripción |
|-----------|-------------|
| [`management/product-backlog.md`](management/product-backlog.md) | Product Backlog completo con 22 historias de usuario derivadas del código real |
| [`management/sprint-backlog.md`](management/sprint-backlog.md) | Sprint Backlog de los 6 sprints con tareas, SP y estado |
| [`scrum/proceso/justificacion-metodologia.md`](scrum/proceso/justificacion-metodologia.md) | Justificación de Scrum Lite, roles, ceremonias y Definition of Done |
| [`scrum/metricas/velocidad-sprints.md`](scrum/metricas/velocidad-sprints.md) | Velocidad por sprint, burndown chart y Happiness Index |
| [`scrum/resumen-final.md`](scrum/resumen-final.md) | Resumen ejecutivo del proceso, logros, desafíos y lecciones aprendidas |

### Módulos implementados

| Documento | Descripción |
|-----------|-------------|
| [`modules/gestion-matricula-financiera.md`](modules/gestion-matricula-financiera.md) | Documentación técnica completa del módulo de Gestión de Matrícula Financiera |
| [`modules/gestion-informacion-presupuestaria.md`](modules/gestion-informacion-presupuestaria.md) | Documentación técnica completa del módulo de Gestión de Información Presupuestaria |

### API y Contratos

| Documento | Descripción |
|-----------|-------------|
| [`api/API_Contracts.md`](api/API_Contracts.md) | Contratos de API (request/response) de todos los endpoints consumidos |

### Testing

| Documento | Descripción |
|-----------|-------------|
| [`testing/unit-test-plan.md`](testing/unit-test-plan.md) | Plan de pruebas unitarias con 71 casos de prueba documentados |
| [`testing/TestCoverage_Report.md`](testing/TestCoverage_Report.md) | Reporte de cobertura de tests por módulo y capa |
| [`testing/EdgeCases_Catalog.md`](testing/EdgeCases_Catalog.md) | Catálogo de 31 edge cases identificados para los dos módulos |
| [`testing/production-readiness-checklist.md`](testing/production-readiness-checklist.md) | Checklist completo de preparación para producción |

---

## Resumen del Trabajo Realizado

### Módulo: gestion-matricula-financiera

**Funcionalidades implementadas:**
- Listado de estudiantes matriculados con filtros por período y semestre
- Detalle completo de matrícula financiera de un estudiante (para coordinador)
- Resumen de matrícula propia (para estudiante)
- Componente de badge de estado de matrícula (`MatriculaStatusBadgeComponent`)

**Arquitectura:**
- Pattern B (Hexagonal variante) con capas `data/`, `feature/`, `ui/`, `models/`, `dto/`
- Facade con BehaviorSubject para gestión de estado reactivo
- Mapper para transformación DTO â†” Dominio
- ApiService puro (solo HttpClient)
- Lazy loading + RoleGuard en todas las rutas

**Tests:** 34 tests unitarios (Facade: 16, Mapper: 10, Componente UI: 8)

---

### Módulo: gestion-informacion-presupuestaria

**Funcionalidades implementadas:**
- Proyección de ingresos del período activo (editable)
- Reporte financiero final de períodos cerrados
- Distribución del presupuesto por grupos de investigación (editable)
- Gestión CRUD de gastos generales
- Exportación a Excel con múltiples hojas y formato profesional
- Selector de período con navegación por flechas
- Modal de descarga de reportes

**Arquitectura:**
- Pattern B (Hexagonal variante) con capas `data/`, `feature/`, `ui/`, `models/`, `dto/`
- Facade con BehaviorSubject para gestión de estado reactivo
- Mapper para transformación DTO â†” Dominio
- ApiService puro (sin lógica de encadenamiento)
- View Model (`ReporteFinalVM`) para separar lógica de presentación
- `TotalesReporteService` para normalización de totales
- `ExcelService` con ExcelJS para generación de reportes
- Lazy loading + RoleGuard en todas las rutas

**Tests:** 27 tests unitarios (Facade: 16, Mapper: 11)

---

### Correcciones y mejoras aplicadas

| Corrección | Archivos afectados |
|-----------|-------------------|
| Eliminación de `console.log`/`console.error` en producción | 5 componentes feature |
| Método `descargar()` vacío reemplazado con TODO documentado | `reporte-final`, `proyeccion-reporte` |
| Lógica de encadenamiento movida del ApiService al Facade | `api.service.ts`, `facade.service.ts` (presupuestaria) |
| Creación de pipes compartidos `FormatCurrencyPipe` y `FormatPercentPipe` | `shared/pipes/` + 3 componentes |
| Eliminación de variable `loading` muerta en `MatriculaFinancieraComponent` | `matricula-financiera.component.ts` |

---

### Pipes compartidos creados

| Pipe | Selector | Descripción |
|------|----------|-------------|
| `FormatCurrencyPipe` | `\| formatCurrency` | Formatea números como moneda COP |
| `FormatPercentPipe` | `\| formatPercent` o `\| formatPercent:N` | Formatea números como porcentaje con N decimales |

---

## Cómo ejecutar los tests

```bash
cd ms-maestriacomputacion-front

# Ejecutar todos los tests
ng test --watch=false

# Con reporte de cobertura
ng test --watch=false --code-coverage

# Solo módulo matrícula financiera
ng test --watch=false --include="**/gestion-matricula-financiera/**/*.spec.ts"

# Solo módulo presupuestaria
ng test --watch=false --include="**/gestion-informacion-presupuestaria/**/*.spec.ts"

# Solo pipes compartidos
ng test --watch=false --include="**/shared/pipes/**/*.spec.ts"
```

El reporte de cobertura se genera en `coverage/ms-maestriacomputacion-front/index.html`.
