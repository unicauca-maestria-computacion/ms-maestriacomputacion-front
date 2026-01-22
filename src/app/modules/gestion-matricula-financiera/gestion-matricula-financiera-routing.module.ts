import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaFinancieraComponent } from './pages/matricula-financiera/matricula-financiera.component';

const routes: Routes = [
    { path: '', component: MatriculaFinancieraComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionMatriculaFinancieraRoutingModule { }
