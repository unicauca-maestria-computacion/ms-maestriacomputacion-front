# Changelog — Módulos Matrícula Financiera e Información Presupuestaria

**Período:** 2026-05-07 al 2026-05-09  
**Autor:** Daniel Felipe Contreras Tobar  
**Contexto:** Correcciones post-implementación del spec, alineación con Design System TIC v3 y mejoras de UX

---

## Resumen ejecutivo

Tras la implementación inicial guiada por el spec (`tasks.md`), se realizó una sesión de revisión y corrección que abarcó:

1. Corrección de errores TypeScript en DTOs y componentes
2. Alineación visual con el Design System TIC v3 de la Universidad del Cauca
3. Corrección de lógica de estados de pago
4. Eliminación de funcionalidades no requeridas
5. Mejora de la presentación de datos en vistas de detalle
6. Aplicación de Atomic Design para eliminar duplicación

---

## Correcciones técnicas

### TS-001 — Error de tipo en `ActualizarParticipacionDTOPeticion`

**Archivo:** `gestion-informacion-presupuestaria/feature/reporte-por-grupos/reporte-por-grupos.component.ts`  
**Error:** `Type '{ idGrupo: string; nombreGrupo: string; porcentaje: number; ... }' is not assignable to type 'ActualizarParticipacionDTOPeticion'`  
**Causa:** El objeto literal usaba `idGrupo: string` y `porcentaje` en lugar de los campos reales del DTO.  
**Corrección:** Reemplazado por `{ grupoId: number, porcentajeParticipacion: number, periodoAcademicoId: number }` según `porcentaje-grupo.dto.ts`.

---

### TS-002 — Campo `grupoNombre` no tipado en el modelo `Estudiante`

**Archivos:** `models/domain-models.ts`, `dto/estudiante.dto.ts`, `data/mapper.service.ts`  
**Causa:** El API devuelve `grupoNombre` pero el campo no existía en el modelo de dominio ni en el DTO.  
**Corrección:** Agregado `grupoNombre?: string` en `Estudiante`, `EstudianteDTORespuesta` y mapeado en `mappearDeRespuestaAEstudiante`.

---

## Correcciones de diseño — Design System TIC v3

### DS-001 — Fuentes institucionales no cargadas

**Archivo:** `src/index.html`  
**Causa:** Las fuentes `Titillium Web`, `Open Sans` y `Material Symbols Rounded` no estaban importadas, causando que los íconos de Material Symbols se mostraran como texto literal (ej: `calendar_month` en lugar del ícono).  
**Corrección:** Agregadas las tres fuentes en `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700;900&family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
```

---

### DS-002 — Badge de período usando `p-tag` en lugar del componente institucional

**Archivo:** `resumen-matricula-estudiante.component.html`  
**Causa:** Se usaba `p-tag` de PrimeNG con `severity="info"` para mostrar el período activo.  
**Corrección:** Reemplazado por `app-periodo-badge` con:
- `border-radius: 9999px` (`--radius-full`)
- Color `#5056AC` (primary-40 M3)
- Ícono `calendar_month` de Material Symbols Rounded (18px inline)
- Tipografía Titillium Web Bold 700, 16px, letter-spacing 0.15px (H4 tabla desarrollo)

---

### DS-003 — Spinner circular no corresponde al Design System

**Archivos:** 6 templates (3 en matrícula financiera, 3 en información presupuestaria)  
**Causa:** Se usaba `p-progressSpinner` de PrimeNG. El Design System TIC v3 especifica `mat-progress-bar` (barra lineal).  
**Corrección:** Reemplazado por `app-uni-progress-bar` — barra lineal indeterminada con color `#000066` implementada con CSS puro en `styles.scss`.

---

### DS-004 — Estados de pago con colores incorrectos

**Archivos:** `matricula-financiera.component.ts`, `detalle-estudiante.component.ts`, `resumen-matricula-estudiante.component.ts`  
**Causa:** Se usaban solo 2 estados (`true`/`false`) con severities incorrectos. El estado `null` (pendiente) no estaba contemplado.  
**Corrección:** Implementados 3 estados reales:

| `estaPago` | Severity | Color |
|---|---|---|
| `true` | `success` | `#5BAE40` |
| `false` | `danger` | `#DB141C` |
| `null/undefined` | `warning` | `#FFB000` |

---

## Correcciones de funcionalidad

### FUNC-001 — Botón "Iniciar nueva matrícula" no requerido

**Archivo:** `matricula-financiera.component.html`, `matricula-financiera.component.ts`  
**Causa:** El spec incluía un botón para iniciar matrícula, pero esta funcionalidad no es responsabilidad del frontend.  
**Corrección:** Eliminados:
- Botón "Iniciar nueva matrícula" del template
- `p-confirmDialog` asociado
- Método `confirmarIniciarMatricula()` del TS
- Subject `iniciarMatricula$` y método `configurarIniciarMatricula()`
- `ConfirmationService` del constructor y `providers`
- Imports de `exhaustMap`, `catchError`, `EMPTY` que quedaron sin uso

---

### FUNC-002 — Dropdown de estados con valores incorrectos

**Archivo:** `matricula-financiera.component.ts`  
**Causa:** El dropdown de filtro tenía 7 opciones basadas en el enum `EstadoMatricula` (AL_DIA, MORA, EXONERADO, etc.) que no corresponden a la realidad del API.  
**Corrección:** Reducido a 4 opciones que reflejan los 3 estados reales de `estaPago`:
```typescript
readonly estadosMatricula = [
    { label: 'Todos los estados', value: 'TODOS' },
    { label: 'Al día',            value: 'true'  },
    { label: 'No pagó',           value: 'false' },
    { label: 'Pendiente',         value: 'null'  },
];
```

---

### FUNC-003 — Columna "Valor SMLV" mostraba `1.00` para todos los estudiantes

**Archivo:** `matricula-financiera.component.html`  
**Causa:** El endpoint `POST /estudiantes` (listado) devuelve `valorEnSMLV: 1` para todos los registros. El backend no calcula este valor en el listado, solo en el detalle individual.  
**Corrección:** Eliminada la columna "Valor SMLV" del listado. El valor correcto solo se muestra en la vista de detalle del estudiante.

---

### FUNC-004 — Porcentaje de beca con pipe incorrecto

**Archivos:** `resumen-matricula-estudiante.component.html`, `detalle-estudiante.component.html`  
**Causa:** Se usaba `{{ beca.porcentaje | percent:'1.0-2' }}` pero el valor ya viene como entero (ej: `25`, no `0.25`), lo que mostraba `2500%`.  
**Corrección:** Reemplazado por `{{ beca.porcentaje }}%`.

---

## Mejoras de presentación de datos

### UX-001 — Datos del estudiante incompletos en vistas de detalle

**Archivos:** `resumen-matricula-estudiante.component.html`, `detalle-estudiante.component.html`  
**Causa:** Los templates originales no mostraban todos los campos disponibles en el modelo `Estudiante`.  
**Corrección:** Agregados los campos faltantes:

| Campo | Antes | Después |
|-------|-------|---------|
| `nombre` + `apellido` | ✅ | ✅ |
| `identificacion` | ✅ | ✅ |
| `codigo` | ✅ | ✅ |
| `cohorte` | ✅ | ✅ |
| `periodoIngreso` | ✅ | ✅ |
| `semestreFinanciero` | ✅ | ✅ |
| `semestreAcademico` | ❌ | ✅ |
| `grupoNombre` | ❌ | ✅ |
| `esEgresadoUnicauca` | ❌ | ✅ |
| `aplicaVotacion` | ❌ | ✅ |
| `valorEnSMLV` | ✅ | ✅ |
| `estaPago` | ✅ | ✅ |
| `becasDescuentos` | ✅ | ✅ |
| `materias` | ✅ | ✅ |

---

### UX-002 — Becas y descuentos como tarjeta separada

**Archivos:** `resumen-matricula-estudiante.component.html`, `detalle-estudiante.component.html`  
**Causa:** Las becas estaban dentro de la tarjeta "Resumen Financiero" como tabla anidada.  
**Corrección:** Extraídas a su propia `p-card` con el mismo patrón de grid `campo-label`/`campo-valor` que el resto de las tarjetas.

---

### UX-003 — Materias como grid en lugar de tabla

**Archivos:** `resumen-matricula-estudiante.component.html`, `detalle-estudiante.component.html`  
**Causa:** Las materias se mostraban en una `p-table` con encabezados de columna.  
**Corrección:** Reemplazadas por el patrón grid `campo-label`/`campo-valor` consistente con las demás tarjetas.

---

## Atomic Design — Refactorización de componentes

### AD-001 — Creación de átomos y moléculas compartidos

Se identificaron 6 patrones repetidos en los 5 componentes feature de ambos módulos y se extrajeron a componentes reutilizables en `SharedModule`:

| Componente | Tipo | Patrón eliminado |
|-----------|------|-----------------|
| `app-uni-progress-bar` | Átomo | `p-progressSpinner` (6 ocurrencias) |
| `app-periodo-badge` | Átomo | Badge de período con `p-tag` |
| `app-campo-dato` | Átomo | Par `campo-label`/`campo-valor` |
| `app-page-header` | Molécula | Encabezado con línea roja (5 ocurrencias) |
| `app-estado-vacio` | Molécula | Bloque de estado vacío (5 ocurrencias) |
| `app-uni-card-header` | Molécula | Header de `p-card` con fondo `#000066` (10+ ocurrencias) |

Ver documentación completa: [`design-system/atomic-design.md`](../design-system/atomic-design.md)

---

## Encoding — Problema identificado (pendiente de corrección en backend)

**Síntoma:** Nombres con caracteres especiales se muestran corruptos (ej: `MetodologÃ­a`, `OrdoÃ±ez`).  
**Causa:** El backend devuelve JSON con encoding Latin-1/ISO-8859-1 pero sin declarar `charset=UTF-8` en el `Content-Type`.  
**Estado:** No corregible en el frontend. Requiere configuración en el backend Spring Boot:
```properties
spring.http.encoding.charset=UTF-8
spring.http.encoding.force=true
```
O en el controlador:
```java
@RequestMapping(produces = "application/json;charset=UTF-8")
```

---

## Archivos modificados — Resumen

### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `src/app/shared/components/uni-progress-bar/uni-progress-bar.component.ts` | Átomo: barra de progreso |
| `src/app/shared/components/periodo-badge/periodo-badge.component.ts` | Átomo: badge de período |
| `src/app/shared/components/campo-dato/campo-dato.component.ts` | Átomo: par label/valor |
| `src/app/shared/components/page-header/page-header.component.ts` | Molécula: encabezado de página |
| `src/app/shared/components/estado-vacio/estado-vacio.component.ts` | Molécula: estado vacío |
| `src/app/shared/components/uni-card-header/uni-card-header.component.ts` | Molécula: header de tarjeta |

### Archivos modificados
| Archivo | Cambios |
|---------|---------|
| `src/index.html` | Fuentes institucionales agregadas |
| `src/styles.scss` | `.uni-progress-bar`, `.periodo-badge`, `.campo-label`, `.campo-valor` |
| `src/app/shared/shared.module.ts` | 6 nuevos componentes registrados |
| `src/app/modules/gestion-matricula-financiera/models/domain-models.ts` | `grupoNombre` agregado a `Estudiante` |
| `src/app/modules/gestion-matricula-financiera/dto/estudiante.dto.ts` | `grupoNombre` agregado a `EstudianteDTORespuesta` |
| `src/app/modules/gestion-matricula-financiera/data/mapper.service.ts` | `grupoNombre` mapeado |
| `src/app/modules/gestion-matricula-financiera/feature/matricula-financiera/matricula-financiera.component.ts` | Eliminado `iniciarMatricula`, estados corregidos |
| `src/app/modules/gestion-matricula-financiera/feature/matricula-financiera/matricula-financiera.component.html` | Atomic Design, columna SMLV eliminada |
| `src/app/modules/gestion-matricula-financiera/feature/detalle-estudiante/detalle-estudiante.component.html` | Todos los datos, Atomic Design |
| `src/app/modules/gestion-matricula-financiera/feature/detalle-estudiante/detalle-estudiante.component.ts` | Estados de pago corregidos |
| `src/app/modules/gestion-matricula-financiera/feature/resumen-matricula-estudiante/resumen-matricula-estudiante.component.html` | Todos los datos, Atomic Design |
| `src/app/modules/gestion-matricula-financiera/feature/resumen-matricula-estudiante/resumen-matricula-estudiante.component.ts` | Estados de pago corregidos |
| `src/app/modules/gestion-informacion-presupuestaria/feature/reporte-por-grupos/reporte-por-grupos.component.ts` | DTO corregido |
| `src/app/modules/gestion-informacion-presupuestaria/feature/reporte-por-grupos/reporte-por-grupos.component.html` | Atomic Design |
| `src/app/modules/gestion-informacion-presupuestaria/feature/reporte-final/reporte-final.component.html` | Atomic Design |
| `src/app/modules/gestion-informacion-presupuestaria/feature/proyeccion-reporte/proyeccion-reporte.component.html` | Atomic Design |
---

## Jornada 2026-05-09 — Optimización Arquitectónica y Estandarización Final

### ARQ-001 — Refactorización SCSS (Principios DRY & Atomic Design)

**Archivos:** `src/assets/sass/layout/_financial-reports.scss`, `src/assets/sass/layout/_layout.scss`  
**Problema:** Se detectó una redundancia de estilos de más de 15KB entre los componentes de reportes, lo que causaba advertencias de presupuesto en el build.  
**Solución:**
- Centralización de clases estructurales (`.config-panel`, `.unified-table`, `.totales-container`) en un layout global especializado.
- Limpieza de archivos `.scss` locales, eliminando definiciones duplicadas y forzando el consumo de estilos atómicos.
- Resultado: Reducción del peso de los componentes y cumplimiento de los budgets originales de 10KB en `angular.json`.

---

### DS-005 — Notificaciones e Interacciones Oficiales (TIC v3 2026)

**Archivos:** `src/assets/sass/layout/_financial-notifications.scss`, 6 templates HTML.  
**Problema:** Los mensajes de error usaban el Rojo Institucional (prohibido por el manual para errores) y no seguían la geometría M3 (radius 28px para diálogos).  
**Solución:**
- **Color de Error:** Se migró al **Naranja #ED7D31** para todos los Toasts y Mensajes de error.
- **Geometría Oficial:** Implementación de `border-radius: 4px` para Toasts y **28px** para Diálogos de Confirmación.
- **Línea Lateral:** Agregada línea de acento izquierda de 4px según especificación del manual Punto 10.
- **Enfoque Seguro:** Implementado mediante clases `uni-toast`, `uni-dialog` y `uni-message` para evitar afectar a otros módulos del sistema.

---

### UX-004 — UX Writing: Ustedeo y Propuesta de Solución

**Archivos:** `reporte-por-grupos.component.ts`, `reporte-final.component.ts`, `matricula-financiera.component.ts`, entre otros.  
**Problema:** Mensajes de error pasivos ("No se pudo cargar") o técnicos que no guiaban al usuario.  
**Solución:**
- Ajuste al **Ustedeo** institucional ("Por favor, verifique su conexión").
- Aplicación de la **Regla de Solución**: Todo mensaje de error ahora propone una acción correctiva (ej: "Por favor, intente nuevamente" o "Contacte al administrador").

---

### PERF-001 — Estrategia OnPush y Gestión de Memoria

**Archivos:** Auditoría completa de componentes en ambos módulos.  
**Solución:**
- **OnPush Garantizado:** Se verificó que el 100% de los componentes TypeScript (12/12) utilicen `ChangeDetectionStrategy.OnPush`.
- **Memory Leak Prevention:** Implementación sistemática de `takeUntil(this.destroy$)` en todas las suscripciones manuales de los componentes.
- **Async Pipe:** Priorización del pipe `async` en plantillas para la resolución automática de observables.

---

## Archivos modificados — Adenda 09/05

| Archivo | Cambios |
|---------|---------|
| `angular.json` | Reversión de budgets a 10KB (optimización exitosa) |
| `src/assets/sass/layout/_financial-reports.scss` | Centralización de layout de reportes |
| `src/assets/sass/layout/_financial-notifications.scss` | Notificaciones y diálogos TIC v3 |
| `src/app/modules/gestion-informacion-presupuestaria/feature/reporte-por-grupos/reporte-por-grupos.component.scss` | Eliminación de 377 líneas redundantes |
| `src/app/modules/gestion-informacion-presupuestaria/feature/reporte-final/reporte-final.component.scss` | Eliminación de 131 líneas redundantes |
| `src/app/modules/gestion-informacion-presupuestaria/feature/proyeccion-reporte/proyeccion-reporte.component.scss` | Eliminación de 148 líneas redundantes |
| `src/app/modules/gestion-informacion-presupuestaria/ui/configuracion-proyeccion-card/` | [NUEVO] Componente reutilizable de configuración |
| `src/app/modules/gestion-informacion-presupuestaria/gestion-informacion-presupuestaria.module.ts` | Registro de nuevo componente UI |

---

### AD-002 — Componente Reutilizable: Tarjeta de Configuración de Proyección

**Archivos:** `src/app/modules/gestion-informacion-presupuestaria/ui/configuracion-proyeccion-card/`  
**Problema:** La tarjeta de configuración (Biblioteca, Recursos, SMLV) estaba duplicada y hardcodeada tanto en Proyección como en Reporte Final. En Proyección requería lógica de edición, mientras que en Reporte Final solo lectura.  
**Solución:**
- Creación de `ConfiguracionProyeccionCardComponent` con Input `isEditable`.
- Centralización del manejo de estados de edición (`clonedConfig`) dentro del componente UI (Dumb-ish).
- Implementación de mecanismo de guardado mediante EventEmitters.
- **Seguridad de UI:** El componente bloquea su edición si detecta que otra parte del proceso (ej: edición de filas en la tabla) está activa, evitando inconsistencias de datos.
- Resultado: Eliminación de ~80 líneas de HTML/TS duplicadas en los componentes Feature.

---

### DS-006 — Optimización de Alta Densidad para Reportes Extensos

**Archivo:** `src/app/modules/gestion-informacion-presupuestaria/ui/tabla-estudiantes-reporte/`  
**Problema:** Las tablas de reportes financieros contienen hasta 14 columnas, lo que causaba desbordamiento horizontal excesivo y dificultad de lectura en pantallas estándar (1366px).  
**Solución:**
- **Geometría Adaptativa:** Se aplicó una reducción estratégica del font-size a **11.5px** en celdas y **10.5px** en cabeceras.
- **Distribución Inteligente:**
    - Columna **Nombre**: Expandible con wrap permitido y `min-width: 160px`.
    - Columnas **Monetarias**: Anchos fijos optimizados (~95px) con `tabular-nums` para alineación perfecta de cifras.
- **Encabezados Multilínea:** Se habilitó `white-space: normal` en `th` para permitir saltos de línea, reduciendo el ancho total necesario sin perder descriptividad.
- **Micro-espaciado:** Reducción de padding a **4px 3px**, maximizando el área útil de datos sin sacrificar la legibilidad institucional.
- **Cumplimiento TIC v3:** Se mantuvo el uso de **Open Sans**, bordes `#E0E0E0` y el patrón de filas alternas (Zebra) especificado en el manual.

---

### UI-007 — Unificación de Estética entre Módulos (Matrícula vs. Presupuesto)

**Archivos:** `matricula-financiera.component.html`, `matricula-financiera.component.scss`  
**Problema:** Discrepancias visuales en los títulos de sección y estilos de tabla entre los módulos financieros y presupuestarios.  
**Solución:**
- **Encabezados Institucionales:** Se migró el título de "Listado de Estudiantes" en Matrícula al estándar `h2` con **Titillium Web** y color `#000066`, unificando la jerarquía visual con el módulo de Presupuesto.
- **Normalización de Texto:** Se eliminó el resaltado azul y negrita en los nombres de los estudiantes en la tabla de Matrícula para favorecer un diseño más sobrio y homogéneo.
- **Densidad de Tabla:** Se aplicó el estándar de **Alta Densidad (DS-006)** a la tabla de Matrícula, reduciendo fuentes y paddings para lograr una paridad visual del 100% entre ambos módulos.
