import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoFinancieroDTOPeticion, PeriodoFinancieroDTORespuesta } from '../../dto/periodo-financiero.dto';
import { ConfiguracionReporteFinanciero, ProyeccionEstudiante } from '../../models/domain-models';
import { ReporteFinalVM, mapToReporteFinalVM } from '../../models/reporte-final.vm';
import { TotalesReporteService } from '../../services/totales-reporte.service';

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
  periodoSeleccionado: PeriodoFinancieroDTORespuesta | null = null;
  sinPeriodos: boolean = false;

  configuracion: ConfiguracionReporteFinanciero | null = null;
  estudiantes: ReporteFinalVM[] = [];

  totalBruto: number = 0;
  totalDescuentosCalculado: number = 0;
  totalIngresosNetos: number = 0;

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private totalesService: TotalesReporteService,
  ) { }

  ngOnInit(): void {
    // Initial load handled by selector component output
  }

  onPeriodoChange(periodo: PeriodoFinancieroDTORespuesta): void {
    this.periodoSeleccionado = periodo;
    this.cargarReporte(periodo);
  }

  cargarReporte(periodoObj: PeriodoFinancieroDTORespuesta): void {
    this.cargando = true;

    const periodo: PeriodoFinancieroDTOPeticion = {
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

        const totales = this.totalesService.fromBackend({
          totalNeto: data?.totalNeto,
          totalDescuentos: data?.totalDescuentos,
          totalIngresos: data?.totalIngresos
        });
        this.totalBruto              = totales.totalNeto;
        this.totalDescuentosCalculado = totales.totalDescuentos;
        this.totalIngresosNetos      = totales.totalIngresos;
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




