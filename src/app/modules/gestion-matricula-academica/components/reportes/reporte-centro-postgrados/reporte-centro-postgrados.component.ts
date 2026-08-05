import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { gestion_matricula_financiera } from 'src/environments/environment';
import * as ExcelJS from 'exceljs';

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
    materias: { codigoOid: string; materia: string }[];
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
            .get<PeriodoAcademico[]>(`${this.financieraApi}periodos`)
            .subscribe({
                next: (data) => {
                    this.periodos = (data || [])
                        .filter(
                            (p) =>
                                p.estado === 'FINALIZADO' ||
                                p.estado === 'CERRADO'
                        )
                        .sort(
                            (a, b) =>
                                b.anio - a.anio || b.tagPeriodo - a.tagPeriodo
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

    descargarReporte(): void {
        if (!this.periodoSeleccionado) return;
        this.descargando = true;
        const periodoId = this.periodoSeleccionado.id;
        const periodoLabel = `${this.periodoSeleccionado.anio}-${this.periodoSeleccionado.tagPeriodo}`;

        this.http
            .get<ReporteRow[]>(
                `${this.financieraApi}reporte-centro-postgrados/${periodoId}`
            )
            .subscribe({
                next: async (data) => {
                    try {
                        await this.generarExcel(data, periodoLabel);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Reporte generado',
                            detail: 'Descarga iniciada',
                        });
                    } catch (e) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo generar el Excel',
                        });
                    }
                    this.descargando = false;
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron obtener los datos',
                    });
                    this.descargando = false;
                },
            });
    }

    private async generarExcel(data: ReporteRow[], periodoLabel: string): Promise<void> {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet(`Matriculas ${periodoLabel}`);

        // ── Column widths (A=col 1, B=col 2, …, O=col 15) ──
        ws.getColumn(1).width = 1.73;    // A
        ws.getColumn(2).width = 14;      // B
        ws.getColumn(3).width = 35;      // C
        ws.getColumn(4).width = 12;      // D
        ws.getColumn(5).width = 10;      // E
        ws.getColumn(6).width = 12;      // F
        ws.getColumn(7).width = 12;      // G
        ws.getColumn(8).width = 18;      // H
        ws.getColumn(9).width = 8;       // I
        ws.getColumn(10).width = 8;      // J
        ws.getColumn(11).width = 10;     // K
        ws.getColumn(12).width = 12;     // L
        ws.getColumn(13).width = 29;     // M
        ws.getColumn(14).width = 18;     // N
        ws.getColumn(15).width = 12;     // O

        // Agrupar estudiantes por semestreFinanciero
        const grupos = new Map<number, ReporteRow[]>();
        for (const r of data) {
            const sem = r.semestreFinanciero ?? 0;
            if (!grupos.has(sem)) grupos.set(sem, []);
            grupos.get(sem)!.push(r);
        }
        const semestres = Array.from(grupos.keys()).sort((a, b) => b - a);

        let currentRow = 1;

        for (const semestre of semestres) {
            const estudiantes = grupos.get(semestre)!;
            // Ordenar estudiantes por apellido/nombre
            estudiantes.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

            // Grupos de clase únicos para este semestre
            const gruposClase = [...new Set(estudiantes.map(e => e.grupoClase).filter(Boolean))].sort();

            const blockStart = currentRow;

            // ── Fila 1: Título ──
            const titulo = 'Matrícula Financiera-       ESTUDIANTES NUEVOS  SI  __  NO _X_ ( marcar con una x) \n\nMatrícula Financiera-       ESTUDIANTES REGULARES SI  _X_  NO __ ( marcar con una x) \n';
            ws.mergeCells(currentRow, 2, currentRow, 10); // B:J
            ws.getCell(currentRow, 2).value = titulo;
            ws.getCell(currentRow, 2).alignment = { wrapText: true, vertical: 'top' };
            ws.getRow(currentRow).height = 30.75;

            ws.mergeCells(currentRow, 11, currentRow, 15); // K:O
            ws.getCell(currentRow, 11).value = 'Matrícula Académica';
            ws.getCell(currentRow, 11).alignment = { wrapText: true, vertical: 'top' };
            currentRow++;

            // ── Fila 2: Semestre ──
            ws.mergeCells(currentRow, 11, currentRow, 15); // K:O
            ws.getCell(currentRow, 11).value = `Semestre: ____${semestre}____`;
            ws.getCell(currentRow, 11).alignment = { wrapText: true, vertical: 'top' };
            ws.getRow(currentRow).height = 21.75;
            currentRow++;

            // ── Filas 3-7: Cabeceras con celdas combinadas ──
            const headerStart = currentRow;

            // Fila 3: Nombres de columnas
            const headers = [
                '', '',  // A, B
                'Identificación', 'Nombres completos del estudiante',
                'Valor de Matrícula en SMMLV', 'SEM FINAN',
                '¿Aplica Descuento de Voto? ', 'Descuento por Egresado (UNICAUCA) ',
                'No. Res. de Beca', '% Beca', '', 'SEM ACAD',
                'Materias a Matricular ', '',  // L, M
                'Nombre Completo de Docente encargado de subir notas al sistema SIMCA por cada una de las asignaturas.',
                'Grupo Clase'
            ];
            headers.forEach((h, i) => {
                if (h) ws.getCell(currentRow, i + 1).value = h;
            });
            ws.getRow(currentRow).height = 21.75;
            currentRow++;

            // Fila 4: Instrucción materias
            ws.getCell(currentRow, 12).value = '*(Listar las materias a matricular para cada uno de los estudiantes)';
            ws.getRow(currentRow).height = 21.75;
            currentRow++;

            // Fila 5: Grupo clase
            ws.getCell(currentRow, 6).value = '(SI / NO)';
            ws.getCell(currentRow, 7).value = '(SI / NO)';
            ws.getCell(currentRow, 12).value = ' *(En caso de ser las mismas materias para todos los estudiantes combinar las celdas)';
            ws.getCell(currentRow, 15).value = gruposClase.join('-');
            ws.getRow(currentRow).height = 21.75;
            currentRow++;

            // Fila 6: Pendiente + Código-OID / Materia
            ws.mergeCells(currentRow, 8, currentRow, 10); // H:J
            ws.getCell(currentRow, 8).value = ' Pendiente: si aún no cuenta con No. Resolución';
            ws.getCell(currentRow, 12).value = 'Código-OID';
            ws.getCell(currentRow, 13).value = 'Materia';
            ws.getRow(currentRow).height = 33.75;
            currentRow++;

            // Combinar celdas de cabecera verticalmente
            const headerEnd = currentRow - 1;
            const mergeRows = [headerStart, headerStart + 1, headerStart + 2, headerStart + 3, headerStart + 4];
            const firstH = headerStart;
            const lastH = headerEnd;

            // Columnas que abarcan las 5 filas de cabecera
            [2, 3, 4, 5, 11].forEach(col => ws.mergeCells(firstH, col, lastH, col));
            // F y G: 3 filas arriba, 2 abajo
            ws.mergeCells(headerStart, 6, headerStart + 2, 6);
            ws.mergeCells(headerStart + 3, 6, headerEnd, 6);
            ws.mergeCells(headerStart, 7, headerStart + 2, 7);
            ws.mergeCells(headerStart + 3, 7, headerEnd, 7);
            // H: 4 filas arriba, 1 abajo (H:J)
            ws.mergeCells(headerStart, 8, headerStart + 3, 8);
            // I:J 4 filas
            ws.mergeCells(headerStart, 9, headerStart + 3, 10);
            // L:M fila 3
            ws.mergeCells(headerStart, 12, headerStart, 13);
            // L:M fila 4 y 5
            ws.mergeCells(headerStart + 1, 12, headerStart + 2, 13);
            // N: 5 filas
            ws.mergeCells(firstH, 14, lastH, 14);
            // O: 2 filas arriba, 3 abajo
            ws.mergeCells(headerStart, 15, headerStart + 1, 15);
            ws.mergeCells(headerStart + 2, 15, headerEnd, 15);

            // Centrar y wrap en cabeceras
            for (let r = headerStart; r <= headerEnd; r++) {
                for (let c = 2; c <= 15; c++) {
                    const cell = ws.getCell(r, c);
                    cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
                    cell.font = { size: 9 };
                }
            }

            // ── Filas de datos ──
            for (const est of estudiantes) {
                const dataStart = currentRow;
                const materias = est.materias || [];
                const numMaterias = Math.max(materias.length, 1);

                // Datos del estudiante
                ws.getCell(currentRow, 2).value = est.identificacion;
                ws.getCell(currentRow, 3).value = est.nombreCompleto;
                ws.getCell(currentRow, 4).value = est.valorMatriculaSMMLV != null ? est.valorMatriculaSMMLV : '';
                ws.getCell(currentRow, 5).value = est.semestreFinanciero ?? '';
                ws.getCell(currentRow, 6).value = est.aplicaDescuentoVoto ? 'SI' : 'NO';
                ws.getCell(currentRow, 7).value = est.aplicaDescuentoEgresado ? 'SI' : 'NO';
                ws.getCell(currentRow, 8).value = est.resolucionBeca || (est.porcentajeBeca != null ? '' : 'NO');
                ws.getCell(currentRow, 11).value = est.semestreAcademico ?? '';

                if (est.porcentajeBeca != null && est.porcentajeBeca > 0) {
                    ws.getCell(currentRow, 9).value = est.porcentajeBeca + '%';
                }

                if (numMaterias > 1) {
                    // Combinar celdas verticalmente para datos del estudiante
                    const mergeEnd = currentRow + numMaterias - 1;
                    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(col =>
                        ws.mergeCells(currentRow, col, mergeEnd, col)
                    );
                }

                // Materias y docentes
                if (materias.length === 0) {
                    ws.getCell(currentRow, 12).value = '';
                    ws.getCell(currentRow, 13).value = '';
                    ws.getCell(currentRow, 14).value = est.docenteEncargado || '';
                    ws.getCell(currentRow, 15).value = est.grupoClase || '';
                    currentRow++;
                } else {
                    for (let i = 0; i < materias.length; i++) {
                        ws.getCell(currentRow, 12).value = materias[i].codigoOid || '';
                        ws.getCell(currentRow, 13).value = materias[i].materia || '';
                        // Docente y grupo solo en primera fila
                        if (i === 0) {
                            ws.getCell(currentRow, 14).value = est.docenteEncargado || '';
                            ws.getCell(currentRow, 15).value = est.grupoClase || '';
                        }
                        // Si hay más materias que filas de docente/grupo, combinar
                        if (numMaterias > 1 && i === 0) {
                            ws.mergeCells(currentRow, 14, currentRow + numMaterias - 1, 14);
                            ws.mergeCells(currentRow, 15, currentRow + numMaterias - 1, 15);
                        }
                        currentRow++;
                    }
                }
            }

            // ── Notas al pie ──
            const footerStart = currentRow;
            ws.mergeCells(currentRow, 2, currentRow, 15);
            ws.getCell(currentRow, 2).value = '*Para aplicar descuento de voto se requiere en físico anexos certificados de votación vigente (29 de octubre de 2023) de lo contario no se efectuará el descuento de votación. ';
            ws.getRow(currentRow).height = 10.5;
            currentRow++;

            ws.mergeCells(currentRow, 2, currentRow, 15);
            ws.getCell(currentRow, 2).value = '* El descuento del 5% (Egresado) unicamente aplica para los estudiantes que hayan ejercido el derecho al voto y tengan el titulo profesional';
            ws.getRow(currentRow).height = 10.5;
            currentRow++;

            ws.getCell(currentRow, 2).value = 'SEM FINAN';
            ws.getCell(currentRow, 3).value = ' Semestre financiero';
            ws.getRow(currentRow).height = 10.5;
            currentRow++;

            ws.getCell(currentRow, 2).value = 'SEM ACAD';
            ws.getCell(currentRow, 3).value = 'Semestre Académico';
            ws.getRow(currentRow).height = 10.5;
            currentRow++;

            // ── 4 filas vacías de espaciado ──
            currentRow += 4;
        }

        // ── Bordes en todas las celdas con datos ──
        for (let r = 1; r < currentRow; r++) {
            for (let c = 2; c <= 15; c++) {
                const cell = ws.getCell(r, c);
                if (!cell.value) continue;
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // ── Descargar ──
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
}
