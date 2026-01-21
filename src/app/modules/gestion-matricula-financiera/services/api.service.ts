import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendGestionMatriculaFinanciera } from 'src/app/core/constants/api-url';
import { PeriodoAcademicoDTOPeticion } from '../dto/periodo-academico.dto';
import { EstudianteDTORespuesta } from '../dto/estudiante.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionMatriculaFinancieraApiService {

    constructor(private http: HttpClient) { }

    obtenerEstudiantes(periodo: PeriodoAcademicoDTOPeticion): Observable<EstudianteDTORespuesta[]> {
        return this.http.post<EstudianteDTORespuesta[]>(backendGestionMatriculaFinanciera('obtener-estudiantes'), periodo);
    }

    obtenerEstudiante(codigo: number): Observable<EstudianteDTORespuesta> {
        return this.http.get<EstudianteDTORespuesta>(backendGestionMatriculaFinanciera(`obtener-estudiante/${codigo}`));
    }

    iniciarNuevaMatriculaFinanciera(): Observable<boolean> {
        return this.http.post<boolean>(backendGestionMatriculaFinanciera('iniciar-nueva-matricula-financiera'), {});
    }
}
