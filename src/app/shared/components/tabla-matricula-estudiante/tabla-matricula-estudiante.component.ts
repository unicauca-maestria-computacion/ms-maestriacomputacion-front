import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BecaFinanciera, Estudiante, Materia } from '../../../modules/gestion-matricula-financiera/models/domain-models';

@Component({
    selector: 'app-tabla-matricula-estudiante',
    templateUrl: './tabla-matricula-estudiante.component.html',
    styleUrls: ['./tabla-matricula-estudiante.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaMatriculaEstudianteComponent implements OnChanges {

    @Input() estudiante: Estudiante | null = null;

    /** Becas aplicadas del estudiante (todas, no solo la primera) */
    becasList: BecaFinanciera[] = [];
    descuentoVoto: string = 'NO';
    descuentoEgresado: string = 'NO';
    esNuevo: boolean = false;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['estudiante'] && this.estudiante) {
            this.procesarDatosFinancieros();
        }
    }

    private procesarDatosFinancieros(): void {
        if (!this.estudiante) return;

        // Usar los campos booleanos unificados del backend
        this.descuentoVoto = this.estudiante.aplicaVotacion ? 'SI' : 'NO';
        this.descuentoEgresado = this.estudiante.esEgresadoUnicauca ? 'SI' : 'NO';
        this.esNuevo = this.estudiante.semestreFinanciero === 1;

        // Becas en becasDescuentos (backend unificado) o en becas (por compatibilidad)
        this.becasList = this.estudiante.becasDescuentos?.length
            ? this.estudiante.becasDescuentos
            : (this.estudiante.becas ?? []);

        this.cdr.markForCheck();
    }

    getNombreCompleto(): string {
        return this.estudiante ? `${this.estudiante.nombre} ${this.estudiante.apellido}` : '';
    }

    trackByBeca(index: number, beca: BecaFinanciera): string {
        return beca.resolucion + index;
    }

    trackByMateria(_index: number, materia: Materia): string {
        return materia.codigo_oid;
    }
}
