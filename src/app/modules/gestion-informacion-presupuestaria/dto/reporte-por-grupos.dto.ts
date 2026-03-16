import { GastoGeneralDTORespuesta } from "./gasto-general.dto";
import { PeriodoAcademicoDTORespuesta } from "./periodo-academico.dto";

export interface ReportePorGruposFilaDTORespuesta {
    grupo?: { nombre: string };
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
}

// Estructura real devuelta por el backend (ObtenerReportePorGruposDTORespuesta)
export interface ReportePorGruposDTORespuesta {
    gastosGenerales: GastoGeneralDTORespuesta[];
    idConfiguracionReporteGrupos: number;
    auiporcentaje: number;
    auivalor: number;
    excedentesMaestria: number;
    ingresosNetos: number;
    valorADistribuir: number;
    item1: number;
    item2: number;
    imprevistos: number;
    objPeriodoAcademico: PeriodoAcademicoDTORespuesta;
    reportesPorGrupos: ReportePorGruposFilaDTORespuesta[];
}
