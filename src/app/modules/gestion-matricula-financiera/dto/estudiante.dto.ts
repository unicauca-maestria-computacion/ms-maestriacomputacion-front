import { MatriculaFinancieraDTORespuesta } from "./matricula-financiera.dto";
import { DescuentosDTORespuesta } from "./descuento-financiero.dto";
import { BecasDTORespuesta } from "./beca-financiera.dto";
import { MatriculaAcademicaDTORespuesta } from "./matricula-academica.dto";

export interface EstudianteDTORespuesta {
    codigo: string;
    nombre: string;
    apellido: string;
    identificacion: number;
    cohorte: string;
    periodoIngreso: string;
    semestreFinanciero: number;
    matriculasFinancieras: MatriculaFinancieraDTORespuesta[];
    descuentos: DescuentosDTORespuesta[];
    becas: BecasDTORespuesta[];
    matriculasAcademicas: MatriculaAcademicaDTORespuesta[];
}
