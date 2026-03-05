export interface PeriodoAcademico {
    periodo: number;
    año: number;
}

export interface ConfiguracionReporteFinanciero {
    id: number;
    esReporteFinal: boolean;
    biblioteca: number;
    recursosComputacionales: number;
    valorMatricula: number;
    valorSMLV: number;
    totalNeto: number;
    totalDescuentos: number;
    totalIngresos: number;
    objPeriodoAcademico: PeriodoAcademico;
}

export interface ProyeccionEstudiante {
    codigoEstudiante: string;
    nombre: string;
    identificacion: number;
    apellido: string;
    estaPago: boolean;
    porcentajeVotacion: number;
    porcentajeBeca: number;
    grupoInvestigacion: string;
    porcentajeEgresado: number;
}

export interface ReporteProyeccionEstudiantes {
    estudiantes: ProyeccionEstudiante[];
    objConfiguracion: ConfiguracionReporteFinanciero;
    periodo: PeriodoAcademico;
}

export interface ReporteEstudiantes {
    estudiantes: ProyeccionEstudiante[];
    objConfiguracion: ConfiguracionReporteFinanciero;
    periodo: PeriodoAcademico;
}

export interface GastoGeneral {
    idGastoGeneral: number;
    categoria: string;
    descripcion: string;
    monto: number;
}

export interface ConfiguracionReporteGrupos {
    id?: number;
    aUIPorcentaje: number;
    excedentesMaestria: number;
    aUIValor: number;
    ingresosNetos: number;
    valorADistribuir: number;
    item1: number;
    item2: number;
    imprevistos: number;
    objPeriodoAcademico: PeriodoAcademico;
    gastosGenerales: GastoGeneral[];
}

export interface ReportePorGrupos {
    totalNeto: number;
    aportePrimerSemestre: number;
    aporteSegundoSemestre: number;
    participacionPrimerSemestre: number;
    participacionSegundoSemestre: number;
    participacionPorAño: number;
    presupuestoPorGrupoItem1: number;
    presupuestoPorGrupoItem2: number;
    presupuestoPorGrupo: number;
    imprevistos: number;
    presupuestoPorGrupoImprevistos: number;
    vigenciasAnteriores: number;
    gastosGenerales: GastoGeneral[];
    objConfiguracionReporteGrupos: ConfiguracionReporteGrupos;
}

export interface PorcentajeGrupo {
    idGrupo: string;
    nombreGrupo: string;
    porcentaje: number;
}

export interface ValorGrupo {
    idGrupo: string;
    nombreGrupo: string;
    valor: number;
}

export interface Items {
    item1: number;
    item2: number;
}
