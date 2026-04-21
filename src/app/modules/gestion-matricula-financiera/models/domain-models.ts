export interface PeriodoAcademico {
    id?: number;
    periodo?: number;
    año?: number;
    tagPeriodo?: number;
    fechaInicio?: string;
    fechaFin?: string;
    fechaFinMatricula?: string;
    descripcion?: string;
    estado?: string;
}

export interface Docente {
    nombre: string;
    apellido?: string;
}

export interface Materia {
    codigo_oid: string;
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
    valorEnSMLV: number | null;
    objPeriodoAcademico: PeriodoAcademico;
}

export interface BecaFinanciera {
    resolucion: string;
    porcentaje: number;
    tipo: string;
}

export interface DescuentoFinanciero {
    tipoDescuento: string;
    porcentaje: number;
}

export interface Estudiante {
    codigo: string;
    nombre: string;
    apellido: string;
    identificacion: number;
    cohorte: string;
    periodoIngreso: string;
    semestreFinanciero: number;
    semestreAcademico?: number;
    valorEnSMLV?: number | null;
    esEgresadoUnicauca?: boolean;
    matriculasFinancieras: MatriculaFinanciera[];
    descuentos: DescuentoFinanciero[];
    becas: BecaFinanciera[];
    materias: Materia[];
}
