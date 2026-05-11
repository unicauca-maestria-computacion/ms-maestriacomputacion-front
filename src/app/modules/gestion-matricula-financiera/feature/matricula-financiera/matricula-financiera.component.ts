import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GestionMatriculaFinancieraFacadeService } from '../../data/facade.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Estudiante, PeriodoAcademico } from '../../models/domain-models';

interface MatriculaFinancieraVM {
    estudiantes: Estudiante[];
    periodos: PeriodoAcademico[];
    periodoSeleccionado: PeriodoAcademico | null;
    semestreSeleccionado: number | null;
    loading: boolean;
    error: any;
}

@Component({
    selector: 'app-matricula-financiera',
    templateUrl: './matricula-financiera.component.html',
    styleUrls: ['./matricula-financiera.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatriculaFinancieraComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    vm$: Observable<MatriculaFinancieraVM>;
    estudiantesFiltrados$: Observable<Estudiante[]>;

    semestres: { label: string; value: number }[] = [];

    constructor(
        private facadeService: GestionMatriculaFinancieraFacadeService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private loadingService: LoadingService
    ) {
        this.vm$ = combineLatest({
            estudiantes: this.facadeService.estudiantes$,
            periodos: this.facadeService.periodos$,
            periodoSeleccionado: this.facadeService.periodoSeleccionadoFiltro$,
            semestreSeleccionado: this.facadeService.semestreSeleccionadoFiltro$,
            loading: this.facadeService.loading$,
            error: this.facadeService.error$
        });

        this.estudiantesFiltrados$ = combineLatest({
            estudiantes: this.facadeService.estudiantes$,
            semestreSeleccionado: this.facadeService.semestreSeleccionadoFiltro$
        }).pipe(
            map(({ estudiantes, semestreSeleccionado }) => {
                return estudiantes.filter(estudiante => {
                    const cumpleSemestre = semestreSeleccionado === 0 ||
                                         estudiante.semestreFinanciero === semestreSeleccionado;
                    return cumpleSemestre;
                });
            })
        );
    }

    ngOnInit(): void {
        this.cargarPeriodos();
    }

    cargarPeriodos(): void {
        this.loadingService.show('Cargando períodos académicos');
        this.facadeService.obtenerPeriodosAcademicos()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (periodos) => {
                    const periodoGuardado = this.facadeService.getPeriodoFiltro();
                    const semestreGuardado = this.facadeService.getSemestreFiltro();

                    if (periodoGuardado && periodos.some(p => p.año === periodoGuardado.año && p.periodo === periodoGuardado.periodo)) {
                        this.facadeService.setPeriodoFiltro(periodoGuardado);
                    } else if (periodos.length > 0) {
                        this.facadeService.setPeriodoFiltro(periodos[0]);
                    }

                    if (semestreGuardado !== null) {
                        this.facadeService.setSemestreFiltro(semestreGuardado);
                    }

                    const periodoSeleccionado = this.facadeService.getPeriodoFiltro();
                    if (periodoSeleccionado) {
                        this.cargarEstudiantes(periodoSeleccionado);
                    } else {
                        this.loadingService.hide();
                    }
                },
                error: (_err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los períodos académicos. Intente nuevamente más tarde.'
                    });
                    this.loadingService.hide();
                }
            });
    }

    cargarEstudiantes(periodo: PeriodoAcademico): void {
        this.loadingService.show('Cargando lista de estudiantes');
        this.facadeService.obtenerEstudiantes(periodo)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (estudiantes) => {
                    const estudiantesOrdenados = (estudiantes ?? []).sort((a, b) => (b.semestreFinanciero || 0) - (a.semestreFinanciero || 0));
                    this.extraerSemestres(estudiantesOrdenados);
                    this.loadingService.hide();
                },
                error: (_err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los estudiantes. Intente nuevamente más tarde.'
                    });
                    this.loadingService.hide();
                }
            });
    }

    extraerSemestres(estudiantes: Estudiante[]): void {
        const semestresUnicos = [...new Set(estudiantes.map(e => e.semestreFinanciero))].sort((a, b) => a - b);
        this.semestres = [
            { label: 'Todos', value: 0 },
            ...semestresUnicos.map(s => ({ label: `${s}`, value: s }))
        ];

        const semestreGuardado = this.facadeService.getSemestreFiltro();
        if (semestreGuardado === null) {
            this.facadeService.setSemestreFiltro(0);
        }
    }

    onPeriodoChange(periodo: PeriodoAcademico | null): void {
        if (periodo) {
            this.facadeService.setPeriodoFiltro(periodo);
            this.cargarEstudiantes(periodo);
        }
    }

    onFiltroChange(semestre: number | null): void {
        if (semestre !== null) {
            this.facadeService.setSemestreFiltro(semestre);
        }
    }

    verDetalle(estudiante: Estudiante): void {
        this.router.navigate(['detalle', estudiante.codigo], { relativeTo: this.route });
    }

    getInputValue(event: Event): string {
        return (event.target as HTMLInputElement).value;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
