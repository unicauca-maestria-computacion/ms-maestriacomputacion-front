import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Estudiante, Materia } from '../../models/domain-models';
import { GestionMatriculaFinancieraApiService } from '../../services/api.service';

@Component({
    selector: 'app-tabla-matricula-estudiante',
    templateUrl: './tabla-matricula-estudiante.component.html',
    styleUrls: ['./tabla-matricula-estudiante.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaMatriculaEstudianteComponent implements OnChanges, OnDestroy {

    @Input() estudiante: Estudiante | null = null;

    becaResolucion: string = '-';
    becaPorcentaje: string = '';
    becaTipo: string = '—';
    descuentoVoto: string = 'NO';
    descuentoEgresado: string = 'NO';
    esNuevo: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private apiService: GestionMatriculaFinancieraApiService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['estudiante'] && this.estudiante) {
            this.procesarDatosFinancieros();
            this.consultarDescuentoVoto();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private procesarDatosFinancieros(): void {
        if (!this.estudiante) return;

        this.becaResolucion = '-';
        this.becaPorcentaje = '';
        this.becaTipo = '—';
        this.descuentoVoto = 'NO';
        this.descuentoEgresado = 'NO';
        this.esNuevo = this.estudiante.semestreFinanciero === 1;

        if (this.estudiante.descuentos) {
            this.descuentoEgresado = this.estudiante.descuentos.some(
                d => d.tipoDescuento.toLowerCase().includes('egresado')
            ) ? 'SI' : 'NO';
        }

        // esEgresadoUnicauca viene directamente del backend
        if (this.estudiante.esEgresadoUnicauca != null) {
            this.descuentoEgresado = this.estudiante.esEgresadoUnicauca ? 'SI' : 'NO';
        }

        if (this.estudiante.becas?.length) {
            this.becaResolucion = this.estudiante.becas[0].resolucion || '-';
            this.becaPorcentaje = this.estudiante.becas[0].porcentaje ? `${this.estudiante.becas[0].porcentaje}%` : '';
            this.becaTipo = this.estudiante.becas[0].tipo || '—';
        }
    }

    private consultarDescuentoVoto(): void {
        if (!this.estudiante) return;
        const codigo = this.estudiante.codigo;

        this.apiService.tieneDescuentoVoto(codigo)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (tiene) => {
                    this.descuentoVoto = tiene ? 'SI' : 'NO';
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.descuentoVoto = 'NO';
                    this.cdr.markForCheck();
                }
            });
    }

    getNombreCompleto(): string {
        return this.estudiante ? `${this.estudiante.nombre} ${this.estudiante.apellido}` : '';
    }

    trackByMateria(_index: number, materia: Materia): string {
        return materia.codigo_oid;
    }
}
