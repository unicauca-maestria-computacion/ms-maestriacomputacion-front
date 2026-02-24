import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
    ConfiguracionReporteFinanciero,
    ReportePorGrupos,
    ProyeccionEstudiante,
    ReporteEstudiantes,
    ReporteProyeccionEstudiantes,
    PeriodoAcademico
} from '../models/domain-models';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    /**
     * Genera y descarga el Excel del Reporte Final
     */
    generarExcelReporteFinal(data: ReporteEstudiantes): void {
        const workbook = XLSX.utils.book_new();
        const periodo = data.periodo;
        const config = data.objConfiguracion;

        // Hoja 1: Configuración del Reporte
        const configData = [
            ['REPORTE FINAL DE INGRESOS'],
            [''],
            ['Período Académico', `${periodo.año}-${periodo.periodo}`],
            [''],
            ['CONFIGURACIÓN'],
            ['Valor Matrícula (SMLV)', `${config.valorMatricula} SMLV`],
            ['Valor SMLV', this.formatCurrency(config.valorSMLV)],
            ['Recursos Computacionales', this.formatCurrency(config.recursosComputacionales)],
            ['Biblioteca', this.formatCurrency(config.biblioteca)],
            [''],
            ['TOTALES'],
            ['Total Ingresos Brutos', this.formatCurrency(config.totalIngresos)],
            ['Total Descuentos', this.formatCurrency(config.totalDescuentos)],
            ['Total Neto', this.formatCurrency(config.totalNeto)]
        ];
        const wsConfig = XLSX.utils.aoa_to_sheet(configData);
        this.ajustarAnchoColumnas(wsConfig, configData);
        XLSX.utils.book_append_sheet(workbook, wsConfig, 'Resumen');

        // Hoja 2: Listado de Estudiantes
        const estudiantesHeader = [
            'Código', 'Identificación', 'Nombre', 'Apellido',
            'Grupo Investigación', '% Votación', '% Beca', '% Egresado', 'Estado Pago'
        ];
        const estudiantesData = data.estudiantes.map(est => [
            est.codigoEstudiante,
            est.identificacion,
            est.nombre,
            est.apellido,
            est.grupoInvestigacion,
            `${(est.porcentajeVotacion * 100).toFixed(0)}%`,
            `${(est.porcentajeBeca * 100).toFixed(0)}%`,
            `${(est.porcentajeEgresado * 100).toFixed(0)}%`,
            est.estaPago ? 'Pagado' : 'Pendiente'
        ]);

        const wsEstudiantes = XLSX.utils.aoa_to_sheet([estudiantesHeader, ...estudiantesData]);
        this.ajustarAnchoColumnas(wsEstudiantes, [estudiantesHeader, ...estudiantesData]);
        XLSX.utils.book_append_sheet(workbook, wsEstudiantes, 'Estudiantes');

        // Guardar archivo
        const nombreArchivo = `Reporte_Final_${periodo.año}-${periodo.periodo}.xlsx`;
        this.guardarExcel(workbook, nombreArchivo);
    }

    /**
     * Genera y descarga el Excel de la Proyección de Reporte
     */
    generarExcelProyeccionReporte(data: ReporteProyeccionEstudiantes): void {
        const workbook = XLSX.utils.book_new();
        const periodo = data.periodo;
        const config = data.objConfiguracion;

        // Hoja 1: Configuración
        const configData = [
            ['PROYECCIÓN DE INGRESOS'],
            [''],
            ['Período Académico', `${periodo.año}-${periodo.periodo}`],
            [''],
            ['CONFIGURACIÓN'],
            ['Valor Matrícula (SMLV)', `${config.valorMatricula} SMLV`],
            ['Valor SMLV', this.formatCurrency(config.valorSMLV)],
            ['Recursos Computacionales', this.formatCurrency(config.recursosComputacionales)],
            ['Biblioteca', this.formatCurrency(config.biblioteca)],
            [''],
            ['TOTALES PROYECTADOS'],
            ['Total Ingresos Brutos', this.formatCurrency(config.totalIngresos)],
            ['Total Descuentos', this.formatCurrency(config.totalDescuentos)],
            ['Total Neto Proyectado', this.formatCurrency(config.totalNeto)]
        ];
        const wsConfig = XLSX.utils.aoa_to_sheet(configData);
        this.ajustarAnchoColumnas(wsConfig, configData);
        XLSX.utils.book_append_sheet(workbook, wsConfig, 'Resumen Proyección');

        // Hoja 2: Proyección de Estudiantes
        const estudiantesHeader = [
            'Código', 'Identificación', 'Nombre', 'Apellido',
            'Grupo Investigación', '% Votación', '% Beca', '% Egresado', 'Estado Pago'
        ];
        const estudiantesData = data.estudiantes.map(est => [
            est.codigoEstudiante,
            est.identificacion,
            est.nombre,
            est.apellido,
            est.grupoInvestigacion,
            `${(est.porcentajeVotacion * 100).toFixed(0)}%`,
            `${(est.porcentajeBeca * 100).toFixed(0)}%`,
            `${(est.porcentajeEgresado * 100).toFixed(0)}%`,
            est.estaPago ? 'Pagado' : 'Pendiente'
        ]);

        const wsEstudiantes = XLSX.utils.aoa_to_sheet([estudiantesHeader, ...estudiantesData]);
        this.ajustarAnchoColumnas(wsEstudiantes, [estudiantesHeader, ...estudiantesData]);
        XLSX.utils.book_append_sheet(workbook, wsEstudiantes, 'Proyección Estudiantes');

        // Guardar archivo
        const nombreArchivo = `Proyeccion_Reporte_${periodo.año}-${periodo.periodo}.xlsx`;
        this.guardarExcel(workbook, nombreArchivo);
    }

    /**
     * Genera y descarga el Excel del Reporte por Grupos
     */
    generarExcelReportePorGrupos(data: ReportePorGrupos): void {
        const workbook = XLSX.utils.book_new();
        const config = data.objConfiguracionReporteGrupos;
        const periodo = config.objPeriodoAcademico;

        // Hoja 1: Configuración General
        const configData = [
            ['REPORTE POR GRUPOS DE INVESTIGACIÓN'],
            [''],
            ['Período Académico', `${periodo.año}-${periodo.periodo}`],
            [''],
            ['CONFIGURACIÓN GENERAL'],
            ['AUI Universidad (%)', `${config.aUIPorcentaje}%`],
            ['AUI Universidad (Valor)', this.formatCurrency(config.aUIValor)],
            ['Excedentes Maestría', this.formatCurrency(config.excedentesMaestria)],
            ['Ingresos Netos', this.formatCurrency(config.ingresosNetos)],
            ['Valor a Distribuir', this.formatCurrency(config.valorADistribuir)],
            [''],
            ['DISTRIBUCIÓN POR ITEMS'],
            ['Item 1 (%)', `${config.item1}%`],
            ['Item 2 (%)', `${config.item2}%`],
            ['Imprevistos (%)', `${config.imprevistos}%`]
        ];
        const wsConfig = XLSX.utils.aoa_to_sheet(configData);
        this.ajustarAnchoColumnas(wsConfig, configData);
        XLSX.utils.book_append_sheet(workbook, wsConfig, 'Configuración');

        // Hoja 2: Distribución del grupo
        const gruposHeader = [
            'Total Neto', 'Aporte 1er Sem', 'Aporte 2do Sem',
            'Partic. 1er Sem (%)', 'Partic. 2do Sem (%)', 'Partic. Año (%)',
            'Presup. Item 1', 'Presup. Item 2', 'Presup. Total',
            'Imprevistos', 'Presup. + Imprevistos', 'Vigencias Anteriores'
        ];
        const gruposData = [[
            this.formatCurrency(data.totalNeto),
            this.formatCurrency(data.aportePrimerSemestre),
            this.formatCurrency(data.aporteSegundoSemestre),
            `${data.participacionPrimerSemestre}%`,
            `${data.participacionSegundoSemestre}%`,
            `${data.participacionPorAño}%`,
            this.formatCurrency(data.presupuestoPorGrupoItem1),
            this.formatCurrency(data.presupuestoPorGrupoItem2),
            this.formatCurrency(data.presupuestoPorGrupo),
            this.formatCurrency(data.imprevistos),
            this.formatCurrency(data.presupuestoPorGrupoImprevistos),
            this.formatCurrency(data.vigenciasAnteriores)
        ]];

        const wsGrupos = XLSX.utils.aoa_to_sheet([gruposHeader, ...gruposData]);
        this.ajustarAnchoColumnas(wsGrupos, [gruposHeader, ...gruposData]);
        XLSX.utils.book_append_sheet(workbook, wsGrupos, 'Distribución Grupos');

        // Hoja 3: Gastos Generales
        if (config.gastosGenerales && config.gastosGenerales.length > 0) {
            const gastosHeader = ['ID', 'Categoría', 'Descripción', 'Monto'];
            const gastosData = config.gastosGenerales.map(gasto => [
                gasto.idGastoGeneral,
                gasto.categoria,
                gasto.descripcion,
                this.formatCurrency(gasto.monto)
            ]);

            const wsGastos = XLSX.utils.aoa_to_sheet([gastosHeader, ...gastosData]);
            this.ajustarAnchoColumnas(wsGastos, [gastosHeader, ...gastosData]);
            XLSX.utils.book_append_sheet(workbook, wsGastos, 'Gastos Generales');
        }

        // Guardar archivo
        const nombreArchivo = `Reporte_Grupos_${periodo.año}-${periodo.periodo}.xlsx`;
        this.guardarExcel(workbook, nombreArchivo);
    }

    /**
     * Formatea un número como moneda colombiana
     */
    private formatCurrency(value: number): string {
        if (value === null || value === undefined) return '$0';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    /**
     * Ajusta el ancho de las columnas basado en el contenido
     */
    private ajustarAnchoColumnas(worksheet: XLSX.WorkSheet, data: any[][]): void {
        const colWidths: number[] = [];
        data.forEach(row => {
            row.forEach((cell, colIndex) => {
                const cellLength = cell ? String(cell).length : 10;
                if (!colWidths[colIndex] || cellLength > colWidths[colIndex]) {
                    colWidths[colIndex] = cellLength;
                }
            });
        });
        worksheet['!cols'] = colWidths.map(width => ({ wch: Math.min(width + 2, 50) }));
    }

    /**
     * Guarda el workbook como archivo Excel
     */
    private guardarExcel(workbook: XLSX.WorkBook, nombreArchivo: string): void {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, nombreArchivo);
    }
}
