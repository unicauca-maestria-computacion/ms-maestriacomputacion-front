import { PeriodoAcademicoDTORespuesta } from "./periodo-academico.dto";
import { GastoGeneralDTORespuesta } from "./gasto-general.dto";

export interface ConfiguracionReporteGruposDTORespuesta {
    idConfiguracionReporteGrupos?: number;
    aUIPorcentaje: number;
    excedentesMaestria: number;
    aUIValor: number;
    ingresosNetos: number;
    valorADistribuir: number;
    item1: number;
    item2: number;
    imprevistos: number;
    objPeriodoAcademico: PeriodoAcademicoDTORespuesta;
    gastosGenerales: GastoGeneralDTORespuesta[];
}
