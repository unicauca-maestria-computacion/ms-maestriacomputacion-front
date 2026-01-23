import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Estudiante } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../services/facade.service';
import { MessageService } from 'primeng/api';

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
    private facadeService: GestionMatriculaFinancieraFacadeService,
    private messageService: MessageService
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
      this.messageService.add({
          severity: 'info', 
          summary: 'Solicitud Enviada', 
          detail: 'Se ha enviado su solicitud de revisión al coordinador.'
      });
  }
}
