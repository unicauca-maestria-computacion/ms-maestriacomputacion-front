import { MatriculaFinancieraDTORespuesta } from "./matricula-financiera.dto";
import { DescuentoFinancieraDTORespuesta } from "./descuento-financiero.dto";
import { BecaFinancieraDTORespuesta } from "./beca-financiera.dto";
import { MatriculaAcademicaDTORespuesta } from "./matricula-academica.dto";

export interface EstudianteDTORespuesta {
    codigo: number;
    cohorte: string;
    periodoIngreso: string;
    semestreFinanciero: number;
    matriculasFinancieras: MatriculaFinancieraDTORespuesta[];
    descuentos: DescuentoFinancieraDTORespuesta[];
    becas: BecaFinancieraDTORespuesta[];
    matriculasAcademicas: MatriculaAcademicaDTORespuesta[];
}
