import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionMatriculaFinancieraRoutingModule } from './gestion-matricula-financiera-routing.module';
import { PrimenNgModule } from '../primen-ng/primen-ng.module';
import { MessageService } from 'primeng/api';

import { MatriculaFinancieraComponent } from './pages/matricula-financiera/matricula-financiera.component';

@NgModule({
    declarations: [
        MatriculaFinancieraComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PrimenNgModule,
        GestionMatriculaFinancieraRoutingModule
    ],
    providers: [
        MessageService
    ]
})
export class GestionMatriculaFinancieraModule { }
