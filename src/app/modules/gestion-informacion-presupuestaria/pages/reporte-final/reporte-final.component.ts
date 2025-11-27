import { Component, OnInit } from '@angular/core';
import { PeriodoAcademicoDTORespuesta } from '../../models/periodo-academico.dto';

@Component({
  selector: 'app-reporte-final',
  templateUrl: './reporte-final.component.html',
  styleUrls: ['./reporte-final.component.scss']
})
export class ReporteFinalComponent implements OnInit {

  periodosAcademicos: PeriodoAcademicoDTORespuesta[] = [
    { periodo: 1, año: 2024 },
    { periodo: 2, año: 2024 },
    { periodo: 1, año: 2025 }
  ];

  currentPeriodoIndex: number = 2; // Empezamos en 2025-1 (el último)

  constructor() { }

  ngOnInit(): void {
  }

  get periodoActual(): PeriodoAcademicoDTORespuesta {
    return this.periodosAcademicos[this.currentPeriodoIndex];
  }

  get periodoActualTexto(): string {
    const periodo = this.periodoActual;
    return `${periodo.año} - ${periodo.periodo}`;
  }

  get hayAnterior(): boolean {
    return this.currentPeriodoIndex > 0;
  }

  get haySiguiente(): boolean {
    return this.currentPeriodoIndex < this.periodosAcademicos.length - 1;
  }

  irPeriodoAnterior(): void {
    if (this.hayAnterior) {
      this.currentPeriodoIndex--;
    }
  }

  irPeriodoSiguiente(): void {
    if (this.haySiguiente) {
      this.currentPeriodoIndex++;
    }
  }

  descargar(): void {
    // Implementa aquí la lógica de descarga
    console.log('Descargando reporte final...');
  }

}
