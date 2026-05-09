# Changelog — Módulos Matrícula Financiera e Información Presupuestaria

**Período:** 2026-05-07 al 2026-05-08  
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
