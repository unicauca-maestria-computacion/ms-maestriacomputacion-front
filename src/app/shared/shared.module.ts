import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimenNgModule } from '../modules/primen-ng/primen-ng.module';
import { EmptyLabelPipe } from './pipes/empty-label.pipe';
import { BuscadorDocentesComponent } from './components/buscador-docentes/buscador-docentes.component';
import { BuscadorEstudiantesComponent } from './components/buscador-estudiantes/buscador-estudiantes.component';
import { BuscadorExpertosComponent } from './components/buscador-expertos/buscador-expertos.component';
import { BytesToKbPipe } from './pipes/bytes-to-kb.pipe';



import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { TablaMatriculaEstudianteComponent } from './components/tabla-matricula-estudiante/tabla-matricula-estudiante.component';


@NgModule({
  declarations: [
    EmptyLabelPipe,
    BytesToKbPipe,
    BuscadorDocentesComponent,
    BuscadorEstudiantesComponent,
    BuscadorExpertosComponent,
    LoadingOverlayComponent,
    TablaMatriculaEstudianteComponent
  ],
  imports: [
    CommonModule,
    PrimenNgModule
  ],
  exports: [
    EmptyLabelPipe,
    BytesToKbPipe,
    BuscadorDocentesComponent,
    BuscadorEstudiantesComponent,
    BuscadorExpertosComponent,
    LoadingOverlayComponent,
    TablaMatriculaEstudianteComponent
  ]
})
export class SharedModule { }
