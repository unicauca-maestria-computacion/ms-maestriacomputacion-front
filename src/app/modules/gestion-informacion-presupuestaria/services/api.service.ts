import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendGestionInformacionPresupuestaria } from 'src/app/core/constants/api-url';
import { ConfiguracionReporteFinancieroDTOPeticion } from '../dto/configuracion-reporte-financiero.dto';
import { ProyeccionEstudianteDTOPeticion } from '../dto/proyeccion-estudiante.dto';
import { PeriodoAcademicoDTOPeticion, PeriodoAcademicoDTORespuesta } from '../dto/periodo-academico.dto';
import { ReporteProyeccionEstudiantesDTORespuesta } from '../dto/reporte-proyeccion-estudiantes.dto';
import { ConfiguracionReporteGruposDTORespuesta } from '../dto/configuracion-reporte-grupos.dto';
import { PorcentajeGrupoDTOPeticion } from '../dto/porcentaje-grupo.dto';
import { GastoGeneralDTOPeticion, GastoGeneralDTORespuesta } from '../dto/gasto-general.dto';
import { ItemsDTOPeticion } from '../dto/items.dto';
import { ValorGrupoDTOPeticion } from '../dto/valor-grupo.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionInformacionPresupuestariaApiService {

    constructor(private http: HttpClient) { }

    // Gestionar Reporte Estudiantes
    actualizarConfiguracionProyeccion(config: ConfiguracionReporteFinancieroDTOPeticion): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return this.http.put<ReporteProyeccionEstudiantesDTORespuesta>(backendGestionInformacionPresupuestaria('configuracion-proyeccion'), config);
    }

    actualizarProyeccionEstudiante(proyeccion: ProyeccionEstudianteDTOPeticion): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return this.http.put<ReporteProyeccionEstudiantesDTORespuesta>(backendGestionInformacionPresupuestaria('proyeccion-estudiante'), proyeccion);
    }

    obtenerReporteFinanciero(periodo: PeriodoAcademicoDTOPeticion): Observable<any> {
        return this.http.post<any>(backendGestionInformacionPresupuestaria('reporte-financiero'), periodo);
    }

    obtenerProyeccionEstudiantes(): Observable<ReporteProyeccionEstudiantesDTORespuesta> {
        return this.http.get<ReporteProyeccionEstudiantesDTORespuesta>(backendGestionInformacionPresupuestaria('proyeccion-estudiantes'));
    }

    // Gestionar Reporte por Grupos
    obtenerReporteGrupos(periodo: PeriodoAcademicoDTOPeticion): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.post<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('reporte-grupos'), periodo);
    }

    obtenerPeriodosAcademicos(): Observable<PeriodoAcademicoDTORespuesta[]> {
        return this.http.get<PeriodoAcademicoDTORespuesta[]>(backendGestionInformacionPresupuestaria('periodos-academicos'));
    }

    actualizarPorcentajeParticipacionPrimerSemestre(porcentajes: PorcentajeGrupoDTOPeticion[]): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('porcentaje-participacion-primer-semestre'), porcentajes);
    }

    actualizarPorcentajeParticipacionSegundoSemestre(porcentajes: PorcentajeGrupoDTOPeticion[]): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('porcentaje-participacion-segundo-semestre'), porcentajes);
    }

    actualizarPorcentajeAUIUniversidad(nuevoValor: number): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('porcentaje-aui-universidad'), { nuevoValor });
    }

    actualizarValorExcedentesMaestria(nuevoValor: number): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('valor-excedentes-maestria'), { nuevoValor });
    }

    actualizarGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        return this.http.put<GastoGeneralDTORespuesta>(backendGestionInformacionPresupuestaria('gasto-general'), gasto);
    }

    crearGastoGeneral(gasto: GastoGeneralDTOPeticion): Observable<GastoGeneralDTORespuesta> {
        return this.http.post<GastoGeneralDTORespuesta>(backendGestionInformacionPresupuestaria('gasto-general'), gasto);
    }

    eliminarGastoGeneral(idGastoGeneral: number): Observable<boolean> {
        return this.http.delete<boolean>(backendGestionInformacionPresupuestaria(`gasto-general/${idGastoGeneral}`));
    }

    actualizarPorcentajeItems(items: ItemsDTOPeticion): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('porcentaje-items'), items);
    }

    actualizarPorcentajeImprevistos(nuevoValor: number): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('porcentaje-imprevistos'), { nuevoValor });
    }

    actualizarValorVigenciasAnteriores(valoresGrupo: ValorGrupoDTOPeticion[]): Observable<ConfiguracionReporteGruposDTORespuesta> {
        return this.http.put<ConfiguracionReporteGruposDTORespuesta>(backendGestionInformacionPresupuestaria('valor-vigencias-anteriores'), valoresGrupo);
    }
}
