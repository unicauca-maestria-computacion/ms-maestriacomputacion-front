import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { GestionInformacionPresupuestariaApiService } from './api.service';
import { GestionInformacionPresupuestariaMapperService } from './mapper.service';
import { ApiError } from '../dto/api-error';
import { ConfiguracionReporteFinancieroDTOPeticion, ConfiguracionReporteFinancieroDTORespuesta } from '../dto/configuracion-reporte-financiero.dto';
import { ProyeccionEstudianteDTOPeticion } from '../dto/proyeccion-estudiante.dto';
import { PeriodoAcademicoDto } from '../dto/periodo-financiero.dto';
import { ActualizarParticipacionDTOPeticion } from '../dto/porcentaje-grupo.dto';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';
import { ReporteProyeccionEstudiantes, ReportePorGrupos, ConfiguracionReporteFinanciero } from '../models/domain-models';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../dto/reporte-proyeccion-estudiantes.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaFacadeService {

    private _loading = new BehaviorSubject<boolean>(false);
    public loading$ = this._loading.asObservable();

    private _error = new BehaviorSubject<ApiError | null>(null);
    public error$ = this._error.asObservable();

    private _reporteProyeccionEstudiantes = new BehaviorSubject<ReporteProyeccionEstudiantes | null>(null);
    public reporteProyeccionEstudiantes$ = this._reporteProyeccionEstudiantes.asObservable();

    private _reporteGrupos = new BehaviorSubject<ReportePorGrupos | null>(null);
    public reporteGrupos$ = this._reporteGrupos.asObservable();

    constructor(
        private apiService: GestionInformacionPresupuestariaApiService,
        private mapper: GestionInformacionPresupuestariaMapperService
    ) { }

    // ── Periodos ──────────────────────────────────────────────────────────

    obtenerPeriodosFinancieros(): Observable<PeriodoAcademicoDto[]> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodos().pipe(
            map(periodos => periodos.map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo }))),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    obtenerPeriodosActivos(): Observable<PeriodoAcademicoDto[]> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodosActivos().pipe(
            map(periodos => periodos.map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo }))),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    obtenerPeriodosCerrados(): Observable<PeriodoAcademicoDto[]> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodosInactivos().pipe(
            map(periodos => periodos.map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo }))),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    obtenerPeriodosActivosYCerrados(): Observable<PeriodoAcademicoDto[]> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodosActivosYCerrados().pipe(
            map(periodos => periodos.map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo }))),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    obtenerPeriodoProyeccion(): Observable<PeriodoAcademicoDto> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodoProyeccion().pipe(
            map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo })),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Proyección de estudiantes ─────────────────────────────────────────

    obtenerProyeccionEstudiantes(tagPeriodo?: number, anio?: number): Observable<ReporteProyeccionEstudiantes> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerProyeccionEstudiantes(tagPeriodo, anio).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto)),
            tap(data => this._reporteProyeccionEstudiantes.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarProyeccionEstudiante(proyeccion: ProyeccionEstudianteDTOPeticion, tagPeriodo?: number, anio?: number): Observable<any> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarProyeccionEstudiante(proyeccion, tagPeriodo, anio).pipe(
            map(dto => ({
                ...dto,
                objConfiguracion: null,
                periodo: null,
                estudiantes: [dto]
            })),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Reporte financiero ────────────────────────────────────────────────

    obtenerReporteFinanciero(tagPeriodo: number, anio: number): Observable<any> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerReporteFinanciero(tagPeriodo, anio).pipe(
            map(dto => ({
                ...dto,
                objConfiguracion: this.mapper.mappearDeRespuestaAConfiguracionReporteFinanciero(dto.configuracion)
            })),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Configuración reporte financiero ──────────────────────────────────

    actualizarConfiguracionProyeccion(config: ConfiguracionReporteFinancieroDTOPeticion): Observable<ConfiguracionReporteFinancieroDTORespuesta> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodoProyeccion().pipe(
            switchMap(periodo =>
                this.apiService.actualizarConfiguracionReporteFinanciero(config, periodo.tagPeriodo, periodo.anio)
            ),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarConfiguracionReporteFinanciero(
        config: ConfiguracionReporteFinancieroDTOPeticion,
        tagPeriodo: number,
        anio: number
    ): Observable<ConfiguracionReporteFinancieroDTORespuesta> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarConfiguracionReporteFinanciero(config, tagPeriodo, anio).pipe(
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Reporte por grupos ────────────────────────────────────────────────

    obtenerReporteGrupos(anio: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerReportePorGrupos(anio).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarParticipacionGrupo(dto: ActualizarParticipacionDTOPeticion): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarParticipacionGrupo(dto).pipe(
            map(d => this.mapper.mappearDeRespuestaAReportePorGrupos(d)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarPorcentajeAUIUniversidad(porcentaje: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarPorcentajeAUI(porcentaje).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarValorExcedentesMaestria(valor: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarExcedentesMaestria(valor).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Gastos generales ──────────────────────────────────────────────────

    crearGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta & { idGastoGeneral: number }> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.crearGastoGeneral(gasto).pipe(
            map(dto => ({ ...dto, idGastoGeneral: dto.id })),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarGastoGeneral(id: number, gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta & { idGastoGeneral: number }>;
    actualizarGastoGeneral(gastoConId: { idGastoGeneral: number; categoria: string; descripcion: string; monto: number }): Observable<GastoGeneralDTORespuesta & { idGastoGeneral: number }>;
    actualizarGastoGeneral(
        idOrGasto: number | { idGastoGeneral: number; categoria: string; descripcion: string; monto: number },
        gasto?: GastoGeneralDTOPeticion
    ): Observable<GastoGeneralDTORespuesta & { idGastoGeneral: number }> {
        this._loading.next(true);
        this._error.next(null);
        let id: number;
        let dto: GastoGeneralDTOPeticion;
        if (typeof idOrGasto === 'number') {
            id = idOrGasto;
            dto = gasto!;
        } else {
            id = idOrGasto.idGastoGeneral;
            dto = { categoria: idOrGasto.categoria, descripcion: idOrGasto.descripcion, monto: idOrGasto.monto, idConfiguracionReporteGrupos: 0 };
        }
        return this.apiService.actualizarGastoGeneral(id, dto).pipe(
            map(d => ({ ...d, idGastoGeneral: d.id })),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    eliminarGastoGeneral(id: number): Observable<void> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.eliminarGastoGeneral(id).pipe(
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Métodos legacy que el componente aún llama ────────────────────────

    actualizarPorcentajeParticipacionPrimerSemestre(
        porcentajes: { idGrupo: string; nombreGrupo: string; porcentaje: number }[]
    ): Observable<ReportePorGrupos> {
        const dto: ActualizarParticipacionDTOPeticion = {
            grupoId: 0,
            porcentajeParticipacion: porcentajes[0]?.porcentaje ?? 0
        };
        return this.actualizarParticipacionGrupo(dto);
    }

    actualizarPorcentajeParticipacionSegundoSemestre(
        porcentajes: { idGrupo: string; nombreGrupo: string; porcentaje: number }[]
    ): Observable<ReportePorGrupos> {
        const dto: ActualizarParticipacionDTOPeticion = {
            grupoId: 0,
            porcentajeParticipacion: porcentajes[0]?.porcentaje ?? 0
        };
        return this.actualizarParticipacionGrupo(dto);
    }

    actualizarPorcentajeItems(items: { item1: number; item2: number }): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarItems(items.item1, items.item2).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarPorcentajeImprevistos(valor: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarImprevistos(valor).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarValorVigenciasAnteriores(
        valoresGrupo: { idGrupo: string; nombreGrupo: string; valor: number }[]
    ): Observable<ReportePorGrupos> {
        // No-op: vigencias se actualizan por grupo individualmente desde el componente
        return new Observable<ReportePorGrupos>(obs => {
            if (this._reporteGrupos.value) { obs.next(this._reporteGrupos.value); }
            obs.complete();
        });
    }

    actualizarVigenciasAnterioresGrupo(grupoId: number, valor: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarVigenciasAnterioresGrupo(grupoId, valor).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }
}
