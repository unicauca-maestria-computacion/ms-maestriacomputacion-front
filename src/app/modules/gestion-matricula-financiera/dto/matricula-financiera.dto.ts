import { PeriodoAcademicoDTORespuesta } from "./periodo-academico.dto";

export interface MatriculaFinancieraDTORespuesta {
    fechaMatricula: Date;
    valorMatricula: number;
    objPeriodoAcademico: PeriodoAcademicoDTORespuesta;
}
