import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ConfiguracionReporteFinanciero, ProyeccionEstudiante, ReporteProyeccionEstudiantes } from '../../models/domain-models';
import { PeriodoFinancieroDTORespuesta } from '../../dto/periodo-financiero.dto';
import { ProyeccionEstudianteDTOPeticion } from '../../dto/proyeccion-estudiante.dto';
import { ConfiguracionReporteFinancieroDTOPeticion } from '../../dto/configuracion-reporte-financiero.dto';
import { TotalesReporteService } from '../../services/totales-reporte.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

interface EstudianteProyeccion extends ProyeccionEstudiante {
  nombreEstudiante: string;
  matricula: number;
  valorBeca: number;
  valorEgresado: number;
  valorVotacion: number;
  recursosComputacionales: number;
  biblioteca: number;
  grupoInvestigacion: string;
  grupoDescuentos: number;
  totalNeto: number;
}

@Component({
  selector: 'app-proyeccion-reporte',
  templateUrl: './proyeccion-reporte.component.html',
  styleUrls: ['./proyeccion-reporte.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class ProyeccionReporteComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  cargando: boolean = false;
  guardando: boolean = false;
  periodoSeleccionado: PeriodoFinancieroDTORespuesta | null = null;
  periodoActualTexto: string = '';
  sinPeriodos: boolean = false;
  errorPeriodos: boolean = false;

  configuracion: ConfiguracionReporteFinanciero | null = null;
  estudiantes: EstudianteProyeccion[] = [];
  clonedEstudiantes: { [s: string]: EstudianteProyeccion; } = {};

  totalNetoCalculado: number = 0;
  totalDescuentosCalculado: number = 0;
  totalIngresosCalculado: number = 0;

  editandoCabecera: boolean = false;
  clonedCabecera: Partial<ConfiguracionReporteFinanciero> = {};
  editingRowKey: string | null = null;

  constructor(
    private messageService: MessageService,
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private cdr: ChangeDetectorRef,
    private totalesService: TotalesReporteService,
    private loadingService: LoadingService
  ) { }

  // --- Control de Edición Global ---
  get isAnyEditActive(): boolean {
    return this.editandoCabecera || this.editingRowKey !== null;
  }

  ngOnInit(): void {
    // La carga de períodos la maneja el selector app-periodo-financiero-selector con [modo]="'activos'"
    // que emite el período seleccionado via (periodoSeleccionado)="onPeriodoChange($event)"
  }

  onPeriodoChange(periodo: PeriodoFinancieroDTORespuesta): void {
    this.periodoSeleccionado = periodo;
    // Logic to reload data with new period if API supports it.
    // Currently `actualizarConfiguracionProyeccion` doesn't seem to take period param directly in this component's usage?
    // Wait, checking `obtenerProyeccionEstudiantes`.
    // The Facade `obtenerProyeccionEstudiantes` takes NO arguments.
    // This implies the backend session or context determines the period, OR this component hasn't been updated to support period selection yet.
    // BUT the user asked to make the selector work on all 3 pages.
    // If the API `obtenerProyeccionEstudiantes` does not accept a period, I cannot enforce it.
    // However, `ReporteFinal` and `ReportePorGrupos` DO take a period.
    // Let's check `fake-api.service.ts` again. `obtenerProyeccionEstudiantes()` -> no args.
    // If I cannot select period for projection, the selector might be purely visual or I need to update the service too?
    // The user said: "que al ingresar a esa pagina se haga solicitud de los periodos academicos ... y luego se haga la solicitud al servicio para obtener el reporte de grupos de ese periodo academico" -> referring to ReportePorGrupos.
    // AND "ademas tanto en report final como en proyeccion y reporte por grupos debe decir periodo academico unicamente esa parte".
    // AND "puedes hacer que periodo academico sea un componente ... y funcione igual y se muestre igual en las 3 paginas".
    // Use logic similar to ReporteFinal.
    // I will assume I should reload the projection. BUT if the service doesn't support it...
    // `actualizarConfiguracionProyeccion` takes `ConfiguracionReporteFinancieroDTOPeticion` which HAS `objPeriodoFinanciero`.
    // `obtenerProyeccionEstudiantes` in fake-api just returns a mock.
    // Real API likely needs period. Red flag.
    // I will implement the callback. logic. TO be safe, I will just call `cargarProyeccion` but I can't pass the period if the service signature doesn't allow it.
    // Wait, `ConfiguracionReporteFinancieroDTOPeticion` is used for UPDATING.
    // Getting: `obtenerProyeccionEstudiantes` in Facade calls `apiService.obtenerProyeccionEstudiantes()`.
    // Let's look at `facade.service.ts` again.
    // `obtenerProyeccionEstudiantes(): Observable<ReporteProyeccionEstudiantes>` -> No args.
    // I cannot implement "Get Projection for Period X" without changing the service signature.
    // HOWEVER, the user asked to "make it work the same".
    // I will update the Facade to accept an optional period, or just ignore it if I can't change the facade signature easily without breaking other things.
    // Actually, I should probably check if I can overload it or if I should just reload.
    // For now, I will add the method, and just call `cargarProyeccion()`. If the backend doesn't support filtering by period for projection (which implies "Future"), maybe it's always the "Current/Future" period?
    // But the selector allows changing periods.
    // If I look at the mock: `getMockProyeccionReporte` returns `periodo: { periodo: 2, año: 2024 }`.
    // If the user selects 2023-1, and I call 'obtenerProyeccionEstudiantes', the mock returns 2024-2. The selector will be out of sync with the data.
    // This is a discrepancy.
    // For the scope of "Refactor to Component", I will wire it up.
    // I'll update `cargarProyeccion` to take the period, but if the facade doesn't support it, I might have to modify the facade or just warn.
    // Let's check `GestionInformacionPresupuestariaApiService`. If it's a real app, I'd check that.
    // Given I'm in a refactor task, I'll update logic to RECEIVE the period.
    this.cargarProyeccion(periodo);
  }

  cargarProyeccion(periodo?: PeriodoFinancieroDTORespuesta): void {
    this.loadingService.show(periodo ? `Cargando proyección ${periodo.año}-${periodo.periodo}` : 'Cargando proyección');
    const tagPeriodo = periodo?.tagPeriodo ?? periodo?.periodo ?? undefined;
    const anio = periodo?.anio ?? periodo?.año ?? undefined;

    this.facadeService.obtenerProyeccionEstudiantes(tagPeriodo, anio).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.procesarRespuesta(data);
        this.loadingService.hide();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading projection', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la proyección.' });
        this.loadingService.hide();
        this.cdr.markForCheck();
      }
    });
  }

  procesarRespuesta(data: ReporteProyeccionEstudiantes) {
    if (data.periodo) {
      this.periodoActualTexto = `${data.periodo.año}-${data.periodo.periodo}`;
    }
    if (data.objConfiguracion) {
      this.configuracion = data.objConfiguracion;
    }
    if (data.estudiantes && this.configuracion) {
      this.estudiantes = data.estudiantes.map(e => this.mapearEstudianteProyeccion(e));
    }
    const totales = this.totalesService.fromBackend({
      totalNeto: data.totalNeto,
      totalDescuentos: data.totalDescuentos,
      totalIngresos: data.totalIngresos
    });
    this.totalNetoCalculado      = totales.totalNeto;
    this.totalDescuentosCalculado = totales.totalDescuentos;
    this.totalIngresosCalculado  = totales.totalIngresos;
  }

  /**
   * Actualiza solo la(s) fila(s) devuelta(s) por el backend (p. ej. 1 estudiante al guardar edición).
   * No reemplaza toda la lista: busca por codigoEstudiante y actualiza solo esas filas.
   */
  actualizarSoloFilaModificada(data: ReporteProyeccionEstudiantes): void {
    if (data.objConfiguracion) {
      this.configuracion = data.objConfiguracion;
    }
    if (data.periodo) {
      this.periodoActualTexto = `${data.periodo.año}-${data.periodo.periodo}`;
    }
    if (!data.estudiantes || !this.configuracion || data.estudiantes.length === 0) return;
    for (const e of data.estudiantes) {
      const actualizado = this.mapearEstudianteProyeccion(e);
      const index = this.findIndexById(e.codigoEstudiante);
      if (index >= 0) {
        this.estudiantes[index] = actualizado;
      }
    }
    const totales = this.totalesService.fromBackend({
      totalNeto: data.totalNeto,
      totalDescuentos: data.totalDescuentos,
      totalIngresos: data.totalIngresos
    });
    this.totalNetoCalculado      = totales.totalNeto;
    this.totalDescuentosCalculado = totales.totalDescuentos;
    this.totalIngresosCalculado  = totales.totalIngresos;
  }

  private mapearEstudianteProyeccion(e: ProyeccionEstudiante): EstudianteProyeccion {
    const recursosComputacionales = this.configuracion!.recursosComputacionales || 0;
    const biblioteca = this.configuracion!.biblioteca || 0;

    return {
      ...e,
      porcentajeBeca: this.toPercent(e.porcentajeBeca),
      nombreEstudiante: [e.nombre, e.apellido].filter(Boolean).join(' ') || e.codigoEstudiante,
      matricula: e.valorMatricula || 0,
      valorBeca: e.valorDescuentoBeca || 0,
      valorEgresado: e.valorDescuentoEgresado || 0,
      valorVotacion: e.valorDescuentoVoto || 0,
      recursosComputacionales: recursosComputacionales,
      biblioteca: biblioteca,
      grupoDescuentos: e.totalDescuentos || 0,
      totalNeto: e.totalNetoConDerechos || 0
    } as EstudianteProyeccion;
  }

  // --- Lógica de Edición de Cabecera (Configuración) ---

  onHeaderEditInit() {
    if (!this.configuracion) return;

    // Disable row editing if active (force cancel or block? For ease, we just ensure no row is editing or clear it)
    if (this.editingRowKey) {
      const estudianteEnEdicion = this.estudiantes.find(e => e.codigoEstudiante === this.editingRowKey);
      const nombre = estudianteEnEdicion?.nombreEstudiante ?? 'un estudiante';
      this.messageService.add({
        severity: 'warn',
        summary: 'Edición en curso',
        detail: `Guarde o cancele los cambios de ${nombre} antes de editar la configuración.`
      });
      return;
    }

    this.editandoCabecera = true;
    this.clonedCabecera = { ...this.configuracion };
  }

  onHeaderEditSave() {
    if (!this.configuracion) return;

    this.loadingService.show('Actualizando configuración');
    this.editandoCabecera = false;

    const configUpdate: ConfiguracionReporteFinancieroDTOPeticion = {
      biblioteca: this.clonedCabecera.biblioteca!,
      recursosComputacionales: this.clonedCabecera.recursosComputacionales!,
      valorSMLV: this.clonedCabecera.valorSMLV!,
      esReporteFinal: this.configuracion.esReporteFinal
    };

    this.facadeService.actualizarConfiguracionProyeccion(configUpdate).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Configuración actualizada correctamente' });
        this.procesarRespuesta(data);
        this.loadingService.hide();
        this.clonedCabecera = {};
      },
      error: (err) => {
        console.error('Error update config', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar configuración.' });
        this.loadingService.hide();
        // Optionally revert local changes or reload
      }
    });
  }

  onHeaderEditCancel() {
    this.editandoCabecera = false;
    this.clonedCabecera = {};
  }


  // --- Lógica de Edición de Tabla (Estudiantes) ---

  onRowEditInit(estudiante: EstudianteProyeccion) {
    if (this.editandoCabecera) {
      // This theoretically shouldn't happen if buttons are disabled, but safety check
      return;
    }
    this.editingRowKey = estudiante.codigoEstudiante;
    this.clonedEstudiantes[estudiante.codigoEstudiante] = { ...estudiante };
  }

  onRowEditSave(estudiante: EstudianteProyeccion) {
    if (estudiante.porcentajeBeca < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Valor inválido',
        detail: `${estudiante.nombreEstudiante}: el porcentaje de beca no puede ser negativo.`
      });
      this.onRowEditCancel(estudiante, this.findIndexById(estudiante.codigoEstudiante));
      return;
    }
    if (estudiante.porcentajeBeca > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Valor inválido',
        detail: `${estudiante.nombreEstudiante}: el porcentaje de beca no puede superar 100%.`
      });
      return;
    }

    this.loadingService.show(`Guardando cambios de ${estudiante.nombreEstudiante}`);
    this.editingRowKey = null; // Exit edit mode

    const proyeccionUpdate: ProyeccionEstudianteDTOPeticion = {
      codigoEstudiante: estudiante.codigoEstudiante,
      estaPago: estudiante.estaPago,
      aplicaVotacion: estudiante.aplicaVotacion ?? false,
      porcentajeBeca: this.toRatio(estudiante.porcentajeBeca),
      aplicaEgresado: estudiante.aplicaEgresado ?? false
    };

  this.facadeService.actualizarProyeccionEstudiante(
      proyeccionUpdate,
      this.periodoSeleccionado?.tagPeriodo ?? this.periodoSeleccionado?.periodo ?? undefined,
      this.periodoSeleccionado?.anio ?? this.periodoSeleccionado?.año ?? undefined
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        // Al guardar, refrescamos TODO el reporte para que el backend recalcule todos los totales
        this.procesarRespuesta(data);
        delete this.clonedEstudiantes[estudiante.codigoEstudiante];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estudiante actualizado correctamente' });
        this.loadingService.hide();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error updating student', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar estudiante.' });
        this.onRowEditCancel(estudiante, this.findIndexById(estudiante.codigoEstudiante)); // Revert
        this.loadingService.hide();
        this.cdr.markForCheck();
      }
    });
  }

  onRowEditCancel(estudiante: EstudianteProyeccion, index: number) {
    this.estudiantes[index] = this.clonedEstudiantes[estudiante.codigoEstudiante];
    delete this.clonedEstudiantes[estudiante.codigoEstudiante];
    this.editingRowKey = null;
  }

  // --- Helpers ---

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.estudiantes.length; i++) {
      if (this.estudiantes[i].codigoEstudiante === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  /** Convierte valor UI (escala 0-100) a ratio 0-1 para enviar al backend (ej. 22 → 0.22). */
  private toRatio(value: number | null | undefined): number {
    if (value == null) return 0;
    return value / 100;
  }

  /** Convierte ratio 0-1 del backend a 0-100 para mostrar y editar en la UI (ej. 0.22 → 22). */
  private toPercent(value: number | null | undefined): number {
    if (value == null) return 0;
    // El backend ya debería mandar el porcentaje normalizado (0.22 para 22%) o (22.0 para 22%)
    // Si viene como ratio (<= 1), lo multiplicamos por 100 para la UI
    const percent = value <= 1 ? value * 100 : value;
    return Math.round(percent * 100) / 100;
  }

  /** Limita decimales a 2 al escribir. */
  onPercentInput(event: Event, estudiante: EstudianteProyeccion, campo: string): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value;

    const dot = raw.indexOf('.');
    if (dot !== -1 && raw.length - dot - 1 > 2) {
      raw = raw.substring(0, dot + 3);
      input.value = raw;
    }
    
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
       (estudiante as any)[campo] = Math.round(parsed * 100) / 100;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  /** Muestra el porcentaje (valores ya están en escala 0-100). */
  formatPercent(value: number): string {
    if (value == null) return '0.0 %';
    return `${Number(value).toFixed(1)} %`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  descargar(): void {
    console.log('Descargando proyección reporte...');
  }
}




