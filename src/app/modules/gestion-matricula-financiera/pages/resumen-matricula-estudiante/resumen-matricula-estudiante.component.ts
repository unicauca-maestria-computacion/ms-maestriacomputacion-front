import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudiante } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../services/facade.service';
import { RadicarService } from '../../../gestion-solicitudes/services/radicar.service';

@Component({
  selector: 'app-resumen-matricula-estudiante',
  templateUrl: './resumen-matricula-estudiante.component.html',
  styleUrls: ['./resumen-matricula-estudiante.component.scss']
})
export class ResumenMatriculaEstudianteComponent implements OnInit {

  estudiante: Estudiante | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facadeService: GestionMatriculaFinancieraFacadeService,
    private radicarService: RadicarService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
            this.cargarEstudiante(Number(id));
        } else {
            // Mock default
            this.cargarEstudiante(1); 
        }
    });
  }

  cargarEstudiante(id: number): void {
      this.loading = true;
      this.facadeService.obtenerEstudiante(id).subscribe({
          next: (data) => {
              this.estudiante = data;
              this.loading = false;
          },
          error: (err) => {
              console.error('Error cargando estudiante', err);
              this.loading = false;
          }
      });
  }

  solicitarRevision(): void {
      // Limpiar datos previos del servicio radicar
      this.radicarService.restrablecerValores();
      // Pre-seleccionar "Revisión de Matrícula"
      this.radicarService.codigoSolicitudPreseleccionado = 'RE_MATR';
      // Navegar a radicar solicitud
      this.router.navigate(['/gestionsolicitudes/portafolio/radicar']);
  }
}
