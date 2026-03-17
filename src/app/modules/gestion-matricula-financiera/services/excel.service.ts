import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
    Estudiante,
    PeriodoAcademico,
    MatriculaFinanciera,
    MatriculaAcademica,
    BecaFinanciera,
    DescuentoFinanciero,
    Materia
} from '../models/domain-models';

// ─── Paleta de colores institucionales ───────────────────────────────────────
const COLOR = {
    AZUL_HEADER:    'FF1565C0',
    AZUL_SECCION:   'FF1976D2',
    VERDE_EXITO:    'FF2E7D32',
    VERDE_CLARO:    'FFA5D6A7',
    ROJO_PENDIENTE: 'FFEF9A9A',
    AMARILLO_TOTAL: 'FFFFF9C4',
    FILA_ALTERNA:   'FFF5F5F5',
    BLANCO:         'FFFFFFFF',
    GRIS_BORDE:     'FFE0E0E0',
    GRIS_TEXTO:     'FF424242',
    AZUL_KPI_BG:    'FFE3F2FD',
    AZUL_KPI_LABEL: 'FF1565C0',
};

@Injectable({
    providedIn: 'root'
})
export class GestionMatriculaFinancieraExcelService {

    constructor() { }

    // ═══════════════════════════════════════════════════════════════════════
    //  LISTA DE ESTUDIANTES
    // ═══════════════════════════════════════════════════════════════════════

    generarExcelListaEstudiantes(estudiantes: Estudiante[], periodo: PeriodoAcademico): void {
        if (!estudiantes?.length) {
            console.warn('generarExcelListaEstudiantes: no hay estudiantes para exportar.');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema Maestría en Computación';
        workbook.created = new Date();

        this._crearHojaListaEstudiantes(workbook, estudiantes, periodo);
        this._crearHojaResumenFinanciero(workbook, estudiantes, periodo);

        const nombreArchivo = `Matricula_Financiera_${periodo.año}-${periodo.periodo}.xlsx`;
        this._guardarWorkbook(workbook, nombreArchivo);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DETALLE DE ESTUDIANTE
    // ═══════════════════════════════════════════════════════════════════════

    generarExcelDetalleEstudiante(estudiante: Estudiante): void {
        if (!estudiante) {
            console.warn('generarExcelDetalleEstudiante: no hay datos del estudiante.');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema Maestría en Computación';
        workbook.created = new Date();

        this._crearHojaDatosPersonales(workbook, estudiante);
        this._crearHojaMatriculasFinancieras(workbook, estudiante);
        this._crearHojaMateriasMinistriculadas(workbook, estudiante);
        this._crearHojaBecasDescuentos(workbook, estudiante);

        const nombreArchivo = `Detalle_Estudiante_${estudiante.codigo}.xlsx`;
        this._guardarWorkbook(workbook, nombreArchivo);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJA 1: LISTA DE ESTUDIANTES
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaListaEstudiantes(
        wb: ExcelJS.Workbook,
        estudiantes: Estudiante[],
        periodo: PeriodoAcademico
    ): void {
        const ws = wb.addWorksheet('LISTA DE ESTUDIANTES');

        const headers = [
            { header: 'Código',                  key: 'codigo',    width: 14 },
            { header: 'Identificación',           key: 'ident',     width: 18 },
            { header: 'Nombre Completo',          key: 'nombre',    width: 32 },
            { header: 'Cohorte',                  key: 'cohorte',   width: 14 },
            { header: 'Período Ingreso',          key: 'pIngreso',  width: 16 },
            { header: 'Semestre Financiero',      key: 'semFin',    width: 18 },
            { header: 'Valor Matrícula Actual',   key: 'valor',     width: 22 },
            { header: 'Becas',                    key: 'becas',     width: 30 },
            { header: 'Descuentos',               key: 'descuentos',width: 30 },
            { header: 'Estado',                   key: 'estado',    width: 14 },
        ];

        const numCols = headers.length;
        const lastCol = this._colLetra(numCols);
        ws.columns = headers;

        // Insertar 3 filas de encabezado antes de los datos
        ws.spliceRows(1, 0, [], [], []);

        this._agregarTitulo(ws, 1, 'MATRÍCULA FINANCIERA - LISTA DE ESTUDIANTES', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `Período Académico ${periodo.año}-${periodo.periodo}`, numCols, 25);
        ws.getRow(3).height = 8;

        // Fila 4: headers de tabla
        const hRow = ws.getRow(4);
        headers.forEach((col, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), col.header));
        hRow.height = 22;
        ws.autoFilter = `A4:${lastCol}4`;

        // Filas de datos
        estudiantes.forEach((est, idx) => {
            const ultimaMatricula = this._obtenerUltimaMatricula(est.matriculasFinancieras);
            const becasText = est.becas?.length
                ? est.becas.map((b: BecaFinanciera) => `${b.resolucion} (${(b.porcentaje * 100).toFixed(0)}%)`).join(', ')
                : 'Sin beca';
            const descuentosText = est.descuentos?.length
                ? est.descuentos.map((d: DescuentoFinanciero) => `${d.tipoDescuento} (${(d.porcentaje * 100).toFixed(0)}%)`).join(', ')
                : 'Sin descuento';
            const tieneBecaODescuento = (est.becas?.length > 0) || (est.descuentos?.length > 0);
            const estadoText = tieneBecaODescuento ? 'Con beneficio' : 'Sin beneficio';

            const rowValues = [
                est.codigo,
                est.identificacion,
                `${est.nombre} ${est.apellido}`,
                est.cohorte,
                est.periodoIngreso,
                est.semestreFinanciero,
                ultimaMatricula ? this._formatCurrency(ultimaMatricula.valorMatricula) : 'Sin matrícula',
                becasText,
                descuentosText,
                estadoText,
            ];

            const dataRow = ws.addRow(rowValues);
            const bg = idx % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
            this._estilizarFilaDatosCompleta(dataRow, bg, numCols);

            // Color celda estado
            const estadoCell = dataRow.getCell(10);
            if (tieneBecaODescuento) {
                estadoCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.VERDE_CLARO } };
                estadoCell.font  = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.VERDE_EXITO } };
            } else {
                estadoCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.FILA_ALTERNA } };
                estadoCell.font  = { name: 'Calibri', size: 10, color: { argb: COLOR.GRIS_TEXTO } };
            }
        });

        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJA 2: RESUMEN FINANCIERO (KPIs)
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaResumenFinanciero(
        wb: ExcelJS.Workbook,
        estudiantes: Estudiante[],
        periodo: PeriodoAcademico
    ): void {
        const ws = wb.addWorksheet('RESUMEN FINANCIERO');
        const numCols = 4;

        ws.columns = [{ width: 36 }, { width: 26 }, { width: 20 }, { width: 20 }];

        this._agregarTitulo(ws, 1, 'RESUMEN FINANCIERO DE MATRÍCULA', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `Período Académico ${periodo.año}-${periodo.periodo}`, numCols, 25);
        ws.getRow(3).height = 8;

        this._agregarEncabezadoSeccion(ws, 'INDICADORES CLAVE (KPIs)', numCols);

        const totalEstudiantes = estudiantes.length;
        const valoresMatricula = estudiantes
            .map(e => this._obtenerUltimaMatricula(e.matriculasFinancieras))
            .filter(m => m !== null)
            .map(m => (m as MatriculaFinanciera).valorMatricula);

        const totalIngresosProy = valoresMatricula.reduce((s, v) => s + v, 0);
        const promedioValor     = valoresMatricula.length ? totalIngresosProy / valoresMatricula.length : 0;
        const conBeca           = estudiantes.filter(e => e.becas?.length > 0).length;
        const conDescuento      = estudiantes.filter(e => e.descuentos?.length > 0).length;

        const kpis: [string, string][] = [
            ['Total Estudiantes',                    `${totalEstudiantes}`],
            ['Total Ingresos Proyectados',            this._formatCurrency(totalIngresosProy)],
            ['Promedio Valor Matrícula',              this._formatCurrency(promedioValor)],
            ['Estudiantes con Beca',                  `${conBeca}`],
            ['Estudiantes con Descuento',             `${conDescuento}`],
            ['Estudiantes sin Beneficio',             `${totalEstudiantes - conBeca - conDescuento}`],
        ];

        kpis.forEach(([label, value]) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaKPI(row);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJA 1 DETALLE: DATOS PERSONALES
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaDatosPersonales(wb: ExcelJS.Workbook, estudiante: Estudiante): void {
        const ws = wb.addWorksheet('DATOS PERSONALES');
        const numCols = 3;

        ws.columns = [{ width: 28 }, { width: 38 }, { width: 20 }];

        this._agregarTitulo(ws, 1, 'FICHA DEL ESTUDIANTE', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `${estudiante.nombre} ${estudiante.apellido}`, numCols, 25);
        ws.getRow(3).height = 8;

        this._agregarEncabezadoSeccion(ws, 'INFORMACIÓN PERSONAL', numCols);

        const campos: [string, string | number][] = [
            ['Código',              estudiante.codigo],
            ['Identificación',      estudiante.identificacion],
            ['Nombre',              estudiante.nombre],
            ['Apellido',            estudiante.apellido],
            ['Cohorte',             estudiante.cohorte],
            ['Período de Ingreso',  estudiante.periodoIngreso],
            ['Semestre Financiero', estudiante.semestreFinanciero],
        ];

        campos.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
            row.getCell(2).font = { name: 'Calibri', size: 10, color: { argb: COLOR.GRIS_TEXTO } };
        });

        ws.addRow([]);
        this._agregarEncabezadoSeccion(ws, 'RESUMEN FINANCIERO', numCols);

        const ultimaMatricula = this._obtenerUltimaMatricula(estudiante.matriculasFinancieras);
        const totalPagado = (estudiante.matriculasFinancieras ?? []).reduce((s, m) => s + (m.valorMatricula ?? 0), 0);
        const totalBecas = (estudiante.becas ?? []).length;
        const totalDescuentos = (estudiante.descuentos ?? []).length;

        const resumen: [string, string | number][] = [
            ['Matrícula Más Reciente',  ultimaMatricula ? this._formatCurrency(ultimaMatricula.valorMatricula) : 'Sin registro'],
            ['Total Pagado Acumulado',  this._formatCurrency(totalPagado)],
            ['Número de Becas',         totalBecas],
            ['Número de Descuentos',    totalDescuentos],
        ];

        resumen.forEach(([label, value], i) => {
            const row = ws.addRow([label, value]);
            this._estilizarFilaDatos(row, i, 2);
            row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.GRIS_TEXTO } };
        });

        this._aplicarBordesHoja(ws);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJA 2 DETALLE: MATRÍCULAS FINANCIERAS
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaMatriculasFinancieras(wb: ExcelJS.Workbook, estudiante: Estudiante): void {
        const ws = wb.addWorksheet('MATRÍCULAS FINANCIERAS');
        const numCols = 4;

        ws.columns = [
            { width: 22 },
            { width: 22 },
            { width: 22 },
            { width: 22 },
        ];

        this._agregarTitulo(ws, 1, 'HISTORIAL DE MATRÍCULAS FINANCIERAS', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `${estudiante.nombre} ${estudiante.apellido} — Cód: ${estudiante.codigo}`, numCols, 25);
        ws.getRow(3).height = 8;

        const headers = ['Período Académico', 'Fecha de Matrícula', 'Valor Matrícula', 'Observaciones'];
        const hRow = ws.getRow(4);
        headers.forEach((h, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), h));
        hRow.height = 22;

        const matriculas: MatriculaFinanciera[] = estudiante.matriculasFinancieras ?? [];
        let totalPagado = 0;

        if (matriculas.length === 0) {
            const msgRow = ws.addRow(['', 'Sin matrículas financieras registradas', '', '']);
            ws.mergeCells('A5:D5');
            msgRow.getCell(2).font      = { name: 'Calibri', size: 11, italic: true, color: { argb: COLOR.GRIS_TEXTO } };
            msgRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
            msgRow.height = 24;
        } else {
            matriculas.forEach((m, i) => {
                totalPagado += m.valorMatricula ?? 0;
                const periodo = m.objPeriodoAcademico
                    ? `${m.objPeriodoAcademico.año}-${m.objPeriodoAcademico.periodo}`
                    : '—';
                const fecha = m.fechaMatricula
                    ? new Date(m.fechaMatricula).toLocaleDateString('es-CO')
                    : '—';

                const row = ws.addRow([periodo, fecha, this._formatCurrency(m.valorMatricula), '—']);
                const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
                this._estilizarFilaDatosCompleta(row, bg, numCols);
            });

            const totalRow = ws.addRow(['TOTAL PAGADO ACUMULADO', '', this._formatCurrency(totalPagado), '']);
            this._estilizarFilaTotales(totalRow, numCols);
        }

        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJA 3 DETALLE: MATERIAS MATRICULADAS
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaMateriasMinistriculadas(wb: ExcelJS.Workbook, estudiante: Estudiante): void {
        const ws = wb.addWorksheet('MATERIAS MATRICULADAS');
        const numCols = 5;

        ws.columns = [
            { width: 18 },
            { width: 14 },
            { width: 36 },
            { width: 28 },
            { width: 16 },
        ];

        this._agregarTitulo(ws, 1, 'MATERIAS MATRICULADAS', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `${estudiante.nombre} ${estudiante.apellido} — Cód: ${estudiante.codigo}`, numCols, 25);
        ws.getRow(3).height = 8;

        const headers = ['Período Académico', 'Semestre', 'Materia', 'Docente', 'Grupo'];
        const hRow = ws.getRow(4);
        headers.forEach((h, i) => this._estilizarCeldaHeader(hRow.getCell(i + 1), h));
        hRow.height = 22;
        ws.autoFilter = `A4:${this._colLetra(numCols)}4`;

        const matriculasAcad: MatriculaAcademica[] = estudiante.matriculasAcademicas ?? [];

        if (matriculasAcad.length === 0) {
            const msgRow = ws.addRow(['', '', 'Sin matrículas académicas registradas', '', '']);
            ws.mergeCells('A5:E5');
            msgRow.getCell(3).font      = { name: 'Calibri', size: 11, italic: true, color: { argb: COLOR.GRIS_TEXTO } };
            msgRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
            msgRow.height = 24;
        } else {
            let globalIdx = 0;
            matriculasAcad.forEach((mat: MatriculaAcademica) => {
                const periodoLabel = mat.objPeriodoAcademico
                    ? `${mat.objPeriodoAcademico.año}-${mat.objPeriodoAcademico.periodo}`
                    : '—';

                // Subtítulo por semestre
                const secRow = ws.addRow([`SEMESTRE ${mat.semestre} — ${periodoLabel}`, '', '', '', '']);
                ws.mergeCells(`A${secRow.number}:E${secRow.number}`);
                secRow.getCell(1).font  = { name: 'Calibri', size: 10, bold: true, color: { argb: COLOR.BLANCO } };
                secRow.getCell(1).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_SECCION } };
                secRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
                secRow.height = 20;

                const materias: Materia[] = mat.materias ?? [];
                materias.forEach((m: Materia) => {
                    const row = ws.addRow([
                        periodoLabel,
                        m.semestreAcademico,
                        m.materia,
                        m.objDocente?.nombre ?? '—',
                        m.grupoClase,
                    ]);
                    const bg = globalIdx % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
                    this._estilizarFilaDatosCompleta(row, bg, numCols);
                    globalIdx++;
                });
            });
        }

        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HOJA 4 DETALLE: BECAS Y DESCUENTOS
    // ═══════════════════════════════════════════════════════════════════════

    private _crearHojaBecasDescuentos(wb: ExcelJS.Workbook, estudiante: Estudiante): void {
        const ws = wb.addWorksheet('BECAS Y DESCUENTOS');
        const numCols = 3;

        ws.columns = [{ width: 32 }, { width: 18 }, { width: 28 }];

        this._agregarTitulo(ws, 1, 'BECAS Y DESCUENTOS APLICADOS', numCols, 35, COLOR.AZUL_HEADER, 16);
        this._agregarSubtitulo(ws, 2, `${estudiante.nombre} ${estudiante.apellido} — Cód: ${estudiante.codigo}`, numCols, 25);
        ws.getRow(3).height = 8;

        // ── Tabla Becas ───────────────────────────────────────────────────
        this._agregarEncabezadoSeccion(ws, 'BECAS ACADÉMICAS', numCols);

        const hBecasRow = ws.addRow(['Resolución', 'Porcentaje (%)', 'Impacto Económico Estimado']);
        ['Resolución', 'Porcentaje (%)', 'Impacto Económico Estimado'].forEach((h, i) => {
            this._estilizarCeldaHeader(hBecasRow.getCell(i + 1), h);
        });
        hBecasRow.height = 22;

        const becas: BecaFinanciera[] = estudiante.becas ?? [];
        const ultimaMatricula = this._obtenerUltimaMatricula(estudiante.matriculasFinancieras);
        const baseValor = ultimaMatricula?.valorMatricula ?? 0;

        if (becas.length === 0) {
            const msgRow = ws.addRow(['Sin becas registradas', '', '']);
            ws.mergeCells(`A${msgRow.number}:C${msgRow.number}`);
            msgRow.getCell(1).font      = { name: 'Calibri', size: 10, italic: true, color: { argb: COLOR.GRIS_TEXTO } };
            msgRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            msgRow.height = 20;
        } else {
            becas.forEach((beca: BecaFinanciera, i: number) => {
                const impacto = baseValor * beca.porcentaje;
                const row = ws.addRow([
                    beca.resolucion,
                    `${(beca.porcentaje * 100).toFixed(1)}%`,
                    this._formatCurrency(impacto),
                ]);
                const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
                this._estilizarFilaDatosCompleta(row, bg, numCols);
            });

            const totalBecaImpacto = becas.reduce((s, b) => s + baseValor * b.porcentaje, 0);
            const totalBecaRow = ws.addRow(['TOTAL IMPACTO BECAS', '', this._formatCurrency(totalBecaImpacto)]);
            this._estilizarFilaTotales(totalBecaRow, numCols);
        }

        ws.addRow([]);

        // ── Tabla Descuentos ──────────────────────────────────────────────
        this._agregarEncabezadoSeccion(ws, 'DESCUENTOS FINANCIEROS', numCols);

        const hDescRow = ws.addRow(['Tipo de Descuento', 'Porcentaje (%)', 'Impacto Económico Estimado']);
        ['Tipo de Descuento', 'Porcentaje (%)', 'Impacto Económico Estimado'].forEach((h, i) => {
            this._estilizarCeldaHeader(hDescRow.getCell(i + 1), h);
        });
        hDescRow.height = 22;

        const descuentos: DescuentoFinanciero[] = estudiante.descuentos ?? [];

        if (descuentos.length === 0) {
            const msgRow = ws.addRow(['Sin descuentos registrados', '', '']);
            ws.mergeCells(`A${msgRow.number}:C${msgRow.number}`);
            msgRow.getCell(1).font      = { name: 'Calibri', size: 10, italic: true, color: { argb: COLOR.GRIS_TEXTO } };
            msgRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            msgRow.height = 20;
        } else {
            descuentos.forEach((desc: DescuentoFinanciero, i: number) => {
                const impacto = baseValor * desc.porcentaje;
                const row = ws.addRow([
                    desc.tipoDescuento,
                    `${(desc.porcentaje * 100).toFixed(1)}%`,
                    this._formatCurrency(impacto),
                ]);
                const bg = i % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA;
                this._estilizarFilaDatosCompleta(row, bg, numCols);
            });

            const totalDescImpacto = descuentos.reduce((s, d) => s + baseValor * d.porcentaje, 0);
            const totalDescRow = ws.addRow(['TOTAL IMPACTO DESCUENTOS', '', this._formatCurrency(totalDescImpacto)]);
            this._estilizarFilaTotales(totalDescRow, numCols);
        }
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
        cell.font  = { name: 'Calibri', size: fontSize, bold: true, color: { argb: COLOR.BLANCO } };
        cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
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
        cell.font  = { name: 'Calibri', size: 12, color: { argb: COLOR.BLANCO } };
        cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_SECCION } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(rowNum).height = altura;
    }

    private _agregarEncabezadoSeccion(ws: ExcelJS.Worksheet, texto: string, numCols: number): void {
        const lastRowNum = ws.rowCount + 1;
        const lastCol = this._colLetra(numCols);
        ws.mergeCells(`A${lastRowNum}:${lastCol}${lastRowNum}`);
        const cell = ws.getCell(`A${lastRowNum}`);
        cell.value = texto;
        cell.font  = { name: 'Calibri', size: 11, bold: true, color: { argb: COLOR.BLANCO } };
        cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.AZUL_SECCION } };
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
        for (let c = 1; c <= numCols; c++) {
            const cell = row.getCell(c);
            cell.font   = { name: 'Calibri', size: 10 };
            cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 0 ? COLOR.BLANCO : COLOR.FILA_ALTERNA } };
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
                    cell.border = { bottom: { style: 'hair', color: { argb: COLOR.GRIS_BORDE } } };
                }
            });
        });
    }

    private _obtenerUltimaMatricula(matriculas: MatriculaFinanciera[]): MatriculaFinanciera | null {
        if (!matriculas?.length) return null;
        return matriculas.reduce((ultima, m) => {
            if (!ultima) return m;
            const dU = new Date(ultima.fechaMatricula).getTime();
            const dM = new Date(m.fechaMatricula).getTime();
            return dM > dU ? m : ultima;
        }, null as MatriculaFinanciera | null);
    }

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
