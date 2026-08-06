import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { gestion_matricula_financiera } from 'src/environments/environment';
import * as XLSX from 'xlsx';

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

type MergeRange = { s: { r: number; c: number }; e: { r: number; c: number } };
type CellValue = string | number | null | undefined;

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
                next: (data) => {
                    try {
                        this.generarExcel(data, periodoLabel);
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

    private generarExcel(data: ReporteRow[], periodoLabel: string): void {
        const grupos = new Map<number, ReporteRow[]>();
        for (const r of data) {
            const sem = r.semestreFinanciero ?? 0;
            if (!grupos.has(sem)) grupos.set(sem, []);
            grupos.get(sem)!.push(r);
        }
        const semestres = Array.from(grupos.keys()).sort((a, b) => b - a);

        const rows: CellValue[][] = [];
        const merges: MergeRange[] = [];

        rows.push([], [], []);

        for (const semestre of semestres) {
            const estudiantes = grupos.get(semestre)!;
            estudiantes.sort((a, b) =>
                a.nombreCompleto.localeCompare(b.nombreCompleto)
            );
            const gruposClase = [
                ...new Set(
                    estudiantes.map((e) => e.grupoClase).filter(Boolean)
                ),
            ].sort();

            const rTitulo = rows.length;
            const titulo =
                'Matrícula Financiera-       ESTUDIANTES NUEVOS  SI  __  NO _X_ ( marcar con una x) \n\nMatrícula Financiera-       ESTUDIANTES REGULARES SI  _X_  NO __ ( marcar con una x) \n';
            rows.push([
                '',
                titulo,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'Matrícula Académica',
                '',
                '',
                '',
                '',
            ]);
            merges.push({ s: { r: rTitulo, c: 1 }, e: { r: rTitulo, c: 9 } });
            merges.push({ s: { r: rTitulo, c: 10 }, e: { r: rTitulo, c: 14 } });

            const rSem = rows.length;
            rows.push([
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                `Semestre: ____${semestre}____`,
                '',
                '',
                '',
                '',
            ]);
            merges.push({ s: { r: rSem, c: 10 }, e: { r: rSem, c: 14 } });

            const h0 = rows.length;
            rows.push([
                '',
                '',
                'Identificación',
                'Nombres completos del estudiante',
                'Valor de Matrícula en SMMLV',
                'SEM FINAN',
                '¿Aplica Descuento de Voto? ',
                'Descuento por Egresado (UNICAUCA) ',
                'No. Res. de Beca',
                '% Beca',
                '',
                'SEM ACAD',
                'Materias a Matricular ',
                '',
                'Nombre Completo de Docente encargado de subir notas al sistema SIMCA por cada una de las asignaturas.',
                'Grupo Clase',
            ]);

            const h1 = rows.length;
            rows.push([
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '*(Listar las materias a matricular para cada uno de los estudiantes)',
                '',
                '',
                '',
            ]);

            const h2 = rows.length;
            rows.push([
                '',
                '',
                '',
                '',
                '',
                '(SI / NO)',
                '(SI / NO)',
                '',
                '',
                '',
                '',
                ' *(En caso de ser las mismas materias para todos los estudiantes combinar las celdas)',
                '',
                '',
                gruposClase.join('-'),
            ]);

            const h3 = rows.length;
            rows.push([
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ' Pendiente: si aún no cuenta con No. Resolución',
                '',
                '',
                '',
                'Código-OID',
                'Materia',
                '',
                '',
            ]);

            [1, 2, 3, 4, 10].forEach((c) =>
                merges.push({ s: { r: h0, c }, e: { r: h3, c } })
            );
            merges.push({ s: { r: h0, c: 5 }, e: { r: h1, c: 5 } });
            merges.push({ s: { r: h2, c: 5 }, e: { r: h3, c: 5 } });
            merges.push({ s: { r: h0, c: 6 }, e: { r: h1, c: 6 } });
            merges.push({ s: { r: h2, c: 6 }, e: { r: h3, c: 6 } });
            merges.push({ s: { r: h0, c: 7 }, e: { r: h2, c: 7 } });
            merges.push({ s: { r: h3, c: 7 }, e: { r: h3, c: 9 } });
            merges.push({ s: { r: h0, c: 8 }, e: { r: h2, c: 9 } });
            merges.push({ s: { r: h0, c: 11 }, e: { r: h0, c: 12 } });
            merges.push({ s: { r: h1, c: 11 }, e: { r: h2, c: 12 } });
            merges.push({ s: { r: h0, c: 13 }, e: { r: h3, c: 13 } });
            merges.push({ s: { r: h0, c: 14 }, e: { r: h1, c: 14 } });
            merges.push({ s: { r: h2, c: 14 }, e: { r: h3, c: 14 } });

            for (const est of estudiantes) {
                const materias = est.materias || [];
                const numMaterias = Math.max(materias.length, 1);
                const d0 = rows.length;

                rows.push([
                    '',
                    est.identificacion,
                    est.nombreCompleto,
                    est.valorMatriculaSMMLV != null
                        ? est.valorMatriculaSMMLV
                        : '',
                    est.semestreFinanciero ?? '',
                    est.aplicaDescuentoVoto ? 'SI' : 'NO',
                    est.aplicaDescuentoEgresado ? 'SI' : 'NO',
                    est.resolucionBeca ||
                        (est.porcentajeBeca != null ? '' : 'NO'),
                    est.porcentajeBeca != null && est.porcentajeBeca > 0
                        ? est.porcentajeBeca + '%'
                        : '',
                    '',
                    est.semestreAcademico ?? '',
                    materias.length > 0 ? materias[0].codigoOid || '' : '',
                    materias.length > 0 ? materias[0].materia : '',
                    est.docenteEncargado || '',
                    est.grupoClase || '',
                ]);

                if (numMaterias > 1) {
                    const mergeEnd = d0 + numMaterias - 1;
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((c) =>
                        merges.push({ s: { r: d0, c }, e: { r: mergeEnd, c } })
                    );
                    merges.push({
                        s: { r: d0, c: 13 },
                        e: { r: mergeEnd, c: 13 },
                    });
                    merges.push({
                        s: { r: d0, c: 14 },
                        e: { r: mergeEnd, c: 14 },
                    });
                    for (let i = 1; i < materias.length; i++) {
                        rows.push([
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            materias[i].codigoOid || '',
                            materias[i].materia,
                            '',
                            '',
                        ]);
                    }
                }
            }

            const fn0 = rows.length;
            rows.push([
                '',
                '*Para aplicar descuento de voto se requiere en físico anexos certificados de votación vigente (29 de octubre de 2023) de lo contario no se efectuará el descuento de votación. ',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ]);
            merges.push({ s: { r: fn0, c: 1 }, e: { r: fn0, c: 14 } });

            const fn1 = rows.length;
            rows.push([
                '',
                '* El descuento del 5% (Egresado) unicamente aplica para los estudiantes que hayan ejercido el derecho al voto y tengan el titulo profesional',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ]);
            merges.push({ s: { r: fn1, c: 1 }, e: { r: fn1, c: 14 } });

            rows.push([
                '',
                'SEM FINAN',
                ' Semestre financiero',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ]);
            rows.push([
                '',
                'SEM ACAD',
                'Semestre Académico',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ]);

            rows.push([], [], [], [], [], []);
        }

        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws['!merges'] = merges;
        ws['!cols'] = [
            { wch: 1.73 },
            { wch: 14 },
            { wch: 35 },
            { wch: 12 },
            { wch: 10 },
            { wch: 12 },
            { wch: 12 },
            { wch: 18 },
            { wch: 8 },
            { wch: 8 },
            { wch: 10 },
            { wch: 12 },
            { wch: 29 },
            { wch: 18 },
            { wch: 12 },
        ];
        ws['!rows'] = Array(rows.length)
            .fill(null)
            .map((_, i) => {
                const r = rows[i];
                const firstVal = r
                    ? r.filter((c: CellValue) => c !== '' && c != null)[0]
                    : null;
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('Matrícula Financiera')
                )
                    return { hpx: 31 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('Semestre:')
                )
                    return { hpx: 22 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('Identificación')
                )
                    return { hpx: 22 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('*(Listar')
                )
                    return { hpx: 22 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('(SI / NO)')
                )
                    return { hpx: 22 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.includes('Pendiente')
                )
                    return { hpx: 34 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('*Para aplicar')
                )
                    return { hpx: 11 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal.startsWith('* El descuento')
                )
                    return { hpx: 11 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal === 'SEM FINAN'
                )
                    return { hpx: 11 };
                if (
                    firstVal &&
                    typeof firstVal === 'string' &&
                    firstVal === 'SEM ACAD'
                )
                    return { hpx: 11 };
                return {
                    hpx:
                        r && r.some((c: CellValue) => c !== '' && c != null)
                            ? 26
                            : 12,
                };
            });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Matriculas ${periodoLabel}`);
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

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
