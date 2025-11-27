import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

interface TabOption {
  label: string;
  value: string;
  route: string;
}

@Component({
  selector: 'app-opciones-presupuesto',
  templateUrl: './opciones-presupuesto.component.html',
  styleUrls: ['./opciones-presupuesto.component.scss']
})
export class OpcionesPresupuestoComponent implements OnInit {

  @Input() activeTab: string = 'reporte-final';
  @Output() onDescargar = new EventEmitter<void>();

  selectedTab: string = 'reporte-final';

  tabOptions: TabOption[] = [
    { label: 'Reporte Final', value: 'reporte-final', route: '/informacion-presupuestaria/reporte-final' },
    { label: 'Proyección Reporte', value: 'proyeccion-reporte', route: '/informacion-presupuestaria/proyeccion-reporte' },
    { label: 'Reporte Por Grupos', value: 'reporte-por-grupos', route: '/informacion-presupuestaria/reporte-por-grupos' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.selectedTab = this.activeTab;
  }

  ngOnChanges(): void {
    this.selectedTab = this.activeTab;
  }

  onTabChange(event: any): void {
    const selectedOption = this.tabOptions.find(tab => tab.value === event.value);
    if (selectedOption?.route) {
      this.router.navigate([selectedOption.route]);
    }
  }

  descargar(): void {
    this.onDescargar.emit();
  }

}
