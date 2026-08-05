export interface MateriaDto {
    codigo: string;
    nombre: string;
    creditos: number;
}

export interface ProyeccionEstudianteDTORespuesta {
    codigoEstudiante: string;
    identificacion: number;
    nombre: string;
    apellido: string;
    estaPago: boolean;
    aplicaVotacion: boolean;
    porcentajeBeca: number;
    aplicaEgresado: boolean;
    grupoInvestigacion: string;
    valorEnSMLV: number;
    materias: MateriaDto[];
    estadoMatriculaFinanciera?: boolean;
    becaEstado?: string;

    // Campos calculados recibidos del backend
    valorMatricula?: number;
    valorDescuentoVoto?: number;
    valorDescuentoBeca?: number;
    valorDescuentoEgresado?: number;
    totalDescuentos?: number;
    valorNeto?: number;
    totalNetoConDerechos?: number;
}

export interface ProyeccionEstudianteDTOPeticion {
    codigoEstudiante: string;
    estaPago: boolean;
    aplicaVotacion: boolean;
    porcentajeBeca: number;
    aplicaEgresado: boolean;
    grupoInvestigacion?: string;
}
