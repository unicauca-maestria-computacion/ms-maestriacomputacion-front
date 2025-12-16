import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionInformacionPresupuestariaRoutingModule } from './gestion-informacion-presupuestaria-routing.module';
import { ReporteFinalComponent } from './pages/reporte-final/reporte-final.component';
import { ProyeccionReporteComponent } from './pages/proyeccion-reporte/proyeccion-reporte.component';
import { ReportePorGruposComponent } from './pages/reporte-por-grupos/reporte-por-grupos.component';
import { PrimenNgModule } from '../primen-ng/primen-ng.module';
import { OpcionesPresupuestoComponent } from './components/opciones-presupuesto/opciones-presupuesto.component';
import { PeriodoAcademicoSelectorComponent } from './components/periodo-academico-selector/periodo-academico-selector.component';

@NgModule({
    declarations: [
    ReporteFinalComponent,
    ProyeccionReporteComponent,
    ReportePorGruposComponent,
    OpcionesPresupuestoComponent,
    PeriodoAcademicoSelectorComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        GestionInformacionPresupuestariaRoutingModule,
        PrimenNgModule
    ]
})
export class GestionInformacionPresupuestariaModule { }
