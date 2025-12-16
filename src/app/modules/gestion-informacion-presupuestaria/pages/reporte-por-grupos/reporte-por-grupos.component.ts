import { Component, OnInit } from '@angular/core';
import { GestionInformacionPresupuestariaFakeApiService } from '../../services/fake-api.service';
import { ConfiguracionReporteGruposDTORespuesta } from '../../models/configuracion-reporte-grupos.dto';
import { PeriodoAcademicoDTORespuesta } from '../../models/periodo-academico.dto';
import { ReportePorGruposDTORespuesta } from '../../models/reporte-por-grupos.dto';
import { GrupoDTORespuesta } from '../../models/grupo.dto';

interface TableRow {
  concept: string;
  key: keyof ReportePorGruposDTORespuesta;
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

  configuracion: ConfiguracionReporteGruposDTORespuesta;
  tableRows: TableRow[] = [];
  groupColumns: GrupoDTORespuesta[] = [];
  loading: boolean = true;
  editingRowKey: string | null = null;
  clonedRow: { [s: string]: any } = {};

  periodoActualTexto: string = '';
  basicData: any;
  basicOptions: any;

  constructor(private apiService: GestionInformacionPresupuestariaFakeApiService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    const periodoMock = { periodo: 2, año: 2024 }; // Should come from context or selector
    this.periodoActualTexto = `${periodoMock.año} - ${periodoMock.periodo}`; // Format period text

    this.apiService.obtenerReporteGrupos(periodoMock).subscribe(data => {
      this.configuracion = data;
      this.procesarDatosTabla(data);
      this.inicializarGrafica(data);
      this.loading = false;
    });
  }

  procesarDatosTabla(data: ConfiguracionReporteGruposDTORespuesta): void {
    if (!data.reportePorGrupos || data.reportePorGrupos.length === 0) return;

    this.groupColumns = data.reportePorGrupos.map(r => r.objGrupo);

    const concepts: { label: string, key: keyof ReportePorGruposDTORespuesta, isPercentage: boolean, isEditable: boolean }[] = [
      { label: 'Total Neto', key: 'totalNeto', isPercentage: false, isEditable: false },
      { label: 'Aporte grupo primer semestre', key: 'aportePrimerSemestre', isPercentage: false, isEditable: false },
      { label: 'Aporte grupo segundo semestre', key: 'aporteSegundoSemestre', isPercentage: false, isEditable: false },
      { label: 'Participación 1er Semestre', key: 'participacionPrimerSemestre', isPercentage: true, isEditable: true },
      { label: 'Participación 2do semestre', key: 'participacionSegundoSemestre', isPercentage: true, isEditable: true },
      { label: 'Participación por año', key: 'participacionPorAño', isPercentage: true, isEditable: false }
    ];

    this.tableRows = concepts.map(concept => {
      const row: TableRow = {
        concept: concept.label,
        key: concept.key,
        isPercentage: concept.isPercentage,
        isEditable: concept.isEditable,
        total: 0,
        values: {}
      };

      let totalSum = 0;
      data.reportePorGrupos.forEach(grupoReport => {
        const value = grupoReport[concept.key] as number;
        row.values[grupoReport.objGrupo.nombre] = value;
        totalSum += value;
      });

      row.total = totalSum;

      return row;
    });
  }

  inicializarGrafica(data: ConfiguracionReporteGruposDTORespuesta): void {
    if (!data.reportePorGrupos) return;

    const labels = data.reportePorGrupos.map(g => g.objGrupo.nombre);
    const values = data.reportePorGrupos.map(g => g.totalNeto); // Using Total Neto for the chart

    // Assign specific colors if names match, otherwise default
    const colors = data.reportePorGrupos.map(g => {
      const name = g.objGrupo.nombre.toUpperCase();
      if (name.includes('GTI')) return '#FF6384'; // Pink
      if (name.includes('IDIS')) return '#FFCE56'; // Yellow
      if (name.includes('GICO')) return '#36A2EB'; // Blue
      return '#4BC0C0'; // Default Teal
    });

    this.basicData = {
      labels: labels,
      datasets: [
        {
          label: 'Total por Grupo',
          backgroundColor: colors,
          data: values
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          display: false, // Hide legend since bars are distinct groups
          labels: {
            color: '#495057'
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem: any) {
              return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(tooltipItem.raw);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef',
            display: false
          }
        },
        y: {
          ticks: {
            color: '#495057',
            callback: function (value: any) {
              // Format large numbers to Millions if appropriate, or just currency
              if (value >= 1000000) return (value / 1000000) + ' M';
              return value;
            }
          },
          grid: {
            color: '#ebedef'
          }
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
    this.clonedRow = { ...row.values };
    this.editingRowKey = row.key;
  }

  onRowEditSave(row: TableRow) {
    // Here we would call the API service to update the values
    // Example: this.apiService.updateParticipation(...)

    // Update local total
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
}
