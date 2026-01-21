import { Injectable } from '@angular/core';
import {
    Estudiante,
    MatriculaFinanciera,
    MatriculaAcademica,
    Materia,
    Docente,
    BecaFinanciera,
    DescuentoFinanciero,
    PeriodoAcademico
} from '../models/domain-models';
import { EstudianteDTORespuesta } from '../dto/estudiante.dto';
import { MatriculaFinancieraDTORespuesta } from '../dto/matricula-financiera.dto';
import { MatriculaAcademicaDTORespuesta } from '../dto/matricula-academica.dto';
import { MateriaDTORespuesta } from '../dto/materia.dto';
import { DocenteDTORespuesta } from '../dto/docente.dto';
import { BecaFinancieraDTORespuesta } from '../dto/beca-financiera.dto';
import { DescuentoFinancieraDTORespuesta } from '../dto/descuento-financiero.dto';
import { PeriodoAcademicoDTORespuesta, PeriodoAcademicoDTOPeticion } from '../dto/periodo-academico.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionMatriculaFinancieraMapperService {

    constructor() { }

    // --- PeriodoAcademico ---

    mappearDeRespuestaAPeriodoAcademico(dto: PeriodoAcademicoDTORespuesta): PeriodoAcademico {
        return {
            periodo: dto.periodo,
            año: dto.año
        };
    }

    mappearDePeticionAPeriodoAcademico(dto: PeriodoAcademicoDTOPeticion): PeriodoAcademico {
        return {
            periodo: dto.periodo,
            año: dto.año
        };
    }

    mappearDePeriodoAcademicoARespuesta(domain: PeriodoAcademico): PeriodoAcademicoDTORespuesta {
        return {
            periodo: domain.periodo,
            año: domain.año
        };
    }

    // --- Docente ---

    mappearDeRespuestaADocente(dto: DocenteDTORespuesta): Docente {
        return {
            nombre: dto.nombre
        };
    }

    mappearDeDocenteARespuesta(domain: Docente): DocenteDTORespuesta {
        return {
            nombre: domain.nombre
        };
    }

    // --- Materia ---

    mappearDeRespuestaAMateria(dto: MateriaDTORespuesta): Materia {
        return {
            codigo_oid: dto.codigo_oid,
            semestreAcademico: dto.semestreAcademico,
            materia: dto.materia,
            objDocente: this.mappearDeRespuestaADocente(dto.objDocente),
            grupoClase: dto.grupoClase
        };
    }

    mappearDeMateriaARespuesta(domain: Materia): MateriaDTORespuesta {
        return {
            codigo_oid: domain.codigo_oid,
            semestreAcademico: domain.semestreAcademico,
            materia: domain.materia,
            objDocente: this.mappearDeDocenteARespuesta(domain.objDocente),
            grupoClase: domain.grupoClase
        };
    }

    // --- MatriculaAcademica ---

    mappearDeRespuestaAMatriculaAcademica(dto: MatriculaAcademicaDTORespuesta): MatriculaAcademica {
        return {
            semestre: dto.semestre,
            materias: dto.materias.map(m => this.mappearDeRespuestaAMateria(m)),
            objPeriodoAcademico: this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico)
        };
    }

    mappearDeMatriculaAcademicaARespuesta(domain: MatriculaAcademica): MatriculaAcademicaDTORespuesta {
        return {
            semestre: domain.semestre,
            materias: domain.materias.map(m => this.mappearDeMateriaARespuesta(m)),
            objPeriodoAcademico: this.mappearDePeriodoAcademicoARespuesta(domain.objPeriodoAcademico)
        };
    }

    // --- MatriculaFinanciera ---

    mappearDeRespuestaAMatriculaFinanciera(dto: MatriculaFinancieraDTORespuesta): MatriculaFinanciera {
        return {
            fechaMatricula: dto.fechaMatricula,
            valorMatricula: dto.valorMatricula,
            objPeriodoAcademico: this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico)
        };
    }

    mappearDeMatriculaFinancieraARespuesta(domain: MatriculaFinanciera): MatriculaFinancieraDTORespuesta {
        return {
            fechaMatricula: domain.fechaMatricula,
            valorMatricula: domain.valorMatricula,
            objPeriodoAcademico: this.mappearDePeriodoAcademicoARespuesta(domain.objPeriodoAcademico)
        };
    }

    // --- BecaFinanciera ---

    mappearDeRespuestaABecaFinanciera(dto: BecaFinancieraDTORespuesta): BecaFinanciera {
        return {
            resolucion: dto.resolucion,
            porcentaje: dto.porcentaje
        };
    }

    mappearDeBecaFinancieraARespuesta(domain: BecaFinanciera): BecaFinancieraDTORespuesta {
        return {
            resolucion: domain.resolucion,
            porcentaje: domain.porcentaje
        };
    }

    // --- DescuentoFinanciero ---

    mappearDeRespuestaADescuentoFinanciero(dto: DescuentoFinancieraDTORespuesta): DescuentoFinanciero {
        return {
            tipoDescuento: dto.tipoDescuento,
            porcentaje: dto.porcentaje
        };
    }

    mappearDeDescuentoFinancieroARespuesta(domain: DescuentoFinanciero): DescuentoFinancieraDTORespuesta {
        return {
            tipoDescuento: domain.tipoDescuento,
            porcentaje: domain.porcentaje
        };
    }

    // --- Estudiante ---

    mappearDeRespuestaAEstudiante(dto: EstudianteDTORespuesta): Estudiante {
        return {
            codigo: dto.codigo,
            cohorte: dto.cohorte,
            periodoIngreso: dto.periodoIngreso,
            semestreFinanciero: dto.semestreFinanciero,
            matriculasFinancieras: dto.matriculasFinancieras.map(mf => this.mappearDeRespuestaAMatriculaFinanciera(mf)),
            descuentos: dto.descuentos.map(d => this.mappearDeRespuestaADescuentoFinanciero(d)),
            becas: dto.becas.map(b => this.mappearDeRespuestaABecaFinanciera(b)),
            matriculasAcademicas: dto.matriculasAcademicas.map(ma => this.mappearDeRespuestaAMatriculaAcademica(ma))
        };
    }

    mappearDeEstudianteARespuesta(domain: Estudiante): EstudianteDTORespuesta {
        return {
            codigo: domain.codigo,
            cohorte: domain.cohorte,
            periodoIngreso: domain.periodoIngreso,
            semestreFinanciero: domain.semestreFinanciero,
            matriculasFinancieras: domain.matriculasFinancieras.map(mf => this.mappearDeMatriculaFinancieraARespuesta(mf)),
            descuentos: domain.descuentos.map(d => this.mappearDeDescuentoFinancieroARespuesta(d)),
            becas: domain.becas.map(b => this.mappearDeBecaFinancieraARespuesta(b)),
            matriculasAcademicas: domain.matriculasAcademicas.map(ma => this.mappearDeMatriculaAcademicaARespuesta(ma))
        };
    }

    mappearDeListaEstudianteARespuesta(estudiantes: Estudiante[]): EstudianteDTORespuesta[] {
        return estudiantes.map(e => this.mappearDeEstudianteARespuesta(e));
    }

    mappearDeListaRespuestaAEstudiante(dtos: EstudianteDTORespuesta[]): Estudiante[] {
        return dtos.map(dto => this.mappearDeRespuestaAEstudiante(dto));
    }
}
