import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoAcademicoDTOPeticion, PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';
import { ConfiguracionReporteFinanciero, ProyeccionEstudiante } from '../../models/domain-models';

interface EstudianteReporte extends ProyeccionEstudiante {
  nombreEstudiante: string;
  matricula: number;
  valorBeca: number;
  valorEgresado: number;
  recursosComputacionales: number;
  biblioteca: number;
  grupoInvestigacion: string;
  grupoDescuentos: number;
  totalNeto: number;
}

@Component({
  selector: 'app-reporte-final',
  templateUrl: './reporte-final.component.html',
  styleUrls: ['./reporte-final.component.scss'],
  providers: [MessageService]
})
export class ReporteFinalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  cargando: boolean = false;
  periodoSeleccionado: PeriodoAcademicoDTORespuesta | null = null;

  // Configuración del reporte
  configuracion: ConfiguracionReporteFinanciero | null = null;
  editandoCabecera: boolean = false;
  clonedCabecera: Partial<ConfiguracionReporteFinanciero> = {};

  // Datos de la tabla
  estudiantes: EstudianteReporte[] = [];

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private messageService: MessageService
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
        // Asignar configuración del reporte desde el servicio
        if (data?.objConfiguracion) {
          this.configuracion = data.objConfiguracion;
        }

        if (data?.estudiantes && this.configuracion) {
          this.estudiantes = data.estudiantes.map(e => {
            // valorMatricula = nº de SMLVs; la matrícula en COP = valorMatricula × valorSMLV.
            // biblioteca y recursosComputacionales vienen en COP directamente.
            // porcentajeBeca/Votacion/Egresado son ratios decimales (0.20 = 20%).
            const matricula = (this.configuracion!.valorMatricula || 0) * (this.configuracion!.valorSMLV || 0);
            const recursosComp = this.configuracion!.recursosComputacionales || 0;
            const biblioteca = this.configuracion!.biblioteca || 0;
            const valorBeca = matricula * (e.porcentajeBeca || 0);
            const valorEgresado = matricula * (e.porcentajeEgresado || 0);
            const valorVotacion = matricula * (e.porcentajeVotacion || 0);
            const grupoDescuentos = valorBeca + valorEgresado + valorVotacion;
            const totalNeto = matricula + recursosComp + biblioteca - grupoDescuentos;

            return {
              ...e,
              nombreEstudiante: `${e.nombre || ''} ${e.apellido || ''}`.trim(),
              matricula: matricula,
              valorBeca: valorBeca,
              valorEgresado: valorEgresado,
              recursosComputacionales: recursosComp,
              biblioteca: biblioteca,
              grupoDescuentos: grupoDescuentos,
              totalNeto: totalNeto
            } as EstudianteReporte;
          });
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error fetching report', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el reporte financiero. Intente nuevamente.'
        });
        this.cargando = false;
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

  // --- Control de Edición Global ---
  get isAnyEditActive(): boolean {
    return this.editandoCabecera;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  descargar(): void {
    console.log('Descargando reporte final...');
    // Implementar lógica de descarga
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

  // Lógica de edición de cabecera
  onHeaderEditInit(): void {
    if (!this.configuracion) return;
    this.editandoCabecera = true;
    this.clonedCabecera = { ...this.configuracion };
  }

  onHeaderEditSave(): void {
    if (!this.clonedCabecera) return;
    
    // Aquí se llamaría al servicio para persistir si fuera necesario.
    // Por ahora, actualizamos el modelo local.
    this.configuracion = { ...this.configuracion, ...this.clonedCabecera } as ConfiguracionReporteFinanciero;
    this.recalcularReporte();
    this.editandoCabecera = false;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Valores de referencia actualizados localmente' });
  }

  onHeaderEditCancel(): void {
    this.editandoCabecera = false;
    this.clonedCabecera = {};
  }

  private recalcularReporte(): void {
    if (!this.configuracion || !this.estudiantes.length) return;
    
    this.estudiantes = this.estudiantes.map(e => {
      const matricula = (this.configuracion!.valorMatricula || 0) * (this.configuracion!.valorSMLV || 0);
      const recursosComp = this.configuracion!.recursosComputacionales || 0;
      const biblioteca = this.configuracion!.biblioteca || 0;
      const valorBeca = matricula * (e.porcentajeBeca || 0);
      const valorEgresado = matricula * (e.porcentajeEgresado || 0);
      const valorVotacion = matricula * (e.porcentajeVotacion || 0);
      const grupoDescuentos = valorBeca + valorEgresado + valorVotacion;
      const totalNeto = matricula + recursosComp + biblioteca - grupoDescuentos;

      return {
        ...e,
        matricula,
        valorBeca,
        valorEgresado,
        recursosComputacionales: recursosComp,
        biblioteca,
        grupoDescuentos,
        totalNeto
      };
    });
  }
}
