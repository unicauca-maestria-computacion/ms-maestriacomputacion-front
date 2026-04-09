import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoAcademicoDTOPeticion, PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';
import { ConfiguracionReporteFinanciero, ProyeccionEstudiante } from '../../models/domain-models';
import { ReporteFinalVM, mapToReporteFinalVM } from '../../models/reporte-final.vm';

@Component({
  selector: 'app-reporte-final',
  templateUrl: './reporte-final.component.html',
  styleUrls: ['./reporte-final.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class ReporteFinalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  cargando: boolean = false;
  periodoSeleccionado: PeriodoAcademicoDTORespuesta | null = null;

  configuracion: ConfiguracionReporteFinanciero | null = null;
  estudiantes: ReporteFinalVM[] = [];

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // Initial load handled by selector component output
  }

  onPeriodoChange(periodo: PeriodoAcademicoDTORespuesta): void {
    this.periodoSeleccionado = periodo;
    this.cargarReporte(periodo);
  }

  cargarReporte(periodoObj: PeriodoAcademicoDTORespuesta): void {
    this.cargando = true;

    const periodo: PeriodoAcademicoDTOPeticion = {
      periodo: periodoObj.periodo,
      año: periodoObj.año
    };

    this.facadeService.obtenerReporteFinanciero(periodo.periodo, periodo.año).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data?.objConfiguracion) {
          this.configuracion = data.objConfiguracion;
        }

        if (data?.estudiantes && this.configuracion) {
          this.estudiantes = data.estudiantes.map(e =>
            mapToReporteFinalVM(e, this.configuracion!)
          );
        }

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching report', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el reporte financiero. Intente nuevamente.'
        });
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  get totalBruto(): number {
    return this.estudiantes.reduce(
      (acc, e) => acc + (e.matricula || 0) + (e.recursosComputacionales || 0) + (e.biblioteca || 0), 0
    );
  }

  get totalDescuentosCalculado(): number {
    return this.estudiantes.reduce((acc, e) => acc + (e.grupoDescuentos || 0), 0);
  }

  get totalIngresosNetos(): number {
    return this.estudiantes.reduce((acc, e) => acc + (e.totalNeto || 0), 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  descargar(): void {
    console.log('Descargando reporte final...');
  }

  formatCurrency(value: number): string {
    if (value == null || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatPercent(value: number): string {
    if (value == null || isNaN(value)) return '0 %';
    return `${(value * 100).toFixed(0)} %`;
  }

}
