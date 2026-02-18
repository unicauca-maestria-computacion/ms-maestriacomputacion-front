import { GastoGeneralDTORespuesta } from "./gasto-general.dto";
import { ConfiguracionReporteGruposDTORespuesta } from "./configuracion-reporte-grupos.dto";

export interface ReportePorGruposDTORespuesta {
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
    gastosGenerales: GastoGeneralDTORespuesta[];
    objConfiguracionReporteGrupos: ConfiguracionReporteGruposDTORespuesta;
}
