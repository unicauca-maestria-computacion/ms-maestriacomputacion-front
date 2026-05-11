# Resumen Final del Proceso Scrum Lite

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Módulos:** gestion-matricula-financiera, gestion-informacion-presupuestaria
**Fecha de cierre:** 2026-05-11

---

## 1. Resumen Ejecutivo

El desarrollo del frontend Angular para los módulos de Gestión de Matrícula Financiera e Información Presupuestaria se realizó siguiendo la metodología **Scrum Lite** durante 7 sprints (14 semanas en total). El proyecto se completó al 100% con las 25 historias de usuario implementadas (incluyendo la refactorización arquitectónica Pattern B), tests unitarios escritos y documentación técnica exhaustiva.

---

## 2. Estadísticas Globales

| Métrica | Valor |
|---------|-------|
| Total de sprints | 7 (incluyendo Sprint 0 de setup) |
| Duración total | 14 semanas |
| Total de historias de usuario | 25 |
| Historias completadas | 25 (100%) |
| Total de Story Points | 151 |
| Velocidad promedio | 22.8 SP/sprint (sprints 1-6) |
| Tests unitarios escritos | 71 |
| Cobertura estimada | ~93% en módulos cubiertos |
| Documentos generados | 15 |

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

### Refactorización Arquitectónica (3 HU)

| HU-ID | Historia | SP | Estado |
|-------|----------|----|--------|
| HU-023 | Migración Selectiva de Lógica (Pattern B) | 8 | ✅ Done |
| HU-024 | Estandarización de Documentación "Thin Client" | 3 | ✅ Done |
| HU-025 | Coexistencia de Lineamientos Visuales | 3 | ✅ Done |

---

## 4. Principales Logros

1. **Arquitectura hexagonal implementada** — Ambos módulos siguen el Pattern B con separación clara de capas (data, feature, ui, models, dto), facilitando el mantenimiento y las pruebas.

2. **Estado reactivo con Facade + BehaviorSubject** — El estado de cada módulo está centralizado en el Facade, los componentes son solo lectores del estado, sin lógica de negocio.

3. **71 tests unitarios** — Cobertura ~93% en Facades y Mappers, siguiendo el patrón AAA con nomenclatura `shouldXWhenY`.

4. **Exportación a Excel profesional** — El `ExcelService` genera workbooks con múltiples hojas, formato con colores, totales y filtros usando ExcelJS.

5. **Sincronización selectiva entre ramas** — Se logró unificar la lógica técnica de vanguardia (proveniente de la rama institucional) manteniendo la estabilidad visual requerida en la rama principal.

6. **Cero lógica financiera en el frontend** — Todos los cálculos de matrícula, descuentos y totales son responsabilidad del backend. El frontend solo presenta los datos.

7. **Documentación de Decisiones Arquitectónicas (ADR)** — Se formalizó el porqué de cada decisión técnica, asegurando la trazabilidad del proyecto.

---

## 5. Principales Desafíos

| Desafío | Cómo se resolvió |
|---------|-----------------|
| Normalización de porcentajes (ratio 0-1 vs. porcentaje 0-100) | Se implementó el manejo nominal desde el backend para evitar multiplicaciones en el cliente. |
| Control de edición concurrente en tablas complejas | Se implementó el flag `isAnyEditActive` que bloquea ediciones simultáneas. |
| Encadenamiento de llamadas HTTP en el ApiService | Se movió la lógica de `switchMap` al Facade, manteniendo el ApiService puro. |
| Generación de Excel con múltiples hojas y formato | Se usó ExcelJS con una arquitectura de métodos privados por hoja. |
| Migración selectiva de lógica sin afectar la UI | Se realizó una auditoría manual y técnica para extraer solo servicios y modelos de la rama institucional. |
| Consistencia de documentación entre dos realidades visuales | Se creó una matriz de estado actual que define qué sigue lineamientos y qué no. |
| Manejo de nulos en DTOs del backend | El Mapper aplica defaults explícitos (`?? 0`, `?? []`, `?? ''`) para todos los campos opcionales. |

---

## 6. Lecciones Aprendidas

1. **La documentación es parte del código** — Sincronizar la documentación técnica al mismo tiempo que la lógica evita la "desviación de realidad" entre lo que se dice y lo que se hace.

2. **Separar Lógica de Visual es vital** — Gracias al Pattern B, pudimos cambiar toda la lógica interna de los módulos sin romper ni un solo estilo CSS de la interfaz original.

3. **Definir los contratos de API antes de implementar** — Los DTOs deben estar acordados con el backend antes de escribir el Mapper para evitar refactorizaciones costosas.

4. **Los tests del Mapper son críticos en migraciones** — Detectan errores de mapeo inmediatamente después de traer los nuevos DTOs del backend.

5. **Scrum Lite es flexible** — Permitió añadir un Sprint 6 de refactorización cuando se identificó la necesidad de sincronizar las ramas.

---

## 7. Conclusiones sobre la Metodología

Scrum Lite demostró ser la metodología correcta para este proyecto por las siguientes razones:

- **Adaptabilidad:** Cuando surgió la necesidad de sincronizar con la rama institucional, el equipo pudo pivotar rápidamente sin perder el foco en la estabilidad visual.

- **Visibilidad:** El uso de ADRs (Architectural Decision Records) mejoró la transparencia sobre el porqué de la coexistencia de ramas.

- **Calidad:** La "Lógica Cero" en el frontend garantiza que la calidad de los datos dependa de una única fuente de verdad (Backend).

---

## 8. Documentación Generada

| Documento | Ruta |
|-----------|------|
| Índice general | `docs/README.md` |
| Product Backlog | `docs/management/product-backlog.md` |
| Sprint Backlog | `docs/management/sprint-backlog.md` |
| Decisiones de Arquitectura | `docs/management/frontend-architecture-decisions.md` |
| Arquitectura Cero Lógica | `docs/architecture/arquitectura-cero-logica.md` |
| Contrato API | `docs/api/contrato-backend-frontend.md` |
| Patrón Visual Legacy | `docs/design-system/legacy-visual-pattern.md` |
| Design System TIC v3 | `docs/design-system/design-system-tic-v3.md` |
| Resumen Scrum | `docs/scrum/resumen-final.md` |
