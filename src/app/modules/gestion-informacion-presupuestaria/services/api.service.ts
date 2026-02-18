import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    backendReportesEstudiantes,
    backendReportesGrupos,
    backendPeriodosAcademicos
} from 'src/app/core/constants/api-url';
import { ConfiguracionReporteFinancieroDTOPeticion, ConfiguracionReporteFinancieroDTORespuesta } from '../dto/configuracion-reporte-financiero.dto';
import { ProyeccionEstudianteDTOPeticion } from '../dto/proyeccion-estudiante.dto';
import { PeriodoAcademicoDTORespuesta } from '../dto/periodo-academico.dto';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../dto/reporte-proyeccion-estudiantes.dto';
import { ReporteEstudiantesDTORespuesta } from '../dto/reporte-estudiantes.dto';
import { ReportePorGruposDTORespuesta } from '../dto/reporte-por-grupos.dto';
import { PorcentajeGrupoDTOPeticion } from '../dto/porcentaje-grupo.dto';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';
import { ItemsDTOPeticion } from '../dto/items.dto';
import { ValorGrupoDTOPeticion } from '../dto/valor-grupo.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaApiService {

    constructor(private http: HttpClient) { }

    // --- Gestionar Reporte Estudiantes ---

    actualizarConfiguracionProyeccion(config: ConfiguracionReporteFinancieroDTOPeticion): Observable<ConfiguracionReporteFinancieroDTORespuesta> {
        return this.http.put<ConfiguracionReporteFinancieroDTORespuesta>(
            backendReportesEstudiantes('configuracion-proyeccion'), config
        );
    }

    actualizarProyeccionEstudiante(proyeccion: ProyeccionEstudianteDTOPeticion): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return this.http.put<ReporteProyeccionEstudiantesDTORespuesta>(
            backendReportesEstudiantes('proyeccion-estudiante'), proyeccion
        );
    }

    obtenerReporteFinanciero(periodo: number, anio: number): Observable<ReporteEstudiantesDTORespuesta> {
        const params = new HttpParams()
            .set('periodo', periodo.toString())
            .set('anio', anio.toString());
        return this.http.get<ReporteEstudiantesDTORespuesta>(
            backendReportesEstudiantes('financiero'), { params }
        );
    }

    obtenerProyeccionEstudiantes(): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return this.http.get<ReporteProyeccionEstudiantesDTORespuesta>(
            backendReportesEstudiantes('proyeccion')
        );
    }

    obtenerPeriodosAcademicos(): Observable<PeriodoAcademicoDTORespuesta[]> {
        return this.http.get<PeriodoAcademicoDTORespuesta[]>(backendPeriodosAcademicos());
    }

    // --- Gestionar Reporte por Grupos ---

    obtenerReporteGrupos(periodo: number, anio: number): Observable<ReportePorGruposDTORespuesta> {
        const params = new HttpParams()
            .set('periodo', periodo.toString())
            .set('anio', anio.toString());
        return this.http.get<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('obtener'), { params }
        );
    }

    actualizarPorcentajeParticipacionPrimerSemestre(porcentajes: PorcentajeGrupoDTOPeticion[]): Observable<ReportePorGruposDTORespuesta> {
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-porcentaje-primer-semestre'), porcentajes
        );
    }

    actualizarPorcentajeParticipacionSegundoSemestre(porcentajes: PorcentajeGrupoDTOPeticion[]): Observable<ReportePorGruposDTORespuesta> {
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-porcentaje-segundo-semestre'), porcentajes
        );
    }

    actualizarPorcentajeAUIUniversidad(nuevoValor: number): Observable<ReportePorGruposDTORespuesta> {
        const params = new HttpParams().set('nuevoValor', nuevoValor.toString());
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-porcentaje-aui'), null, { params }
        );
    }

    actualizarValorExcedentesMaestria(nuevoValor: number): Observable<ReportePorGruposDTORespuesta> {
        const params = new HttpParams().set('nuevoValor', nuevoValor.toString());
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-excedentes-maestria'), null, { params }
        );
    }

    actualizarGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        return this.http.put<GastoGeneralDTORespuesta>(
            backendReportesGrupos('actualizar-gasto-general'), gasto
        );
    }

    crearGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        return this.http.post<GastoGeneralDTORespuesta>(
            backendReportesGrupos('crear-gasto-general'), gasto
        );
    }

    eliminarGastoGeneral(idGastoGeneral: number): Observable<boolean> {
        return this.http.delete<boolean>(
            backendReportesGrupos('eliminar-gasto-general/' + idGastoGeneral)
        );
    }

    actualizarPorcentajeItems(items: ItemsDTOPeticion): Observable<ReportePorGruposDTORespuesta> {
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-porcentaje-items'), items
        );
    }

    actualizarPorcentajeImprevistos(nuevoValor: number): Observable<ReportePorGruposDTORespuesta> {
        const params = new HttpParams().set('nuevoValor', nuevoValor.toString());
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-porcentaje-imprevistos'), null, { params }
        );
    }

    actualizarValorVigenciasAnteriores(valoresGrupo: ValorGrupoDTOPeticion[]): Observable<ReportePorGruposDTORespuesta> {
        return this.http.put<ReportePorGruposDTORespuesta>(
            backendReportesGrupos('actualizar-vigencias-anteriores'), valoresGrupo
        );
    }
}
