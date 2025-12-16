import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ProyeccionEstudianteDTORespuesta, ProyeccionEstudianteDTOPeticion } from '../../models/proyeccion-estudiante.dto';
import { ConfiguracionReporteFinancieroDTORespuesta, ConfiguracionReporteFinancieroDTOPeticion } from '../../models/configuracion-reporte-financiero.dto';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../../models/reporte-proyeccion-estudiantes.dto';

interface EstudianteProyeccion extends ProyeccionEstudianteDTORespuesta {
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
  selector: 'app-proyeccion-reporte',
  templateUrl: './proyeccion-reporte.component.html',
  styleUrls: ['./proyeccion-reporte.component.scss'],
  providers: [MessageService]
})
export class ProyeccionReporteComponent implements OnInit {

  cargando: boolean = false;
  guardando: boolean = false; // Used for global saving spinner
  periodoActualTexto: string = '';

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
  estudiantes: EstudianteProyeccion[] = [];
  clonedEstudiantes: { [s: string]: EstudianteProyeccion; } = {};

  // Estado de edición de cabecera
  editandoCabecera: boolean = false;
  clonedCabecera: Partial<ConfiguracionReporteFinancieroDTORespuesta> = {};

  // Control de edición de filas (solo una a la vez)
  editingRowKey: string | null = null;

  constructor(
    private messageService: MessageService,
    private facadeService: GestionInformacionPresupuestariaFacadeService
  ) { }

  ngOnInit(): void {
    this.cargarProyeccion();
  }

  cargarProyeccion(): void {
    this.cargando = true;
    this.facadeService.obtenerProyeccionEstudiantes().subscribe({
      next: (data) => {
        this.procesarRespuesta(data);
        this.cargando = false;
        this.guardando = false;
      },
      error: (err) => {
        console.error('Error loading projection', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la proyección.' });
        this.cargando = false;
        this.guardando = false;
      }
    });
  }

  procesarRespuesta(data: ReporteProyeccionEstudiantesDTORespuesta) {
    if (data.periodo) {
      this.periodoActualTexto = `${data.periodo.año}-${data.periodo.periodo}`;
    }
    if (data.objConfiguracion) {
      this.configuracion = data.objConfiguracion;
    }
    if (data.estudiantes) {
      this.estudiantes = data.estudiantes as unknown as EstudianteProyeccion[];
    }
  }

  // --- Lógica de Edición de Cabecera (Configuración) ---

  onHeaderEditInit() {
    // Disable row editing if active (force cancel or block? For ease, we just ensure no row is editing or clear it)
    if (this.editingRowKey) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Termine de editar el estudiante primero.' });
      return;
    }

    this.editandoCabecera = true;
    this.clonedCabecera = { ...this.configuracion };
  }

  onHeaderEditSave() {
    this.guardando = true; // Show loading spinner
    this.editandoCabecera = false;

    const configUpdate: ConfiguracionReporteFinancieroDTOPeticion = {
      ...this.configuracion, // Send all current values
      // Override with edited values (clonedCabecera should hold the bound models)
      biblioteca: this.clonedCabecera.biblioteca!,
      recursosComputacionales: this.clonedCabecera.recursosComputacionales!,
      valorMatricula: this.clonedCabecera.valorMatricula!,
      valorSMLV: this.clonedCabecera.valorSMLV!,
      objPeriodoAcademico: this.configuracion.objPeriodoAcademico
    };

    this.facadeService.actualizarConfiguracionProyeccion(configUpdate).subscribe({
      next: (data) => {
        this.procesarRespuesta(data);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Configuración actualizada correctamente' });
        this.guardando = false;
        this.clonedCabecera = {};
      },
      error: (err) => {
        console.error('Error update config', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar configuración.' });
        this.guardando = false;
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
    // Validaciones básicas
    if (estudiante.porcentajeVotacion < 0 || estudiante.porcentajeBeca < 0 || estudiante.porcentajeEgresado < 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Los porcentajes no pueden ser negativos' });
      // Revertir cambios locales para esa fila
      this.onRowEditCancel(estudiante, this.findIndexById(estudiante.codigoEstudiante));
      return;
    }

    this.guardando = true; // Show full page spinner
    this.editingRowKey = null; // Exit edit mode

    const proyeccionUpdate: ProyeccionEstudianteDTOPeticion = {
      codigoEstudiante: estudiante.codigoEstudiante,
      estaPago: estudiante.estaPago,
      porcentajeVotacion: estudiante.porcentajeVotacion,
      porcentajeBeca: estudiante.porcentajeBeca,
      porcentajeEgresado: estudiante.porcentajeEgresado
    };

    this.facadeService.actualizarProyeccionEstudiante(proyeccionUpdate).subscribe({
      next: (data) => {
        this.procesarRespuesta(data);
        delete this.clonedEstudiantes[estudiante.codigoEstudiante];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estudiante actualizado correctamente' });
        this.guardando = false;
      },
      error: (err) => {
        console.error('Error updating student', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar estudiante.' });
        this.onRowEditCancel(estudiante, this.findIndexById(estudiante.codigoEstudiante)); // Revert
        this.guardando = false;
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

  descargar(): void {
    console.log('Descargando proyección reporte...');
  }
}
