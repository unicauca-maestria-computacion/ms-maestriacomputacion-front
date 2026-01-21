import { DocenteDTORespuesta } from "./docente.dto";

export interface MateriaDTORespuesta {
    codigo_oid: string;
    semestreAcademico: number;
    materia: string;
    objDocente: DocenteDTORespuesta;
    grupoClase: string;
}
