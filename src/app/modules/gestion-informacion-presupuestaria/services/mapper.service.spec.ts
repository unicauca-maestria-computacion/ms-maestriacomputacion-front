import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';
import { GestionInformacionPresupuestariaMapperService } from './mapper.service';
import { PeriodoAcademicoDto } from '../dto/periodo-financiero.dto';
import { ProyeccionEstudianteDTORespuesta } from '../dto/proyeccion-estudiante.dto';
import { ReporteEstudiantesDTORespuesta } from '../dto/reporte-estudiantes.dto';
import { ReportePorGrupoDTORespuesta } from '../dto/reporte-por-grupos.dto';
import { GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';

describe('GestionInformacionPresupuestariaMapperService', () => {
    let mapper: GestionInformacionPresupuestariaMapperService;

    const mockPeriodo: PeriodoAcademicoDto = {
        id: 1,
        tagPeriodo: 1,
        anio: 2024,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-06-30',
        estado: 'ACTIVO',
        activo: true
    };

    const mockConfiguracion = {
        id: 1,
        biblioteca: 100,
        recursosComputacionales: 200,
        valorSMLV: 1300000,
        esReporteFinal: false,
        periodo: mockPeriodo
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        mapper = TestBed.inject(GestionInformacionPresupuestariaMapperService);
    });

    // Feature: front-info-presupuestaria-adapter, Property 1
    // Propiedad 1: Mapper PeriodoAcademico preserva identificadores de periodo
    // Valida: Requisito 2.3
    it('mappearDeRespuestaAPeriodoFinanciero preserva tagPeriodo y anio', () => {
        fc.assert(fc.property(
            fc.integer(), fc.integer(),
            (tagPeriodo, anio) => {
                const dto: PeriodoAcademicoDto = {
                    id: 1,
                    tagPeriodo,
                    anio,
                    fechaInicio: '2024-01-01',
                    fechaFin: '2024-06-30',
                    estado: 'ACTIVO',
                    activo: true
                };
                const result = mapper.mappearDeRespuestaAPeriodoFinanciero(dto);
                expect(result.periodo).toBe(tagPeriodo);
                expect(result.año).toBe(anio);
            }
        ), { numRuns: 100 });
    });

    // Feature: front-info-presupuestaria-adapter, Property 2
    // Propiedad 2: Mapper ProyeccionEstudiante preserva campos nuevos del backend
    // Valida: Requisitos 3.4, 3.5
    it('mappearDeRespuestaAProyeccionEstudiante preserva estadoProyeccion y valorEnSMLV', () => {
        fc.assert(fc.property(
            fc.string(), fc.integer({ min: 0 }),
            (estadoProyeccion, valorEnSMLV) => {
                const dto: ProyeccionEstudianteDTORespuesta = {
                    codigoEstudiante: 'EST001',
                    identificacion: 123456,
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    estaPago: true,
                    porcentajeVotacion: 0,
                    porcentajeBeca: 0,
                    porcentajeEgresado: 0,
                    grupoInvestigacion: 'GTI',
                    estadoProyeccion,
                    valorEnSMLV,
                    materias: []
                };
                const result = mapper.mappearDeRespuestaAProyeccionEstudiante(dto);
                expect(result.estadoProyeccion).toBe(estadoProyeccion);
                expect(result.valorEnSMLV).toBe(valorEnSMLV);
            }
        ), { numRuns: 100 });
    });

    // Feature: front-info-presupuestaria-adapter, Property 3
    // Propiedad 3: Mapper ReporteEstudiantes preserva totales financieros desde la raíz
    // Valida: Requisito 5.3
    it('mappearDeRespuestaAReporteEstudiantes preserva totalNeto, totalDescuentos, totalIngresos', () => {
        fc.assert(fc.property(
            fc.float({ noNaN: true }), fc.float({ noNaN: true }), fc.float({ noNaN: true }),
            (totalNeto, totalDescuentos, totalIngresos) => {
                const dto: ReporteEstudiantesDTORespuesta = {
                    periodo: mockPeriodo,
                    configuracion: mockConfiguracion,
                    estudiantes: [],
                    totalNeto,
                    totalDescuentos,
                    totalIngresos
                };
                const result = mapper.mappearDeRespuestaAReporteEstudiantes(dto);
                expect(result.totalNeto).toBe(totalNeto);
                expect(result.totalDescuentos).toBe(totalDescuentos);
                expect(result.totalIngresos).toBe(totalIngresos);
            }
        ), { numRuns: 100 });
    });

    // Feature: front-info-presupuestaria-adapter, Property 4
    // Propiedad 4: Mapper ReportePorGrupo preserva identificadores de grupo
    // Valida: Requisito 7.4
    it('mappearDeRespuestaAReportePorGrupoFila preserva grupoId y nombreGrupo', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1 }), fc.string({ minLength: 1 }),
            (grupoId, nombreGrupo) => {
                const dto: ReportePorGrupoDTORespuesta = {
                    grupoId,
                    nombreGrupo,
                    porcentajeParticipacion: 0.33,
                    vigenciasAnteriores: 0,
                    presupuestoPorGrupo: 0,
                    aportePrimerSemestre: 0,
                    aporteSegundoSemestre: 0
                };
                const result = mapper.mappearDeRespuestaAReportePorGrupoFila(dto);
                expect(result.nombreGrupo).toBe(nombreGrupo);
            }
        ), { numRuns: 100 });
    });

    // Feature: front-info-presupuestaria-adapter, Property 5
    // Propiedad 5: Mapper GastoGeneral mapea id del backend a idGastoGeneral del dominio
    // Valida: Requisito 9.7
    it('mappearDeRespuestaAGastoGeneral mapea id a idGastoGeneral', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1 }),
            (id) => {
                const dto: GastoGeneralDTORespuesta = {
                    id,
                    categoria: 'PAPELERIA',
                    descripcion: 'Resmas',
                    monto: 50000
                };
                const result = mapper.mappearDeRespuestaAGastoGeneral(dto);
                expect(result.idGastoGeneral).toBe(id);
            }
        ), { numRuns: 100 });
    });
});
