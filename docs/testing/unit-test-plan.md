# Plan de Pruebas Unitarias — ms-maestriacomputacion-front

**Fecha:** 2026-05-04
**Framework:** Jasmine + Karma + Istanbul
**Módulos en alcance:** gestion-matricula-financiera, gestion-informacion-presupuestaria, shared/pipes

---

## 1. Alcance

Este plan cubre las pruebas unitarias de los dos módulos principales del frontend Angular desarrollados como parte del anteproyecto:

- **gestion-matricula-financiera** — gestión de matrículas financieras de estudiantes
- **gestion-informacion-presupuestaria** — reportes financieros y presupuestarios por grupos de investigación
- **shared/pipes** — pipes de formato reutilizables entre módulos

---

## 2. Estrategia de Testing

### Capas probadas

| Capa | Herramienta | Estrategia |
|------|-------------|------------|
| **Facade (Application)** | Jasmine + SpyObj | Instanciación directa sin TestBed. Mocks de ApiService y MapperService con `jasmine.createSpyObj`. Verificación de estado reactivo via BehaviorSubject. |
| **Mapper (Infrastructure)** | Jasmine puro | Instanciación directa. Sin mocks — el mapper es una función pura. Verificación campo a campo. |
| **Componente UI dumb (Presentation)** | TestBed + Jasmine | TestBed mínimo. `overrideComponent` para desactivar OnPush en tests. Verificación de `@Input` y getter. |
| **Pipes (Shared)** | Jasmine puro | Instanciación directa. Sin mocks. Verificación de transformación de valores. |

### Patrón AAA

Todos los tests siguen el patrón Arrange / Act / Assert con comentarios explícitos:

```typescript
it('shouldXWhenY', (done) => {
  // Arrange
  const mockData = { ... };
  apiSpy.method.and.returnValue(of(mockData));

  // Act
  service.operation().subscribe({
    next: (result) => {
      // Assert
      expect(result).toEqual(expectedValue);
      done();
    }
  });
});
```

### Manejo de asincronía

- **Observables con `of()`**: usar `done` callback. Para `finalize`, usar `setTimeout` en el callback `complete`/`error` para ceder el turno al event loop.
- **BehaviorSubject**: usar `take(1)` para leer el valor puntual.
- **Errores**: verificar estado del Facade en el callback `error` del subscribe.

---

## 3. Casos de Prueba por Módulo

### 3.1 gestion-matricula-financiera — Facade

**Archivo:** `src/app/modules/gestion-matricula-financiera/data/facade.service.spec.ts`

**Dependencias mockeadas:**
- `GestionMatriculaFinancieraApiService` — métodos: `obtenerEstudiantes`, `obtenerEstudiante`, `obtenerPeriodosAcademicos`, `iniciarNuevaMatriculaFinanciera`
- `GestionMatriculaFinancieraMapperService` — métodos: `mappearDePeriodoAcademicoAPeticion`, `mappearDeListaRespuestaAEstudiante`, `mappearDeRespuestaAEstudiante`, `mappearDeListaRespuestaAPeriodoAcademico`

| TC-ID | Caso de Prueba | Tipo | Precondición | Resultado Esperado |
|-------|---------------|------|--------------|-------------------|
| TC-MF-F-01 | Estado inicial de `loading$` | Estado | Facade recién instanciado | `false` |
| TC-MF-F-02 | Estado inicial de `error$` | Estado | Facade recién instanciado | `null` |
| TC-MF-F-03 | Estado inicial de `estudiantes$` | Estado | Facade recién instanciado | `[]` |
| TC-MF-F-04 | `loading$` emite `true` luego `false` al obtener estudiantes exitosamente | Happy path | API retorna lista | Secuencia `[false, true, false]` |
| TC-MF-F-05 | `estudiantes$` se actualiza al obtener estudiantes exitosamente | Happy path | API retorna lista | Lista con 1 estudiante |
| TC-MF-F-06 | `error$` se actualiza cuando la API falla al obtener estudiantes | Error path | API lanza error | `error$` no nulo |
| TC-MF-F-07 | `loading$` vuelve a `false` cuando la API falla | Error path | API lanza error | `loading$` = `false` |
| TC-MF-F-08 | `loading$` emite `true` luego `false` al obtener estudiante por código | Happy path | API retorna estudiante | Secuencia correcta |
| TC-MF-F-09 | `estudianteSeleccionado$` se actualiza al obtener estudiante | Happy path | API retorna estudiante | Estudiante con código correcto |
| TC-MF-F-10 | `error$` se actualiza cuando falla obtener estudiante | Error path | API lanza error | `error$` no nulo |
| TC-MF-F-11 | `loading$` emite correctamente al obtener períodos | Happy path | API retorna períodos | Secuencia correcta |
| TC-MF-F-12 | `periodos$` se actualiza al obtener períodos | Happy path | API retorna períodos | Lista con 1 período |
| TC-MF-F-13 | `setPeriodoFiltro` guarda el período en el BehaviorSubject | Filtros | — | `getPeriodoFiltro()` retorna el período |
| TC-MF-F-14 | `getPeriodoFiltro` retorna el período guardado | Filtros | Período guardado | Período correcto |
| TC-MF-F-15 | `setSemestreFiltro` guarda el semestre | Filtros | — | `getSemestreFiltro()` = 3 |
| TC-MF-F-16 | `error$` se limpia al inicio de una nueva operación | Limpieza | Error previo existente | `error$` = `null` |

---

### 3.2 gestion-matricula-financiera — Mapper

**Archivo:** `src/app/modules/gestion-matricula-financiera/data/mapper.service.spec.ts`

| TC-ID | Caso de Prueba | Entidad | Resultado Esperado |
|-------|---------------|---------|-------------------|
| TC-MF-M-01 | Mapeo de PeriodoAcademico con todos los campos | PeriodoAcademico | Todos los campos mapeados correctamente |
| TC-MF-M-02 | Mapeo de PeriodoAcademico sin `anio` (usa `fechaInicio`) | PeriodoAcademico | `año` derivado de `fechaInicio` |
| TC-MF-M-03 | Mapeo de dominio a DTO de petición | PeriodoAcademicoDTOPeticion | Campos invertidos correctamente |
| TC-MF-M-04 | Mapeo de Docente con todos los campos | Docente | `nombre` y `apellido` correctos |
| TC-MF-M-05 | Mapeo de Materia con todos los campos | Materia | `codigo_oid`, `materia`, `grupoClase`, `objDocente` correctos |
| TC-MF-M-06 | Mapeo de BecaFinanciera con todos los campos | BecaFinanciera | Todos los campos mapeados |
| TC-MF-M-07 | Mapeo de BecaFinanciera con campos nulos | BecaFinanciera | Defaults aplicados (`''`, `null`, `0`) |
| TC-MF-M-08 | Mapeo de Estudiante con todos los campos | Estudiante | Todos los campos incluyendo colecciones |
| TC-MF-M-09 | Mapeo de Estudiante con colecciones nulas | Estudiante | Arrays vacíos `[]` |
| TC-MF-M-10 | Mapeo de lista de estudiantes | Lista Estudiante | 2 estudiantes con códigos correctos |

---

### 3.3 gestion-matricula-financiera — Componente UI

**Archivo:** `src/app/modules/gestion-matricula-financiera/ui/matricula-status-badge/matricula-status-badge.component.spec.ts`

| TC-ID | Caso de Prueba | Input | Resultado Esperado |
|-------|---------------|-------|-------------------|
| TC-MF-C-01 | Ácono para estado PENDIENTE | `estado = 'PENDIENTE'` | `icono = 'â³'` |
| TC-MF-C-02 | Ácono para estado AL_DIA | `estado = 'AL_DIA'` | `icono = '✅'` |
| TC-MF-C-03 | Ácono para estado MORA | `estado = 'MORA'` | `icono = 'âš ï¸'` |
| TC-MF-C-04 | Ácono para estado EXONERADO | `estado = 'EXONERADO'` | `icono = '🎓'` |
| TC-MF-C-05 | Ácono para estado BECADO | `estado = 'BECADO'` | `icono = 'ðŸ…'` |
| TC-MF-C-06 | Ácono para estado ANULADO | `estado = 'ANULADO'` | `icono = 'âŒ'` |
| TC-MF-C-07 | Ácono para estado desconocido | `estado = 'DESCONOCIDO'` | `icono = ''` |
| TC-MF-C-08 | Componente renderiza correctamente | `estado = 'AL_DIA'` | Componente instanciado, ícono accesible |

---

### 3.4 gestion-informacion-presupuestaria — Facade

**Archivo:** `src/app/modules/gestion-informacion-presupuestaria/data/facade.service.spec.ts`

**Dependencias mockeadas:**
- `GestionInformacionPresupuestariaApiService` — 12 métodos mockeados
- `GestionInformacionPresupuestariaMapperService` — 4 métodos mockeados

| TC-ID | Caso de Prueba | Tipo | Resultado Esperado |
|-------|---------------|------|-------------------|
| TC-IP-F-01 | Estado inicial de `loading$` | Estado | `false` |
| TC-IP-F-02 | Estado inicial de `error$` | Estado | `null` |
| TC-IP-F-03 | Estado inicial de `reporteProyeccionEstudiantes$` | Estado | `null` |
| TC-IP-F-04 | `loading$` emite correctamente al obtener períodos financieros | Happy path | Secuencia `[false, true, false]` |
| TC-IP-F-05 | `error$` se actualiza cuando falla obtener períodos | Error path | `error$` no nulo |
| TC-IP-F-06 | `loading$` emite correctamente al obtener proyección | Happy path | Secuencia correcta |
| TC-IP-F-07 | `reporteProyeccionEstudiantes$` se actualiza al obtener proyección | Happy path | Reporte con `totalNeto = 5000000` |
| TC-IP-F-08 | `error$` se actualiza cuando falla obtener proyección | Error path | `error$` no nulo |
| TC-IP-F-09 | `loading$` emite correctamente al actualizar proyección | Happy path | Secuencia correcta |
| TC-IP-F-10 | `reporteProyeccionEstudiantes$` se actualiza al actualizar proyección | Happy path | Reporte actualizado |
| TC-IP-F-11 | `loading$` emite correctamente al obtener reporte financiero | Happy path | Secuencia correcta |
| TC-IP-F-12 | `error$` se actualiza cuando falla obtener reporte financiero | Error path | `error$` no nulo |
| TC-IP-F-13 | `loading$` emite correctamente al obtener reporte por grupos | Happy path | Secuencia correcta |
| TC-IP-F-14 | `reporteGrupos$` se actualiza al obtener reporte por grupos | Happy path | Reporte con `totalNeto = 8000000` |
| TC-IP-F-15 | `error$` se actualiza cuando falla obtener reporte por grupos | Error path | `error$` no nulo |
| TC-IP-F-16 | `error$` se limpia al inicio de cada operación | Limpieza | `error$` = `null` |

---

### 3.5 gestion-informacion-presupuestaria — Mapper

**Archivo:** `src/app/modules/gestion-informacion-presupuestaria/data/mapper.service.spec.ts`

| TC-ID | Caso de Prueba | Entidad | Resultado Esperado |
|-------|---------------|---------|-------------------|
| TC-IP-M-01 | Mapeo de PeriodoFinanciero | PeriodoFinanciero | `periodo = 2`, `año = 2024` |
| TC-IP-M-02 | Mapeo de ConfiguracionReporteFinanciero completo | ConfiguracionReporteFinanciero | Todos los campos correctos |
| TC-IP-M-03 | Mapeo de ConfiguracionReporteFinanciero con porcentajes nulos | ConfiguracionReporteFinanciero | Defaults `0.10` y `0.05` aplicados |
| TC-IP-M-04 | Mapeo de ProyeccionEstudiante completo | ProyeccionEstudiante | Todos los campos incluyendo calculados |
| TC-IP-M-05 | Mapeo de ProyeccionEstudiante con campos nulos | ProyeccionEstudiante | Defaults `''`, `false`, `[]` aplicados |
| TC-IP-M-06 | Mapeo de ReporteProyeccionEstudiantes | ReporteProyeccionEstudiantes | Estudiantes, configuración y totales correctos |
| TC-IP-M-07 | Mapeo de ReporteEstudiantes | ReporteEstudiantes | Estudiantes y totales correctos |
| TC-IP-M-08 | Mapeo de GastoGeneral | GastoGeneral | `idGastoGeneral`, `categoria`, `monto` correctos |
| TC-IP-M-09 | Mapeo de ReportePorGrupoFila | ReportePorGrupoFila | Todos los campos incluyendo calculados |
| TC-IP-M-10 | Mapeo de ReportePorGrupos completo | ReportePorGrupos | Filas, gastos y configuración correctos |
| TC-IP-M-11 | Mapeo de ReportePorGrupos con colecciones nulas | ReportePorGrupos | Arrays vacíos `[]` |

---

### 3.6 shared/pipes

**Archivos:** `src/app/shared/pipes/format-currency.pipe.spec.ts`, `format-percent.pipe.spec.ts`

| TC-ID | Caso de Prueba | Input | Resultado Esperado |
|-------|---------------|-------|-------------------|
| TC-SH-P-01 | FormatCurrency con número positivo | `1000000` | Contiene `'1.000.000'` |
| TC-SH-P-02 | FormatCurrency con null | `null` | `'â€“'` |
| TC-SH-P-03 | FormatCurrency con undefined | `undefined` | `'â€“'` |
| TC-SH-P-04 | FormatCurrency con cero | `0` | Contiene `'0'` |
| TC-SH-P-05 | FormatPercent con 2 decimales (default) | `25.5` | `'25.50 %'` |
| TC-SH-P-06 | FormatPercent con 0 decimales | `25.5, 0` | `'26 %'` |
| TC-SH-P-07 | FormatPercent con 1 decimal | `25.5, 1` | `'25.5 %'` |
| TC-SH-P-08 | FormatPercent con null | `null` | `'â€“'` |
| TC-SH-P-09 | FormatPercent con undefined | `undefined` | `'â€“'` |
| TC-SH-P-10 | FormatPercent con cero | `0` | `'0.00 %'` |

---

## 4. Criterios de Aceptación

Una suite de tests se considera **APROBADA** cuando:

- [ ] Todos los tests pasan (`0 failures`)
- [ ] Cobertura de líneas â‰¥ 80% en Facades y Mappers
- [ ] Cobertura de líneas â‰¥ 60% en componentes dumb
- [ ] Sin `fdescribe` ni `fit` en el código
- [ ] Sin `console.log` en los tests
- [ ] Todos los tests tienen al menos un `expect()`

---

## 5. Cómo ejecutar los tests

```bash
# Ejecutar todos los tests una vez (sin modo watch)
cd ms-maestriacomputacion-front
ng test --watch=false

# Ejecutar con reporte de cobertura
ng test --watch=false --code-coverage

# Ejecutar solo los tests de un módulo específico
ng test --watch=false --include="**/gestion-matricula-financiera/**/*.spec.ts"
ng test --watch=false --include="**/gestion-informacion-presupuestaria/**/*.spec.ts"
```

El reporte de cobertura se genera en `coverage/ms-maestriacomputacion-front/index.html`.
