export interface GastoGeneralDTORespuesta {
    idGastoGeneral: number;
    categoria: string;
    descripcion: string;
    monto: number;
}

export interface GastoGeneralDTOPeticion {
    idGastoGeneral: number;
    idConfiguracionReporteGrupos?: number;
    categoria: string;
    descripcion: string;
    monto: number;
}
