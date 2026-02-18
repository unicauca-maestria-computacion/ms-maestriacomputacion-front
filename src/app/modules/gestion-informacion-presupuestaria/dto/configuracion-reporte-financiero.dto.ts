import { PeriodoAcademicoDTORespuesta, PeriodoAcademicoDTOPeticion } from "./periodo-academico.dto";

export interface ConfiguracionReporteFinancieroDTORespuesta {
    id: number;
    esReporteFinal: boolean;
    biblioteca: number;
    recursosComputacionales: number;
    valorMatricula: number;
    valorSMLV: number;
    totalNeto: number;
    totalDescuentos: number;
    totalIngresos: number;
    objPeriodoAcademico: PeriodoAcademicoDTORespuesta;
}

export interface ConfiguracionReporteFinancieroDTOPeticion {
    id?: number;
    biblioteca: number;
    recursosComputacionales: number;
    valorMatricula: number;
    valorSMLV: number;
    totalNeto: number;
    totalDescuentos: number;
    totalIngresos: number;
    objPeriodoAcademico: PeriodoAcademicoDTORespuesta;
}
