import { Injectable } from '@angular/core';
import {
    ConfiguracionReporteFinancieroDTOPeticion,
    ConfiguracionReporteFinancieroDTORespuesta
} from '../dto/configuracion-reporte-financiero.dto';
import { ConfiguracionReporteGruposDTORespuesta } from '../dto/configuracion-reporte-grupos.dto';
import {
    ConfiguracionReporteFinanciero,
    ConfiguracionReporteGrupos,
    GastoGeneral,
    PeriodoAcademico,
    ProyeccionEstudiante,
    ReportePorGrupos,
    ReporteProyeccionEstudiantes,
    ReporteEstudiantes
} from '../models/domain-models';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';
import { PeriodoAcademicoDTOPeticion, PeriodoAcademicoDTORespuesta } from '../dto/periodo-academico.dto';
import { ProyeccionEstudianteDTOPeticion, ProyeccionEstudianteDTORespuesta } from '../dto/proyeccion-estudiante.dto';
import { ReportePorGruposDTORespuesta } from '../dto/reporte-por-grupos.dto';
import {
    ReporteProyeccionEstudiantesDTOPeticion,
    ReporteProyeccionEstudiantesDTORespuesta
} from '../dto/reporte-proyeccion-estudiantes.dto';
import { ReporteEstudiantesDTORespuesta } from '../dto/reporte-estudiantes.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaMapperService {

    constructor() { }

    // --- ConfiguracionReporteFinanciero ---

    mappearDePeticionAConfiguracionReporteFinanciero(dto: ConfiguracionReporteFinancieroDTOPeticion): ConfiguracionReporteFinanciero {
        return {
            id: dto.id || 0,
            esReporteFinal: false,
            biblioteca: dto.biblioteca,
            recursosComputacionales: dto.recursosComputacionales,
            valorMatricula: dto.valorMatricula,
            valorSMLV: dto.valorSMLV,
            totalNeto: dto.totalNeto,
            totalDescuentos: dto.totalDescuentos,
            totalIngresos: dto.totalIngresos,
            objPeriodoAcademico: this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico)
        };
    }

    mappearDeRespuestaAConfiguracionReporteFinanciero(dto: ConfiguracionReporteFinancieroDTORespuesta): ConfiguracionReporteFinanciero {
        return {
            id: dto.id,
            esReporteFinal: dto.esReporteFinal,
            biblioteca: dto.biblioteca,
            recursosComputacionales: dto.recursosComputacionales,
            valorMatricula: dto.valorMatricula,
            valorSMLV: dto.valorSMLV,
            totalNeto: dto.totalNeto,
            totalDescuentos: dto.totalDescuentos,
            totalIngresos: dto.totalIngresos,
            objPeriodoAcademico: this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico)
        };
    }

    mappearDeConfiguracionReporteFinancieroARespuesta(domain: ConfiguracionReporteFinanciero): ConfiguracionReporteFinancieroDTORespuesta {
        return {
            id: domain.id,
            esReporteFinal: domain.esReporteFinal,
            biblioteca: domain.biblioteca,
            recursosComputacionales: domain.recursosComputacionales,
            valorMatricula: domain.valorMatricula,
            valorSMLV: domain.valorSMLV,
            totalNeto: domain.totalNeto,
            totalDescuentos: domain.totalDescuentos,
            totalIngresos: domain.totalIngresos,
            objPeriodoAcademico: this.mappearDePeriodoAcademicoARespuesta(domain.objPeriodoAcademico)
        };
    }

    // --- ReporteProyeccionEstudiantes ---

    mappearDePeticionAReporteProyeccionEstudiantes(dto: ReporteProyeccionEstudiantesDTOPeticion): ReporteProyeccionEstudiantes {
        return {
            estudiantes: [],
            objConfiguracion: this.mappearDeRespuestaAConfiguracionReporteFinanciero(dto.objConfiguracion),
            periodo: this.mappearDeRespuestaAPeriodoAcademico(dto.objConfiguracion.objPeriodoAcademico)
        };
    }

    mappearDeRespuestaAReporteProyeccionEstudiantes(dto: ReporteProyeccionEstudiantesDTORespuesta): ReporteProyeccionEstudiantes {
        return {
            estudiantes: dto.estudiantes.map(e => this.mappearDeRespuestaAProyeccionEstudiante(e)),
            objConfiguracion: this.mappearDeRespuestaAConfiguracionReporteFinanciero(dto.objConfiguracion),
            periodo: this.mappearDeRespuestaAPeriodoAcademico(dto.periodo)
        };
    }

    mappearDeReporteProyeccionEstudiantesARespuesta(domain: ReporteProyeccionEstudiantes): ReporteProyeccionEstudiantesDTORespuesta {
        return {
            estudiantes: domain.estudiantes.map(e => this.mappearDeProyeccionEstudianteARespuesta(e)),
            objConfiguracion: this.mappearDeConfiguracionReporteFinancieroARespuesta(domain.objConfiguracion),
            periodo: this.mappearDePeriodoAcademicoARespuesta(domain.periodo)
        };
    }

    // --- ReporteEstudiantes ---

    mappearDeRespuestaAReporteEstudiantes(dto: ReporteEstudiantesDTORespuesta): ReporteEstudiantes {
        return {
            estudiantes: dto.estudiantes.map(e => this.mappearDeRespuestaAProyeccionEstudiante(e)),
            objConfiguracion: this.mappearDeRespuestaAConfiguracionReporteFinanciero(dto.objConfiguracion),
            periodo: this.mappearDeRespuestaAPeriodoAcademico(dto.periodo)
        };
    }

    mappearDeReporteEstudiantesARespuesta(domain: ReporteEstudiantes): ReporteEstudiantesDTORespuesta {
        return {
            estudiantes: domain.estudiantes.map(e => this.mappearDeProyeccionEstudianteARespuesta(e)),
            objConfiguracion: this.mappearDeConfiguracionReporteFinancieroARespuesta(domain.objConfiguracion),
            periodo: this.mappearDePeriodoAcademicoARespuesta(domain.periodo)
        };
    }

    // --- ProyeccionEstudiante ---

    mappearDePeticionAProyeccionEstudiante(dto: ProyeccionEstudianteDTOPeticion): Partial<ProyeccionEstudiante> {
        return {
            codigoEstudiante: dto.codigoEstudiante,
            estaPago: dto.estaPago,
            porcentajeVotacion: dto.porcentajeVotacion,
            porcentajeBeca: dto.porcentajeBeca,
            porcentajeEgresado: dto.porcentajeEgresado
        };
    }

    mappearDeRespuestaAProyeccionEstudiante(dto: ProyeccionEstudianteDTORespuesta): ProyeccionEstudiante {
        return {
            codigoEstudiante: dto.codigoEstudiante,
            nombre: dto.nombre,
            apellido: dto.apellido,
            identificacion: dto.identificacion,
            estaPago: dto.estaPago,
            porcentajeVotacion: dto.porcentajeVotacion,
            porcentajeBeca: dto.porcentajeBeca,
            grupoInvestigacion: dto.grupoInvestigacion,
            porcentajeEgresado: dto.porcentajeEgresado
        };
    }

    mappearDeProyeccionEstudianteARespuesta(domain: ProyeccionEstudiante): ProyeccionEstudianteDTORespuesta {
        return {
            codigoEstudiante: domain.codigoEstudiante,
            nombre: domain.nombre,
            apellido: domain.apellido,
            identificacion: domain.identificacion,
            estaPago: domain.estaPago,
            porcentajeVotacion: domain.porcentajeVotacion,
            porcentajeBeca: domain.porcentajeBeca,
            grupoInvestigacion: domain.grupoInvestigacion,
            porcentajeEgresado: domain.porcentajeEgresado
        };
    }

    mappearDeListaProyeccionEstudianteARespuesta(proyecciones: ProyeccionEstudiante[]): ProyeccionEstudianteDTORespuesta[] {
        return proyecciones.map(p => this.mappearDeProyeccionEstudianteARespuesta(p));
    }

    // --- PeriodoAcademico ---

    mappearDePeticionAPeriodoAcademico(dto: PeriodoAcademicoDTOPeticion): PeriodoAcademico {
        return {
            periodo: dto.periodo,
            año: dto.año
        };
    }

    mappearDeRespuestaAPeriodoAcademico(dto: PeriodoAcademicoDTORespuesta): PeriodoAcademico {
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

    // --- ConfiguracionReporteGrupos ---

    mappearDeRespuestaAConfiguracionReporteGrupos(dto: ConfiguracionReporteGruposDTORespuesta): ConfiguracionReporteGrupos {
        const dtoAny = dto as unknown as Record<string, unknown>;
        const id = dto.idConfiguracionReporteGrupos ?? dtoAny['idConfiguracionReporteGrupos'];
        return {
            id: id != null ? Number(id) : undefined,
            aUIPorcentaje: (dto.aUIPorcentaje ?? dtoAny['auiporcentaje']) as number,
            excedentesMaestria: dto.excedentesMaestria,
            aUIValor: (dto.aUIValor ?? dtoAny['auivalor']) as number,
            ingresosNetos: dto.ingresosNetos,
            valorADistribuir: dto.valorADistribuir,
            item1: dto.item1,
            item2: dto.item2,
            imprevistos: dto.imprevistos,
            objPeriodoAcademico: this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico),
            gastosGenerales: dto.gastosGenerales.map(g => this.mappearDeRespuestaAGastoGeneral(g))
        };
    }

    // --- GastoGeneral ---

    mappearDePeticionAGastoGeneral(dto: GastoGeneralDTOPeticion): GastoGeneral {
        return {
            idGastoGeneral: dto.idGastoGeneral,
            categoria: dto.categoria,
            descripcion: dto.descripcion,
            monto: dto.monto
        };
    }

    mappearDeRespuestaAGastoGeneral(dto: GastoGeneralDTORespuesta): GastoGeneral {
        return {
            idGastoGeneral: dto.idGastoGeneral,
            categoria: dto.categoria,
            descripcion: dto.descripcion,
            monto: dto.monto
        };
    }

    mappearDeGastoGeneralARespuesta(domain: GastoGeneral): GastoGeneralDTORespuesta {
        return {
            idGastoGeneral: domain.idGastoGeneral,
            categoria: domain.categoria,
            descripcion: domain.descripcion,
            monto: domain.monto
        };
    }

    // --- ReportePorGrupos ---

    mappearDeRespuestaAReportePorGrupos(dto: ReportePorGruposDTORespuesta): ReportePorGrupos {
        const filas = dto.reportesPorGrupos ?? [];
        const gastos = (dto.gastosGenerales ?? []).map(g => this.mappearDeRespuestaAGastoGeneral(g));
        const sum = (key: keyof typeof filas[0]) => filas.reduce((acc, f) => acc + ((f[key] as number) ?? 0), 0);
        const filasPorGrupo = filas.map((f, i) => ({
            nombreGrupo: f.grupo?.nombre ?? `Grupo ${i + 1}`,
            totalNeto: f.totalNeto ?? 0,
            aportePrimerSemestre: f.aportePrimerSemestre ?? 0,
            aporteSegundoSemestre: f.aporteSegundoSemestre ?? 0,
            participacionPrimerSemestre: f.participacionPrimerSemestre ?? 0,
            participacionSegundoSemestre: f.participacionSegundoSemestre ?? 0,
            participacionPorAño: f.participacionPorAño ?? 0,
            presupuestoPorGrupoItem1: f.presupuestoPorGrupoItem1 ?? 0,
            presupuestoPorGrupoItem2: f.presupuestoPorGrupoItem2 ?? 0,
            presupuestoPorGrupo: f.presupuestoPorGrupo ?? 0,
            imprevistos: f.imprevistos ?? 0,
            presupuestoPorGrupoImprevistos: f.presupuestoPorGrupoImprevistos ?? 0,
            vigenciasAnteriores: f.vigenciasAnteriores ?? 0
        }));
        return {
            totalNeto: sum('totalNeto'),
            aportePrimerSemestre: sum('aportePrimerSemestre'),
            aporteSegundoSemestre: sum('aporteSegundoSemestre'),
            participacionPrimerSemestre: sum('participacionPrimerSemestre'),
            participacionSegundoSemestre: sum('participacionSegundoSemestre'),
            participacionPorAño: sum('participacionPorAño'),
            presupuestoPorGrupoItem1: sum('presupuestoPorGrupoItem1'),
            presupuestoPorGrupoItem2: sum('presupuestoPorGrupoItem2'),
            presupuestoPorGrupo: sum('presupuestoPorGrupo'),
            imprevistos: sum('imprevistos'),
            presupuestoPorGrupoImprevistos: sum('presupuestoPorGrupoImprevistos'),
            vigenciasAnteriores: sum('vigenciasAnteriores'),
            gastosGenerales: gastos,
            filasPorGrupo,
            objConfiguracionReporteGrupos: {
                id: dto.idConfiguracionReporteGrupos != null ? Number(dto.idConfiguracionReporteGrupos) : undefined,
                aUIPorcentaje: dto.auiporcentaje ?? 0,
                aUIValor: dto.auivalor ?? 0,
                excedentesMaestria: dto.excedentesMaestria ?? 0,
                ingresosNetos: dto.ingresosNetos ?? 0,
                valorADistribuir: dto.valorADistribuir ?? 0,
                item1: dto.item1 ?? 0,
                item2: dto.item2 ?? 0,
                imprevistos: dto.imprevistos ?? 0,
                objPeriodoAcademico: dto.objPeriodoAcademico
                    ? this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico)
                    : { periodo: 0, año: 0 },
                gastosGenerales: gastos
            }
        };
    }
}
