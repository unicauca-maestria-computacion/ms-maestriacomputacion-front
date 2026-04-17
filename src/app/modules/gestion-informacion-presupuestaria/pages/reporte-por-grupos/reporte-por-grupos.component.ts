import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ConfiguracionReporteGrupos, ReportePorGrupos, ReportePorGrupoFila, GastoGeneral } from '../../models/domain-models';
import { PeriodoAcademicoDto } from '../../dto/periodo-financiero.dto';
import { ConfirmationService, MessageService } from 'primeng/api';

interface GroupColumn { nombre: string; grupoId: number; }

interface TableRow {
  concept: string;
  key: string;
  isPercentage: boolean;
  isEditable: boolean;
  total: number;
  values: { [groupName: string]: number };
}

@Component({
  selector: 'app-reporte-por-grupos',
  templateUrl: './reporte-por-grupos.component.html',
  styleUrls: ['./reporte-por-grupos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportePorGruposComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  configuracion: ReportePorGrupos | null = null;
  tableRows: TableRow[] = [];
  budgetTableRows: TableRow[] = [];
  distributionSummary: { label: string, value: number, isBold?: boolean }[] = [];
  groupColumns: GroupColumn[] = [];
  loading: boolean = false;
  periodoSeleccionado: PeriodoAcademicoDto | null = null;
  esUltimoPeriodo: boolean = false;
  sinPeriodos: boolean = false;
  errorPeriodos: boolean = false;

  /** Es editable si al menos uno de los períodos del año está ACTIVO o dentro de fechas. */
  get esEditable(): boolean {
    return this.configuracion?.esEditable ?? false;
  }

  /** ID del período académico actualmente cargado, necesario para todas las operaciones de edición. */
  private get periodoAcademicoId(): number {
    return this.periodoSeleccionado?.id ?? 0;
  }

  editingRowKey: string | null = null;
  editingBudgetRowKey: string | null = null;
  clonedRow: { [s: string]: number } = {};
  clonedBudgetRow: { [s: string]: { [groupName: string]: number } } = {};

  basicData: object = {};
  basicOptions: object = {};

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // Initial load handled by selector component
  }

  onPeriodoChange(periodo: PeriodoAcademicoDto): void {
    this.periodoSeleccionado = periodo;
    this.cargarDatos(periodo);
  }

  cargarDatos(periodoObj: PeriodoAcademicoDto): void {
    this.loading = true;
    const anio = periodoObj.anio ?? periodoObj.año;

    this.facadeService.obtenerReporteGrupos(anio!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.configuracion = data;
        this.normalizarPorcentajesParaDisplay(this.configuracion);
        this.procesarDatosTabla(this.configuracion);
        this.procesarDistribucion(this.configuracion);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching report', err);
        const anioTexto = periodoObj ? `del año ${anio}` : '';
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar',
          detail: `No se pudo cargar el reporte por grupos ${anioTexto}. Intente nuevamente.`
        });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  /** Convierte valor en escala 0-100 (UI) a ratio 0-1 para el backend, con redondeo. */
  private toRatio(value: number | null | undefined): number {
    if (value == null) return 0;
    return Math.round((value / 100) * 10000) / 10000;
  }

  /** AUI Universidad: muestra auiporcentaje del API (ratio 0-1 o ya 0-100). Para vista se normaliza a 0-100. */
  get aUIPorcentajeDisplay(): number | null {
    const c = this.configuracion?.objConfiguracionReporteGrupos as unknown as Record<string, unknown> | undefined;
    if (!c) return null;
    const v = c['aUIPorcentaje'] ?? c['auiporcentaje'];
    if (typeof v !== 'number') return null;
    return v > 1 ? v : v * 100;
  }

  /** Si el backend envía porcentajes en ratio 0-1, los convierte a 0-100 para mostrar en la UI. */
  private normalizarPorcentajesParaDisplay(data: ReportePorGrupos): void {
    const config = data.objConfiguracionReporteGrupos;
    if (config.aUIPorcentaje != null && config.aUIPorcentaje <= 1) config.aUIPorcentaje = config.aUIPorcentaje * 100;
    if (config.item1 != null && config.item1 <= 1) config.item1 = config.item1 * 100;
    if (config.item2 != null && config.item2 <= 1) config.item2 = config.item2 * 100;
    if (config.imprevistos != null && config.imprevistos <= 1) config.imprevistos = config.imprevistos * 100;

    // Normalizar porcentajes de participación por grupo (ratio 0-1 → escala 0-100)
    if (data.filasPorGrupo) {
      for (const fila of data.filasPorGrupo) {
        if (fila.porcentajePrimerSemestre != null && fila.porcentajePrimerSemestre <= 1) {
          fila.porcentajePrimerSemestre = Math.round(fila.porcentajePrimerSemestre * 10000) / 100;
        }
        if (fila.porcentajeSegundoSemestre != null && fila.porcentajeSegundoSemestre <= 1) {
          fila.porcentajeSegundoSemestre = Math.round(fila.porcentajeSegundoSemestre * 10000) / 100;
        }
        if (fila.participacionPorAño != null && fila.participacionPorAño <= 1) {
          fila.participacionPorAño = Math.round(fila.participacionPorAño * 10000) / 100;
        }
      }
    }
  }

  procesarDatosTabla(data: ReportePorGrupos): void {
    const grupos = data.filasPorGrupo ?? [];
    this.groupColumns = grupos.length > 0
      ? grupos.map(g => ({ nombre: g.nombreGrupo, grupoId: g.grupoId }))
      : [{ nombre: 'Total', grupoId: 0 }];

    const concepts: { label: string, key: keyof ReportePorGrupoFila, isPercentage: boolean, isEditable: boolean }[] = [
      { label: 'Total Neto', key: 'totalNeto', isPercentage: false, isEditable: false },
      { label: 'Aporte grupo primer semestre', key: 'aportePrimerSemestre', isPercentage: false, isEditable: false },
      { label: 'Aporte grupo segundo semestre', key: 'aporteSegundoSemestre', isPercentage: false, isEditable: false },
      { label: 'Participación 1er Semestre', key: 'porcentajePrimerSemestre', isPercentage: true, isEditable: true },
      { label: 'Participación 2do semestre', key: 'porcentajeSegundoSemestre', isPercentage: true, isEditable: true },
      { label: 'Participación por año', key: 'participacionPorAño', isPercentage: true, isEditable: false }
    ];

    this.tableRows = concepts.map(concept => {
      const values: { [groupName: string]: number } = {};
      if (grupos.length > 0) {
        grupos.forEach(g => { values[g.nombreGrupo] = (g[concept.key] as number) ?? 0; });
      } else {
        values['Total'] = (data[concept.key as keyof ReportePorGrupos] as number) ?? 0;
      }
      const total = Object.values(values).reduce((a, b) => a + b, 0);
      return {
        concept: concept.label,
        key: concept.key as keyof ReportePorGrupos,
        isPercentage: concept.isPercentage,
        isEditable: concept.isEditable,
        total,
        values
      };
    });

    this.procesarDatosTablaBudget(data);
    this.recalcularParticipacionPorAño();
  }

  procesarDistribucion(data: ReportePorGrupos): void {
    const config = data.objConfiguracionReporteGrupos;
    const configAny = config as unknown as Record<string, unknown>;
    const auiValor = (configAny['aUIValor'] ?? configAny['auivalor']) as number | undefined;
    this.distributionSummary = [
      { label: 'AUI Universidad', value: auiValor ?? 0 },
      { label: 'Ingresos Netos', value: config.ingresosNetos },
      { label: 'Excedentes Maestria', value: config.excedentesMaestria },
      { label: 'Gastos Generales', value: config.gastosGenerales.reduce((sum, g) => sum + g.monto, 0) },
      { label: 'Valor a Distribuir (Ingresos-Gastos)', value: config.valorADistribuir, isBold: true }
    ];
  }

  procesarDatosTablaBudget(data: ReportePorGrupos): void {
    const grupos = data.filasPorGrupo ?? [];
    const budgetConcepts: { label: string, key: keyof ReportePorGrupoFila, isEditable: boolean }[] = [
      { label: 'Presupuesto por grupo', key: 'presupuestoPorGrupo', isEditable: false },
      { label: 'Imprevistos', key: 'imprevistos', isEditable: false },
      { label: 'Presupuesto por grupo imprevistos', key: 'presupuestoPorGrupoImprevistos', isEditable: false },
      { label: 'Vigencias Anteriores', key: 'vigenciasAnteriores', isEditable: true }
    ];

    this.budgetTableRows = budgetConcepts.map(concept => {
      const values: { [groupName: string]: number } = {};
      if (grupos.length > 0) {
        grupos.forEach(g => { values[g.nombreGrupo] = (g[concept.key] as number) ?? 0; });
      } else {
        values['Total'] = (data[concept.key as keyof ReportePorGrupos] as number) ?? 0;
      }
      const total = Object.values(values).reduce((a, b) => a + b, 0);
      return {
        concept: concept.label,
        key: concept.key as keyof ReportePorGrupos,
        isPercentage: false,
        isEditable: concept.isEditable,
        total,
        values
      };
    });
  }

  inicializarGrafica(data: ReportePorGrupos): void {
    const grupos = data.filasPorGrupo ?? [];
    const colors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    if (grupos.length > 0) {
      this.basicData = {
        labels: grupos.map(g => g.nombreGrupo),
        datasets: [
          {
            label: 'Participación por Año (%)',
            backgroundColor: grupos.map((_, i) => colors[i % colors.length]),
            data: grupos.map(g => g.participacionPorAño ?? 0)
          }
        ]
      };
    } else {
      const config = data.objConfiguracionReporteGrupos;
      const label = `Periodo ${config.objPeriodoFinanciero.periodo}-${config.objPeriodoFinanciero.año}`;
      this.basicData = {
        labels: [label],
        datasets: [{ label: 'Total Neto', backgroundColor: ['#36A2EB'], data: [data.totalNeto] }]
      };
    }

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false, labels: { color: '#495057' } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.parsed.y.toFixed(2)} %`
          }
        }
      },
      scales: {
        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef', display: false } },
        y: {
          ticks: {
            color: '#495057',
            callback: (value: any) => `${value} %`
          },
          grid: { color: '#ebedef' }
        }
      }
    };
  }

  /** Limita porcentajes de config: max 2 decimales, AUI/Imprevistos max 100, Items juntos max 100. */
  onConfigPercentInput(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value;

    // Limitar a 2 decimales
    const dot = raw.indexOf('.');
    if (dot !== -1 && raw.length - dot - 1 > 2) {
      raw = raw.substring(0, dot + 3);
      input.value = raw;
    }

    let maxAllowed = 100;
    if (field === 'item1') {
      maxAllowed = Math.round((100 - (this.clonedItems.item2 ?? 0)) * 100) / 100;
    } else if (field === 'item2') {
      maxAllowed = Math.round((100 - (this.clonedItems.item1 ?? 0)) * 100) / 100;
    }

    const parsed = parseFloat(raw);
    let v = 0;
    if (!isNaN(parsed) && parsed > 0) {
      v = Math.round(parsed * 100) / 100;
      if (v > maxAllowed) {
        v = Math.round(maxAllowed * 100) / 100;
        input.value = String(v);
      }
    }

    switch (field) {
      case 'aui': this.clonedCabecera.aUIPorcentaje = v; break;
      case 'item1': this.clonedItems.item1 = v; break;
      case 'item2': this.clonedItems.item2 = v; break;
      case 'imprevistos': this.clonedImprevistos = v; break;
    }
  }

  descargar(): void {
    // La descarga se abre desde opciones-presupuesto (app-descargar-reporte-dialog) con activeTab 'reporte-por-grupos'.
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number') return '–';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }

  /** Muestra porcentaje con 2 decimales (valores ya están en escala 0-100). */
  formatPercent(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number') return '–';
    return `${value.toFixed(2)} %`;
  }

  /** Calcula el porcentaje máximo permitido para un grupo en una fila (100 - suma de los demás). */
  getMaxPercent(row: TableRow, groupName: string): number {
    const otherSum = this.groupColumns
      .filter(g => g.nombre !== groupName)
      .reduce((acc, g) => acc + (row.values[g.nombre] ?? 0), 0);
    return Math.round(Math.max(0, 100 - otherSum) * 100) / 100;
  }

  /** Bloquea letras y caracteres no numéricos en inputs de porcentaje. */
  onPercentKeyDown(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', '.'];
    if (allowed.includes(event.key) ||
        (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) ||
        (event.key >= '0' && event.key <= '9')) {
      return;
    }
    event.preventDefault();
  }

  /** Llamado en cada cambio de input: limita decimales a 2 y el valor al máximo disponible. */
  onPercentInput(event: Event, row: TableRow, groupName: string): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value;

    // Limitar a 2 decimales cortando el string
    const dot = raw.indexOf('.');
    if (dot !== -1 && raw.length - dot - 1 > 2) {
      raw = raw.substring(0, dot + 3);
      input.value = raw;
    }

    const parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed < 0) {
      row.values[groupName] = 0;
    } else {
      let v = Math.round(parsed * 100) / 100;
      const maxAllowed = this.getMaxPercent(row, groupName);
      if (v > maxAllowed) {
        v = Math.round(maxAllowed * 100) / 100;
        input.value = String(v);
      }
      row.values[groupName] = v;
    }

    row.total = this.groupColumns.reduce((acc, g) => acc + (row.values[g.nombre] ?? 0), 0);
    this.recalcularParticipacionPorAño();
  }

  /** Recalcula la fila "Participación por año" como promedio de 1er y 2do semestre por grupo. */
  private recalcularParticipacionPorAño(): void {
    const primerRow = this.tableRows.find(r => r.key === 'porcentajePrimerSemestre');
    const segundoRow = this.tableRows.find(r => r.key === 'porcentajeSegundoSemestre');
    const porAñoRow = this.tableRows.find(r => r.key === 'participacionPorAño');
    if (!primerRow || !segundoRow || !porAñoRow) return;
    for (const group of this.groupColumns) {
      const p1 = primerRow.values[group.nombre] ?? 0;
      const p2 = segundoRow.values[group.nombre] ?? 0;
      porAñoRow.values[group.nombre] = Math.round((p1 + p2) / 2 * 10) / 10;
    }
    porAñoRow.total = Object.values(porAñoRow.values).reduce((a, b) => a + b, 0);
    this.actualizarGrafica(porAñoRow);
  }

  /** Actualiza la gráfica con los valores actuales de participación por año. */
  private actualizarGrafica(porAñoRow: TableRow): void {
    const colors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    this.basicData = {
      labels: this.groupColumns.map(g => g.nombre),
      datasets: [
        {
          label: 'Participación por Año (%)',
          backgroundColor: this.groupColumns.map((_, i) => colors[i % colors.length]),
          data: this.groupColumns.map(g => porAñoRow.values[g.nombre] ?? 0)
        }
      ]
    };
    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false, labels: { color: '#495057' } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.parsed.y.toFixed(2)} %`
          }
        }
      },
      scales: {
        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef', display: false } },
        y: {
          ticks: {
            color: '#495057',
            callback: (value: any) => `${value} %`
          },
          grid: { color: '#ebedef' }
        }
      }
    };
  }

  onRowEditInit(row: TableRow) {
    if (this.isAnyEditActive) return;
    this.clonedRow = { ...row.values };
    this.editingRowKey = row.key;
  }

  onRowEditSave(row: TableRow) {
    row.total = Object.values(row.values).reduce((a, b) => a + b, 0);

    this.editingRowKey = null;
    this.clonedRow = {};

    if (row.key !== 'porcentajePrimerSemestre' && row.key !== 'porcentajeSegundoSemestre') return;

    const semestre = row.key === 'porcentajePrimerSemestre' ? 'PRIMER' : 'SEGUNDO';

    // Capturar los valores ANTES de cualquier llamada async para evitar mutaciones
    const valoresPorGrupo = this.groupColumns.map(grupo => ({
      grupoId: grupo.grupoId,
      porcentaje: this.toRatio(row.values[grupo.nombre] ?? 0),
      semestre
    }));

    // Ejecutar llamadas secuencialmente para evitar condiciones de carrera
    const ejecutarSecuencial = (index: number) => {
      if (index >= valoresPorGrupo.length) return;
      const { grupoId, porcentaje } = valoresPorGrupo[index];
      this.facadeService.actualizarParticipacionGrupo({ periodoAcademicoId: this.periodoAcademicoId, grupoId, porcentajeParticipacion: porcentaje, semestre: valoresPorGrupo[index].semestre })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            if (index === valoresPorGrupo.length - 1) {
              // Solo actualizar la UI con la última respuesta
              this.configuracion = data;
              this.normalizarPorcentajesParaDisplay(this.configuracion);
              this.procesarDatosTabla(this.configuracion);
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Participación actualizada.' });
              this.cdr.markForCheck();
            } else {
              ejecutarSecuencial(index + 1);
            }
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la participación.' });
          }
        });
    };

    ejecutarSecuencial(0);
  }

  onRowEditCancel(row: TableRow, index: number) {
    row.values = { ...this.clonedRow };
    this.editingRowKey = null;
    this.clonedRow = {};
  }

  // --- Configuración y Edición de Distribución (Cabecera 2) ---
  editandoCabecera: boolean = false;
  clonedCabecera: Partial<ConfiguracionReporteGrupos> = {};
  guardandoCabecera: boolean = false;

  // --- Configuración Ingresos (Cabecera 1) ---
  editandoIngresos: boolean = false;
  clonedIngresos: number = 0;
  guardandoIngresos: boolean = false;

  // --- Modal Gastos ---
  displayGastosModal: boolean = false;
  guardandoGastos: boolean = false;

  // --- Control de Edición Global ---
  get isAnyEditActive(): boolean {
    return this.editandoIngresos ||
           this.editandoCabecera ||
           this.editandoItems ||
           this.editandoImprevistos ||
           this.editingRowKey !== null ||
           this.editingBudgetRowKey !== null;
  }

  // --- Configuración Items (Cabecera 3) ---
  editandoItems: boolean = false;
  clonedItems: { item1?: number; item2?: number } = {};
  guardandoItems: boolean = false;

  get totalGastosGenerales(): number {
    if (!this.configuracion || !this.configuracion.objConfiguracionReporteGrupos.gastosGenerales) return 0;
    return this.configuracion.objConfiguracionReporteGrupos.gastosGenerales.reduce((sum, g) => sum + g.monto, 0);
  }

  // Métodos Distribución
  onHeaderEditInit() {
    if (this.isAnyEditActive) return;
    this.editandoCabecera = true;
    this.clonedCabecera = { ...this.configuracion?.objConfiguracionReporteGrupos };
  }

  onHeaderEditSave() {
    this.guardandoCabecera = true;
    this.editandoCabecera = false;
    const aui = this.clonedCabecera.aUIPorcentaje;
    const excedentes = this.clonedCabecera.excedentesMaestria;

    const finish = (data: ReportePorGrupos) => {
      this.configuracion = data;
      this.normalizarPorcentajesParaDisplay(this.configuracion);
      this.procesarDatosTabla(this.configuracion);
      this.procesarDistribucion(this.configuracion);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Distribución actualizada correctamente.' });
      this.guardandoCabecera = false;
      this.clonedCabecera = {};
    };
    const onError = (msg: string) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      this.guardandoCabecera = false;
      this.clonedCabecera = {};
    };

    if (aui !== undefined) {
      this.configuracion!.objConfiguracionReporteGrupos.aUIPorcentaje = aui;
      this.facadeService.actualizarPorcentajeAUIUniversidad(this.periodoAcademicoId, this.toRatio(aui)).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          if (excedentes !== undefined) {
            this.configuracion!.objConfiguracionReporteGrupos.excedentesMaestria = excedentes;
            this.facadeService.actualizarValorExcedentesMaestria(this.periodoAcademicoId, excedentes).pipe(takeUntil(this.destroy$)).subscribe({
              next: (d) => finish(d),
              error: () => onError('No se pudo actualizar excedentes.')
            });
          } else {
            finish(data);
          }
        },
        error: () => onError('No se pudo actualizar AUI.')
      });
    } else if (excedentes !== undefined) {
      this.configuracion!.objConfiguracionReporteGrupos.excedentesMaestria = excedentes;
      this.facadeService.actualizarValorExcedentesMaestria(this.periodoAcademicoId, excedentes).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => finish(data),
        error: () => onError('No se pudo actualizar excedentes.')
      });
    } else {
      this.guardandoCabecera = false;
      this.clonedCabecera = {};
    }
  }

  onHeaderEditCancel() {
    this.editandoCabecera = false;
    this.clonedCabecera = {};
  }

  // Métodos Ingresos
  onIngresosEditInit() {
    if (this.isAnyEditActive) return;
    this.editandoIngresos = true;
    this.clonedIngresos = this.configuracion!.objConfiguracionReporteGrupos.ingresosNetos;
  }

  onIngresosEditSave() {
    this.guardandoIngresos = true;
    this.editandoIngresos = false;
    this.configuracion!.objConfiguracionReporteGrupos.ingresosNetos = this.clonedIngresos;
    this.guardandoIngresos = false;
  }

  onIngresosEditCancel() {
    this.editandoIngresos = false;
    this.clonedIngresos = 0;
  }

  // Métodos Items
  onItemsEditInit() {
    if (this.isAnyEditActive) return;
    this.editandoItems = true;
    this.clonedItems = {
      item1: this.configuracion!.objConfiguracionReporteGrupos.item1,
      item2: this.configuracion!.objConfiguracionReporteGrupos.item2
    };
  }

  onItemsEditSave() {
    this.guardandoItems = true;
    this.editandoItems = false;
    const item1 = this.clonedItems.item1 ?? 0;
    const item2 = this.clonedItems.item2 ?? 0;
    this.facadeService.actualizarPorcentajeItems({
      item1: this.toRatio(item1),
      item2: this.toRatio(item2)
    }, this.periodoAcademicoId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.configuracion = data;
        this.normalizarPorcentajesParaDisplay(this.configuracion);
        this.procesarDatosTabla(this.configuracion);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Items actualizados correctamente.' });
        this.guardandoItems = false;
        this.clonedItems = {};
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar los items.' });
        this.editandoItems = true;
        this.guardandoItems = false;
      }
    });
  }

  onItemsEditCancel() {
    this.editandoItems = false;
    this.clonedItems = {};
  }

  abrirModalGastos() {
    this.displayGastosModal = true;
  }

  onGastosChange() {
    if (this.periodoSeleccionado) {
      this.cargarDatos(this.periodoSeleccionado);
    }
  }

  getItemBudgetValue(groupIndex: number, itemIndex: number): number {
    if (!this.configuracion) return 0;
    const grupos = this.configuracion.filasPorGrupo ?? [];
    if (grupos.length > groupIndex) {
      return itemIndex === 0 ? grupos[groupIndex].presupuestoPorGrupoItem1 : grupos[groupIndex].presupuestoPorGrupoItem2;
    }
    return itemIndex === 0 ? this.configuracion.presupuestoPorGrupoItem1 : this.configuracion.presupuestoPorGrupoItem2;
  }

  getItemBudgetTotal(itemIndex: number): number {
    if (!this.configuracion) return 0;
    return itemIndex === 0
      ? this.configuracion.presupuestoPorGrupoItem1
      : this.configuracion.presupuestoPorGrupoItem2;
  }

  // --- Configuración Imprevistos (Cabecera 4) ---
  editandoImprevistos: boolean = false;
  clonedImprevistos: number = 0;
  guardandoImprevistos: boolean = false;

  onImprevistosEditInit() {
    if (this.isAnyEditActive) return;
    this.editandoImprevistos = true;
    this.clonedImprevistos = this.configuracion!.objConfiguracionReporteGrupos.imprevistos;
  }

  onImprevistosEditSave() {
    this.guardandoImprevistos = true;
    this.editandoImprevistos = false;
    const valor = this.clonedImprevistos;
    this.facadeService.actualizarPorcentajeImprevistos(this.periodoAcademicoId, this.toRatio(valor)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.configuracion = data;
        this.normalizarPorcentajesParaDisplay(this.configuracion);
        this.procesarDatosTabla(this.configuracion);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Imprevistos actualizados correctamente.' });
        this.guardandoImprevistos = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar los imprevistos.' });
        this.editandoImprevistos = true;
        this.guardandoImprevistos = false;
      }
    });
  }

  onImprevistosEditCancel() {
    this.editandoImprevistos = false;
    this.clonedImprevistos = 0;
  }

  // Budget Table Row Editing
  onBudgetRowEditInit(row: TableRow) {
    if (this.isAnyEditActive) return;
    this.editingBudgetRowKey = row.key;
    this.clonedBudgetRow[row.key] = { ...row.values };
  }

  onBudgetRowEditSave(row: TableRow) {
    if (!this.configuracion) return;

    if (row.key !== 'vigenciasAnteriores') {
      // Solo vigencias anteriores es editable en la tabla de presupuesto
      delete this.clonedBudgetRow[row.key];
      this.editingBudgetRowKey = null;
      return;
    }

    // Capturar valores antes de llamadas async
    const valoresPorGrupo = this.groupColumns.map(grupo => ({
      grupoId: grupo.grupoId,
      valor: row.values[grupo.nombre] ?? 0
    }));

    const ejecutarSecuencial = (index: number) => {
      if (index >= valoresPorGrupo.length) return;
      const { grupoId, valor } = valoresPorGrupo[index];
      this.facadeService.actualizarVigenciasAnterioresGrupo(this.periodoAcademicoId, grupoId, valor)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            if (index === valoresPorGrupo.length - 1) {
              this.configuracion = data;
              this.normalizarPorcentajesParaDisplay(this.configuracion);
              this.procesarDatosTabla(data);
              delete this.clonedBudgetRow[row.key];
              this.editingBudgetRowKey = null;
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vigencias anteriores actualizadas.' });
              this.cdr.markForCheck();
            } else {
              ejecutarSecuencial(index + 1);
            }
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar las vigencias anteriores.' });
          }
        });
    };

    ejecutarSecuencial(0);
  }

  onBudgetRowEditCancel(row: TableRow, index: number) {
    row.values = this.clonedBudgetRow[row.key];
    delete this.clonedBudgetRow[row.key];
    this.editingBudgetRowKey = null;
  }

  trackByGroupNombre(_index: number, group: GroupColumn): string {
    return group.nombre;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Fin Lógica Cabecera ---
}




