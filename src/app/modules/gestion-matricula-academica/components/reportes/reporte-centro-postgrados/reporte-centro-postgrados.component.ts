import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { gestion_matricula_financiera } from 'src/environments/environment';
import { utils, write } from 'xlsx';

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
        this.http.get<PeriodoAcademico[]>(`${this.financieraApi}/periodos`).subscribe({
            next: (data) => {
                this.periodos = (data || [])
                    .filter(p => p.estado === 'FINALIZADO' || p.estado === 'CERRADO')
                    .sort((a, b) => b.anio - a.anio || b.tagPeriodo - a.tagPeriodo);
                this.cargando = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los periodos' });
                this.cargando = false;
            },
        });
    }

    descargarReporte(): void {
        if (!this.periodoSeleccionado) return;
        this.descargando = true;
        const periodoId = this.periodoSeleccionado.id;
        const periodoLabel = `${this.periodoSeleccionado.anio}-${this.periodoSeleccionado.tagPeriodo}`;

        this.http.get<ReporteRow[]>(`${this.financieraApi}/reporte-centro-postgrados/${periodoId}`).subscribe({
            next: (data) => {
                try {
                    this.generarExcel(data, periodoLabel);
                    this.messageService.add({ severity: 'success', summary: 'Reporte generado', detail: 'Descarga iniciada' });
                } catch (e) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el Excel' });
                }
                this.descargando = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los datos' });
                this.descargando = false;
            },
        });
    }

    private generarExcel(data: ReporteRow[], periodoLabel: string): void {
        const rows: any[][] = [];

        // Headers
        rows.push(['', '', 'Identificación', 'Nombres completos del estudiante',
            'Valor Matrícula SMMLV', 'SEM FINAN', '¿Aplica Voto?',
            'Descuento Egresado', 'No. Res. Beca', '% Beca',
            '', 'SEM ACAD', 'Materias', '',
            'Docente encargado', 'Grupo']);

        // Data
        for (const r of data) {
            rows.push(['', '', r.identificacion, r.nombreCompleto,
                r.valorMatriculaSMMLV, r.semestreFinanciero,
                r.aplicaDescuentoVoto ? 'Sí' : 'No',
                r.aplicaDescuentoEgresado ? 'Sí' : 'No',
                r.resolucionBeca || '',
                r.porcentajeBeca != null ? r.porcentajeBeca + '%' : '',
                '', r.semestreAcademico,
                (r.materias || []).join(', '), '',
                r.docenteEncargado || '', r.grupoClase || '']);
        }

        const ws = utils.aoa_to_sheet(rows);
        ws['!cols'] = [
            { wch: 3 }, { wch: 3 }, { wch: 14 }, { wch: 35 },
            { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
            { wch: 18 }, { wch: 8 }, { wch: 3 }, { wch: 10 },
            { wch: 38 }, { wch: 3 }, { wch: 35 }, { wch: 8 }
        ];

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Matriculas');
        const buffer = write(wb, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Matriculas_${periodoLabel}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
