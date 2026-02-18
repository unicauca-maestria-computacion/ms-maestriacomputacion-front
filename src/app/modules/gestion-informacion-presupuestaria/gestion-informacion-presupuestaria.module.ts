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
import { GastosGeneralesDialogComponent } from './components/gastos-generales-dialog/gastos-generales-dialog.component';
import { DescargarReporteDialogComponent } from './components/descargar-reporte-dialog/descargar-reporte-dialog.component';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
    ReporteFinalComponent,
    ProyeccionReporteComponent,
    ReportePorGruposComponent,
    OpcionesPresupuestoComponent,
    PeriodoAcademicoSelectorComponent,
    GastosGeneralesDialogComponent,
    DescargarReporteDialogComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        GestionInformacionPresupuestariaRoutingModule,
        PrimenNgModule
    ],
    providers: [
        MessageService
    ]
})
export class GestionInformacionPresupuestariaModule { }
