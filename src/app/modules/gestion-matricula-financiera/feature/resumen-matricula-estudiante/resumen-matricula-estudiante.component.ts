import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BecaFinanciera, Materia, PeriodoAcademico } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../data/facade.service';
import { AutenticacionService } from '../../../gestion-autenticacion/services/autenticacion.service';
import { getEstadoMatriculaSeverity, getEstadoMatriculaLabel } from '../../utils/estado-matricula.utils';

@Component({
    selector: 'app-resumen-matricula-estudiante',
    templateUrl: './resumen-matricula-estudiante.component.html',
    styleUrls: ['./resumen-matricula-estudiante.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class ResumenMatriculaEstudianteComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    /** ViewModel del Facade — contiene loading, error, estudiante, periodos, isEmpty */
    readonly vmResumen$ = this.facadeService.vmResumen$;

    constructor(
        private route: ActivatedRoute,
        private facadeService: GestionMatriculaFinancieraFacadeService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private autenticacionService: AutenticacionService
    ) {}

    ngOnInit(): void {
        this.facadeService.obtenerPeriodosAcademicos().pipe(
            switchMap(periodos => {
                if (periodos?.length > 0) {
                    this.facadeService.setPeriodoFiltro(periodos[0]);
                }
                return this.route.paramMap;
            }),
            switchMap(params => {
                const idRuta = params.get('id');
                const id = idRuta?.trim()
                    ? idRuta
                    : this.autenticacionService.getLoggedInUser()?.academicCode ?? '';
                return this.facadeService.obtenerEstudiante(id);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: () => this.cdr.markForCheck(),
            error: () => {
                // Error 404 u otro: no redirigir, mostrar estado vacío con botón de revisión
                this.cdr.markForCheck();
            }
        });
    }

    /** Simula el envío exitoso de una solicitud de revisión */
    solicitarRevision(): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Solicitud enviada',
            detail: 'Tu solicitud de revisión de matrícula ha sido registrada exitosamente. La coordinación del programa la revisará pronto.'
        });
    }

    getPeriodoLabel(periodos: PeriodoAcademico[]): string {
        if (!periodos?.length) return '';
        const p = periodos[0];
        const anio = p.año ?? p.tagPeriodo ?? '';
        const periodo = p.periodo ?? p.tagPeriodo ?? '';
        return `${anio}-${periodo}`;
    }

    getEstadoPagoLabel(estaPago: boolean | undefined | null): string {
        return getEstadoMatriculaLabel(estaPago);
    }

    getEstadoPagoSeverity(estaPago: boolean | undefined | null): 'success' | 'warning' | 'danger' | 'info' {
        return getEstadoMatriculaSeverity(estaPago);
    }

    trackByBeca(index: number, beca: BecaFinanciera): string {
        return beca.resolucion + index;
    }

    trackByMateria(index: number, materia: Materia): string {
        return materia.codigo_oid + index;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
