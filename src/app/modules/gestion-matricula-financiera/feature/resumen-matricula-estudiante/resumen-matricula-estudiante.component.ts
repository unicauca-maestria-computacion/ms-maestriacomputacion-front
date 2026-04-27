import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Estudiante } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../data/facade.service';
import { RadicarService } from '../../../gestion-solicitudes/services/radicar.service';
import { AutenticacionService } from '../../../gestion-autenticacion/services/autenticacion.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-resumen-matricula-estudiante',
  templateUrl: './resumen-matricula-estudiante.component.html',
  styleUrls: ['./resumen-matricula-estudiante.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private autenticacionService: AutenticacionService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
        const idRuta = params.get('id');
        const id = idRuta?.trim()
            ? idRuta
            : this.autenticacionService.getLoggedInUser()?.academicCode ?? null;

        if (!id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Sin identificador',
                detail: 'No se pudo determinar el estudiante. Inicie sesión nuevamente.'
            });
            return;
        }
        this.cargarEstudiante(id);
    });
  }

  cargarEstudiante(id: string): void {
      this.loadingService.show('Cargando resumen de matrícula');
      this.facadeService.obtenerEstudiante(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (data) => {
              if (!data) {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'No se encontró información de matrícula para el estudiante solicitado.'
                  });
                  this.loadingService.hide();
                  return;
              }
              this.estudiante = data;
              this.loadingService.hide();
              this.cdr.markForCheck();
          },
          error: (err) => {
              console.error('Error cargando estudiante', err);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo cargar la información de matrícula del estudiante.'
              });
              this.loadingService.hide();
          }
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  solicitarRevision(): void {
      this.radicarService.restrablecerValores();
      this.radicarService.codigoSolicitudPreseleccionado = 'RE_MATR';
      this.router.navigate(['/gestionsolicitudes/portafolio/radicar']);
  }
}
