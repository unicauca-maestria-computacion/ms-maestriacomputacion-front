import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';
import { GestionMatriculaFinancieraMapperService } from './mapper.service';
import { EstudianteDTORespuesta } from '../dto/estudiante.dto';
import { BecaDescuentoInfoDTO } from '../dto/beca-descuento-info.dto';

describe('GestionMatriculaFinancieraMapperService', () => {
    let mapper: GestionMatriculaFinancieraMapperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        mapper = TestBed.inject(GestionMatriculaFinancieraMapperService);
    });

    // Subtarea 21.1 — mapeo correcto de becasDescuentos con lista no vacía
    it('mappearDeRespuestaAEstudiante mapea becasDescuentos correctamente', () => {
        const beca: BecaDescuentoInfoDTO = {
            tipo: 'BECA',
            porcentaje: 50,
            resolucion: 'RES-001',
            estado: 'avalada'
        };
        const dto: EstudianteDTORespuesta = {
            codigo: 'EST001',
            nombre: 'Juan',
            apellido: 'Pérez',
            identificacion: 12345678,
            cohorte: 2020,
            periodoIngreso: '2020-1',
            semestreFinanciero: 3,
            descuentos: [],
            becas: [],
            materias: [],
            becasDescuentos: [beca]
        };

        const result = mapper.mappearDeRespuestaAEstudiante(dto);

        expect(result.becasDescuentos).toBeDefined();
        expect(result.becasDescuentos.length).toBe(1);
        expect(result.becasDescuentos[0].tipo).toBe('BECA');
        expect(result.becasDescuentos[0].porcentaje).toBe(50);
        expect(result.becasDescuentos[0].resolucion).toBe('RES-001');
        expect(result.becasDescuentos[0].estado).toBe('avalada');
    });

    // Subtarea 21.1 — lista vacía
    it('mappearDeRespuestaAEstudiante retorna lista vacía cuando becasDescuentos es []', () => {
        const dto: EstudianteDTORespuesta = {
            codigo: 'EST001',
            nombre: 'Juan',
            apellido: 'Pérez',
            identificacion: 12345678,
            cohorte: 2020,
            periodoIngreso: '2020-1',
            semestreFinanciero: 3,
            descuentos: [],
            becas: [],
            materias: [],
            becasDescuentos: []
        };

        const result = mapper.mappearDeRespuestaAEstudiante(dto);

        expect(result.becasDescuentos).toEqual([]);
    });

    // Subtarea 21.1 — valor null
    it('mappearDeRespuestaAEstudiante retorna lista vacía cuando becasDescuentos es null', () => {
        const dto: any = {
            codigo: 'EST001',
            nombre: 'Juan',
            apellido: 'Pérez',
            identificacion: 12345678,
            cohorte: 2020,
            periodoIngreso: '2020-1',
            semestreFinanciero: 3,
            descuentos: [],
            becas: [],
            materias: [],
            becasDescuentos: null
        };

        const result = mapper.mappearDeRespuestaAEstudiante(dto);

        expect(result.becasDescuentos).toEqual([]);
    });

    // Property 7: Renderizado completo de campos en el frontend (mapper part)
    // Validates: Requirements 4.2, 4.5
    it('mappearDeRespuestaABecaDescuentoInfo preserva todos los campos sin transformación', () => {
        fc.assert(fc.property(
            fc.record({
                tipo: fc.string({ minLength: 1 }),
                porcentaje: fc.float({ min: 0, max: 100, noNaN: true }),
                resolucion: fc.string({ minLength: 1 }),
                estado: fc.string({ minLength: 1 })
            }),
            (beca: BecaDescuentoInfoDTO) => {
                const result = mapper.mappearDeRespuestaABecaDescuentoInfo(beca);
                expect(result.tipo).toBe(beca.tipo);
                expect(result.porcentaje).toBe(beca.porcentaje);
                expect(result.resolucion).toBe(beca.resolucion);
                expect(result.estado).toBe(beca.estado);
            }
        ), { numRuns: 100 });
    });
});
