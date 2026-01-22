export interface ProyeccionEstudianteDTORespuesta {
    codigoEstudiante: string;
    nombre: string;
    identificacion: number;
    apellido: string;
    estaPago: boolean;
    porcentajeVotacion: number;
    porcentajeBeca: number;
    grupoInvestigacion: string;
    porcentajeEgresado: number;
}

export interface ProyeccionEstudianteDTOPeticion {
    codigoEstudiante: string;
    estaPago: boolean;
    porcentajeVotacion: number;
    porcentajeBeca: number;
    porcentajeEgresado: number;
}
