import { Component, OnInit } from '@angular/core';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoAcademicoDTOPeticion, PeriodoAcademicoDTORespuesta } from '../../models/periodo-academico.dto';
import { ReporteEstudiantesDTORespuesta } from '../../models/reporte-estudiantes.dto';
import { ProyeccionEstudianteDTORespuesta } from '../../models/proyeccion-estudiante.dto';
import { ConfiguracionReporteFinancieroDTORespuesta } from '../../models/configuracion-reporte-financiero.dto';

interface EstudianteReporte extends ProyeccionEstudianteDTORespuesta {
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
  styleUrls: ['./reporte-final.component.scss']
})
export class ReporteFinalComponent implements OnInit {

  cargando: boolean = false;
  periodoActualTexto: string = '';
  hayAnterior: boolean = false;
  haySiguiente: boolean = false;

  periodos: PeriodoAcademicoDTORespuesta[] = [];
  currentIndex: number = 0;

  // Configuración del reporte
  configuracion: ConfiguracionReporteFinancieroDTORespuesta = {
    esReporteFinal: false,
    biblioteca: 0,
    recursosComputacionales: 0,
    valorMatricula: 0,
    valorSMLV: 0,
    totalNeto: 0,
    totalDescuentos: 0,
    totalIngresos: 0,
    objPeriodoAcademico: { periodo: 0, año: 0 }
  };

  // Datos de la tabla
  estudiantes: EstudianteReporte[] = [];

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService
  ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.cargando = true;
    this.facadeService.obtenerPeriodosAcademicos().subscribe({
      next: (data) => {
        this.periodos = data;
        if (this.periodos.length > 0) {
          // Select the last period by default (assuming list is ordered or we want the latest)
          this.currentIndex = this.periodos.length - 1;
          this.actualizarPeriodoActual();
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error loading periods', err);
        this.cargando = false;
      }
    });
  }

  actualizarPeriodoActual(): void {
    const periodo = this.periodos[this.currentIndex];
    this.periodoActualTexto = `${periodo.año}-${periodo.periodo}`;
    this.actualizarEstadoFlechas();
    this.cargarReporte();
  }

  actualizarEstadoFlechas(): void {
    this.hayAnterior = this.currentIndex > 0;
    this.haySiguiente = this.currentIndex < this.periodos.length - 1;
  }

  cargarReporte(): void {
    this.cargando = true;

    const periodo: PeriodoAcademicoDTOPeticion = {
      periodo: this.periodos[this.currentIndex].periodo,
      año: this.periodos[this.currentIndex].año
    };

    this.facadeService.obtenerReporteFinanciero(periodo).subscribe({
      next: (data) => {
        this.estudiantes = data.estudiantes as unknown as EstudianteReporte[];

        // Asignar configuración del reporte desde el servicio
        if (data.objConfiguracion) {
          this.configuracion = data.objConfiguracion;
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error fetching report', err);
        this.cargando = false;
      }
    });
  }

  irPeriodoAnterior(): void {
    if (this.hayAnterior) {
      this.currentIndex--;
      this.actualizarPeriodoActual();
    }
  }

  irPeriodoSiguiente(): void {
    if (this.haySiguiente) {
      this.currentIndex++;
      this.actualizarPeriodoActual();
    }
  }

  descargar(): void {
    console.log('Descargando reporte final...');
    // Implementar lógica de descarga
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatPercent(value: number): string {
    return `${value} %`;
  }

}
