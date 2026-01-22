import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-descargar-reporte-dialog',
  templateUrl: './descargar-reporte-dialog.component.html',
  styleUrls: ['./descargar-reporte-dialog.component.scss']
})
export class DescargarReporteDialogComponent implements OnInit, OnChanges {
  @Input() display: boolean = false;
  @Input() activeReportCode: string = '';
  @Input() activePeriod: PeriodoAcademicoDTORespuesta | null = null;
  @Output() displayChange = new EventEmitter<boolean>();

  // Opciones siguiendo el estándar Name/Value del ejemplo de PrimeNG
  reportOptions = [
    { name: 'Reporte Final', value: 'reporte-final' },
    { name: 'Proyección Reporte', value: 'proyeccion-reporte' },
    { name: 'Reporte por Grupos', value: 'reporte-por-grupos' }
  ];

  periodOptions: any[] = [];
  allPeriodOptions: any[] = []; // Guardamos todos para filtrar según el reporte
  selectedReport: string = '';
  selectedPeriod: any = null;
  loadingPeriods: boolean = false;

  constructor(private facadeService: GestionInformacionPresupuestariaFacadeService) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['display']?.currentValue === true) {
      this.sincronizarSeleccion();
    }
  }

  cargarPeriodos() {
    this.loadingPeriods = true;
    this.facadeService.obtenerPeriodosAcademicos().subscribe({
      next: (periodos) => {
        this.allPeriodOptions = periodos.map(p => ({
          name: `${p.año}-${p.periodo}`,
          value: p
        }));
        this.actualizarPeriodosDisponibles();
        this.sincronizarSeleccion();
        this.loadingPeriods = false;
      },
      error: () => {
        this.loadingPeriods = false;
      }
    });
  }

  actualizarPeriodosDisponibles() {
    if (this.selectedReport === 'reporte-final' && this.allPeriodOptions.length > 0) {
      // Excluir el último periodo para Reporte Final
      this.periodOptions = this.allPeriodOptions.slice(0, -1);
      
      // Si el periodo seleccionado era el último, deseleccionarlo
      if (this.selectedPeriod && this.allPeriodOptions.length > 0) {
        const lastPeriodValue = this.allPeriodOptions[this.allPeriodOptions.length - 1].value;
        if (this.selectedPeriod.año === lastPeriodValue.año && this.selectedPeriod.periodo === lastPeriodValue.periodo) {
          this.selectedPeriod = null;
        }
      }
    } else {
      this.periodOptions = [...this.allPeriodOptions];
    }
  }

  onReportChange() {
    this.actualizarPeriodosDisponibles();
  }

  sincronizarSeleccion() {
    // Sincronizar Reporte
    if (this.activeReportCode) {
      this.selectedReport = this.activeReportCode;
    }

    this.actualizarPeriodosDisponibles();

    // Sincronizar Periodo
    if (this.activePeriod && this.periodOptions.length > 0) {
      const found = this.periodOptions.find(opt => 
        opt.value.año === this.activePeriod?.año && 
        opt.value.periodo === this.activePeriod?.periodo
      );
      if (found) {
        this.selectedPeriod = found.value;
      }
    }
  }

  cerrar() {
    this.displayChange.emit(false);
  }

  descargar() {
    console.log('Descargando reporte seleccionado:', this.selectedReport);
    console.log('Para el periodo:', this.selectedPeriod);
    this.cerrar();
  }
}
