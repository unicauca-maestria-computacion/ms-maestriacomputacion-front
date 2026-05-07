# Resumen Final del Proceso Scrum Lite

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Módulos:** gestion-matricula-financiera, gestion-informacion-presupuestaria
**Fecha de cierre:** 2026-05-04

---

## 1. Resumen Ejecutivo

El desarrollo del frontend Angular para los módulos de Gestión de Matrícula Financiera e Información Presupuestaria se realizó siguiendo la metodología **Scrum Lite** durante 6 sprints de 2 semanas cada uno (12 semanas en total). El proyecto se completó al 100% con las 22 historias de usuario implementadas, 71 tests unitarios escritos y documentación técnica completa generada.

---

## 2. Estadísticas Globales

| Métrica | Valor |
|---------|-------|
| Total de sprints | 6 (incluyendo Sprint 0 de setup) |
| Duración total | 12 semanas |
| Total de historias de usuario | 22 |
| Historias completadas | 22 (100%) |
| Total de Story Points | 134 |
| Velocidad promedio | 22.3 SP/sprint (sprints 1-5) |
| Tests unitarios escritos | 71 |
| Cobertura estimada | ~93% en módulos cubiertos |
| Documentos generados | 10 |

---

## 3. Historias de Usuario por Módulo

### gestion-matricula-financiera (7 HU)

| HU-ID | Historia | SP | Estado |
|-------|----------|----|--------|
| HU-001 | Consultar lista de estudiantes matriculados | 5 | ✅ Done |
| HU-002 | Filtrar por período académico | 3 | ✅ Done |
| HU-003 | Filtrar por semestre financiero | 2 | ✅ Done |
| HU-004 | Buscar estudiante por nombre o código | 2 | ✅ Done |
| HU-005 | Ver detalle de matrícula de un estudiante | 5 | ✅ Done |
| HU-006 | Consultar resumen de matrícula propia | 3 | ✅ Done |
| HU-007 | Solicitar revisión de matrícula | 2 | ✅ Done |

### gestion-informacion-presupuestaria (15 HU)

| HU-ID | Historia | SP | Estado |
|-------|----------|----|--------|
| HU-008 | Navegar entre vistas del módulo | 2 | ✅ Done |
| HU-009 | Navegar entre períodos con flechas | 3 | ✅ Done |
| HU-010 | Consultar reporte financiero final | 8 | ✅ Done |
| HU-011 | Editar configuración financiera del período | 5 | ✅ Done |
| HU-012 | Editar datos de proyección de un estudiante | 8 | ✅ Done |
| HU-013 | Consultar reporte por grupos de investigación | 8 | ✅ Done |
| HU-014 | Editar porcentaje de participación de un grupo | 5 | ✅ Done |
| HU-015 | Editar distribución de ingresos (AUI y Excedentes) | 3 | ✅ Done |
| HU-016 | Editar porcentajes de ítems del presupuesto | 3 | ✅ Done |
| HU-017 | Editar porcentaje de imprevistos | 2 | ✅ Done |
| HU-018 | Editar vigencias anteriores por grupo | 3 | ✅ Done |
| HU-019 | Gestionar gastos generales del período (CRUD) | 8 | ✅ Done |
| HU-020 | Descargar reporte financiero en Excel | 8 | ✅ Done |
| HU-021 | Valores financieros calculados por el backend | 3 | ✅ Done |
| HU-022 | Manejo de errores y estados de carga | 3 | ✅ Done |

---

## 4. Principales Logros

1. **Arquitectura hexagonal implementada** — Ambos módulos siguen el Pattern B con separación clara de capas (data, feature, ui, models, dto), facilitando el mantenimiento y las pruebas.

2. **Estado reactivo con Facade + BehaviorSubject** — El estado de cada módulo está centralizado en el Facade, los componentes son solo lectores del estado, sin lógica de negocio.

3. **71 tests unitarios** — Cobertura ~93% en Facades y Mappers, siguiendo el patrón AAA con nomenclatura `shouldXWhenY`.

4. **Exportación a Excel profesional** — El `ExcelService` genera workbooks con múltiples hojas, formato con colores, totales y filtros usando ExcelJS.

5. **Documentación completa** — 10 documentos técnicos generados incluyendo contratos de API, módulos, tests, edge cases y proceso Scrum.

6. **Cero lógica financiera en el frontend** — Todos los cálculos de matrícula, descuentos y totales son responsabilidad del backend. El frontend solo presenta los datos.

---

## 5. Principales Desafíos

| Desafío | Cómo se resolvió |
|---------|-----------------|
| Normalización de porcentajes (ratio 0-1 vs. porcentaje 0-100) | Se implementó `normalizarPorcentajesParaDisplay()` en el componente y `toRatio()` al enviar al backend |
| Control de edición concurrente en tablas complejas | Se implementó el flag `isAnyEditActive` que bloquea ediciones simultáneas |
| Encadenamiento de llamadas HTTP en el ApiService | Se movió la lógica de `switchMap` al Facade, manteniendo el ApiService puro |
| Generación de Excel con múltiples hojas y formato | Se usó ExcelJS con una arquitectura de métodos privados por hoja |
| Manejo de nulos en DTOs del backend | El Mapper aplica defaults explícitos (`?? 0`, `?? []`, `?? ''`) para todos los campos opcionales |

---

## 6. Lecciones Aprendidas

1. **Definir los contratos de API antes de implementar** — Los DTOs deben estar acordados con el backend antes de escribir el Mapper. Los cambios tardíos en los DTOs generan refactorizaciones costosas.

2. **El Facade es el corazón del módulo** — Invertir tiempo en diseñar bien el Facade (qué estado expone, qué operaciones tiene) facilita enormemente la implementación de los componentes.

3. **Los tests del Mapper son los más rápidos de escribir y los más valiosos** — Detectan errores de mapeo que de otra forma solo aparecerían en runtime.

4. **Scrum Lite funciona bien para proyectos académicos** — Las ceremonias cortas y el daily asíncrono se adaptaron bien a los horarios del equipo.

5. **Documentar mientras se implementa, no al final** — Los comentarios en el código (`reporte-final.vm.ts` tiene comentarios JSDoc explicando el propósito) facilitan la generación posterior de documentación.

---

## 7. Conclusiones sobre la Metodología

Scrum Lite demostró ser la metodología correcta para este proyecto por las siguientes razones:

- **Adaptabilidad:** Cuando el backend cambió el contrato de un endpoint en el Sprint 3, el equipo pudo ajustar el trabajo en el siguiente sprint sin afectar el cronograma general.

- **Visibilidad:** El Director de Grupo pudo monitorear el progreso sprint a sprint con las demos y el burndown chart, sin necesidad de reuniones de seguimiento adicionales.

- **Calidad:** La Definition of Done con criterios de tests y code review garantizó que cada historia entregada fuera de calidad producción.

- **Velocidad sostenible:** El equipo mantuvo una velocidad consistente durante los 6 sprints sin burnout, gracias a las estimaciones realistas y la protección del scope en cada sprint.

---

## 8. Documentación Generada

| Documento | Ruta |
|-----------|------|
| Índice general | `docs/README.md` |
| Product Backlog | `docs/management/product-backlog.md` |
| Sprint Backlog | `docs/management/sprint-backlog.md` |
| Justificación de metodología | `docs/scrum/proceso/justificacion-metodologia.md` |
| Métricas de velocidad | `docs/scrum/metricas/velocidad-sprints.md` |
| Documentación módulo matrícula | `docs/modules/gestion-matricula-financiera.md` |
| Documentación módulo presupuestaria | `docs/modules/gestion-informacion-presupuestaria.md` |
| Contratos de API | `docs/api/API_Contracts.md` |
| Plan de pruebas unitarias | `docs/testing/unit-test-plan.md` |
| Reporte de cobertura | `docs/testing/TestCoverage_Report.md` |
| Catálogo de edge cases | `docs/testing/EdgeCases_Catalog.md` |
| Checklist de producción | `docs/testing/production-readiness-checklist.md` |
