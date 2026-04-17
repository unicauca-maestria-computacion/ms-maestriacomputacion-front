import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Estudiante, Materia } from '../../models/domain-models';

@Component({
    selector: 'app-tabla-matricula-estudiante',
    templateUrl: './tabla-matricula-estudiante.component.html',
    styleUrls: ['./tabla-matricula-estudiante.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaMatriculaEstudianteComponent implements OnChanges {

    @Input() estudiante: Estudiante | null = null;

    becaResolucion: string = '-';
    becaPorcentaje: string = '';
    descuentoVoto: string = 'NO';
    descuentoEgresado: string = 'NO';
    esNuevo: boolean = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['estudiante'] && this.estudiante) {
            this.procesarDatosFinancieros();
        }
    }

    private procesarDatosFinancieros(): void {
        if (!this.estudiante) return;

        this.becaResolucion = '-';
        this.becaPorcentaje = '';
        this.descuentoVoto = 'NO';
        this.descuentoEgresado = 'NO';
        this.esNuevo = this.estudiante.semestreFinanciero === 1;

        if (this.estudiante.descuentos) {
            this.descuentoVoto = this.estudiante.descuentos.some(d => d.tipoDescuento.toLowerCase().includes('voto')) ? 'SI' : 'NO';
            this.descuentoEgresado = this.estudiante.descuentos.some(d => d.tipoDescuento.toLowerCase().includes('egresado')) ? 'SI' : 'NO';
        }

        if (this.estudiante.becas?.length) {
            this.becaResolucion = this.estudiante.becas[0].resolucion || '-';
            this.becaPorcentaje = this.estudiante.becas[0].porcentaje ? `${this.estudiante.becas[0].porcentaje}%` : '';
        }
    }

    getNombreCompleto(): string {
        return this.estudiante ? `${this.estudiante.nombre} ${this.estudiante.apellido}` : '';
    }

    trackByMateria(_index: number, materia: Materia): string {
        return materia.codigo_oid;
    }
}
