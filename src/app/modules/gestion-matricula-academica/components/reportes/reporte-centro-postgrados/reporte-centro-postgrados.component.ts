import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { gestion_matricula_financiera } from 'src/environments/environment';

interface PeriodoAcademico {
    id: number;
    tagPeriodo: number;
    anio: number;
    descripcion: string;
    estado: string;
}

interface ReporteRow {
    identificacion: string;
    nombreCompleto: string;
    valorMatriculaSMMLV: number;
    semestreFinanciero: number;
    aplicaDescuentoVoto: boolean;
    aplicaDescuentoEgresado: boolean;
    resolucionBeca: string;
    porcentajeBeca: number;
    semestreAcademico: number;
    materias: string[];
    docenteEncargado: string;
    grupoClase: string;
}

@Component({
    selector: 'app-reporte-centro-postgrados',
    templateUrl: './reporte-centro-postgrados.component.html',
    styleUrls: ['./reporte-centro-postgrados.component.scss'],
    providers: [MessageService],
})
export class ReporteCentroPostgradosComponent implements OnInit {
    periodos: PeriodoAcademico[] = [];
    periodoSeleccionado: PeriodoAcademico | null = null;
    cargando = false;
    descargando = false;

    private readonly financieraApi = gestion_matricula_financiera.api_url;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cargarPeriodos();
    }

    cargarPeriodos(): void {
        this.cargando = true;
        this.http
            .get<PeriodoAcademico[]>(`${this.financieraApi}/periodos`)
            .subscribe({
                next: (data) => {
                    this.periodos = (data || [])
                        .filter(
                            (p) =>
                                p.estado === 'FINALIZADO' ||
                                p.estado === 'CERRADO'
                        )
                        .sort(
                            (a, b) => b.anio - a.anio || b.tagPeriodo - a.tagPeriodo
                        );
                    this.cargando = false;
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los periodos',
                    });
                    this.cargando = false;
                },
            });
    }

    async descargarReporte(): Promise<void> {
        if (!this.periodoSeleccionado) return;
        this.descargando = true;
        const periodoId = this.periodoSeleccionado.id;

        this.http
            .get<ReporteRow[]>(
                `${this.financieraApi}/reporte-centro-postgrados/${periodoId}`
            )
            .subscribe({
                next: async (data) => {
                    try {
                        await this.generarExcel(data);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Reporte generado',
                            detail: 'La descarga comenzará en breve',
                        });
                    } catch (e) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo generar el archivo Excel',
                        });
                    }
                    this.descargando = false;
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron obtener los datos del reporte',
                    });
                    this.descargando = false;
                },
            });
    }

    private async generarExcel(data: ReporteRow[]): Promise<void> {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Matriculas', {
            properties: { tabColor: { argb: 'FF4361EE' } },
            views: [{ state: 'frozen', ySplit: 6 }],
        });

        // Configurar anchos de columna
        ws.columns = [
            { width: 3 },
            { width: 3 },
            { width: 14 },
            { width: 35 },
            { width: 10 },
            { width: 10 },
            { width: 14 },
            { width: 14 },
            { width: 18 },
            { width: 10 },
            { width: 3 },
            { width: 10 },
            { width: 38 },
            { width: 3 },
            { width: 38 },
            { width: 10 },
        ];

        const p = this.periodoSeleccionado!;
        const periodoLabel = `${p.anio}-${p.tagPeriodo}`;

        // --- HEADER ---
        // Row 1-2: Empty
        ws.addRow([]);
        ws.addRow([]);

        // Row 3: Titles
        const r3 = ws.addRow([]);
        r3.getCell(3).value = 'Matrícula Financiera';
        r3.getCell(3).font = { bold: true, size: 14 };
        ws.mergeCells('C3:K3');
        r3.getCell(13).value = 'Matrícula Académica';
        r3.getCell(13).font = { bold: true, size: 14 };
        ws.mergeCells('M3:P3');

        // Row 4: Semester
        const r4 = ws.addRow([]);
        r4.getCell(12).value = `Semestre: ____${p.tagPeriodo}______`;
        r4.getCell(12).font = { bold: true };

        // Row 5: Column headers
        const headers = [
            '',
            '',
            'Identificación',
            'Nombres completos del estudiante',
            'Valor de Matrícula en SMMLV',
            'SEM FINAN',
            '¿Aplica Descuento de Voto?',
            'Descuento por Egresado (UNICAUCA)',
            'No. Res. de Beca',
            '% Beca',
            '',
            'SEM ACAD',
            'Materias a Matricular',
            '',
            'Nombre Completo de Docente encargado',
            'Grupo Clase',
        ];
        const r5 = ws.addRow(headers);
        r5.eachCell((cell) => {
            cell.font = { bold: true, size: 10 };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' },
            };
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
        r5.height = 40;

        // Row 6: Sub-header (materias list note)
        const r6 = ws.addRow([]);
        r6.getCell(13).value = '*(Listar las materias a matricular)';
        r6.getCell(13).font = {
            italic: true,
            size: 8,
            color: { argb: 'FF666666' },
        };

        // --- DATA ROWS ---
        for (const row of data) {
            const materiasTexto = row.materias?.join(', ') || '';
            const nombreDocente = row.docenteEncargado || '';

            const dataRow = ws.addRow([
                '',
                '',
                row.identificacion,
                row.nombreCompleto,
                row.valorMatriculaSMMLV,
                row.semestreFinanciero,
                row.aplicaDescuentoVoto ? 'Sí' : 'No',
                row.aplicaDescuentoEgresado ? 'Sí' : 'No',
                row.resolucionBeca || '',
                row.porcentajeBeca != null ? `${row.porcentajeBeca}%` : '',
                '',
                row.semestreAcademico,
                materiasTexto,
                '',
                nombreDocente,
                row.grupoClase || '',
            ]);

            dataRow.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.font = { size: 10 };
                if ([3, 5, 6, 7, 8, 9, 10, 12].includes(colNumber)) {
                    cell.alignment = { horizontal: 'center' };
                }
                if (colNumber === 5) cell.numFmt = '#,##0';
            });
        }

        // Row height for data
        ws.eachRow((r, i) => {
            if (i > 6) r.height = 22;
        });

        // Download
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Matriculas_${periodoLabel}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    get periodoLabel(): string {
        if (!this.periodoSeleccionado) return '';
        return `${this.periodoSeleccionado.anio}-${this.periodoSeleccionado.tagPeriodo} - ${this.periodoSeleccionado.descripcion}`;
    }
}
