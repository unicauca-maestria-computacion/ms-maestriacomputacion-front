import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoAcademicoDTORespuesta } from '../../models/periodo-academico.dto';

@Component({
  selector: 'app-periodo-academico-selector',
  templateUrl: './periodo-academico-selector.component.html',
  styleUrls: ['./periodo-academico-selector.component.scss']
})
export class PeriodoAcademicoSelectorComponent implements OnInit {

  @Output() periodoSeleccionado = new EventEmitter<PeriodoAcademicoDTORespuesta>();

  periodos: PeriodoAcademicoDTORespuesta[] = [];
  currentIndex: number = 0;
  periodoActualTexto: string = '';
  hayAnterior: boolean = false;
  haySiguiente: boolean = false;
  loading: boolean = false;

  constructor(private facadeService: GestionInformacionPresupuestariaFacadeService) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.loading = true;
    this.facadeService.obtenerPeriodosAcademicos().subscribe({
      next: (data) => {
        this.periodos = data;
        if (this.periodos.length > 0) {
          this.currentIndex = this.periodos.length - 1;
          this.actualizarPeriodoActual();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading periods', err);
        this.loading = false;
      }
    });
  }

  actualizarPeriodoActual(): void {
    const periodo = this.periodos[this.currentIndex];
    this.periodoActualTexto = `${periodo.año} - ${periodo.periodo}`;
    this.actualizarEstadoFlechas();
    this.periodoSeleccionado.emit(periodo);
  }

  actualizarEstadoFlechas(): void {
    this.hayAnterior = this.currentIndex > 0;
    this.haySiguiente = this.currentIndex < this.periodos.length - 1;
  }

  irPeriodoAnterior(): void {
    if (this.hayAnterior) {
      this.currentIndex--;
      this.actualizarPeriodoActual();
    }
  }

  irPeriodoSiguiente(): void {
    if (this.haySiguiente) {
      this.currentIndex++;
      this.actualizarPeriodoActual();
    }
  }

}
