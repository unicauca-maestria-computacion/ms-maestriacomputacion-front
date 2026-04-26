import { DescuentosDTORespuesta } from "./descuento-financiero.dto";
import { BecasDTORespuesta } from "./beca-financiera.dto";
import { MateriaDTORespuesta } from "./materia.dto";
import { BecaDescuentoInfoDTO } from './beca-descuento-info.dto';

export interface EstudianteDTORespuesta {
    codigo: string;
    nombre: string;
    apellido: string;
    identificacion: number;
    cohorte: number;
    periodoIngreso: string;
    semestreFinanciero: number;
    semestreAcademico?: number;
    valorEnSMLV?: number | null;
    descuentos: DescuentosDTORespuesta[];
    becas: BecasDTORespuesta[];
    materias: MateriaDTORespuesta[];
    becasDescuentos: BecaDescuentoInfoDTO[];
}
