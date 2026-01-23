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
  
  // Helpers for table display
  becaResolucion: string = 'Pendiente: Si aún no cuenta con No. Resolución';
  becaPorcentaje: string = '';
  descuentoVoto: string = 'NO';
  descuentoEgresado: string = 'NO';
  valorMatricula: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facadeService: GestionMatriculaFinancieraFacadeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
            this.cargarEstudiante(Number(id));
        }
    });
  }

  cargarEstudiante(id: number): void {
      this.loading = true;
      this.facadeService.obtenerEstudiante(id).subscribe({
          next: (data) => {
              this.estudiante = data;
              this.procesarDatosFinancieros();
              this.loading = false;
          },
          error: (err) => {
              console.error('Error cargando estudiante', err);
              this.loading = false;
          }
      });
  }

  procesarDatosFinancieros(): void {
      if (!this.estudiante) return;

      if (this.estudiante.matriculasFinancieras && this.estudiante.matriculasFinancieras.length > 0) {
          const mat = this.estudiante.matriculasFinancieras[0];
          this.valorMatricula = mat.valorMatricula;
      }

      if (this.estudiante.descuentos) {
          const voto = this.estudiante.descuentos.find(d => d.tipoDescuento.toLowerCase().includes('voto'));
          this.descuentoVoto = voto ? 'SI' : 'NO';

          const egresado = this.estudiante.descuentos.find(d => d.tipoDescuento.toLowerCase().includes('egresado'));
          this.descuentoEgresado = egresado ? 'SI' : 'NO';
      }

      if (this.estudiante.becas && this.estudiante.becas.length > 0) {
          this.becaResolucion = this.estudiante.becas[0].resolucion || 'Pendiente: Si aún no cuenta con No. Resolución';
          this.becaPorcentaje = this.estudiante.becas[0].porcentaje ? `${this.estudiante.becas[0].porcentaje}%` : '';
      }
  }

  volver(): void {
      this.router.navigate(['../'], { relativeTo: this.route });
  }

  getNombreCompleto(): string {
      return this.estudiante ? `${this.estudiante.nombre} ${this.estudiante.apellido}` : '';
  }
}
