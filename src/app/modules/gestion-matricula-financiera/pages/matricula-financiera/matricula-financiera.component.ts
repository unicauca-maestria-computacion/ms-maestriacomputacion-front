import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GestionMatriculaFinancieraFacadeService } from '../../services/facade.service';
import { Estudiante, PeriodoAcademico } from '../../models/domain-models';

@Component({
    selector: 'app-matricula-financiera',
    templateUrl: './matricula-financiera.component.html',
    styleUrls: ['./matricula-financiera.component.scss']
})
export class MatriculaFinancieraComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    estudiantes: Estudiante[] = [];
    estudiantesFiltrados: Estudiante[] = [];
    loading: boolean = false;

    // Períodos
    periodos: PeriodoAcademico[] = [];
    periodosDropdown: { label: string; value: PeriodoAcademico }[] = [];
    periodoSeleccionado: PeriodoAcademico | null = null;

    // Semestres Financieros
    semestres: { label: string; value: number }[] = [];
    semestreSeleccionado: number | null = null; // null representará "Todos"

    // Fecha de Matrícula
    fechaSeleccionada: Date | null = null;

    constructor(
        private facadeService: GestionMatriculaFinancieraFacadeService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.cargarPeriodos();
    }


    cargarPeriodos(): void {
        this.loading = true;
        this.facadeService.obtenerPeriodosAcademicos().pipe(takeUntil(this.destroy$)).subscribe({
            next: (periodos) => {
                this.periodos = periodos;
                this.periodosDropdown = periodos.map(p => ({
                    label: `${p.año}-${p.periodo}`,
                    value: p
                }));

                // Restaurar filtros desde la fachada
                const periodoGuardado = this.facadeService.getPeriodoFiltro();
                const semestreGuardado = this.facadeService.getSemestreFiltro();
                const fechaGuardada = this.facadeService.getFechaFiltro();

                if (periodoGuardado && this.periodos.some(p => p.año === periodoGuardado.año && p.periodo === periodoGuardado.periodo)) {
                    // Buscar el objeto exacto de la lista actual para que el dropdown funcione (comparacion de objetos en PrimeNG)
                    this.periodoSeleccionado = this.periodos.find(p => p.año === periodoGuardado.año && p.periodo === periodoGuardado.periodo) || null;
                } else if (periodos.length > 0) {
                    this.periodoSeleccionado = periodos[0];
                    this.facadeService.setPeriodoFiltro(this.periodoSeleccionado);
                }

                if (semestreGuardado !== null) {
                    this.semestreSeleccionado = semestreGuardado;
                }
                
                if (fechaGuardada) {
                    this.fechaSeleccionada = new Date(fechaGuardada);
                }

                if (this.periodoSeleccionado) {
                    this.cargarEstudiantes();
                } else {
                    this.loading = false;
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los períodos académicos. Intente nuevamente más tarde.'
                });
                this.loading = false;
            }
        });
    }

    cargarEstudiantes(): void {
        if (!this.periodoSeleccionado) return;

        this.loading = true;
        this.facadeService.obtenerEstudiantes(this.periodoSeleccionado).pipe(takeUntil(this.destroy$)).subscribe({
            next: (estudiantes) => {
                this.estudiantes = estudiantes ?? [];
                this.extraerSemestres();
                this.aplicarFiltros();
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los estudiantes. Intente nuevamente más tarde.'
                });
                this.loading = false;
            }
        });
    }

    extraerSemestres(): void {
        const semestresUnicos = [...new Set(this.estudiantes.map(e => e.semestreFinanciero))].sort((a, b) => a - b);
        this.semestres = [
            { label: 'Todos', value: 0 },
            ...semestresUnicos.map(s => ({ label: `${s}`, value: s }))
        ];
        
        // Si no tenemos un semestre restaurado de la fachada, ponemos "Todos"
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
        this.facadeService.setFechaFiltro(this.fechaSeleccionada);
        this.aplicarFiltros();
    }

    aplicarFiltros(): void {
        this.estudiantesFiltrados = this.estudiantes.filter(estudiante => {
            // Filtro por semestre
            const cumpleSemestre = this.semestreSeleccionado === 0 || 
                                 estudiante.semestreFinanciero === this.semestreSeleccionado;
            
            // Filtro por fecha de matrícula
            let cumpleFecha = true;
            if (this.fechaSeleccionada) {
                const fechaM = this.obtenerFechaMatricula(estudiante);
                if (fechaM) {
                    // Comparar solo fecha sin hora
                    const d1 = new Date(this.fechaSeleccionada).setHours(0,0,0,0);
                    const d2 = new Date(fechaM).setHours(0,0,0,0);
                    cumpleFecha = d1 === d2;
                } else {
                    cumpleFecha = false;
                }
            }

            return cumpleSemestre && cumpleFecha;
        });
    }

    obtenerFechaMatricula(estudiante: Estudiante): Date | null {
        if (!this.periodoSeleccionado || !estudiante.matriculasFinancieras) return null;
        
        const matricula = estudiante.matriculasFinancieras.find(m => 
            m.objPeriodoAcademico.año === this.periodoSeleccionado?.año && 
            m.objPeriodoAcademico.periodo === this.periodoSeleccionado?.periodo
        );
        
        return matricula ? matricula.fechaMatricula : null;
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
