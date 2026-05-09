import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    BehaviorSubject,
    Subject,
    combineLatest
} from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    takeUntil
} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GestionMatriculaFinancieraFacadeService } from '../../data/facade.service';
import { Estudiante } from '../../models/domain-models';
import { getEstadoMatriculaLabel, getEstadoMatriculaSeverity } from '../../utils/estado-matricula.utils';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
    selector: 'app-matricula-financiera',
    templateUrl: './matricula-financiera.component.html',
    styleUrls: ['./matricula-financiera.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatriculaFinancieraComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    // ── Filtros reactivos ───────────────────────────────────────────────────
    readonly busqueda$ = new Subject<string>();
    readonly estadoFiltro$ = new BehaviorSubject<string>('TODOS');

    // ── ViewModel del Facade ────────────────────────────────────────────────
    readonly vm$ = this.facadeService.vm$;

    // ── Lista filtrada (combina estado del Facade + filtros locales) ────────
    readonly estudiantesFiltrados$ = combineLatest({
        estudiantes: this.facadeService.estudiantes$,
        termino: this.busqueda$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            startWith('')
        ),
        estado: this.estadoFiltro$
    }).pipe(
        map(({ estudiantes, termino, estado }) => {
            let resultado = estudiantes;

            if (termino.trim()) {
                const t = termino.toLowerCase();
                resultado = resultado.filter(e =>
                    e.nombre.toLowerCase().includes(t) ||
                    e.apellido.toLowerCase().includes(t) ||
                    e.codigo.toLowerCase().includes(t)
                );
            }

            if (estado && estado !== 'TODOS') {
                resultado = resultado.filter(e =>
                    estado === 'true'  ? e.estaPago === true :
                    estado === 'false' ? e.estaPago === false :
                    estado === 'null'  ? e.estaPago == null :
                    true
                );
            }

            return resultado;
        })
    );

    // ── Opciones de estado para el dropdown de filtro ───────────────────────
    readonly estadosMatricula = [
        { label: 'Todos los estados', value: 'TODOS' },
        { label: 'PAGADO',            value: 'true'  },
        { label: 'NO PAGADO',         value: 'false' },
        { label: 'PENDIENTE',         value: 'null'  },
    ];

    constructor(
        private facadeService: GestionMatriculaFinancieraFacadeService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.cargarPeriodosYEstudiantes();
    }

    private cargarPeriodosYEstudiantes(): void {
        this.loadingService.show('Cargando períodos académicos...');
        this.facadeService.obtenerPeriodosAcademicos()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: periodos => {
                    const periodoGuardado = this.facadeService.getPeriodoFiltro();
                    const periodo = periodoGuardado
                        ? periodos.find(p => p.año === periodoGuardado.año && p.periodo === periodoGuardado.periodo) ?? periodos[0]
                        : periodos[0];

                    if (periodo) {
                        this.facadeService.setPeriodoFiltro(periodo);
                        this.loadingService.show(`Cargando estudiantes del período ${this.getPeriodoDropdownLabel(periodo)}...`);
                        this.facadeService.obtenerEstudiantes(periodo)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe({
                                next: () => this.loadingService.hide(),
                                error: () => {
                                    this.loadingService.hide();
                                    this.mostrarError('No fue posible cargar las matrículas. Por favor, intente nuevamente.');
                                }
                            });
                    } else {
                        this.loadingService.hide();
                    }
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.loadingService.hide();
                    this.mostrarError('No fue posible cargar los períodos académicos. Por favor, intente nuevamente.');
                }
            });
    }

    onPeriodoChange(periodo: any): void {
        if (!periodo) return;
        this.loadingService.show(`Sincronizando período ${this.getPeriodoDropdownLabel(periodo)}...`);
        this.facadeService.setPeriodoFiltro(periodo);
        this.facadeService.obtenerEstudiantes(periodo)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => this.loadingService.hide(),
                error: () => {
                    this.loadingService.hide();
                    this.mostrarError('No fue posible cargar las matrículas. Por favor, intente nuevamente.');
                }
            });
    }

    onBusquedaChange(event: Event): void {
        this.busqueda$.next((event.target as HTMLInputElement).value);
    }

    onEstadoChange(valor: string): void {
        this.estadoFiltro$.next(valor);
    }

    verDetalle(estudiante: Estudiante): void {
        this.router.navigate(['detalle', estudiante.codigo], { relativeTo: this.route });
    }

    trackByEstudiante(index: number, estudiante: Estudiante): string {
        return estudiante.codigo;
    }

    getEstadoLabel(estaPago: boolean | undefined | null): string {
        return getEstadoMatriculaLabel(estaPago);
    }

    getEstadoPagoSeverity(estaPago: boolean | undefined | null): 'success' | 'warning' | 'danger' | 'info' {
        return getEstadoMatriculaSeverity(estaPago);
    }

    getPeriodoDropdownLabel(periodo: any): string {
        if (!periodo) return '';
        const anio = periodo.anio ?? periodo['año'] ?? '';
        const tag = periodo.tagPeriodo ?? periodo.periodo ?? '';
        return `${anio}-${tag}`;
    }

    private mostrarError(detalle: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: detalle
        });
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
