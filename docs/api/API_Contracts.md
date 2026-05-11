# Contratos de API — ms-maestriacomputacion-front

**Fecha:** 2026-05-04
**Módulos:** gestion-matricula-financiera, gestion-informacion-presupuestaria

---

## Módulo: gestion-matricula-financiera

### POST `/gestion-matricula-financiera/estudiantes`

**Descripción:** Obtiene la lista de estudiantes matriculados para un período académico.

**Request:**
```typescript
interface PeriodoAcademicoDTOPeticion {
  tagPeriodo?: number;       // Número del período (1 o 2)
  anio?: number;             // Año del período
  fechaInicio?: string;      // ISO date string
  fechaFin?: string;         // ISO date string
  fechaFinMatricula?: string; // ISO date string
  descripcion?: string;
  estado?: string;
}
```

**Response:** `EstudianteDTORespuesta[]`
```typescript
interface EstudianteDTORespuesta {
  codigo: string;
  nombre: string;
  apellido: string;
  identificacion: number;
  cohorte: number;
  periodoIngreso: string;
  semestreFinanciero: number;
  semestreAcademico?: number;
  valorEnSMLV?: number | null;
  esEgresadoUnicauca?: boolean;
  aplicaVotacion?: boolean;
  becas?: BecasDTORespuesta[];
  descuentos?: BecasDTORespuesta[];
  becasDescuentos: BecasDTORespuesta[];
  materias: MateriaDTORespuesta[];
  estaPago?: boolean;
}
```

---

### GET `/gestion-matricula-financiera/estudiantes/{codigo}`

**Descripción:** Obtiene el detalle financiero de un estudiante específico.

**Query params:** `tagPeriodo?: number`, `anio?: number`

**Response:** `EstudianteDTORespuesta` (mismo esquema que el listado)

---

### GET `/gestion-matricula-financiera/periodos`

**Descripción:** Obtiene la lista de períodos académicos disponibles.

**Response:** `PeriodoAcademicoDTORespuesta[]`
```typescript
interface PeriodoAcademicoDTORespuesta {
  id?: number;
  periodo?: number;
  anio?: number;
  tagPeriodo?: number;
  fechaInicio?: string;
  fechaFin?: string;
  fechaFinMatricula?: string;
  descripcion?: string;
  estado?: string;
}
```

---

### POST `/gestion-matricula-financiera/iniciar`

**Descripción:** Inicia un nuevo proceso de matrícula financiera.

**Request:** `{}` (body vacío)

**Response:** `boolean`

---

### GET `/gestion-matricula-financiera/estudiantes/{codigo}/descuento-voto`

**Descripción:** Verifica si un estudiante tiene descuento por votación.

**Response:** `boolean`

---

## Módulo: gestion-informacion-presupuestaria

### GET `/info-presupuestaria/periodos`

**Response:** `PeriodoAcademicoDto[]`
```typescript
interface PeriodoAcademicoDto {
  id: number;
  tagPeriodo: number;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  activo: boolean;
}
```

---

### GET `/info-presupuestaria/periodos/activos`
**Response:** `PeriodoAcademicoDto[]` — Solo períodos con `activo = true`

### GET `/info-presupuestaria/periodos/cerrados`
**Response:** `PeriodoAcademicoDto[]` — Solo períodos cerrados/inactivos

### GET `/info-presupuestaria/periodos/activos-y-cerrados`
**Response:** `PeriodoAcademicoDto[]` — Períodos activos y cerrados

### GET `/info-presupuestaria/periodos/proyeccion`
**Response:** `PeriodoAcademicoDto` — El período activo de proyección

---

### GET `/info-presupuestaria/proyeccion-estudiantes`

**Query params:** `tagPeriodo?: number`, `anio?: number`

**Response:** `ReporteProyeccionEstudiantesDTORespuesta`
```typescript
interface ReporteProyeccionEstudiantesDTORespuesta {
  periodo: PeriodoAcademicoDto;
  configuracion: ConfiguracionReporteFinancieroDTORespuesta;
  estudiantes: ProyeccionEstudianteDTORespuesta[];
  totalNeto?: number;
  totalDescuentos?: number;
  totalIngresos?: number;
}

interface ConfiguracionReporteFinancieroDTORespuesta {
  id: number;
  biblioteca: number;
  recursosComputacionales: number;
  valorSMLV: number;
  esReporteFinal: boolean;
  periodo: PeriodoAcademicoDto;
  porcentajeVotacionFijo: number;  // ratio 0-1
  porcentajeEgresadoFijo: number;  // ratio 0-1
}

interface ProyeccionEstudianteDTORespuesta {
  codigoEstudiante: string;
  identificacion: number;
  nombre: string;
  apellido: string;
  estaPago: boolean;
  aplicaVotacion: boolean;
  porcentajeBeca: number;          // ratio 0-1
  aplicaEgresado: boolean;
  grupoInvestigacion: string;
  valorEnSMLV: number;
  materias: MateriaDto[];
  estadoMatriculaFinanciera?: boolean;
  // Campos calculados por el backend:
  valorMatricula?: number;
  valorDescuentoVoto?: number;
  valorDescuentoBeca?: number;
  valorDescuentoEgresado?: number;
  totalDescuentos?: number;
  valorNeto?: number;
  totalNetoConDerechos?: number;
}
```

---

### PUT `/info-presupuestaria/proyeccion-estudiantes`

**Query params:** `tagPeriodo?: number`, `anio?: number`

**Request:**
```typescript
interface ProyeccionEstudianteDTOPeticion {
  codigoEstudiante: string;
  estaPago: boolean;
  aplicaVotacion: boolean;
  porcentajeBeca: number;    // ratio 0-1
  aplicaEgresado: boolean;
  grupoInvestigacion?: string;
}
```

**Response:** `ReporteEstudiantesDTORespuesta` (mismo esquema que proyección)

---

### GET `/info-presupuestaria/reporte-financiero`

**Query params:** `tagPeriodo: number`, `anio: number`

**Response:** `ReporteEstudiantesDTORespuesta` (mismo esquema que proyección, con `esReporteFinal = true`)

---

### GET `/info-presupuestaria/configuracion-reporte-financiero/periodo`

**Query params:** `tagPeriodo: number`, `anio: number`

**Response:** `number` — ID de la configuración del período

---

### PUT `/info-presupuestaria/configuracion-reporte-financiero/{id}`

**Request:**
```typescript
interface ConfiguracionReporteFinancieroDTOPeticion {
  biblioteca: number;
  recursosComputacionales: number;
  valorSMLV: number;
  esReporteFinal: boolean;
}
```

**Response:** `ReporteEstudiantesDTORespuesta`

---

### GET `/info-presupuestaria/reporte-por-grupos`

**Query params:** `anio: number`

**Response:** `ConsultaReportePorGruposDTORespuesta`
```typescript
interface ConsultaReportePorGruposDTORespuesta {
  periodo: PeriodoAcademicoDto;
  anio?: number;
  esEditable?: boolean;
  ingresoPeriodo1?: number;
  ingresoPeriodo2?: number;
  auiPorcentaje: number;       // ratio 0-1
  auiValor: number;
  excedentesMaestria: number;
  item1: number;               // ratio 0-1
  item2: number;               // ratio 0-1
  imprevistos: number;         // ratio 0-1
  totalIngresos: number;
  valorADistribuir: number;
  transferenciaUnicauca?: number;
  reportesPorGrupo: ReportePorGrupoDTORespuesta[];
  gastosGenerales: GastoGeneralDTORespuesta[];
  idConfiguracionReporteGrupos: number;
}

interface ReportePorGrupoDTORespuesta {
  grupoId: number;
  nombreGrupo: string;
  porcentajeParticipacion: number;   // ratio 0-1
  porcentajePrimerSemestre: number;  // ratio 0-1
  porcentajeSegundoSemestre: number; // ratio 0-1
  vigenciasAnteriores: number;
  presupuestoPorGrupo: number;
  presupuestoPorGrupoItem1: number;
  presupuestoPorGrupoItem2: number;
  imprevistosValor: number;
  totalNeto: number;
  aportePrimerSemestre: number;
  aporteSegundoSemestre: number;
}
```

---

### PUT `/info-presupuestaria/reporte-por-grupos/participacion`

**Request:**
```typescript
interface ActualizarParticipacionDTOPeticion {
  periodoAcademicoId: number;
  grupoId: number;
  porcentajeParticipacion: number;  // ratio 0-1
  semestre?: string;                // 'PRIMER' | 'SEGUNDO'
}
```

**Response:** `ConsultaReportePorGruposDTORespuesta`

---

### PUT `/info-presupuestaria/reporte-por-grupos/aui`
**Query params:** `periodoAcademicoId: number`, `porcentaje: number` (ratio 0-1)
**Response:** `ConsultaReportePorGruposDTORespuesta`

### PUT `/info-presupuestaria/reporte-por-grupos/excedentes`
**Query params:** `periodoAcademicoId: number`, `valor: number`
**Response:** `ConsultaReportePorGruposDTORespuesta`

### PUT `/info-presupuestaria/reporte-por-grupos/items`
**Query params:** `periodoAcademicoId: number`, `item1: number`, `item2: number` (ratios 0-1)
**Response:** `ConsultaReportePorGruposDTORespuesta`

### PUT `/info-presupuestaria/reporte-por-grupos/imprevistos`
**Query params:** `periodoAcademicoId: number`, `porcentaje: number` (ratio 0-1)
**Response:** `ConsultaReportePorGruposDTORespuesta`

### PUT `/info-presupuestaria/reporte-por-grupos/vigencias`
**Query params:** `periodoAcademicoId: number`, `grupoId: number`, `valor: number`
**Response:** `ConsultaReportePorGruposDTORespuesta`

---

### POST `/info-presupuestaria/reporte-por-grupos/gastos`

**Query params:** `periodoAcademicoId: number`

**Request:**
```typescript
interface GastoGeneralDTOPeticion {
  categoria: string;
  descripcion: string;
  monto: number;
  idConfiguracionReporteGrupos: number;
}
```

**Response:** `ConsultaReportePorGruposDTORespuesta`

---

### PUT `/info-presupuestaria/reporte-por-grupos/gastos/{id}`

**Query params:** `periodoAcademicoId: number`

**Request:** `GastoGeneralDTOPeticion`

**Response:** `ConsultaReportePorGruposDTORespuesta`

---

### DELETE `/info-presupuestaria/reporte-por-grupos/gastos/{id}`

**Query params:** `periodoAcademicoId: number`

**Response:** `ConsultaReportePorGruposDTORespuesta`

---

## Notas sobre convenciones

1. **Porcentajes:** El backend usa ratios (0-1). El frontend convierte a porcentajes (0-100) para display y de vuelta a ratio al enviar.
2. **Fechas:** Todas las fechas son strings ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).
3. **Montos:** Todos los montos monetarios son en COP (pesos colombianos).
4. **Errores HTTP:** El `AuthInterceptor` maneja 401 (refresh/logout), 403 (forbidden), 404 y 500 globalmente.
