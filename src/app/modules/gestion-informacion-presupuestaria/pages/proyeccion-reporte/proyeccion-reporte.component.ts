import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proyeccion-reporte',
  templateUrl: './proyeccion-reporte.component.html',
  styleUrls: ['./proyeccion-reporte.component.scss']
})
export class ProyeccionReporteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  descargar(): void {
    // Implementa aquí la lógica de descarga
    console.log('Descargando proyección reporte...');
  }

}
