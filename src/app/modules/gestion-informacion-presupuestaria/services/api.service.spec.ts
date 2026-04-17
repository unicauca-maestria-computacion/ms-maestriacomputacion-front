import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GestionInformacionPresupuestariaApiService } from './api.service';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.gestion_informacion_presupuestaria.api_url;

describe('GestionInformacionPresupuestariaApiService', () => {
    let service: GestionInformacionPresupuestariaApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(GestionInformacionPresupuestariaApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    // --- 8.1 Verificación de URLs y métodos HTTP ---

    it('obtenerPeriodos debe hacer GET a /api/periodos', () => {
        service.obtenerPeriodos().subscribe();
        const req = httpMock.expectOne(`${BASE_URL}periodos`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('obtenerPeriodoProyeccion debe hacer GET a /api/periodos/proyeccion', () => {
        service.obtenerPeriodoProyeccion().subscribe();
        const req = httpMock.expectOne(`${BASE_URL}periodos/proyeccion`);
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('obtenerProyeccionEstudiantes debe hacer GET a /api/proyeccion-estudiantes', () => {
        service.obtenerProyeccionEstudiantes().subscribe();
        const req = httpMock.expectOne(`${BASE_URL}proyeccion-estudiantes`);
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('actualizarProyeccionEstudiante debe hacer PUT a /api/proyeccion-estudiantes', () => {
        const dto = {
            codigoEstudiante: 'EST001',
            estaPago: true,
            porcentajeVotacion: 0,
            porcentajeBeca: 0,
            porcentajeEgresado: 0,
            grupoInvestigacion: 'GTI',
            estadoProyeccion: 'ACTIVO'
        };
        service.actualizarProyeccionEstudiante(dto).subscribe();
        const req = httpMock.expectOne(`${BASE_URL}proyeccion-estudiantes`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('obtenerReporteFinanciero debe hacer GET con tagPeriodo y anio como query params', () => {
        service.obtenerReporteFinanciero(1, 2024).subscribe();
        const req = httpMock.expectOne(r =>
            r.url === `${BASE_URL}reporte-financiero` &&
            r.params.get('tagPeriodo') === '1' &&
            r.params.get('anio') === '2024'
        );
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('obtenerReportePorGrupos debe hacer GET con tagPeriodo y anio como query params', () => {
        service.obtenerReportePorGrupos(2, 2024).subscribe();
        const req = httpMock.expectOne(r =>
            r.url === `${BASE_URL}reporte-por-grupos` &&
            r.params.get('tagPeriodo') === '2' &&
            r.params.get('anio') === '2024'
        );
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('actualizarParticipacionGrupo debe hacer PUT a /api/reporte-por-grupos/participacion', () => {
        const dto = { grupoId: 1, porcentajeParticipacion: 0.33 };
        service.actualizarParticipacionGrupo(dto).subscribe();
        const req = httpMock.expectOne(`${BASE_URL}reporte-por-grupos/participacion`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('actualizarPorcentajeAUI debe hacer PUT con query param porcentaje', () => {
        service.actualizarPorcentajeAUI(0.15).subscribe();
        const req = httpMock.expectOne(r =>
            r.url === `${BASE_URL}reporte-por-grupos/aui` &&
            r.params.get('porcentaje') === '0.15'
        );
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('actualizarExcedentesMaestria debe hacer PUT con query param valor', () => {
        service.actualizarExcedentesMaestria(5000000).subscribe();
        const req = httpMock.expectOne(r =>
            r.url === `${BASE_URL}reporte-por-grupos/excedentes` &&
            r.params.get('valor') === '5000000'
        );
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('crearGastoGeneral debe hacer POST a /api/reporte-por-grupos/gastos', () => {
        const dto = { categoria: 'PAPELERIA', descripcion: 'Resmas', monto: 50000, idConfiguracionReporteGrupos: 1 };
        service.crearGastoGeneral(dto).subscribe();
        const req = httpMock.expectOne(`${BASE_URL}reporte-por-grupos/gastos`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('actualizarGastoGeneral debe hacer PUT a /api/reporte-por-grupos/gastos/{id}', () => {
        const dto = { categoria: 'PAPELERIA', descripcion: 'Resmas', monto: 60000, idConfiguracionReporteGrupos: 1 };
        service.actualizarGastoGeneral(5, dto).subscribe();
        const req = httpMock.expectOne(`${BASE_URL}reporte-por-grupos/gastos/5`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('eliminarGastoGeneral debe hacer DELETE a /api/reporte-por-grupos/gastos/{id}', () => {
        service.eliminarGastoGeneral(3).subscribe();
        const req = httpMock.expectOne(`${BASE_URL}reporte-por-grupos/gastos/3`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    // --- 8.2 Flujo de dos pasos para actualización de configuración ---

    it('actualizarConfiguracionReporteFinanciero debe hacer GET primero y luego PUT con el id obtenido', () => {
        const config = { biblioteca: 100, recursosComputacionales: 200, valorSMLV: 1300000, esReporteFinal: false };
        service.actualizarConfiguracionReporteFinanciero(config, 1, 2024).subscribe();

        // Primer paso: GET para obtener el id
        const getReq = httpMock.expectOne(r =>
            r.url === `${BASE_URL}configuracion-reporte-financiero/periodo` &&
            r.params.get('tagPeriodo') === '1' &&
            r.params.get('anio') === '2024'
        );
        expect(getReq.request.method).toBe('GET');
        getReq.flush({ id: 42, biblioteca: 100, recursosComputacionales: 200, valorSMLV: 1300000, esReporteFinal: false, periodo: {} });

        // Segundo paso: PUT con el id obtenido
        const putReq = httpMock.expectOne(`${BASE_URL}configuracion-reporte-financiero/42`);
        expect(putReq.request.method).toBe('PUT');
        putReq.flush({});
    });

    it('actualizarConfiguracionReporteFinanciero no debe ejecutar PUT si el GET falla con 404', () => {
        const config = { biblioteca: 100, recursosComputacionales: 200, valorSMLV: 1300000, esReporteFinal: false };
        let errorReceived = false;

        service.actualizarConfiguracionReporteFinanciero(config, 1, 2024).subscribe({
            error: () => { errorReceived = true; }
        });

        const getReq = httpMock.expectOne(r =>
            r.url === `${BASE_URL}configuracion-reporte-financiero/periodo`
        );
        getReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

        httpMock.expectNone(`${BASE_URL}configuracion-reporte-financiero/42`);
        expect(errorReceived).toBeTrue();
    });

    // --- 8.3 Propagación de errores ---

    it('obtenerPeriodos debe propagar error HTTP 404', () => {
        let errorReceived = false;
        service.obtenerPeriodos().subscribe({ error: () => { errorReceived = true; } });
        const req = httpMock.expectOne(`${BASE_URL}periodos`);
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        expect(errorReceived).toBeTrue();
    });

    it('actualizarProyeccionEstudiante debe propagar error HTTP 400', () => {
        let errorReceived = false;
        const dto = {
            codigoEstudiante: 'EST001',
            estaPago: true,
            porcentajeVotacion: 0,
            porcentajeBeca: 0,
            porcentajeEgresado: 0,
            grupoInvestigacion: 'GTI',
            estadoProyeccion: 'ACTIVO'
        };
        service.actualizarProyeccionEstudiante(dto).subscribe({ error: () => { errorReceived = true; } });
        const req = httpMock.expectOne(`${BASE_URL}proyeccion-estudiantes`);
        req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
        expect(errorReceived).toBeTrue();
    });

    it('obtenerReporteFinanciero debe propagar error HTTP 500', () => {
        let errorReceived = false;
        service.obtenerReporteFinanciero(1, 2024).subscribe({ error: () => { errorReceived = true; } });
        const req = httpMock.expectOne(r => r.url === `${BASE_URL}reporte-financiero`);
        req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
        expect(errorReceived).toBeTrue();
    });
});
