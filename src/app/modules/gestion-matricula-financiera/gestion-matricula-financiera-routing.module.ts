import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaFinancieraComponent } from './pages/matricula-financiera/matricula-financiera.component';
import { DetalleEstudianteComponent } from './pages/detalle-estudiante/detalle-estudiante.component';
import { ResumenMatriculaEstudianteComponent } from './pages/resumen-matricula-estudiante/resumen-matricula-estudiante.component';

const routes: Routes = [
    { path: '', component: MatriculaFinancieraComponent },
    { path: 'detalle/:id', component: DetalleEstudianteComponent },
    { path: 'resumen', component: ResumenMatriculaEstudianteComponent },
    { path: 'resumen/:id', component: ResumenMatriculaEstudianteComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionMatriculaFinancieraRoutingModule { }
