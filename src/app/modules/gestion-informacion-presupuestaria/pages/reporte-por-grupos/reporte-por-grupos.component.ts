import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-por-grupos',
  templateUrl: './reporte-por-grupos.component.html',
  styleUrls: ['./reporte-por-grupos.component.scss']
})
export class ReportePorGruposComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  descargar(): void {
    // Implementa aquí la lógica de descarga
    console.log('Descargando reporte por grupos...');
  }

}
