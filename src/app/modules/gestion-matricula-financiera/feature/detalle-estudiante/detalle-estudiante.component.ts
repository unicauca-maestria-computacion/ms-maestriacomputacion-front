import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Estudiante } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../data/facade.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-detalle-estudiante',
  templateUrl: './detalle-estudiante.component.html',
  styleUrls: ['./detalle-estudiante.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class DetalleEstudianteComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  estudiante: Estudiante | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facadeService: GestionMatriculaFinancieraFacadeService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
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
            this.router.navigate(['/gestion-matricula-financiera']);
            return;
        }
        this.cargarEstudiante(id);
    });
  }

  cargarEstudiante(id: string): void {
      this.loadingService.show(`Cargando detalle del estudiante ${id}`);
      this.facadeService.obtenerEstudiante(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (data) => {
              if (!data) {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'No se encontró información para el estudiante solicitado.'
                  });
                  this.router.navigate(['/gestion-matricula-financiera']);
                  return;
              }
              this.estudiante = data;
              this.loadingService.hide();
              this.cdr.markForCheck();
          },
          error: (_err) => {
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo cargar la información del estudiante. Volviendo a la lista.'
              });
              this.loadingService.hide();
              this.cdr.markForCheck();
              this.router.navigate(['/gestion-matricula-financiera']);
          }
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  volver(): void {
      this.router.navigate(['/gestion-matricula-financiera']);
  }
}
