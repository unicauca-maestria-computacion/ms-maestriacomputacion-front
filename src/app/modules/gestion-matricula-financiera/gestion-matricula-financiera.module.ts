import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionMatriculaFinancieraRoutingModule } from './gestion-matricula-financiera-routing.module';
import { PrimenNgModule } from '../primen-ng/primen-ng.module';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../shared/shared.module';

import { MatriculaFinancieraComponent } from './pages/matricula-financiera/matricula-financiera.component';
import { DetalleEstudianteComponent } from './pages/detalle-estudiante/detalle-estudiante.component';
import { ResumenMatriculaEstudianteComponent } from './pages/resumen-matricula-estudiante/resumen-matricula-estudiante.component';
import { MatriculaStatusBadgeComponent } from './presentation/molecules/matricula-status-badge/matricula-status-badge.component';
import { MatriculaFormComponent } from './presentation/organisms/matricula-form/matricula-form.component';
import { MatriculaFacade } from './application/facade/matricula.facade';
import { MATRICULA_REPOSITORY } from './application/tokens/matricula.tokens';
import { HttpMatriculaAdapter } from './infrastructure/adapters/http-matricula.adapter';

@NgModule({
    declarations: [
        MatriculaFinancieraComponent,
        DetalleEstudianteComponent,
        ResumenMatriculaEstudianteComponent,
        MatriculaStatusBadgeComponent,
        MatriculaFormComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimenNgModule,
        GestionMatriculaFinancieraRoutingModule,
        SharedModule
    ],
    providers: [
        MessageService,
        MatriculaFacade,
        { provide: MATRICULA_REPOSITORY, useClass: HttpMatriculaAdapter },
    ]
})
export class GestionMatriculaFinancieraModule { }
