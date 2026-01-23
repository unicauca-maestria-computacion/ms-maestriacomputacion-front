import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Estudiante } from '../../models/domain-models';

@Component({
  selector: 'app-tabla-matricula-estudiante',
  templateUrl: './tabla-matricula-estudiante.component.html',
  styleUrls: ['./tabla-matricula-estudiante.component.scss']
})
export class TablaMatriculaEstudianteComponent implements OnChanges {

  @Input() estudiante: Estudiante | null = null;
  
  // Helpers para mostrar en la tabla (calculados internamente)
  becaResolucion: string = 'Pendiente: Si aún no cuenta con No. Resolución';
  becaPorcentaje: string = '';
  descuentoVoto: string = 'NO';
  descuentoEgresado: string = 'NO';
  valorMatricula: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['estudiante'] && this.estudiante) {
          this.procesarDatosFinancieros();
      }
  }

  private procesarDatosFinancieros(): void {
      if (!this.estudiante) return;

      // Reset de valores
      this.becaResolucion = 'Pendiente: Si aún no cuenta con No. Resolución';
      this.becaPorcentaje = '';
      this.descuentoVoto = 'NO';
      this.descuentoEgresado = 'NO';
      this.valorMatricula = 0;

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

  getNombreCompleto(): string {
      return this.estudiante ? `${this.estudiante.nombre} ${this.estudiante.apellido}` : '';
  }
}
