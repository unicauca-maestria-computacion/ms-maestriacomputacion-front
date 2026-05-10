# Documentación — ms-maestriacomputacion-front

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Autor:** Daniel Felipe Contreras Tobar
**Fecha:** 2026-05-04
**Stack:** Angular 13, TypeScript 4.4, PrimeNG 13, RxJS 7.4

---

## Índice de Documentación

### Integración Frontend-Backend

| Documento | Descripción |
|-----------|-------------|
| [`integration/frontend-backend-integration.md`](integration/frontend-backend-integration.md) | Cómo se acordaron los contratos de API, separación de responsabilidades, por qué los cambios en el backend no afectan al frontend, y cómo probar la integración |
| [`arquitectura-cero-logica.md`](arquitectura-cero-logica.md) | Definición del estándar institucional de cero lógica financiera en el cliente (Frontend Delgado) |
| [`contrato-backend-frontend.md`](contrato-backend-frontend.md) | Detalle técnico de estructuras JSON, endpoints y flujos de datos sin procesamiento local |


### Design System TIC v3

| Documento | Descripción |
|-----------|-------------|
| [`design-system/design-system-tic-v3.md`](design-system/design-system-tic-v3.md) | Colores institucionales, tipografía, border radius, íconos y estados de pago aplicados en los módulos |
| [`design-system/atomic-design.md`](design-system/atomic-design.md) | Catálogo de átomos y moléculas compartidos: `app-uni-progress-bar`, `app-periodo-badge`, `app-campo-dato`, `app-page-header`, `app-estado-vacio`, `app-uni-card-header` |

### Gestión y Proceso Scrum

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
| [`modules/changelog-matricula-presupuestaria.md`](modules/changelog-matricula-presupuestaria.md) | Changelog de correcciones post-spec: errores TypeScript, alineación Design System TIC v3, correcciones de UX y Atomic Design |

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
- Mapper para transformación DTO ↔ Dominio
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
- Mapper para transformación DTO ↔ Dominio
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
| **Arquitectura Cero Lógica** | Eliminación de lógica aritmética y normalizaciones en 10+ componentes |
| **Centralización en Backend** | Migración de cálculos de totales globales a DTOs de microservicios |
| Eliminación de `console.log`/`console.error` en producción | 5 componentes feature |
| Método `descargar()` vacío reemplazado con TODO documentado | `reporte-final`, `proyeccion-reporte` |
| Lógica de encadenamiento movida del ApiService al Facade | `api.service.ts`, `facade.service.ts` (presupuestaria) |
| Creación de pipes compartidos `FormatCurrencyPipe` y `FormatPercentPipe` | `shared/pipes/` + 3 componentes |
| Eliminación de variable `loading` muerta en `MatriculaFinancieraComponent` | `matricula-financiera.component.ts` |
| Error TS en `ActualizarParticipacionDTOPeticion` — campos incorrectos en objeto literal | `reporte-por-grupos.component.ts` |
| Fuentes institucionales (Titillium Web, Open Sans, Material Symbols) agregadas a `index.html` | `src/index.html` |
| Badge de período reemplazado por componente institucional `app-periodo-badge` | `resumen-matricula-estudiante.component.html` |
| `p-progressSpinner` reemplazado por `app-uni-progress-bar` (barra lineal Design System TIC v3) | 6 templates |
| Estados de pago corregidos a 3 estados reales (`true`/`false`/`null`) con colores correctos | 3 componentes TS |
| Dropdown de estados reducido de 7 a 4 opciones reales | `matricula-financiera.component.ts` |
| Columna "Valor SMLV" eliminada del listado (backend devuelve `1` para todos) | `matricula-financiera.component.html` |
| Porcentaje de beca corregido (`\| percent` → `%` directo) | 2 templates |
| Botón "Iniciar nueva matrícula" eliminado (no es responsabilidad del frontend) | `matricula-financiera.component.html/.ts` |
| Campo `grupoNombre` tipado en modelo, DTO y mapper | `domain-models.ts`, `estudiante.dto.ts`, `mapper.service.ts` |
| Datos faltantes del estudiante agregados a vistas de detalle y resumen | 2 templates |
| Becas extraídas a tarjeta separada con patrón grid consistente | 2 templates |
| Materias convertidas de tabla a grid `campo-label`/`campo-valor` | 2 templates |
| Atomic Design: 6 componentes compartidos creados en `SharedModule` | `shared.module.ts` + 6 nuevos archivos |


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
