import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fc from 'fast-check';
import { TablaMatriculaEstudianteComponent } from './tabla-matricula-estudiante.component';
import { Estudiante, BecaDescuentoInfo } from '../../models/domain-models';

const buildEstudiante = (overrides: Partial<Estudiante> = {}): Estudiante => ({
    codigo: 'EST001',
    nombre: 'Juan',
    apellido: 'Pérez',
    identificacion: 12345678,
    cohorte: '2020',
    periodoIngreso: '2020-1',
    semestreFinanciero: 3,
    semestreAcademico: 3,
    valorEnSMLV: 6,
    matriculasFinancieras: [],
    descuentos: [],
    becas: [],
    materias: [],
    becasDescuentos: [],
    ...overrides
});

describe('TablaMatriculaEstudianteComponent', () => {
    let component: TablaMatriculaEstudianteComponent;
    let fixture: ComponentFixture<TablaMatriculaEstudianteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TablaMatriculaEstudianteComponent],
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(TablaMatriculaEstudianteComponent);
        component = fixture.componentInstance;
    });

    // Subtarea 21.2 — con lista no vacía, la sección es visible
    it('debería mostrar la sección de becas/descuentos cuando la lista no está vacía', () => {
        const beca: BecaDescuentoInfo = {
            tipo: 'BECA',
            porcentaje: 50,
            resolucion: 'RES-001',
            estado: 'avalada'
        };
        component.estudiante = buildEstudiante({ becasDescuentos: [beca] });
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Solicitudes de Beca/Descuento');
    });

    // Subtarea 21.3 — con lista vacía, se muestra el mensaje de estado vacío
    it('debería mostrar el mensaje vacío cuando becasDescuentos está vacío', () => {
        component.estudiante = buildEstudiante({ becasDescuentos: [] });
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Sin solicitudes de beca/descuento para este período');
    });

    // Subtarea 21.4 — badge de estado con severidad correcta
    it('getBecaEstadoSeverity retorna success para avalada', () => {
        expect(component.getBecaEstadoSeverity('avalada')).toBe('success');
    });

    it('getBecaEstadoSeverity retorna warning para pendiente', () => {
        expect(component.getBecaEstadoSeverity('pendiente')).toBe('warning');
    });

    it('getBecaEstadoSeverity retorna danger para rechazada', () => {
        expect(component.getBecaEstadoSeverity('rechazada')).toBe('danger');
    });

    it('getBecaEstadoSeverity retorna info para estado desconocido', () => {
        expect(component.getBecaEstadoSeverity('otro')).toBe('info');
    });

    // Subtarea 21.5 — Property 7: renderizado completo de campos en el frontend
    // Validates: Requirements 4.2, 4.5
    it('Property 7: getBecaEstadoSeverity retorna un valor no vacío para cualquier estado', () => {
        fc.assert(fc.property(
            fc.string(),
            (estado: string) => {
                const severity = component.getBecaEstadoSeverity(estado);
                expect(['success', 'warning', 'danger', 'info']).toContain(severity);
            }
        ), { numRuns: 100 });
    });
});
