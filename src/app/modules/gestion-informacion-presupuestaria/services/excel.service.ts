import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
    ConfiguracionReporteFinanciero,
    ReportePorGrupos,
    ProyeccionEstudiante,
    ReporteEstudiantes,
    ReporteProyeccionEstudiantes,
    PeriodoAcademico,
    ReportePorGrupoFila
} from '../models/domain-models';

// ─── Paleta de colores institucionales ───────────────────────────────────────
const COLOR = {
    AZUL_HEADER:    'FF1565C0',   // azul oscuro universitario
    AZUL_SECCION:   'FF1976D2',   // azul medio secciones
    VERDE_EXITO:    'FF2E7D32',   // verde "Pagado"
    ROJO_PENDIENTE: 'FFEF9A9A',   // rojo claro "Pendiente"
    VERDE_CLARO:    'FFA5D6A7',   // verde claro fondo "Pagado"
    AMARILLO_TOTAL: 'FFFFF9C4',   // amarillo suave fila totales
    AMARILLO_ADV:   'FFF57F17',   // amarillo advertencia
    FILA_ALTERNA:   'FFF5F5F5',   // gris muy claro filas impares
    BLANCO:         'FFFFFFFF',
    GRIS_BORDE:     'FFE0E0E0',
    GRIS_TEXTO:     'FF424242',
    AZUL_KPI_BG:    'FFE3F2FD',   // fondo celdas KPI
    AZUL_KPI_LABEL: 'FF1565C0',
};

type RgbColor = { argb: string };

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    // ═══════════════════════════════════════════════════════════════════════
    //  REPORTE FINAL
    // ═══════════════════════════════════════════════════════════════════════

    generarExcelReporteFinal(data: ReporteEstudiantes): void {
        if (!data?.estudiantes?.length) {
            console.warn('generarExcelReporteFinal: no hay datos de estudiantes para exportar.');
            return;
        }
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema Maestría en Computación';
        workbook.created = new Date();

        const periodo = data.periodo;
        const config = data.objConfiguracion;

        this._crearHojaResumenEjecutivo(workbook, periodo, config, data.estudiantes, false);
        this._crearHojaEstudiantes(workbook, data.estudiantes, config, false);
        this._crearHojaAnalisisDescuentos(workbook, data.estudiantes, config);
        this._crearHojaDatosGraficas(workbook, data.estudiantes);

        const nombreArchivo = `Reporte_Final_${periodo.año}-${periodo.periodo}.xlsx`;
        this._guardarWorkbook(workbook, nombreArchivo);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PROYECCIÓN DE REPORTE
    // ═══════════════════════════════════════════════════════════════════════

    generarExcelProyeccionReporte(data: ReporteProyeccionEstudiantes): void {
        if (!data?.estudiantes?.length) {
            console.warn('generarExcelProyeccionReporte: no hay datos para exportar.');
            return;
        }
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema Maestría en Computación';
        workbook.created = new Date();

        const periodo = data.periodo;
        const config = data.objConfiguracion;

        this._crearHojaResumenEjecutivo(workbook, periodo, config, data.estudiantes, true);
        this._crearHojaEstudiantes(workbook, data.estudiantes, config, true);
        this._crearHojaAnalisisDescuentos(workbook, data.estudiantes, config);

        const nombreArchivo = `Proyeccion_Reporte_${periodo.año}-${periodo.periodo}.xlsx`;
        this._guardarWorkbook(workbook, nombreArchivo);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  REPORTE POR GRUPOS
    // ═══════════════════════════════════════════════════════════════════════

    generarExcelReportePorGrupos(data: ReportePorGrupos): void {
        if (!data?.objConfiguracionReporteGrupos) {
            console.warn('generarExcelReportePorGrupos: no hay datos de grupos para exportar.');
            return;
        }
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema Maestría en Computación';
        workbook.created = new Date();

        const config = data.objConfiguracionReporteGrupos;
        const periodo = config.objPeriodoAcademico;

        this._crearHojaResumenGeneral(workbook, data);
        this._crearHojaDistribucionFinanciera(workbook, data);
        this._crearHojaGastosGenerales(workbook, data);
        this._crearHojaItemsPresupuesto(workbook, config, periodo);

        const nombreArchivo = `Reporte_Grupos_${periodo.año}-${periodo.periodo}.xlsx`;
        this._guardarWorkbook(workbook, nombreArchivo);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJAS COMPARTIDAS: REPORTE FINAL & PROYECCIÓN
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaResumenEjecutivo(
        wb: ExcelJS.Workbook,
        periodo: PeriodoAcademico,
        config: ConfiguracionReporteFinanciero,
        estudiantes: ProyeccionEstudiante[],
        esProyeccion: boolean
    ): void {
        const titulo = esProyeccion
            ? 'PROYECCIÓN DE INGRESOS - MAESTRÍA EN COMPUTACIÓN'
            : 'REPORTE FINAL DE INGRESOS - MAESTRÍA EN COMPUTACIÓN';
        const ws = wb.addWorksheet('RESUMEN EJECUTIVO');

        ws.columns = [
            { width: 38 },
            { width: 28 },
            { width: 20 },
            { width: 20 },
        ];

        const numCols = 4;
        const lastCol = this._colLetra(numCols);

        // Fila 1: Título principal
        this._agregarTitulo(ws, 1, titulo, numCols, 35, COLOR.AZUL_HEADER, 16);

        // Fila 2: Subtítulo período
        this._agregarSubtitulo(ws, 2, `Período Académico ${periodo.año}-${periodo.periodo}`, numCols, 25);

        // Fila 3: separador
        ws.addRow([]);
        ws.getRow(3).height = 8;

        // ── Sección CONFIGURACIÓN FINANCIERA ─────────────────────────────
        this._agregarEncabezadoSeccion(ws, 'CONFIGURACIÓN FINANCIERA', numCols);

        const configRows: [string, string | number][] = [
            ['Valor Matrícula (SMLV)',        `${config.valorMatricula} SMLV`],
            ['Valor SMLV',                    this._formatCurrency(config.valorSMLV)],
            ['Recursos Computacionales',      this._formatCurrency(config.recursosComputacionales)],
            ['Biblioteca',                    this._formatCurrency(config.biblioteca)],
        ];

        configRows.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
        });

        ws.addRow([]);

        // ── Sección RESUMEN DE INGRESOS (KPIs) ───────────────────────────
        this._agregarEncabezadoSeccion(ws, esProyeccion ? 'RESUMEN PROYECTADO' : 'RESUMEN DE INGRESOS', numCols);

        const kpiRows: [string, number][] = [
            ['Total Ingresos Brutos',  config.totalIngresos],
            ['Total Descuentos',       config.totalDescuentos],
            ['Total Neto',             config.totalNeto],
        ];

        kpiRows.forEach(([label, value]) => {
            const row = ws.addRow([label, this._formatCurrency(value)]);
            this._estilizarFilaKPI(row);
        });

        ws.addRow([]);

        // ── Sección ESTADÍSTICAS DE ESTUDIANTES ──────────────────────────
        this._agregarEncabezadoSeccion(ws, 'ESTADÍSTICAS DE ESTUDIANTES', numCols);

        const totalEst    = estudiantes.length;
        const pagados     = estudiantes.filter(e => e.estaPago).length;
        const pendientes  = totalEst - pagados;
        const pctCumplimiento = totalEst > 0 ? ((pagados / totalEst) * 100).toFixed(1) : '0.0';

        const estRows: [string, string | number][] = [
            ['Total Estudiantes',      totalEst],
            ['Estudiantes Pagados',    pagados],
            ['Estudiantes Pendientes', pendientes],
            ['% Cumplimiento',         `${pctCumplimiento}%`],
        ];

        estRows.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
            if (label === 'Estudiantes Pagados') {
                row.getCell(2).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.VERDE_EXITO } };
            }
            if (label === 'Estudiantes Pendientes') {
                row.getCell(2).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFEF5350' } };
            }
        });

        // Bordes a toda la hoja
        this._aplicarBordesHoja(ws);
    }

    private _crearHojaEstudiantes(
        wb: ExcelJS.Workbook,
        estudiantes: ProyeccionEstudiante[],
        config: ConfiguracionReporteFinanciero,
        esProyeccion: boolean
    ): void {
        const nombreHoja = esProyeccion ? 'PROYECCIÓN ESTUDIANTES' : 'ESTUDIANTES';
        const ws = wb.addWorksheet(nombreHoja);

        const headersCols = esProyeccion
            ? [
                { header: 'Código',              key: 'codigo',      width: 14 },
                { header: 'Identificación',       key: 'ident',       width: 18 },
                { header: 'Nombre Completo',      key: 'nombre',      width: 30 },
                { header: 'Grupo Investigación',  key: 'grupo',       width: 24 },
                { header: '% Votación',           key: 'votacion',    width: 13 },
                { header: '% Beca',               key: 'beca',        width: 12 },
                { header: '% Egresado',           key: 'egresado',    width: 13 },
                { header: 'Total Descuento',      key: 'descTotal',   width: 17 },
                { header: 'Estado Pago',          key: 'estado',      width: 14 },
                { header: 'Valor Matrícula Proyectado', key: 'valorProy', width: 24 },
            ]
            : [
                { header: 'Código',              key: 'codigo',      width: 14 },
                { header: 'Identificación',       key: 'ident',       width: 18 },
                { header: 'Nombre Completo',      key: 'nombre',      width: 30 },
                { header: 'Grupo Investigación',  key: 'grupo',       width: 24 },
                { header: '% Votación',           key: 'votacion',    width: 13 },
                { header: '% Beca',               key: 'beca',        width: 12 },
                { header: '% Egresado',           key: 'egresado',    width: 13 },
                { header: 'Total Descuento',      key: 'descTotal',   width: 17 },
                { header: 'Estado Pago',          key: 'estado',      width: 14 },
            ];

        const numCols = headersCols.length;
        const lastCol = this._colLetra(numCols);
        const titulo = esProyeccion ? 'PROYECCIÓN DE ESTUDIANTES' : 'LISTADO DE ESTUDIANTES';

        ws.columns = headersCols;

        // Filas título y subtítulo (insertar antes de los datos)
        ws.spliceRows(1, 0, [], [], []);

        this._agregarTitulo(ws, 1, titulo, numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, 'Datos detallados por estudiante', numCols, 25);
        ws.getRow(3).height = 8;

        // Fila 4: headers de tabla
        const headerRow = ws.getRow(4);
        headersCols.forEach((col, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = col.header;
            this._estilizarCeldaHeader(cell);
        });
        headerRow.height = 22;
        ws.autoFilter = `A4:${lastCol}4`;

        // Filas de datos (empiezan en fila 5)
        let pagados = 0;
        let pendientes = 0;

        estudiantes.forEach((est, idx) => {
            const totalDesc = est.porcentajeVotacion + est.porcentajeBeca + est.porcentajeEgresado;
            const valorProy = esProyeccion
                ? config.valorMatricula * config.valorSMLV * (1 - totalDesc)
                : null;

            const rowValues: any[] = [
                est.codigoEstudiante,
                est.identificacion,
                `${est.nombre} ${est.apellido}`,
                est.grupoInvestigacion,
                `${(est.porcentajeVotacion * 100).toFixed(0)}%`,
                `${(est.porcentajeBeca * 100).toFixed(0)}%`,
                `${(est.porcentajeEgresado * 100).toFixed(0)}%`,
                `${(totalDesc * 100).toFixed(0)}%`,
                est.estaPago ? 'Pagado' : 'Pendiente',
            ];
            if (esProyeccion && valorProy !== null) {
                rowValues.push(this._formatCurrency(valorProy));
            }

            const dataRow = ws.addRow(rowValues);
            const rowNum = idx + 5;
            const bgColor = idx % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
            this._estilizarFilaDatosCompleta(dataRow, bgColor, numCols);

            // Colorear celda de estado
            const estadoCell = dataRow.getCell(9);
            if (est.estaPago) {
                estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.VERDE_CLARO } };
                estadoCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.VERDE_EXITO } };
                pagados++;
            } else {
                estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.ROJO_PENDIENTE } };
                estadoCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFC62828' } };
                pendientes++;
            }
        });

        // Fila de totales
        const totalRowValues = [
            'TOTALES', '', '', '', '', '', '', '',
            `Pagados: ${pagados} | Pendientes: ${pendientes}`,
        ];
        if (esProyeccion) totalRowValues.push('');
        const totalRow = ws.addRow(totalRowValues);
        this._estilizarFilaTotales(totalRow, numCols);

        // Freeze panes: congelar hasta fila 4 (headers)
        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    private _crearHojaAnalisisDescuentos(
        wb: ExcelJS.Workbook,
        estudiantes: ProyeccionEstudiante[],
        config: ConfiguracionReporteFinanciero
    ): void {
        const ws = wb.addWorksheet('ANÁLISIS DESCUENTOS');
        const numCols = 5;
        const lastCol = this._colLetra(numCols);

        ws.columns = [
            { width: 30 },
            { width: 18 },
            { width: 18 },
            { width: 22 },
            { width: 22 },
        ];

        this._agregarTitulo(ws, 1, 'ANÁLISIS DE DESCUENTOS POR TIPO', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, 'Distribución e impacto económico de descuentos', numCols, 25);
        ws.getRow(3).height = 8;

        // Headers
        const headers = ['Tipo de Descuento', 'Cant. Estudiantes', 'Promedio (%)', 'Total Descuento (%)', 'Impacto Económico'];
        const hRow = ws.getRow(4);
        headers.forEach((h, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), h));
        hRow.height = 22;

        const baseMatricula = config.valorMatricula * config.valorSMLV;

        const conBeca      = estudiantes.filter(e => e.porcentajeBeca > 0);
        const conVotacion  = estudiantes.filter(e => e.porcentajeVotacion > 0);
        const conEgresado  = estudiantes.filter(e => e.porcentajeEgresado > 0);

        const promBeca     = conBeca.length     ? conBeca.reduce((s, e) => s + e.porcentajeBeca, 0)      / conBeca.length      : 0;
        const promVotacion = conVotacion.length ? conVotacion.reduce((s, e) => s + e.porcentajeVotacion, 0) / conVotacion.length : 0;
        const promEgresado = conEgresado.length ? conEgresado.reduce((s, e) => s + e.porcentajeEgresado, 0) / conEgresado.length : 0;

        const impactoBeca      = conBeca.reduce((s, e)     => s + e.porcentajeBeca * baseMatricula, 0);
        const impactoVotacion  = conVotacion.reduce((s, e) => s + e.porcentajeVotacion * baseMatricula, 0);
        const impactoEgresado  = conEgresado.reduce((s, e) => s + e.porcentajeEgresado * baseMatricula, 0);

        const dataRows: any[][] = [
            ['Beca Académica',      conBeca.length,     `${(promBeca * 100).toFixed(1)}%`,     `${(promBeca * 100).toFixed(1)}%`,     this._formatCurrency(impactoBeca)],
            ['Descuento Votación',  conVotacion.length, `${(promVotacion * 100).toFixed(1)}%`, `${(promVotacion * 100).toFixed(1)}%`, this._formatCurrency(impactoVotacion)],
            ['Descuento Egresado',  conEgresado.length, `${(promEgresado * 100).toFixed(1)}%`, `${(promEgresado * 100).toFixed(1)}%`, this._formatCurrency(impactoEgresado)],
        ];

        dataRows.forEach((rowData, i) => {
            const row = ws.addRow(rowData);
            const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
            this._estilizarFilaDatosCompleta(row, bg, numCols);
        });

        // Total impacto
        const totalImpacto = impactoBeca + impactoVotacion + impactoEgresado;
        const totalRow = ws.addRow(['TOTAL IMPACTO DESCUENTOS', '', '', '', this._formatCurrency(totalImpacto)]);
        this._estilizarFilaTotales(totalRow, numCols);

        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    private _crearHojaDatosGraficas(
        wb: ExcelJS.Workbook,
        estudiantes: ProyeccionEstudiante[]
    ): void {
        const ws = wb.addWorksheet('DATOS PARA GRÁFICAS');
        const numCols = 3;

        ws.columns = [{ width: 30 }, { width: 18 }, { width: 12 }];

        this._agregarTitulo(ws, 1, 'DATOS PARA GRÁFICAS', numCols, 30, COLOR.AZUL_HEADER, 14);

        const noteRow = ws.getRow(2);
        noteRow.getCell(1).value = 'Use estos datos para crear gráficas en Excel (Insertar > Gráfico)';
        noteRow.getCell(1).font = { name: 'Calibri', size: 10, italic: true, color: { argb: COLOR.AMARILLO_ADV } };
        ws.mergeCells(`A2:C2`);
        noteRow.height = 20;

        ws.getRow(3).height = 8;

        // Gráfica Pagados vs Pendientes
        const hRow = ws.getRow(4);
        ['Categoría', 'Cantidad', '% del Total'].forEach((h, i) => {
            this._estilizarCeldaHeader(hRow.getCell(i + 1), h);
        });
        hRow.height = 22;

        const pagados    = estudiantes.filter(e => e.estaPago).length;
        const pendientes = estudiantes.length - pagados;
        const total      = estudiantes.length;

        const grafData = [
            ['Pagados',    pagados,    total ? `${((pagados / total) * 100).toFixed(1)}%`    : '0%'],
            ['Pendientes', pendientes, total ? `${((pendientes / total) * 100).toFixed(1)}%` : '0%'],
            ['Total',      total,      '100%'],
        ];

        grafData.forEach((rowData, i) => {
            const row = ws.addRow(rowData);
            const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
            this._estilizarFilaDatosCompleta(row, bg, numCols);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJAS: REPORTE POR GRUPOS
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaResumenGeneral(wb: ExcelJS.Workbook, data: ReportePorGrupos): void {
        const ws = wb.addWorksheet('RESUMEN GENERAL');
        const config = data.objConfiguracionReporteGrupos;
        const periodo = config.objPeriodoAcademico;
        const numCols = 4;

        ws.columns = [{ width: 36 }, { width: 26 }, { width: 20 }, { width: 20 }];

        this._agregarTitulo(ws, 1, 'REPORTE POR GRUPOS DE INVESTIGACIÓN', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `Período Académico ${periodo.año}-${periodo.periodo}`, numCols, 25);
        ws.getRow(3).height = 8;

        // ── Configuración del grupo ───────────────────────────────────────
        this._agregarEncabezadoSeccion(ws, 'CONFIGURACIÓN FINANCIERA', numCols);

        const configRows: [string, string][] = [
            ['AUI Universidad (%)',       `${config.aUIPorcentaje}%`],
            ['AUI Universidad (Valor)',   this._formatCurrency(config.aUIValor)],
            ['Excedentes Maestría',       this._formatCurrency(config.excedentesMaestria)],
            ['Ingresos Netos',            this._formatCurrency(config.ingresosNetos)],
            ['Valor a Distribuir',        this._formatCurrency(config.valorADistribuir)],
        ];

        configRows.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
        });

        ws.addRow([]);

        // ── Participación semestral ───────────────────────────────────────
        this._agregarEncabezadoSeccion(ws, 'PARTICIPACIÓN SEMESTRAL', numCols);

        const semRows: [string, string][] = [
            ['Aporte 1er Semestre',         this._formatCurrency(data.aportePrimerSemestre)],
            ['Aporte 2do Semestre',         this._formatCurrency(data.aporteSegundoSemestre)],
            ['Participación 1er Sem (%)',   `${data.participacionPrimerSemestre}%`],
            ['Participación 2do Sem (%)',   `${data.participacionSegundoSemestre}%`],
            ['Participación Año (%)',        `${data.participacionPorAño}%`],
        ];

        semRows.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
        });

        ws.addRow([]);

        // ── Distribución de ítems ─────────────────────────────────────────
        this._agregarEncabezadoSeccion(ws, 'DISTRIBUCIÓN DE ÍTEMS', numCols);

        const itemsRows: [string, string][] = [
            ['Item 1 (%)',              `${config.item1}%`],
            ['Item 2 (%)',              `${config.item2}%`],
            ['Imprevistos (%)',         `${config.imprevistos}%`],
            ['Presupuesto Ítem 1',      this._formatCurrency(data.presupuestoPorGrupoItem1)],
            ['Presupuesto Ítem 2',      this._formatCurrency(data.presupuestoPorGrupoItem2)],
            ['Presupuesto Total',       this._formatCurrency(data.presupuestoPorGrupo)],
            ['Imprevistos (Valor)',     this._formatCurrency(data.imprevistos)],
            ['Presupuesto + Imprevistos', this._formatCurrency(data.presupuestoPorGrupoImprevistos)],
            ['Vigencias Anteriores',   this._formatCurrency(data.vigenciasAnteriores)],
        ];

        itemsRows.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
        });

        this._aplicarBordesHoja(ws);
    }

    private _crearHojaDistribucionFinanciera(wb: ExcelJS.Workbook, data: ReportePorGrupos): void {
        const ws = wb.addWorksheet('DISTRIBUCIÓN FINANCIERA');

        const headers = [
            'Grupo',
            'Total Neto',
            'Aporte 1er Sem',
            'Aporte 2do Sem',
            'Partic. 1er Sem (%)',
            'Partic. 2do Sem (%)',
            'Partic. Año (%)',
            'Presup. Item 1',
            'Presup. Item 2',
            'Presup. Total',
            'Imprevistos',
            'Presup. + Imprevistos',
            'Vigencias Anteriores',
        ];

        const numCols = headers.length;
        const lastCol = this._colLetra(numCols);
        const colWidths = [28, 18, 18, 18, 18, 18, 15, 18, 18, 18, 15, 22, 20];
        ws.columns = colWidths.map(w => ({ width: w }));

        this._agregarTitulo(ws, 1, 'DISTRIBUCIÓN FINANCIERA POR GRUPOS', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, 'Detalle de distribución por grupo de investigación', numCols, 25);
        ws.getRow(3).height = 8;

        const hRow = ws.getRow(4);
        headers.forEach((h, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), h));
        hRow.height = 22;
        ws.autoFilter = `A4:${lastCol}4`;

        const filas: ReportePorGrupoFila[] = data.filasPorGrupo ?? [];

        if (filas.length === 0) {
            // Mostrar datos globales como una sola fila
            const rowData = [
                'General',
                this._formatCurrency(data.totalNeto),
                this._formatCurrency(data.aportePrimerSemestre),
                this._formatCurrency(data.aporteSegundoSemestre),
                `${data.participacionPrimerSemestre}%`,
                `${data.participacionSegundoSemestre}%`,
                `${data.participacionPorAño}%`,
                this._formatCurrency(data.presupuestoPorGrupoItem1),
                this._formatCurrency(data.presupuestoPorGrupoItem2),
                this._formatCurrency(data.presupuestoPorGrupo),
                this._formatCurrency(data.imprevistos),
                this._formatCurrency(data.presupuestoPorGrupoImprevistos),
                this._formatCurrency(data.vigenciasAnteriores),
            ];
            const row = ws.addRow(rowData);
            this._estilizarFilaDatosCompleta(row, COLOR.BLANCO, numCols);
        } else {
            filas.forEach((fila, i) => {
                const rowData = [
                    fila.nombreGrupo,
                    this._formatCurrency(fila.totalNeto),
                    this._formatCurrency(fila.aportePrimerSemestre),
                    this._formatCurrency(fila.aporteSegundoSemestre),
                    `${fila.participacionPrimerSemestre}%`,
                    `${fila.participacionSegundoSemestre}%`,
                    `${fila.participacionPorAño}%`,
                    this._formatCurrency(fila.presupuestoPorGrupoItem1),
                    this._formatCurrency(fila.presupuestoPorGrupoItem2),
                    this._formatCurrency(fila.presupuestoPorGrupo),
                    this._formatCurrency(fila.imprevistos),
                    this._formatCurrency(fila.presupuestoPorGrupoImprevistos),
                    this._formatCurrency(fila.vigenciasAnteriores),
                ];
                const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
                const row = ws.addRow(rowData);
                this._estilizarFilaDatosCompleta(row, bg, numCols);
            });

            // Fila total
            const totalRow = ws.addRow([
                'TOTAL',
                this._formatCurrency(data.totalNeto),
                this._formatCurrency(data.aportePrimerSemestre),
                this._formatCurrency(data.aporteSegundoSemestre),
                `${data.participacionPrimerSemestre}%`,
                `${data.participacionSegundoSemestre}%`,
                `${data.participacionPorAño}%`,
                this._formatCurrency(data.presupuestoPorGrupoItem1),
                this._formatCurrency(data.presupuestoPorGrupoItem2),
                this._formatCurrency(data.presupuestoPorGrupo),
                this._formatCurrency(data.imprevistos),
                this._formatCurrency(data.presupuestoPorGrupoImprevistos),
                this._formatCurrency(data.vigenciasAnteriores),
            ]);
            this._estilizarFilaTotales(totalRow, numCols);
        }

        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    private _crearHojaGastosGenerales(wb: ExcelJS.Workbook, data: ReportePorGrupos): void {
        const ws = wb.addWorksheet('GASTOS GENERALES');
        const numCols = 4;

        ws.columns = [{ width: 12 }, { width: 22 }, { width: 40 }, { width: 22 }];

        this._agregarTitulo(ws, 1, 'GASTOS GENERALES', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, 'Detalle de gastos generales del período', numCols, 25);
        ws.getRow(3).height = 8;

        const headers = ['ID', 'Categoría', 'Descripción', 'Monto'];
        const hRow = ws.getRow(4);
        headers.forEach((h, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), h));
        hRow.height = 22;

        const gastos = data.objConfiguracionReporteGrupos?.gastosGenerales ?? data.gastosGenerales ?? [];

        if (!gastos || gastos.length === 0) {
            const msgRow = ws.addRow(['', '', 'No se registraron gastos generales', '']);
            ws.mergeCells(`A5:D5`);
            msgRow.getCell(3).font   = { name: 'Calibri', size: 11, italic: true, color: { argb: COLOR.GRIS_TEXTO } };
            msgRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
            msgRow.getCell(3).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.FILA_ALTERNA } };
            msgRow.height = 28;
        } else {
            let subtotal = 0;
            gastos.forEach((gasto, i) => {
                subtotal += gasto.monto ?? 0;
                const row = ws.addRow([
                    gasto.idGastoGeneral,
                    gasto.categoria,
                    gasto.descripcion,
                    this._formatCurrency(gasto.monto),
                ]);
                const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
                this._estilizarFilaDatosCompleta(row, bg, numCols);
            });

            const totalRow = ws.addRow(['', '', 'SUBTOTAL', this._formatCurrency(subtotal)]);
            this._estilizarFilaTotales(totalRow, numCols);
        }

        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    private _crearHojaItemsPresupuesto(
        wb: ExcelJS.Workbook,
        config: any,
        periodo: PeriodoAcademico
    ): void {
        const ws = wb.addWorksheet('ÍTEMS Y PRESUPUESTO');
        const numCols = 3;

        ws.columns = [{ width: 30 }, { width: 18 }, { width: 22 }];

        this._agregarTitulo(ws, 1, 'ÍTEMS Y DISTRIBUCIÓN DEL PRESUPUESTO', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `Período Académico ${periodo.año}-${periodo.periodo}`, numCols, 25);
        ws.getRow(3).height = 8;

        const headers = ['Concepto', 'Porcentaje', 'Descripción'];
        const hRow = ws.getRow(4);
        headers.forEach((h, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), h));
        hRow.height = 22;

        const items: any[][] = [
            ['Ítem 1',      `${config.item1}%`,      'Presupuesto asignado al ítem 1'],
            ['Ítem 2',      `${config.item2}%`,      'Presupuesto asignado al ítem 2'],
            ['Imprevistos', `${config.imprevistos}%`, 'Reserva para gastos imprevistos'],
        ];

        items.forEach((rowData, i) => {
            const row = ws.addRow(rowData);
            const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
            this._estilizarFilaDatosCompleta(row, bg, numCols);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  UTILIDADES DE ESTILOS
    // ═══════════════════════════════════════════════════════════════════════

    private _agregarTitulo(
        ws: ExcelJS.Worksheet,
        rowNum: number,
        texto: string,
        numCols: number,
        altura: number,
        bgColor: string,
        fontSize: number
    ): void {
        const lastCol = this._colLetra(numCols);
        ws.mergeCells(`A${rowNum}:${lastCol}${rowNum}`);
        const cell = ws.getCell(`A${rowNum}`);
        cell.value = texto;
        cell.font = { name: 'Calibri', size: fontSize, bold: true, color: { argb: COLOR.BLANCO } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(rowNum).height = altura;
    }

    private _agregarSubtitulo(
        ws: ExcelJS.Worksheet,
        rowNum: number,
        texto: string,
        numCols: number,
        altura: number
    ): void {
        const lastCol = this._colLetra(numCols);
        ws.mergeCells(`A${rowNum}:${lastCol}${rowNum}`);
        const cell = ws.getCell(`A${rowNum}`);
        cell.value = texto;
        cell.font = { name: 'Calibri', size: 12, color: { argb: COLOR.BLANCO } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_SECCION } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(rowNum).height = altura;
    }

    private _agregarEncabezadoSeccion(ws: ExcelJS.Worksheet, texto: string, numCols: number): void {
        const lastRowNum = ws.rowCount + 1;
        const lastCol = this._colLetra(numCols);
        ws.mergeCells(`A${lastRowNum}:${lastCol}${lastRowNum}`);
        const cell = ws.getCell(`A${lastRowNum}`);
        cell.value = texto;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: COLOR.BLANCO } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_SECCION } };
        cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        ws.getRow(lastRowNum).height = 22;
    }

    private _estilizarCeldaHeader(cell: ExcelJS.Cell, value?: string): void {
        if (value !== undefined) cell.value = value;
        cell.font      = { name: 'Calibri', size: 11, bold: true, color: { argb: COLOR.BLANCO } };
        cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_HEADER } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border    = {
            top:    { style: 'thin', color: { argb: COLOR.BLANCO } },
            left:   { style: 'thin', color: { argb: COLOR.BLANCO } },
            bottom: { style: 'thin', color: { argb: COLOR.BLANCO } },
            right:  { style: 'thin', color: { argb: COLOR.BLANCO } },
        };
    }

    private _estilizarFilaDatos(row: ExcelJS.Row, idx: number, numCols: number): void {
        const bg = idx % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
        for (let c = 1; c <= numCols; c++) {
            const cell = row.getCell(c);
            cell.font = { name: 'Calibri', size: 10 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
            cell.border = { bottom: { style: 'thin', color: { argb: COLOR.GRIS_BORDE } } };
        }
        row.height = 18;
    }

    private _estilizarFilaDatosCompleta(row: ExcelJS.Row, bgColor: string, numCols: number): void {
        for (let c = 1; c <= numCols; c++) {
            const cell = row.getCell(c);
            cell.font      = { name: 'Calibri', size: 10, color: { argb: COLOR.GRIS_TEXTO } };
            cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
            cell.alignment = { vertical: 'middle' };
            cell.border    = {
                bottom: { style: 'thin', color: { argb: COLOR.GRIS_BORDE } },
                right:  { style: 'thin', color: { argb: COLOR.GRIS_BORDE } },
            };
        }
        row.height = 18;
    }

    private _estilizarFilaKPI(row: ExcelJS.Row): void {
        const labelCell = row.getCell(1);
        const valueCell = row.getCell(2);

        labelCell.font  = { name: 'Calibri', size: 11, bold: true, color: { argb: COLOR.BLANCO } };
        labelCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_KPI_LABEL } };
        labelCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        labelCell.border = { bottom: { style: 'medium', color: { argb: COLOR.GRIS_BORDE } } };

        valueCell.font  = { name: 'Calibri', size: 12, bold: true, color: { argb: COLOR.AZUL_HEADER } };
        valueCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_KPI_BG } };
        valueCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
        valueCell.border = { bottom: { style: 'medium', color: { argb: COLOR.GRIS_BORDE } } };

        row.height = 24;
    }

    private _estilizarFilaTotales(row: ExcelJS.Row, numCols: number): void {
        for (let c = 1; c <= numCols; c++) {
            const cell = row.getCell(c);
            cell.font   = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
            cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AMARILLO_TOTAL } };
            cell.border = {
                top:    { style: 'double', color: { argb: COLOR.AZUL_HEADER } },
                bottom: { style: 'thin',   color: { argb: COLOR.GRIS_BORDE } },
                right:  { style: 'thin',   color: { argb: COLOR.GRIS_BORDE } },
            };
            cell.alignment = { vertical: 'middle' };
        }
        row.height = 20;
    }

    private _aplicarBordesHoja(ws: ExcelJS.Worksheet): void {
        ws.eachRow({ includeEmpty: false }, (row) => {
            row.eachCell({ includeEmpty: false }, (cell) => {
                if (!cell.border) {
                    cell.border = {
                        bottom: { style: 'hair', color: { argb: COLOR.GRIS_BORDE } },
                    };
                }
            });
        });
    }

    /** Convierte número de columna a letra (1=A, 2=B, ..., 26=Z, 27=AA ...) */
    private _colLetra(n: number): string {
        let result = '';
        while (n > 0) {
            const rem = (n - 1) % 26;
            result = String.fromCharCode(65 + rem) + result;
            n = Math.floor((n - 1) / 26);
        }
        return result;
    }

    private _formatCurrency(value: number): string {
        if (value === null || value === undefined) return '$0';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    private _guardarWorkbook(workbook: ExcelJS.Workbook, nombreArchivo: string): void {
        workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, nombreArchivo);
        }).catch((err: any) => {
            console.error('Error al generar el archivo Excel:', err);
        });
    }
}
