import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionInformacionPresupuestariaRoutingModule } from './gestion-informacion-presupuestaria-routing.module';
import { ReporteFinalComponent } from './pages/reporte-final/reporte-final.component';
import { ProyeccionReporteComponent } from './pages/proyeccion-reporte/proyeccion-reporte.component';
import { ReportePorGruposComponent } from './pages/reporte-por-grupos/reporte-por-grupos.component';
import { PrimenNgModule } from '../primen-ng/primen-ng.module';
import { SharedModule } from '../../shared/shared.module';
import { OpcionesPresupuestoComponent } from './components/opciones-presupuesto/opciones-presupuesto.component';
import { PeriodoAcademicoSelectorComponent } from './components/periodo-academico-selector/periodo-academico-selector.component';
import { GastosGeneralesDialogComponent } from './components/gastos-generales-dialog/gastos-generales-dialog.component';
import { DescargarReporteDialogComponent } from './components/descargar-reporte-dialog/descargar-reporte-dialog.component';
import { PresupuestoFilterComponent } from './presentation/molecules/presupuesto-filter/presupuesto-filter.component';
import { PresupuestoFormComponent } from './presentation/organisms/presupuesto-form/presupuesto-form.component';
import { MessageService } from 'primeng/api';
import { PresupuestoFacade } from './application/facade/presupuesto.facade';
import { PRESUPUESTO_REPOSITORY } from './application/tokens/presupuesto.tokens';
import { HttpPresupuestoAdapter } from './infrastructure/adapters/http-presupuesto.adapter';

@NgModule({
    declarations: [
    ReporteFinalComponent,
    ProyeccionReporteComponent,
    ReportePorGruposComponent,
    OpcionesPresupuestoComponent,
    PeriodoAcademicoSelectorComponent,
    GastosGeneralesDialogComponent,
    DescargarReporteDialogComponent,
    PresupuestoFilterComponent,
    PresupuestoFormComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GestionInformacionPresupuestariaRoutingModule,
        PrimenNgModule,
        SharedModule,
    ],
    providers: [
        MessageService,
        PresupuestoFacade,
        { provide: PRESUPUESTO_REPOSITORY, useClass: HttpPresupuestoAdapter },
    ]
})
export class GestionInformacionPresupuestariaModule { }
