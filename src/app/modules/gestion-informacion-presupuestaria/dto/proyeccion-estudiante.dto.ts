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
    estadoProyeccion: string;
    valorEnSMLV: number;
    materias: MateriaDto[];
}

export interface ProyeccionEstudianteDTOPeticion {
    codigoEstudiante: string;
    estaPago: boolean;
    aplicaVotacion: boolean;
    porcentajeBeca: number;
    aplicaEgresado: boolean;
    grupoInvestigacion?: string;
    estadoProyeccion?: string;
}
