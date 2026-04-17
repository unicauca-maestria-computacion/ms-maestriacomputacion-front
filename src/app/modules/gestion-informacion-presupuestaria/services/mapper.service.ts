import { Injectable } from '@angular/core';
import {
    ConfiguracionReporteFinancieroDTOPeticion,
    ConfiguracionReporteFinancieroDTORespuesta
} from '../dto/configuracion-reporte-financiero.dto';
import {
    ConfiguracionReporteFinanciero,
    ConfiguracionReporteGrupos,
    GastoGeneral,
    Materia,
    PeriodoFinanciero,
    ProyeccionEstudiante,
    ReportePorGrupoFila,
    ReportePorGrupos,
    ReporteProyeccionEstudiantes,
    ReporteEstudiantes
} from '../models/domain-models';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';
import { PeriodoAcademicoDto } from '../dto/periodo-financiero.dto';
import { MateriaDto, ProyeccionEstudianteDTOPeticion, ProyeccionEstudianteDTORespuesta } from '../dto/proyeccion-estudiante.dto';
import { ConsultaReportePorGruposDTORespuesta, ReportePorGrupoDTORespuesta } from '../dto/reporte-por-grupos.dto';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../dto/reporte-proyeccion-estudiantes.dto';
import { ReporteEstudiantesDTORespuesta } from '../dto/reporte-estudiantes.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaMapperService {

    constructor() { }

    // --- PeriodoFinanciero ---

    mappearDeRespuestaAPeriodoFinanciero(dto: PeriodoAcademicoDto): PeriodoFinanciero {
        return {
            periodo: dto.tagPeriodo,
            año: dto.anio
        };
    }
    // --- ConfiguracionReporteFinanciero ---

    mappearDeRespuestaAConfiguracionReporteFinanciero(dto: ConfiguracionReporteFinancieroDTORespuesta): ConfiguracionReporteFinanciero {
        return {
            id: dto.id,
            esReporteFinal: dto.esReporteFinal,
            biblioteca: dto.biblioteca,
            recursosComputacionales: dto.recursosComputacionales,
            valorSMLV: dto.valorSMLV,
            porcentajeVotacionFijo: dto.porcentajeVotacionFijo ?? 0.10,
            porcentajeEgresadoFijo: dto.porcentajeEgresadoFijo ?? 0.05,
            objPeriodoFinanciero: this.mappearDeRespuestaAPeriodoFinanciero(dto.periodo)
        };
    }

    // --- Materia ---

    mappearDeRespuestaAMateria(dto: MateriaDto): Materia {
        return {
            codigo: dto.codigo,
            nombre: dto.nombre,
            creditos: dto.creditos
        };
    }

    // --- ProyeccionEstudiante ---

    mappearDePeticionAProyeccionEstudiante(dto: ProyeccionEstudianteDTOPeticion): Partial<ProyeccionEstudiante> {
        return {
            codigoEstudiante: dto.codigoEstudiante,
            estaPago: dto.estaPago,
            aplicaVotacion: dto.aplicaVotacion,
            porcentajeBeca: dto.porcentajeBeca,
            aplicaEgresado: dto.aplicaEgresado,
            estadoProyeccion: dto.estadoProyeccion
        };
    }

    mappearDeRespuestaAProyeccionEstudiante(dto: ProyeccionEstudianteDTORespuesta): ProyeccionEstudiante {
        return {
            codigoEstudiante: dto.codigoEstudiante,
            nombre: dto?.nombre ?? '',
            apellido: dto?.apellido ?? '',
            identificacion: Number(dto?.identificacion) || 0,
            estaPago: dto.estaPago ?? false,
            aplicaVotacion: dto.aplicaVotacion ?? false,
            porcentajeBeca: dto.porcentajeBeca || 0,
            aplicaEgresado: dto.aplicaEgresado ?? false,
            grupoInvestigacion: dto?.grupoInvestigacion ?? '',
            estadoProyeccion: dto.estadoProyeccion,
            valorEnSMLV: dto.valorEnSMLV,
            materias: (dto.materias ?? []).map(m => this.mappearDeRespuestaAMateria(m))
        };
    }

    // --- ReporteProyeccionEstudiantes ---

    mappearDeRespuestaAReporteProyeccionEstudiantes(dto: ReporteProyeccionEstudiantesDTORespuesta): ReporteProyeccionEstudiantes {
        return {
            estudiantes: (dto.estudiantes ?? []).map(e => this.mappearDeRespuestaAProyeccionEstudiante(e)),
            objConfiguracion: this.mappearDeRespuestaAConfiguracionReporteFinanciero(dto.configuracion),
            periodo: this.mappearDeRespuestaAPeriodoFinanciero(dto.periodo),
            totalNeto: dto.totalNeto,
            totalDescuentos: dto.totalDescuentos,
            totalIngresos: dto.totalIngresos
        };
    }

    // --- ReporteEstudiantes ---

    mappearDeRespuestaAReporteEstudiantes(dto: ReporteEstudiantesDTORespuesta): ReporteEstudiantes {
        return {
            estudiantes: (dto.estudiantes ?? []).map(e => this.mappearDeRespuestaAProyeccionEstudiante(e)),
            objConfiguracion: this.mappearDeRespuestaAConfiguracionReporteFinanciero(dto.configuracion),
            periodo: this.mappearDeRespuestaAPeriodoFinanciero(dto.periodo),
            totalNeto: dto.totalNeto,
            totalDescuentos: dto.totalDescuentos,
            totalIngresos: dto.totalIngresos
        };
    }

    // --- GastoGeneral ---

    mappearDeRespuestaAGastoGeneral(dto: GastoGeneralDTORespuesta): GastoGeneral {
        return {
            idGastoGeneral: dto.id,
            categoria: dto.categoria,
            descripcion: dto.descripcion,
            monto: dto.monto
        };
    }

    // --- ReportePorGrupoFila ---

    mappearDeRespuestaAReportePorGrupoFila(dto: ReportePorGrupoDTORespuesta): ReportePorGrupoFila {
        return {
            grupoId: dto.grupoId,
            nombreGrupo: dto.nombreGrupo,
            porcentajeParticipacion: dto.porcentajeParticipacion,
            porcentajePrimerSemestre: dto.porcentajePrimerSemestre ?? dto.porcentajeParticipacion,
            porcentajeSegundoSemestre: dto.porcentajeSegundoSemestre ?? dto.porcentajeParticipacion,
            vigenciasAnteriores: dto.vigenciasAnteriores,
            presupuestoPorGrupo: dto.presupuestoPorGrupo,
            aportePrimerSemestre: dto.aportePrimerSemestre,
            aporteSegundoSemestre: dto.aporteSegundoSemestre,
            participacionPrimerSemestre: dto.porcentajeParticipacion,
            participacionSegundoSemestre: dto.porcentajeParticipacion,
            participacionPorAño: dto.porcentajeParticipacion,
            presupuestoPorGrupoItem1: dto.presupuestoPorGrupoItem1 ?? 0,
            presupuestoPorGrupoItem2: dto.presupuestoPorGrupoItem2 ?? 0,
            imprevistos: dto.imprevistosValor ?? 0,
            presupuestoPorGrupoImprevistos: dto.presupuestoPorGrupoImprevistos ?? dto.presupuestoPorGrupo,
            totalNeto: dto.totalNeto ?? dto.presupuestoPorGrupo
        };
    }

    // --- ReportePorGrupos ---

    mappearDeRespuestaAReportePorGrupos(dto: ConsultaReportePorGruposDTORespuesta): ReportePorGrupos {
        const gastos = (dto.gastosGenerales ?? []).map(g => this.mappearDeRespuestaAGastoGeneral(g));
        const filasPorGrupo = (dto.reportesPorGrupo ?? []).map(f => this.mappearDeRespuestaAReportePorGrupoFila(f));
        const totalNeto = filasPorGrupo.reduce((s, f) => s + f.presupuestoPorGrupo, 0);
        const aportePrimerSemestre = filasPorGrupo.reduce((s, f) => s + f.aportePrimerSemestre, 0);
        const aporteSegundoSemestre = filasPorGrupo.reduce((s, f) => s + f.aporteSegundoSemestre, 0);
        const presupuestoPorGrupoItem1 = filasPorGrupo.reduce((s, f) => s + (f.presupuestoPorGrupoItem1 ?? 0), 0);
        const presupuestoPorGrupoItem2 = filasPorGrupo.reduce((s, f) => s + (f.presupuestoPorGrupoItem2 ?? 0), 0);
        const imprevistosTotal = filasPorGrupo.reduce((s, f) => s + (f.imprevistos ?? 0), 0);
        const presupuestoPorGrupoImprevistos = filasPorGrupo.reduce((s, f) => s + (f.presupuestoPorGrupoImprevistos ?? 0), 0);
        return {
            gastosGenerales: gastos,
            filasPorGrupo,
            anio: dto.anio,
            esEditable: dto.esEditable ?? false,
            ingresoPeriodo1: dto.ingresoPeriodo1 ?? 0,
            ingresoPeriodo2: dto.ingresoPeriodo2 ?? 0,
            totalNeto,
            aportePrimerSemestre,
            aporteSegundoSemestre,
            participacionPrimerSemestre: 0,
            participacionSegundoSemestre: 0,
            participacionPorAño: 0,
            presupuestoPorGrupoItem1,
            presupuestoPorGrupoItem2,
            presupuestoPorGrupo: totalNeto,
            imprevistos: imprevistosTotal,
            presupuestoPorGrupoImprevistos,
            vigenciasAnteriores: filasPorGrupo.reduce((s, f) => s + f.vigenciasAnteriores, 0),
            objConfiguracionReporteGrupos: {
                id: dto.idConfiguracionReporteGrupos,
                aUIPorcentaje: dto.auiPorcentaje ?? 0,
                aUIValor: dto.auiValor ?? 0,
                excedentesMaestria: dto.excedentesMaestria ?? 0,
                ingresosNetos: dto.totalIngresos ?? 0,
                valorADistribuir: dto.valorADistribuir ?? 0,
                item1: dto.item1 ?? 0,
                item2: dto.item2 ?? 0,
                imprevistos: dto.imprevistos ?? 0,
                objPeriodoFinanciero: this.mappearDeRespuestaAPeriodoFinanciero(dto.periodo),
                gastosGenerales: gastos
            }
        };
    }
}
