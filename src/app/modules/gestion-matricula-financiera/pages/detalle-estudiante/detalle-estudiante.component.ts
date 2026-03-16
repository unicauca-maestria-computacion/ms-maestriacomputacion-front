import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudiante } from '../../models/domain-models';
import { GestionMatriculaFinancieraFacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-detalle-estudiante',
  templateUrl: './detalle-estudiante.component.html',
  styleUrls: ['./detalle-estudiante.component.scss']
})
export class DetalleEstudianteComponent implements OnInit {

  estudiante: Estudiante | null = null;
  loading: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facadeService: GestionMatriculaFinancieraFacadeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
            this.cargarEstudiante(id);
        }
    });
  }

  cargarEstudiante(id: string): void {
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

  volver(): void {
      this.router.navigate(['/matricula-financiera']);
  }
}
