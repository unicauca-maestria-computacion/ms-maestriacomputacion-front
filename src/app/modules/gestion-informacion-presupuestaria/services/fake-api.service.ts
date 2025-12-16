import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PeriodoAcademicoDTORespuesta, PeriodoAcademicoDTOPeticion } from '../models/periodo-academico.dto';
import { delay } from 'rxjs/operators';
import { ConfiguracionReporteFinancieroDTOPeticion, ConfiguracionReporteFinancieroDTORespuesta } from '../models/configuracion-reporte-financiero.dto';
import { ProyeccionEstudianteDTOPeticion, ProyeccionEstudianteDTORespuesta } from '../models/proyeccion-estudiante.dto';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../models/reporte-proyeccion-estudiantes.dto';
import { ConfiguracionReporteGruposDTORespuesta } from '../models/configuracion-reporte-grupos.dto';
import { PorcentajeGrupoDTOPeticion } from '../models/porcentaje-grupo.dto';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../models/gasto-general.dto';
import { ItemsDTOPeticion } from '../models/items.dto';
import { ValorGrupoDTOPeticion } from '../models/valor-grupo.dto';
import { ReporteEstudiantesDTORespuesta } from '../models/reporte-estudiantes.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaFakeApiService {

    constructor() { }

    obtenerPeriodosAcademicos(): Observable<PeriodoAcademicoDTORespuesta[]> {
        const mockData: PeriodoAcademicoDTORespuesta[] = [
            { periodo: 1, año: 2023 },
            { periodo: 2, año: 2023 },
            { periodo: 1, año: 2024 }
        ];
        return of(mockData).pipe(delay(500));
    }

    obtenerReporteFinanciero(periodo: PeriodoAcademicoDTOPeticion): Observable<ReporteEstudiantesDTORespuesta> {
        const estudiantes: any[] = [ // Using any[] temporarily or strict type if imported, casting to ensure it matches
            {
                codigoEstudiante: '1087453621',
                nombreEstudiante: 'Laura Pérez',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 0,
                porcentajeBeca: 0,
                valorBeca: 0,
                porcentajeEgresado: 0,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'GTI',
                grupoDescuentos: 500000,
                totalNeto: 7300000
            },
            {
                codigoEstudiante: '1024566421',
                nombreEstudiante: 'María Tobar',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 10,
                porcentajeBeca: 10,
                valorBeca: 780000,
                porcentajeEgresado: 5,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'IDIS',
                grupoDescuentos: 1280000,
                totalNeto: 6520000
            },
            {
                codigoEstudiante: '1022453221',
                nombreEstudiante: 'Diana López',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 10,
                porcentajeBeca: 15,
                valorBeca: 1170000,
                porcentajeEgresado: 5,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'IDIS',
                grupoDescuentos: 1670000,
                totalNeto: 6130000
            },
            {
                codigoEstudiante: '1007554022',
                nombreEstudiante: 'Natalia García',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 10,
                porcentajeBeca: 20,
                valorBeca: 2340000,
                porcentajeEgresado: 5,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'GICO',
                grupoDescuentos: 2060000,
                totalNeto: 5740000
            },
            {
                codigoEstudiante: '1090733402',
                nombreEstudiante: 'Sofía Ramírez',
                estaPago: false,
                matricula: 1300000,
                porcentajeVotacion: 10,
                porcentajeBeca: 0,
                valorBeca: 0,
                porcentajeEgresado: 0,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'GICO',
                grupoDescuentos: 500000,
                totalNeto: 800000
            }
        ];

        const objConfiguracion: ConfiguracionReporteFinancieroDTORespuesta = {
            esReporteFinal: true,
            biblioteca: 250000,
            recursosComputacionales: 250000,
            valorMatricula: 6,
            valorSMLV: 1423500,
            totalNeto: 25000000,
            totalDescuentos: 5000000,
            totalIngresos: 20000000,
            objPeriodoAcademico: {
                periodo: periodo.periodo,
                año: periodo.año
            }
        };

        const response: ReporteEstudiantesDTORespuesta = {
            estudiantes: estudiantes as any, // Cast to avoid strict check issues for now if types strictly differ
            objConfiguracion: objConfiguracion,
            periodo: {
                periodo: periodo.periodo,
                año: periodo.año
            }
        };

        return of(response).pipe(delay(1500));
    }

    // Métodos mockeados adicionales para cumplir con la interfaz del ApiService

    // Helper for mock data to avoid duplication
    private getMockProyeccionReporte(): ReporteProyeccionEstudiantesDTORespuesta {
        const est: any[] = [
            {
                codigoEstudiante: '1087453621',
                nombreEstudiante: 'Laura Pérez',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 0,
                porcentajeBeca: 0,
                valorBeca: 0,
                porcentajeEgresado: 0,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'GTI',
                grupoDescuentos: 500000,
                totalNeto: 7300000
            },
            {
                codigoEstudiante: '1024566421',
                nombreEstudiante: 'María Tobar',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 10,
                porcentajeBeca: 10,
                valorBeca: 780000,
                porcentajeEgresado: 5,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'IDIS',
                grupoDescuentos: 1280000,
                totalNeto: 6520000
            },
            {
                codigoEstudiante: '1022453221',
                nombreEstudiante: 'Diana López',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 10,
                porcentajeBeca: 15,
                valorBeca: 1170000,
                porcentajeEgresado: 5,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'IDIS',
                grupoDescuentos: 1670000,
                totalNeto: 6130000
            },
            {
                codigoEstudiante: '1007554022',
                nombreEstudiante: 'Natalia García',
                estaPago: true,
                matricula: 7800000,
                porcentajeVotacion: 10,
                porcentajeBeca: 20,
                valorBeca: 2340000,
                porcentajeEgresado: 5,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'GICO',
                grupoDescuentos: 2060000,
                totalNeto: 5740000
            },
            {
                codigoEstudiante: '1090733402',
                nombreEstudiante: 'Sofía Ramírez',
                estaPago: false,
                matricula: 1300000,
                porcentajeVotacion: 10,
                porcentajeBeca: 0,
                valorBeca: 0,
                porcentajeEgresado: 0,
                valorEgresado: 0,
                recursosComputacionales: 250000,
                biblioteca: 250000,
                grupoInvestigacion: 'GICO',
                grupoDescuentos: 500000,
                totalNeto: 800000
            }
        ];

        return {
            estudiantes: est as any,
            objConfiguracion: {
                esReporteFinal: false,
                biblioteca: 250000,
                recursosComputacionales: 250000,
                valorMatricula: 6,
                valorSMLV: 1423500,
                totalNeto: 25000000,
                totalDescuentos: 5000000,
                totalIngresos: 20000000,
                objPeriodoAcademico: { periodo: 2, año: 2024 }
            },
            periodo: { periodo: 2, año: 2024 }
        };
    }

    actualizarConfiguracionProyeccion(config: ConfiguracionReporteFinancieroDTOPeticion): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return of(this.getMockProyeccionReporte()).pipe(delay(500));
    }

    actualizarProyeccionEstudiante(proyeccion: ProyeccionEstudianteDTOPeticion): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return of(this.getMockProyeccionReporte()).pipe(delay(500));
    }

    obtenerProyeccionEstudiantes(): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return of(this.getMockProyeccionReporte()).pipe(delay(500));
    }

    obtenerReporteGrupos(periodo: PeriodoAcademicoDTOPeticion): Observable<ConfiguracionReporteGruposDTORespuesta> {
        const mockResponse: ConfiguracionReporteGruposDTORespuesta = {
            AUIPorcentaje: 20,
            excedentesMaestria: 41819614,
            AUIValor: 36674913,
            ingresosNetos: 183374564,
            valorADistribuir: 82512165,
            item1: 4500000,
            item2: 5000000,
            imprevistos: 1200000,
            objPeriodoAcademico: { periodo: periodo.periodo, año: periodo.año },
            gastosGenerales: [],
            reportePorGrupos: [
                {
                    objGrupo: { nombre: 'GTI' },
                    totalNeto: 100900692,
                    aportePrimerSemestre: 33400692,
                    aporteSegundoSemestre: 67500000,
                    participacionPrimerSemestre: 48.65,
                    participacionSegundoSemestre: 58.84,
                    participacionPorAño: 55.02,
                    presupuestoPorGrupoItem1: 0,
                    presupuestoPorGrupoItem2: 0,
                    presupuestoPorGrupo: 45398193,
                    imprevistos: 0,
                    presupuestoPorGrupoImprevistos: 0,
                    vigenciasAnteriores: 0,
                    gastosGenerales: []
                },
                {
                    objGrupo: { nombre: 'IDIS' },
                    totalNeto: 60243872,
                    aportePrimerSemestre: 27066286,
                    aporteSegundoSemestre: 33177586,
                    participacionPrimerSemestre: 39.42,
                    participacionSegundoSemestre: 28.92,
                    participacionPorAño: 32.85,
                    presupuestoPorGrupoItem1: 0,
                    presupuestoPorGrupoItem2: 0,
                    presupuestoPorGrupo: 27105246,
                    imprevistos: 0,
                    presupuestoPorGrupoImprevistos: 0,
                    vigenciasAnteriores: 0,
                    gastosGenerales: []
                },
                {
                    objGrupo: { nombre: 'GICO' },
                    totalNeto: 22230000,
                    aportePrimerSemestre: 8190000,
                    aporteSegundoSemestre: 14040000,
                    participacionPrimerSemestre: 11.93,
                    participacionSegundoSemestre: 12.24,
                    participacionPorAño: 12.12,
                    presupuestoPorGrupoItem1: 0,
                    presupuestoPorGrupoItem2: 0,
                    presupuestoPorGrupo: 10008726,
                    imprevistos: 0,
                    presupuestoPorGrupoImprevistos: 0,
                    vigenciasAnteriores: 0,
                    gastosGenerales: []
                }
            ]
        };
        return of(mockResponse).pipe(delay(500));
    }

    actualizarPorcentajeParticipacionPrimerSemestre(porcentajes: PorcentajeGrupoDTOPeticion[]): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }

    actualizarPorcentajeParticipacionSegundoSemestre(porcentajes: PorcentajeGrupoDTOPeticion[]): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }

    actualizarPorcentajeAUIUniversidad(nuevoValor: number): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }

    actualizarValorExcedentesMaestria(nuevoValor: number): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }

    actualizarGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        return of({} as GastoGeneralDTORespuesta).pipe(delay(500));
    }

    crearGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        return of({} as GastoGeneralDTORespuesta).pipe(delay(500));
    }

    eliminarGastoGeneral(idGastoGeneral: number): Observable<boolean> {
        return of(true).pipe(delay(500));
    }

    actualizarPorcentajeItems(items: ItemsDTOPeticion): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }

    actualizarPorcentajeImprevistos(nuevoValor: number): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }

    actualizarValorVigenciasAnteriores(valoresGrupo: ValorGrupoDTOPeticion[]): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return of({} as ConfiguracionReporteGruposDTORespuesta).pipe(delay(500));
    }
}
