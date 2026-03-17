import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Estudiante } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../services/facade.service';
import { RadicarService } from '../../../gestion-solicitudes/services/radicar.service';

@Component({
  selector: 'app-resumen-matricula-estudiante',
  templateUrl: './resumen-matricula-estudiante.component.html',
  styleUrls: ['./resumen-matricula-estudiante.component.scss'],
  providers: [MessageService]
})
export class ResumenMatriculaEstudianteComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  estudiante: Estudiante | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facadeService: GestionMatriculaFinancieraFacadeService,
    private radicarService: RadicarService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
        const id = params.get('id');
        if (!id || id.trim() === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El identificador del estudiante no es válido.'
            });
            return;
        }
        this.cargarEstudiante(id);
    });
  }

  cargarEstudiante(id: string): void {
      this.loading = true;
      this.facadeService.obtenerEstudiante(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (data) => {
              if (!data) {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'No se encontró información de matrícula para el estudiante solicitado.'
                  });
                  this.loading = false;
                  return;
              }
              this.estudiante = data;
              this.loading = false;
          },
          error: (err) => {
              console.error('Error cargando estudiante', err);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo cargar la información de matrícula del estudiante.'
              });
              this.loading = false;
          }
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
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
