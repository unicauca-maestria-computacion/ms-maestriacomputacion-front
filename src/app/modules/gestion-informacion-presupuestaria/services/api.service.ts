import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { backendInfoPresupuestaria } from 'src/app/core/constants/api-url';
import { ConfiguracionReporteFinancieroDTOPeticion, ConfiguracionReporteFinancieroDTORespuesta } from '../dto/configuracion-reporte-financiero.dto';
import { ProyeccionEstudianteDTOPeticion, ProyeccionEstudianteDTORespuesta } from '../dto/proyeccion-estudiante.dto';
import { PeriodoAcademicoDto } from '../dto/periodo-financiero.dto';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../dto/reporte-proyeccion-estudiantes.dto';
import { ReporteEstudiantesDTORespuesta } from '../dto/reporte-estudiantes.dto';
import { ConsultaReportePorGruposDTORespuesta } from '../dto/reporte-por-grupos.dto';
import { ActualizarParticipacionDTOPeticion } from '../dto/porcentaje-grupo.dto';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaApiService {

    constructor(private http: HttpClient) { }

    // --- Periodos académicos ---

    obtenerPeriodos(): Observable<PeriodoAcademicoDto[]> {
        return this.http.get<PeriodoAcademicoDto[]>(backendInfoPresupuestaria('periodos'));
    }

    obtenerPeriodosActivos(): Observable<PeriodoAcademicoDto[]> {
        return this.http.get<PeriodoAcademicoDto[]>(backendInfoPresupuestaria('periodos/activos'));
    }

    obtenerPeriodosInactivos(): Observable<PeriodoAcademicoDto[]> {
        return this.http.get<PeriodoAcademicoDto[]>(backendInfoPresupuestaria('periodos/cerrados'));
    }

    obtenerPeriodosActivosYCerrados(): Observable<PeriodoAcademicoDto[]> {
        return this.http.get<PeriodoAcademicoDto[]>(backendInfoPresupuestaria('periodos/activos-y-cerrados'));
    }

    obtenerPeriodoProyeccion(): Observable<PeriodoAcademicoDto> {
        return this.http.get<PeriodoAcademicoDto>(backendInfoPresupuestaria('periodos/proyeccion'));
    }

    // --- Proyección de estudiantes ---

    obtenerProyeccionEstudiantes(tagPeriodo?: number, anio?: number): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        let params = new HttpParams();
        if (tagPeriodo != null) params = params.set('tagPeriodo', tagPeriodo.toString());
        if (anio != null) params = params.set('anio', anio.toString());
        return this.http.get<ReporteProyeccionEstudiantesDTORespuesta>(
            backendInfoPresupuestaria('proyeccion-estudiantes'), { params }
        );
    }

    actualizarProyeccionEstudiante(dto: ProyeccionEstudianteDTOPeticion, tagPeriodo?: number, anio?: number): Observable<ProyeccionEstudianteDTORespuesta> {
        let params = new HttpParams();
        if (tagPeriodo != null) params = params.set('tagPeriodo', tagPeriodo.toString());
        if (anio != null) params = params.set('anio', anio.toString());
        return this.http.put<ProyeccionEstudianteDTORespuesta>(
            backendInfoPresupuestaria('proyeccion-estudiantes'), dto, { params }
        );
    }

    // --- Reporte financiero ---

    obtenerReporteFinanciero(tagPeriodo: number, anio: number): Observable<ReporteEstudiantesDTORespuesta> {
        const params = new HttpParams()
            .set('tagPeriodo', tagPeriodo.toString())
            .set('anio', anio.toString());
        return this.http.get<ReporteEstudiantesDTORespuesta>(
            backendInfoPresupuestaria('reporte-financiero'), { params }
        );
    }

    // --- Configuración reporte financiero (flujo de dos pasos) ---

    actualizarConfiguracionReporteFinanciero(
        config: ConfiguracionReporteFinancieroDTOPeticion,
        tagPeriodo: number,
        anio: number
    ): Observable<ConfiguracionReporteFinancieroDTORespuesta> {
        const params = new HttpParams()
            .set('tagPeriodo', tagPeriodo.toString())
            .set('anio', anio.toString());
        // El backend retorna el id directamente como número (Long), no como objeto
        return this.http.get<number>(
            backendInfoPresupuestaria('configuracion-reporte-financiero/periodo'), { params }
        ).pipe(
            switchMap((id: number) =>
                this.http.put<ConfiguracionReporteFinancieroDTORespuesta>(
                    backendInfoPresupuestaria(`configuracion-reporte-financiero/${id}`), config
                )
            )
        );
    }

    // --- Reporte por grupos ---

    obtenerReportePorGrupos(anio: number): Observable<ConsultaReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('anio', anio.toString());
        return this.http.get<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos'), { params }
        );
    }

    actualizarParticipacionGrupo(dto: ActualizarParticipacionDTOPeticion): Observable<ConsultaReportePorGruposDTORespuesta> {
        return this.http.put<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/participacion'), dto
        );
    }

    actualizarPorcentajeAUI(periodoAcademicoId: number, porcentaje: number): Observable<ConsultaReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('periodoAcademicoId', periodoAcademicoId.toString())
            .set('porcentaje', porcentaje.toString());
        return this.http.put<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/aui'), null, { params }
        );
    }

    actualizarExcedentesMaestria(periodoAcademicoId: number, valor: number): Observable<ConsultaReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('periodoAcademicoId', periodoAcademicoId.toString())
            .set('valor', valor.toString());
        return this.http.put<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/excedentes'), null, { params }
        );
    }

    actualizarVigenciasAnterioresGrupo(periodoAcademicoId: number, grupoId: number, valor: number): Observable<ConsultaReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('periodoAcademicoId', periodoAcademicoId.toString())
            .set('grupoId', grupoId.toString())
            .set('valor', valor.toString());
        return this.http.put<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/vigencias'), null, { params }
        );
    }

    actualizarItems(periodoAcademicoId: number, item1: number, item2: number): Observable<ConsultaReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('periodoAcademicoId', periodoAcademicoId.toString())
            .set('item1', item1.toString())
            .set('item2', item2.toString());
        return this.http.put<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/items'), null, { params }
        );
    }

    actualizarImprevistos(periodoAcademicoId: number, porcentaje: number): Observable<ConsultaReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('periodoAcademicoId', periodoAcademicoId.toString())
            .set('porcentaje', porcentaje.toString());
        return this.http.put<ConsultaReportePorGruposDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/imprevistos'), null, { params }
        );
    }

    // --- Gastos generales ---

    crearGastoGeneral(periodoAcademicoId: number, dto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        const params = new HttpParams().set('periodoAcademicoId', periodoAcademicoId.toString());
        return this.http.post<GastoGeneralDTORespuesta>(
            backendInfoPresupuestaria('reporte-por-grupos/gastos'), dto, { params }
        );
    }

    actualizarGastoGeneral(id: number, periodoAcademicoId: number, dto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        const params = new HttpParams().set('periodoAcademicoId', periodoAcademicoId.toString());
        return this.http.put<GastoGeneralDTORespuesta>(
            backendInfoPresupuestaria(`reporte-por-grupos/gastos/${id}`), dto, { params }
        );
    }

    eliminarGastoGeneral(id: number, periodoAcademicoId: number): Observable<void> {
        const params = new HttpParams().set('periodoAcademicoId', periodoAcademicoId.toString());
        return this.http.delete<void>(
            backendInfoPresupuestaria(`reporte-por-grupos/gastos/${id}`), { params }
        );
    }
}
