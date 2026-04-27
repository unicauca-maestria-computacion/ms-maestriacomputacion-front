import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GestionMatriculaFinancieraFacadeService } from '../../data/facade.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Estudiante, PeriodoAcademico } from '../../models/domain-models';

@Component({
    selector: 'app-matricula-financiera',
    templateUrl: './matricula-financiera.component.html',
    styleUrls: ['./matricula-financiera.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatriculaFinancieraComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    estudiantes: Estudiante[] = [];
    estudiantesFiltrados: Estudiante[] = [];
    loading: boolean = false;

    periodos: PeriodoAcademico[] = [];
    periodosDropdown: { label: string; value: PeriodoAcademico }[] = [];
    periodoSeleccionado: PeriodoAcademico | null = null;

    semestres: { label: string; value: number }[] = [];
    semestreSeleccionado: number | null = null;

    constructor(
        private facadeService: GestionMatriculaFinancieraFacadeService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.cargarPeriodos();
    }

    cargarPeriodos(): void {
        this.loadingService.show('Cargando períodos académicos');
        this.facadeService.obtenerPeriodosAcademicos().pipe(takeUntil(this.destroy$)).subscribe({
            next: (periodos) => {
                this.periodos = periodos;
                this.periodosDropdown = periodos.map(p => ({
                    label: `${p.año}-${p.periodo}`,
                    value: p
                }));

                const periodoGuardado = this.facadeService.getPeriodoFiltro();
                const semestreGuardado = this.facadeService.getSemestreFiltro();

                if (periodoGuardado && this.periodos.some(p => p.año === periodoGuardado.año && p.periodo === periodoGuardado.periodo)) {
                    this.periodoSeleccionado = this.periodos.find(p => p.año === periodoGuardado.año && p.periodo === periodoGuardado.periodo) || null;
                } else if (periodos.length > 0) {
                    this.periodoSeleccionado = periodos[0];
                    this.facadeService.setPeriodoFiltro(this.periodoSeleccionado);
                }

                if (semestreGuardado !== null) {
                    this.semestreSeleccionado = semestreGuardado;
                }

                if (this.periodoSeleccionado) {
                    this.cargarEstudiantes();
                } else {
                    this.loadingService.hide();
                    this.cdr.markForCheck();
                }
            },
            error: (_err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los períodos académicos. Intente nuevamente más tarde.'
                });
                this.loadingService.hide();
                this.cdr.markForCheck();
            }
        });
    }

    cargarEstudiantes(): void {
        if (!this.periodoSeleccionado) return;

        this.loadingService.show('Cargando lista de estudiantes');
        this.facadeService.obtenerEstudiantes(this.periodoSeleccionado).pipe(takeUntil(this.destroy$)).subscribe({
            next: (estudiantes) => {
                this.estudiantes = (estudiantes ?? []).sort((a, b) => (b.semestreFinanciero || 0) - (a.semestreFinanciero || 0));
                this.extraerSemestres();
                this.aplicarFiltros();
                this.loadingService.hide();
                this.cdr.markForCheck();
            },
            error: (_err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los estudiantes. Intente nuevamente más tarde.'
                });
                this.loadingService.hide();
                this.cdr.markForCheck();
            }
        });
    }

    extraerSemestres(): void {
        const semestresUnicos = [...new Set(this.estudiantes.map(e => e.semestreFinanciero))].sort((a, b) => a - b);
        this.semestres = [
            { label: 'Todos', value: 0 },
            ...semestresUnicos.map(s => ({ label: `${s}`, value: s }))
        ];

        if (this.semestreSeleccionado === null) {
            this.semestreSeleccionado = 0;
        }
    }

    onPeriodoChange(): void {
        this.facadeService.setPeriodoFiltro(this.periodoSeleccionado);
        this.cargarEstudiantes();
    }

    onFiltroChange(): void {
        this.facadeService.setSemestreFiltro(this.semestreSeleccionado);
        this.aplicarFiltros();
    }

    aplicarFiltros(): void {
        this.estudiantesFiltrados = this.estudiantes.filter(estudiante => {
            const cumpleSemestre = this.semestreSeleccionado === 0 ||
                                 estudiante.semestreFinanciero === this.semestreSeleccionado;
            return cumpleSemestre;
        });
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
