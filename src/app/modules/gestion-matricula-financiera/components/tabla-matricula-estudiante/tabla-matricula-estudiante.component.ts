import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Estudiante, MatriculaAcademica, Materia } from '../../models/domain-models';

interface GrupoMaterias {
    semestre: number;
    materias: Materia[];
}

@Component({
    selector: 'app-tabla-matricula-estudiante',
    templateUrl: './tabla-matricula-estudiante.component.html',
    styleUrls: ['./tabla-matricula-estudiante.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaMatriculaEstudianteComponent implements OnChanges {

    @Input() estudiante: Estudiante | null = null;

    // Helpers para mostrar en la vista
    becaResolucion: string = '-';
    becaPorcentaje: string = '';
    descuentoVoto: string = 'NO';
    descuentoEgresado: string = 'NO';
    valorMatricula: number = 0;
    valorEnSMLV: number = 0;
    materiasAgrupadas: GrupoMaterias[] = [];
    semestreAcademicoEstudiante: number = 0;
    esNuevo: boolean = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['estudiante'] && this.estudiante) {
            this.procesarDatosFinancieros();
            this.agruparMateriasPorSemestre();
        }
    }

    private procesarDatosFinancieros(): void {
        if (!this.estudiante) return;

        this.becaResolucion = '-';
        this.becaPorcentaje = '';
        this.descuentoVoto = 'NO';
        this.descuentoEgresado = 'NO';
        this.valorMatricula = 0;
        this.valorEnSMLV = 0;
        this.esNuevo = this.estudiante.semestreFinanciero === 1;

        const semestre = this.estudiante.semestreFinanciero || 1;
        this.valorEnSMLV = (semestre >= 1 && semestre <= 4) ? 6 : 1;

        if (this.estudiante.matriculasFinancieras && this.estudiante.matriculasFinancieras.length > 0) {
            const mat = this.estudiante.matriculasFinancieras[0];
            this.valorMatricula = mat.valorMatricula;
        }

        if (this.estudiante.descuentos) {
            const voto = this.estudiante.descuentos.find(d => d.tipoDescuento.toLowerCase().includes('voto'));
            this.descuentoVoto = voto ? 'SI' : 'NO';

            const egresado = this.estudiante.descuentos.find(d => d.tipoDescuento.toLowerCase().includes('egresado'));
            this.descuentoEgresado = egresado ? 'SI' : 'NO';
        }

        if (this.estudiante.becas && this.estudiante.becas.length > 0) {
            this.becaResolucion = this.estudiante.becas[0].resolucion || '-';
            this.becaPorcentaje = this.estudiante.becas[0].porcentaje ? `${this.estudiante.becas[0].porcentaje}%` : '';
        }
    }

    private agruparMateriasPorSemestre(): void {
        if (!this.estudiante?.matriculasAcademicas?.length) {
            this.materiasAgrupadas = [];
            this.semestreAcademicoEstudiante = 0;
            return;
        }

        // El semestre académico del estudiante es el mayor de sus matrículas académicas
        this.semestreAcademicoEstudiante = Math.max(
            ...this.estudiante.matriculasAcademicas.map(ma => ma.semestre || 0)
        );

        const gruposMap = new Map<number, Materia[]>();

        for (const matricula of this.estudiante.matriculasAcademicas) {
            for (const materia of matricula.materias) {
                const sem = materia.semestreAcademico || matricula.semestre;
                if (!gruposMap.has(sem)) {
                    gruposMap.set(sem, []);
                }
                gruposMap.get(sem)!.push(materia);
            }
        }

        this.materiasAgrupadas = Array.from(gruposMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([semestre, materias]) => ({ semestre, materias }));
    }

    getNombreCompleto(): string {
        return this.estudiante ? `${this.estudiante.nombre} ${this.estudiante.apellido}` : '';
    }

    trackByGrupo(_index: number, grupo: GrupoMaterias): number {
        return grupo.semestre;
    }

    trackByMatricula(_index: number, matricula: MatriculaAcademica): number {
        return matricula.semestre;
    }

    trackByMateria(_index: number, materia: Materia): string {
        return materia.codigo_oid;
    }
}
