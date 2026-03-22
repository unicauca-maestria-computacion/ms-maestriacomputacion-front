import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ExcelService } from '../../services/excel.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-descargar-reporte-dialog',
  templateUrl: './descargar-reporte-dialog.component.html',
  styleUrls: ['./descargar-reporte-dialog.component.scss']
})
export class DescargarReporteDialogComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input() display: boolean = false;
  @Input() activeReportCode: string = '';
  @Input() activePeriod: PeriodoAcademicoDTORespuesta | null = null;
  @Output() displayChange = new EventEmitter<boolean>();

  reportOptions = [
    { name: 'Reporte Final', value: 'reporte-final' },
    { name: 'Proyección Reporte', value: 'proyeccion-reporte' },
    { name: 'Reporte por Grupos', value: 'reporte-por-grupos' }
  ];

  periodOptions: { name: string; value: string }[] = [];
  allPeriodOptions: { name: string; value: string; period: PeriodoAcademicoDTORespuesta }[] = [];
  selectedReport: string = '';
  selectedPeriodKey: string = '';
  loadingPeriods: boolean = false;
  loadingDownload: boolean = false;

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private excelService: ExcelService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Actualizar selección cuando cambia el período o el tipo de reporte desde el padre
    if ((changes['activePeriod'] || changes['activeReportCode']) && this.allPeriodOptions.length > 0) {
      this.sincronizarSeleccion();
    }
  }

  onDialogShow(): void {
    // (onShow) se dispara cuando el dialog ya está completamente en el DOM.
    // setTimeout(0) garantiza que los dropdowns están inicializados antes de asignar valores.
    setTimeout(() => this.sincronizarSeleccion(), 0);
  }

  cargarPeriodos() {
    this.loadingPeriods = true;
    this.facadeService.obtenerPeriodosAcademicos().pipe(takeUntil(this.destroy$)).subscribe({
      next: (periodos) => {
        const seen = new Set<string>();
        const unicos = periodos.filter(p => {
          const key = `${p.año}-${p.periodo}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        this.allPeriodOptions = unicos
          .sort((a, b) => b.año !== a.año ? b.año - a.año : b.periodo - a.periodo)
          .map(p => ({
            name: `${p.año}-${p.periodo}`,
            value: `${p.año}-${p.periodo}`,
            period: p
          }));
        this.sincronizarSeleccion();
        this.loadingPeriods = false;
      },
      error: () => {
        this.loadingPeriods = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los períodos académicos. Intente nuevamente más tarde.'
        });
      }
    });
  }

  actualizarPeriodosDisponibles() {
    if (this.allPeriodOptions.length === 0) {
      this.periodOptions = [];
      return;
    }

    if (this.selectedReport === 'reporte-final') {
      this.periodOptions = this.allPeriodOptions.slice(1).map(o => ({ name: o.name, value: o.value }));
      const currentKey = this.allPeriodOptions[0]?.value;
      if (currentKey && this.selectedPeriodKey === currentKey) {
        this.selectedPeriodKey = '';
      }
    } else if (this.selectedReport === 'proyeccion-reporte') {
      const latest = this.allPeriodOptions[0];
      this.periodOptions = latest ? [{ name: latest.name, value: latest.value }] : [];
      // No asignar selectedPeriodKey aquí — se hace en aplicarSeleccionPeriodo (diferido)
    } else {
      this.periodOptions = this.allPeriodOptions.map(o => ({ name: o.name, value: o.value }));
    }
  }

  onReportChange() {
    // Clear first so the p-dropdown options setter does not see a stale value
    // and clobber selectedPeriodKey via onModelChange(null) before we re-assign it.
    this.selectedPeriodKey = '';
    this.actualizarPeriodosDisponibles();
    setTimeout(() => this.aplicarSeleccionPeriodo(), 0);
  }

  /**
   * Calculates and assigns the correct selectedPeriodKey from the current
   * periodOptions and activePeriod. Must be called AFTER periodOptions has
   * already been set and Angular has processed that binding through the
   * p-dropdown options setter (i.e. inside a setTimeout or similar).
   */
  private aplicarSeleccionPeriodo(): void {
    if (this.periodOptions.length === 0) {
      return;
    }
    if (this.selectedReport === 'proyeccion-reporte') {
      // Proyección: siempre el único período disponible (el más reciente)
      this.selectedPeriodKey = this.periodOptions[0].value;
      return;
    }
    if (this.activePeriod) {
      const key = `${this.activePeriod.año}-${this.activePeriod.periodo}`;
      const exists = this.periodOptions.some(opt => opt.value === key);
      this.selectedPeriodKey = exists ? key : this.periodOptions[0].value;
    } else {
      this.selectedPeriodKey = this.periodOptions[0].value;
    }
  }

  sincronizarSeleccion() {
    // 1. Sincronizar tipo de reporte
    if (this.activeReportCode) {
      this.selectedReport = this.activeReportCode;
    }

    // 2. Clear any stale period key BEFORE updating periodOptions so that when
    //    the p-dropdown `options` setter fires it sees '' and does not try to
    //    look up a value that belongs to the previous list — avoiding the
    //    PrimeNG 13 bug where options setter calls onModelChange(null) and
    //    overwrites the model when the value is not yet present in the new list.
    this.selectedPeriodKey = '';

    // 3. Reconstruir opciones de período según el reporte
    this.actualizarPeriodosDisponibles();

    // 4. Defer the period key assignment by one macrotask tick so that Angular's
    //    change-detection has already propagated the new periodOptions array into
    //    the p-dropdown (triggering its options setter) before we write
    //    selectedPeriodKey.  Without this deferral, both bindings ([options] and
    //    [(ngModel)]) are processed in the same CD cycle; [options] fires first
    //    (it appears first in the template), finds no match for the model value,
    //    and resets the model to null via onModelChange — wiping out the value
    //    we are about to set.
    setTimeout(() => this.aplicarSeleccionPeriodo(), 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrar() {
    this.loadingDownload = false;
    this.displayChange.emit(false);
  }

  descargar() {
    const selectedPeriodObj = this.allPeriodOptions.find(o => o.value === this.selectedPeriodKey)?.period ?? null;

    if (!this.selectedReport || !selectedPeriodObj) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione un reporte y un período académico.'
      });
      return;
    }

    this.loadingDownload = true;
    const periodo = { año: selectedPeriodObj.año, periodo: selectedPeriodObj.periodo };

    switch (this.selectedReport) {
      case 'reporte-final':
        this.descargarReporteFinal(periodo);
        break;
      case 'proyeccion-reporte':
        this.descargarProyeccionReporte();
        break;
      case 'reporte-por-grupos':
        this.descargarReportePorGrupos(periodo);
        break;
      default:
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Tipo de reporte no reconocido.'
        });
    }
  }

  private descargarReporteFinal(periodo: { año: number; periodo: number }) {
    this.facadeService.obtenerReporteFinanciero(periodo.periodo, periodo.año).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data || !data.estudiantes || data.estudiantes.length === 0) {
          this.loadingDownload = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay registros disponibles para exportar en el período seleccionado.'
          });
          return;
        }
        this.excelService.generarExcelReporteFinal(data);
        this.loadingDownload = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reporte Final descargado correctamente.' });
        this.cerrar();
      },
      error: (err) => {
        this.loadingDownload = false;
        console.error('Error al obtener reporte final:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el Reporte Final.' });
      }
    });
  }

  private descargarProyeccionReporte() {
    this.facadeService.obtenerProyeccionEstudiantes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data || !data.estudiantes || data.estudiantes.length === 0) {
          this.loadingDownload = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay registros disponibles para exportar en la proyección actual.'
          });
          return;
        }
        this.excelService.generarExcelProyeccionReporte(data);
        this.loadingDownload = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyección de Reporte descargada correctamente.' });
        this.cerrar();
      },
      error: (err) => {
        this.loadingDownload = false;
        console.error('Error al obtener proyección:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar la Proyección de Reporte.' });
      }
    });
  }

  private descargarReportePorGrupos(periodo: { año: number; periodo: number }) {
    this.facadeService.obtenerReporteGrupos(periodo.periodo, periodo.año).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data || !data.objConfiguracionReporteGrupos) {
          this.loadingDownload = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay registros disponibles para exportar en el período seleccionado.'
          });
          return;
        }
        this.excelService.generarExcelReportePorGrupos(data);
        this.loadingDownload = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reporte por Grupos descargado correctamente.' });
        this.cerrar();
      },
      error: (err) => {
        this.loadingDownload = false;
        console.error('Error al obtener reporte por grupos:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el Reporte por Grupos.' });
      }
    });
  }
}
