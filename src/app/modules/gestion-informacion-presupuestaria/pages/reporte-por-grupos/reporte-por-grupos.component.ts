import { Component, OnInit } from '@angular/core';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ConfiguracionReporteGrupos, ReportePorGrupos, GastoGeneral } from '../../models/domain-models';
import { PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';
import { ConfirmationService } from 'primeng/api';

interface GroupColumn { nombre: string; }

interface TableRow {
  concept: string;
  key: keyof ReportePorGrupos;
  isPercentage: boolean;
  isEditable: boolean;
  total: number;
  values: { [groupName: string]: number };
}

@Component({
  selector: 'app-reporte-por-grupos',
  templateUrl: './reporte-por-grupos.component.html',
  styleUrls: ['./reporte-por-grupos.component.scss']
})
export class ReportePorGruposComponent implements OnInit {

  configuracion: ReportePorGrupos | null = null;
  tableRows: TableRow[] = [];
  budgetTableRows: TableRow[] = [];
  distributionSummary: { label: string, value: number, isBold?: boolean }[] = [];
  groupColumns: GroupColumn[] = [];
  loading: boolean = false;
  periodoSeleccionado: PeriodoAcademicoDTORespuesta | null = null;
  editingRowKey: string | null = null;
  editingBudgetRowKey: string | null = null;
  clonedRow: { [s: string]: any } = {};
  clonedBudgetRow: { [s: string]: any } = {};

  basicData: any;
  basicOptions: any;

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    // Initial load handled by selector component
  }

  onPeriodoChange(periodo: PeriodoAcademicoDTORespuesta): void {
    this.periodoSeleccionado = periodo;
    this.cargarDatos(periodo);
  }

  cargarDatos(periodoObj: PeriodoAcademicoDTORespuesta): void {
    this.loading = true;

    this.facadeService.obtenerReporteGrupos(periodoObj.periodo, periodoObj.año).subscribe({
      next: (data) => {
        this.configuracion = data;
        this.procesarDatosTabla(data);
        this.procesarDistribucion(data);
        this.inicializarGrafica(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching report', err);
        this.loading = false;
      }
    });
  }

  procesarDatosTabla(data: ReportePorGrupos): void {
    // Use a single aggregate column since the API returns one report object
    this.groupColumns = [{ nombre: 'Total' }];

    const concepts: { label: string, key: keyof ReportePorGrupos, isPercentage: boolean, isEditable: boolean }[] = [
      { label: 'Total Neto', key: 'totalNeto', isPercentage: false, isEditable: false },
      { label: 'Aporte grupo primer semestre', key: 'aportePrimerSemestre', isPercentage: false, isEditable: false },
      { label: 'Aporte grupo segundo semestre', key: 'aporteSegundoSemestre', isPercentage: false, isEditable: false },
      { label: 'Participación 1er Semestre', key: 'participacionPrimerSemestre', isPercentage: true, isEditable: true },
      { label: 'Participación 2do semestre', key: 'participacionSegundoSemestre', isPercentage: true, isEditable: true },
      { label: 'Participación por año', key: 'participacionPorAño', isPercentage: true, isEditable: false }
    ];

    this.tableRows = concepts.map(concept => {
      const value = data[concept.key] as number;
      const row: TableRow = {
        concept: concept.label,
        key: concept.key,
        isPercentage: concept.isPercentage,
        isEditable: concept.isEditable,
        total: value,
        values: { 'Total': value }
      };
      return row;
    });

    this.procesarDatosTablaBudget(data);
  }

  procesarDistribucion(data: ReportePorGrupos): void {
    const config = data.objConfiguracionReporteGrupos;
    this.distributionSummary = [
      { label: 'AUI Universidad', value: config.aUIValor },
      { label: 'Ingresos Netos', value: config.ingresosNetos },
      { label: 'Excedentes Maestria', value: config.excedentesMaestria },
      { label: 'Gastos Generales', value: config.gastosGenerales.reduce((sum, g) => sum + g.monto, 0) },
      { label: 'Valor a Distribuir (Ingresos-Gastos)', value: config.valorADistribuir, isBold: true }
    ];
  }

  procesarDatosTablaBudget(data: ReportePorGrupos): void {
    const budgetConcepts: { label: string, key: keyof ReportePorGrupos, isEditable: boolean }[] = [
      { label: 'Presupuesto por grupo', key: 'presupuestoPorGrupo', isEditable: false },
      { label: 'Imprevistos', key: 'imprevistos', isEditable: false },
      { label: 'Presupuesto por grupo imprevistos', key: 'presupuestoPorGrupoImprevistos', isEditable: false },
      { label: 'Vigencias Anteriores', key: 'vigenciasAnteriores', isEditable: true }
    ];

    this.budgetTableRows = budgetConcepts.map(concept => {
      const value = data[concept.key] as number;
      return {
        concept: concept.label,
        key: concept.key,
        isPercentage: false,
        isEditable: concept.isEditable,
        total: value,
        values: { 'Total': value }
      };
    });
  }

  inicializarGrafica(data: ReportePorGrupos): void {
    const config = data.objConfiguracionReporteGrupos;
    const label = `Periodo ${config.objPeriodoAcademico.periodo}-${config.objPeriodoAcademico.año}`;

    this.basicData = {
      labels: [label],
      datasets: [
        {
          label: 'Total por Grupo',
          backgroundColor: ['#36A2EB'],
          data: [data.totalNeto]
        }
      ]
    };

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
          labels: { color: '#495057' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#495057' },
          grid: { color: '#ebedef', display: false }
        },
        y: {
          ticks: {
            color: '#495057',
            callback: function (value: any) {
              if (value >= 1000000) return (value / 1000000) + ' M';
              return value;
            }
          },
          grid: { color: '#ebedef' }
        }
      }
    };
  }

  descargar(): void {
    console.log('Descargando reporte por grupos...');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }

  formatPercent(value: number): string {
    return `${value.toFixed(2)} %`;
  }

  onRowEditInit(row: TableRow) {
    if (this.isAnyEditActive) return;
    this.clonedRow = { ...row.values };
    this.editingRowKey = row.key;
  }

  onRowEditSave(row: TableRow) {
    let newTotal = 0;
    Object.keys(row.values).forEach(key => {
      newTotal += row.values[key];
    });
    row.total = newTotal;

    this.editingRowKey = null;
    this.clonedRow = {};

    console.log('Saved row:', row);
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

    if (this.clonedCabecera.aUIPorcentaje !== undefined) {
      this.configuracion!.objConfiguracionReporteGrupos.aUIPorcentaje = this.clonedCabecera.aUIPorcentaje;
      this.facadeService.actualizarPorcentajeAUIUniversidad(this.clonedCabecera.aUIPorcentaje).subscribe();
    }
    if (this.clonedCabecera.excedentesMaestria !== undefined) {
      this.configuracion!.objConfiguracionReporteGrupos.excedentesMaestria = this.clonedCabecera.excedentesMaestria;
      this.facadeService.actualizarValorExcedentesMaestria(this.clonedCabecera.excedentesMaestria).subscribe();
    }

    this.guardandoCabecera = false;
    this.clonedCabecera = {};
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
    this.configuracion!.objConfiguracionReporteGrupos.item1 = this.clonedItems.item1!;
    this.configuracion!.objConfiguracionReporteGrupos.item2 = this.clonedItems.item2!;
    this.guardandoItems = false;
    this.clonedItems = {};
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
    return itemIndex === 0
      ? this.configuracion.presupuestoPorGrupoItem1
      : this.configuracion.presupuestoPorGrupoItem2;
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
    this.configuracion!.objConfiguracionReporteGrupos.imprevistos = this.clonedImprevistos;
    this.guardandoImprevistos = false;
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

    const valoresGrupo = this.groupColumns.map(grupo => ({
      idGrupo: '',
      nombreGrupo: grupo.nombre,
      valor: row.values[grupo.nombre]
    }));

    this.facadeService.actualizarValorVigenciasAnteriores(valoresGrupo).subscribe({
      next: (data) => {
        this.configuracion = data;
        this.procesarDatosTabla(data);
        delete this.clonedBudgetRow[row.key];
        this.editingBudgetRowKey = null;
      },
      error: (err) => {
        console.error('Error updating vigencias anteriores', err);
      }
    });
  }

  onBudgetRowEditCancel(row: TableRow, index: number) {
    row.values = this.clonedBudgetRow[row.key];
    delete this.clonedBudgetRow[row.key];
    this.editingBudgetRowKey = null;
  }

  // --- Fin Lógica Cabecera ---
}
