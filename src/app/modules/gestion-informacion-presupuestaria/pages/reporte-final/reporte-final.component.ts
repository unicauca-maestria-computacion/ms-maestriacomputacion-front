import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./reporte-final.component.scss']
})
export class ReporteFinalComponent implements OnInit {

  cargando: boolean = false;
  periodoSeleccionado: PeriodoAcademicoDTORespuesta | null = null;


  // Configuración del reporte
  configuracion: ConfiguracionReporteFinanciero | null = null;

  // Datos de la tabla
  estudiantes: EstudianteReporte[] = [];

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService
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

    this.facadeService.obtenerReporteFinanciero(periodo.periodo, periodo.año).subscribe({
      next: (data) => {
        // Asignar configuración del reporte desde el servicio
        if (data.objConfiguracion) {
          this.configuracion = data.objConfiguracion;
        }

        if (data.estudiantes && this.configuracion) {
          this.estudiantes = data.estudiantes.map(e => {
            // valorMatricula = nº de SMLVs; la matrícula en COP = valorMatricula × valorSMLV.
            // biblioteca y recursosComputacionales vienen en COP directamente.
            // porcentajeBeca/Votacion/Egresado son ratios decimales (0.20 = 20%).
            const matricula = this.configuracion!.valorMatricula * this.configuracion!.valorSMLV;
            const recursosComp = this.configuracion!.recursosComputacionales;
            const biblioteca = this.configuracion!.biblioteca;
            const valorBeca = matricula * e.porcentajeBeca;
            const valorEgresado = matricula * e.porcentajeEgresado;
            const valorVotacion = matricula * e.porcentajeVotacion;
            const grupoDescuentos = valorBeca + valorEgresado + valorVotacion;
            const totalNeto = matricula + recursosComp + biblioteca - grupoDescuentos;

            return {
              ...e,
              nombreEstudiante: `${e.nombre} ${e.apellido}`,
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
        this.cargando = false;
      }
    });
  }

  get totalBruto(): number {
    return this.estudiantes.reduce(
      (acc, e) => acc + e.matricula + e.recursosComputacionales + e.biblioteca, 0
    );
  }

  get totalDescuentosCalculado(): number {
    return this.estudiantes.reduce((acc, e) => acc + e.grupoDescuentos, 0);
  }

  get totalIngresosNetos(): number {
    return this.estudiantes.reduce((acc, e) => acc + e.totalNeto, 0);
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
    return `${(value * 100).toFixed(0)} %`;
  }

}
