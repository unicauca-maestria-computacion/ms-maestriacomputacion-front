import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { GestionMatriculaFinancieraFakeApiService } from './fake-api.service';
import { GestionMatriculaFinancieraMapperService } from './mapper.service';
import { Estudiante, PeriodoAcademico } from '../models/domain-models';
import { ApiError } from '../../gestion-informacion-presupuestaria/dto/api-error';

@Injectable({
    providedIn: 'root'
})
export class GestionMatriculaFinancieraFacadeService {

    private _loading = new BehaviorSubject<boolean>(false);
    public loading$ = this._loading.asObservable();

    private _error = new BehaviorSubject<ApiError | null>(null);
    public error$ = this._error.asObservable();

    private _estudiantes = new BehaviorSubject<Estudiante[]>([]);
    public estudiantes$ = this._estudiantes.asObservable();

    private _estudianteSeleccionado = new BehaviorSubject<Estudiante | null>(null);
    public estudianteSeleccionado$ = this._estudianteSeleccionado.asObservable();

    constructor(
        private apiService: GestionMatriculaFinancieraFakeApiService,
        private mapper: GestionMatriculaFinancieraMapperService
    ) { }

    obtenerEstudiantes(periodo: PeriodoAcademico): Observable<Estudiante[]> {
        this._loading.next(true);
        this._error.next(null);
        const dtoPeticion = this.mapper.mappearDePeriodoAcademicoARespuesta(periodo);
        
        return this.apiService.obtenerEstudiantes(dtoPeticion).pipe(
            map(dtos => this.mapper.mappearDeListaRespuestaAEstudiante(dtos)),
            tap(estudiantes => this._estudiantes.next(estudiantes)),
            catchError(error => {
                this._error.next(error);
                return throwError(() => error);
            }),
            finalize(() => this._loading.next(false))
        );
    }

    obtenerEstudiante(codigo: number): Observable<Estudiante> {
        this._loading.next(true);
        this._error.next(null);
        
        return this.apiService.obtenerEstudiante(codigo).pipe(
            map(dto => this.mapper.mappearDeRespuestaAEstudiante(dto)),
            tap(estudiante => this._estudianteSeleccionado.next(estudiante)),
            catchError(error => {
                this._error.next(error);
                return throwError(() => error);
            }),
            finalize(() => this._loading.next(false))
        );
    }

    iniciarNuevaMatriculaFinanciera(): Observable<boolean> {
        this._loading.next(true);
        this._error.next(null);
        
        return this.apiService.iniciarNuevaMatriculaFinanciera().pipe(
            catchError(error => {
                this._error.next(error);
                return throwError(() => error);
            }),
            finalize(() => this._loading.next(false))
        );
    }
}
