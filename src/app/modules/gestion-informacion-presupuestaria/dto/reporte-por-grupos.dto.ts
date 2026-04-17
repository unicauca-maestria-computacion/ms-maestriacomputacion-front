import { GastoGeneralDTORespuesta } from './gasto-general.dto';
import { PeriodoAcademicoDto } from './periodo-financiero.dto';

export interface ReportePorGrupoDTORespuesta {
    grupoId: number;
    nombreGrupo: string;
    porcentajeParticipacion: number;
    porcentajePrimerSemestre: number;
    porcentajeSegundoSemestre: number;
    vigenciasAnteriores: number;
    presupuestoPorGrupo: number;
    presupuestoPorGrupoItem1: number;
    presupuestoPorGrupoItem2: number;
    imprevistosValor: number;
    presupuestoPorGrupoImprevistos: number;
    totalNeto: number;
    aportePrimerSemestre: number;
    aporteSegundoSemestre: number;
}

export interface ConsultaReportePorGruposDTORespuesta {
    periodo: PeriodoAcademicoDto;
    anio?: number;
    ingresoPeriodo1?: number;
    ingresoPeriodo2?: number;
    auiPorcentaje: number;
    auiValor: number;
    excedentesMaestria: number;
    item1: number;
    item2: number;
    imprevistos: number;
    totalIngresos: number;
    valorADistribuir: number;
    reportesPorGrupo: ReportePorGrupoDTORespuesta[];
    gastosGenerales: GastoGeneralDTORespuesta[];
    idConfiguracionReporteGrupos: number;
}
