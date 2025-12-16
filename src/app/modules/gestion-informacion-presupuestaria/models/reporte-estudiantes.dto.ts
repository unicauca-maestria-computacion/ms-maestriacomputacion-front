import { ProyeccionEstudianteDTORespuesta } from "./proyeccion-estudiante.dto";
import { ConfiguracionReporteFinancieroDTORespuesta } from "./configuracion-reporte-financiero.dto";
import { PeriodoAcademicoDTORespuesta } from "./periodo-academico.dto";

export interface ReporteEstudiantesDTORespuesta {
    estudiantes: ProyeccionEstudianteDTORespuesta[];
    objConfiguracion: ConfiguracionReporteFinancieroDTORespuesta;
    periodo: PeriodoAcademicoDTORespuesta;
}
