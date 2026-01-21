export interface PeriodoAcademico {
    periodo: number;
    año: number;
}

export interface Docente {
    nombre: string;
}

export interface Materia {
    codigo_oid: string;
    semestreAcademico: number;
    materia: string;
    objDocente: Docente;
    grupoClase: string;
}

export interface MatriculaAcademica {
    semestre: number;
    materias: Materia[];
    objPeriodoAcademico: PeriodoAcademico;
}

export interface MatriculaFinanciera {
    fechaMatricula: Date;
    valorMatricula: number;
    objPeriodoAcademico: PeriodoAcademico;
}

export interface BecaFinanciera {
    resolucion: string;
    porcentaje: number;
}

export interface DescuentoFinanciero {
    tipoDescuento: string;
    porcentaje: number;
}

export interface Estudiante {
    codigo: number;
    cohorte: string;
    periodoIngreso: string;
    semestreFinanciero: number;
    matriculasFinancieras: MatriculaFinanciera[];
    descuentos: DescuentoFinanciero[];
    becas: BecaFinanciera[];
    matriculasAcademicas: MatriculaAcademica[];
}
