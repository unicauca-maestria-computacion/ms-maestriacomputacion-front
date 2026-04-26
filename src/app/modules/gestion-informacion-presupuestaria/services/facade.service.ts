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
            map(periodos => {
                console.log('[Facade] Periodos cerrados raw:', periodos);
                return (periodos || []).map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo }));
            }),
            catchError(err => {
                console.error('[Facade] Error cargando periodos cerrados:', err);
                const msg = 'No se pudieron cargar los períodos académicos finalizados.';
                this._error.next({
                    mensaje: msg,
                    codigoError: 'FE-PERIODOS-CERRADOS',
                    codigoHttp: err.status || 500,
                    url: err.url || '',
                    metodo: 'GET'
                });
                return throwError(() => err);
            }),
            finalize(() => this._loading.next(false))
        );
    }

    obtenerPeriodosActivosYCerrados(): Observable<PeriodoAcademicoDto[]> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodosActivosYCerrados().pipe(
            map(periodos => {
                console.log('[Facade] Periodos activos/cerrados raw:', periodos);
                return (periodos || []).map(p => ({ ...p, año: p.anio, periodo: p.tagPeriodo }));
            }),
            catchError(err => {
                console.error('[Facade] Error cargando periodos activos/cerrados:', err);
                const msg = 'No se pudieron cargar los períodos académicos.';
                this._error.next({
                    mensaje: msg,
                    codigoError: 'FE-PERIODOS-ACT-CERR',
                    codigoHttp: err.status || 500,
                    url: err.url || '',
                    metodo: 'GET'
                });
                return throwError(() => err);
            }),
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

    actualizarProyeccionEstudiante(proyeccion: ProyeccionEstudianteDTOPeticion, tagPeriodo?: number, anio?: number): Observable<ReporteProyeccionEstudiantes> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarProyeccionEstudiante(proyeccion, tagPeriodo, anio).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto)),
            tap(data => this._reporteProyeccionEstudiantes.next(data)),
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

    actualizarConfiguracionProyeccion(config: ConfiguracionReporteFinancieroDTOPeticion): Observable<ReporteProyeccionEstudiantes> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.obtenerPeriodoProyeccion().pipe(
            switchMap(periodo =>
                this.apiService.actualizarConfiguracionReporteFinanciero(config, periodo.tagPeriodo, periodo.anio)
            ),
            map(dto => this.mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto)),
            tap(data => this._reporteProyeccionEstudiantes.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarConfiguracionReporteFinanciero(
        config: ConfiguracionReporteFinancieroDTOPeticion,
        tagPeriodo: number,
        anio: number
    ): Observable<ReporteProyeccionEstudiantes> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarConfiguracionReporteFinanciero(config, tagPeriodo, anio).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReporteProyeccionEstudiantes(dto)),
            tap(data => this._reporteProyeccionEstudiantes.next(data)),
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

    actualizarPorcentajeAUIUniversidad(periodoAcademicoId: number, porcentaje: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarPorcentajeAUI(periodoAcademicoId, porcentaje).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarValorExcedentesMaestria(periodoAcademicoId: number, valor: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarExcedentesMaestria(periodoAcademicoId, valor).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Gastos generales ──────────────────────────────────────────────────

    crearGastoGeneral(periodoAcademicoId: number, gasto: GastoGeneralDTOPeticion): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.crearGastoGeneral(periodoAcademicoId, gasto).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarGastoGeneral(id: number, periodoAcademicoId: number, gasto: GastoGeneralDTOPeticion): Observable<ReportePorGrupos>;
    actualizarGastoGeneral(gastoConId: { idGastoGeneral: number; periodoAcademicoId: number; categoria: string; descripcion: string; monto: number }): Observable<ReportePorGrupos>;
    actualizarGastoGeneral(
        idOrGasto: number | { idGastoGeneral: number; periodoAcademicoId: number; categoria: string; descripcion: string; monto: number },
        periodoAcademicoIdOrGasto?: number,
        gasto?: GastoGeneralDTOPeticion
    ): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        let id: number;
        let periodoId: number;
        let dto: GastoGeneralDTOPeticion;
        if (typeof idOrGasto === 'number') {
            id = idOrGasto;
            periodoId = periodoAcademicoIdOrGasto!;
            dto = gasto!;
        } else {
            id = idOrGasto.idGastoGeneral;
            periodoId = idOrGasto.periodoAcademicoId;
            dto = { categoria: idOrGasto.categoria, descripcion: idOrGasto.descripcion, monto: idOrGasto.monto, idConfiguracionReporteGrupos: 0 };
        }
        return this.apiService.actualizarGastoGeneral(id, periodoId, dto).pipe(
            map(d => this.mapper.mappearDeRespuestaAReportePorGrupos(d)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    eliminarGastoGeneral(id: number, periodoAcademicoId: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.eliminarGastoGeneral(id, periodoAcademicoId).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    // ── Métodos legacy que el componente aún llama ────────────────────────

    actualizarPorcentajeParticipacionPrimerSemestre(
        porcentajes: { idGrupo: string; nombreGrupo: string; porcentaje: number }[]
    ): Observable<ReportePorGrupos> {
        const dto: ActualizarParticipacionDTOPeticion = {
            periodoAcademicoId: 0,
            grupoId: 0,
            porcentajeParticipacion: porcentajes[0]?.porcentaje ?? 0
        };
        return this.actualizarParticipacionGrupo(dto);
    }

    actualizarPorcentajeParticipacionSegundoSemestre(
        porcentajes: { idGrupo: string; nombreGrupo: string; porcentaje: number }[]
    ): Observable<ReportePorGrupos> {
        const dto: ActualizarParticipacionDTOPeticion = {
            periodoAcademicoId: 0,
            grupoId: 0,
            porcentajeParticipacion: porcentajes[0]?.porcentaje ?? 0
        };
        return this.actualizarParticipacionGrupo(dto);
    }

    actualizarPorcentajeItems(items: { item1: number; item2: number }, periodoAcademicoId: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarItems(periodoAcademicoId, items.item1, items.item2).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }

    actualizarPorcentajeImprevistos(periodoAcademicoId: number, valor: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarImprevistos(periodoAcademicoId, valor).pipe(
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

    actualizarVigenciasAnterioresGrupo(periodoAcademicoId: number, grupoId: number, valor: number): Observable<ReportePorGrupos> {
        this._loading.next(true);
        this._error.next(null);
        return this.apiService.actualizarVigenciasAnterioresGrupo(periodoAcademicoId, grupoId, valor).pipe(
            map(dto => this.mapper.mappearDeRespuestaAReportePorGrupos(dto)),
            tap(data => this._reporteGrupos.next(data)),
            catchError(err => { this._error.next(err); return throwError(() => err); }),
            finalize(() => this._loading.next(false))
        );
    }
}
