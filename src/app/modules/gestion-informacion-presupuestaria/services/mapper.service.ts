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
    Grupo,
    PeriodoAcademico,
    ProyeccionEstudiante,
    ReportePorGrupos,
    ReporteProyeccionEstudiantes,
    ReporteEstudiantes
} from '../models/domain-models';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';
import { GrupoDTORespuesta } from '../dto/grupo.dto';
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
        return {
            AUIPorcentaje: dto.AUIPorcentaje,
            excedentesMaestria: dto.excedentesMaestria,
            AUIValor: dto.AUIValor,
            ingresosNetos: dto.ingresosNetos,
            valorADistribuir: dto.valorADistribuir,
            item1: dto.item1,
            item2: dto.item2,
            imprevistos: dto.imprevistos,
            objPeriodoAcademico: this.mappearDeRespuestaAPeriodoAcademico(dto.objPeriodoAcademico),
            gastosGenerales: dto.gastosGenerales.map(g => this.mappearDeRespuestaAGastoGeneral(g)),
            reportePorGrupos: dto.reportePorGrupos.map(r => this.mappearDeRespuestaAReportePorGrupos(r))
        };
    }

    mappearDeConfiguracionReporteGruposARespuesta(domain: ConfiguracionReporteGrupos): ConfiguracionReporteGruposDTORespuesta {
        return {
            AUIPorcentaje: domain.AUIPorcentaje,
            excedentesMaestria: domain.excedentesMaestria,
            AUIValor: domain.AUIValor,
            ingresosNetos: domain.ingresosNetos,
            valorADistribuir: domain.valorADistribuir,
            item1: domain.item1,
            item2: domain.item2,
            imprevistos: domain.imprevistos,
            objPeriodoAcademico: this.mappearDePeriodoAcademicoARespuesta(domain.objPeriodoAcademico),
            gastosGenerales: domain.gastosGenerales.map(g => this.mappearDeGastoGeneralARespuesta(g)),
            reportePorGrupos: domain.reportePorGrupos.map(r => this.mappearDeReportePorGruposARespuesta(r))
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
        return {
            totalNeto: dto.totalNeto,
            aportePrimerSemestre: dto.aportePrimerSemestre,
            aporteSegundoSemestre: dto.aporteSegundoSemestre,
            participacionPrimerSemestre: dto.participacionPrimerSemestre,
            participacionSegundoSemestre: dto.participacionSegundoSemestre,
            participacionPorAño: dto.participacionPorAño,
            presupuestoPorGrupoItem1: dto.presupuestoPorGrupoItem1,
            presupuestoPorGrupoItem2: dto.presupuestoPorGrupoItem2,
            presupuestoPorGrupo: dto.presupuestoPorGrupo,
            imprevistos: dto.imprevistos,
            presupuestoPorGrupoImprevistos: dto.presupuestoPorGrupoImprevistos,
            vigenciasAnteriores: dto.vigenciasAnteriores,
            gastosGenerales: dto.gastosGenerales.map(g => this.mappearDeRespuestaAGastoGeneral(g)),
            objGrupo: this.mappearDeRespuestaAGrupo(dto.objGrupo)
        };
    }

    mappearDeReportePorGruposARespuesta(domain: ReportePorGrupos): ReportePorGruposDTORespuesta {
        return {
            totalNeto: domain.totalNeto,
            aportePrimerSemestre: domain.aportePrimerSemestre,
            aporteSegundoSemestre: domain.aporteSegundoSemestre,
            participacionPrimerSemestre: domain.participacionPrimerSemestre,
            participacionSegundoSemestre: domain.participacionSegundoSemestre,
            participacionPorAño: domain.participacionPorAño,
            presupuestoPorGrupoItem1: domain.presupuestoPorGrupoItem1,
            presupuestoPorGrupoItem2: domain.presupuestoPorGrupoItem2,
            presupuestoPorGrupo: domain.presupuestoPorGrupo,
            imprevistos: domain.imprevistos,
            presupuestoPorGrupoImprevistos: domain.presupuestoPorGrupoImprevistos,
            vigenciasAnteriores: domain.vigenciasAnteriores,
            gastosGenerales: domain.gastosGenerales.map(g => this.mappearDeGastoGeneralARespuesta(g)),
            objGrupo: this.mappearDeGrupoARespuesta(domain.objGrupo)
        };
    }

    // --- Grupo ---

    mappearDeRespuestaAGrupo(dto: GrupoDTORespuesta): Grupo {
        return {
            nombre: dto.nombre
        };
    }

    mappearDeGrupoARespuesta(domain: Grupo): GrupoDTORespuesta {
        return {
            nombre: domain.nombre
        };
    }
}
