import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PeriodoAcademicoDTOPeticion } from '../dto/periodo-academico.dto';
import { EstudianteDTORespuesta } from '../dto/estudiante.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionMatriculaFinancieraFakeApiService {

    constructor() { }

    obtenerEstudiantes(periodo: PeriodoAcademicoDTOPeticion): Observable<EstudianteDTORespuesta[]> {
        const mockEstudiantes: EstudianteDTORespuesta[] = [
            {
                codigo: 1087453621,
                cohorte: '2023.1',
                periodoIngreso: '2023.1',
                semestreFinanciero: 3,
                matriculasFinancieras: [
                    {
                        fechaMatricula: new Date('2023-01-15'),
                        valorMatricula: 7800000,
                        objPeriodoAcademico: { periodo: 1, año: 2023 }
                    }
                ],
                descuentos: [
                    { tipoDescuento: 'Votación', porcentaje: 10 }
                ],
                becas: [],
                matriculasAcademicas: [
                    {
                        semestre: 1,
                        materias: [
                            {
                                codigo_oid: 'MAT01',
                                semestreAcademico: 1,
                                materia: 'Introducción a la Computación',
                                objDocente: { nombre: 'Juan Pérez' },
                                grupoClase: 'A'
                            }
                        ],
                        objPeriodoAcademico: { periodo: 1, año: 2023 }
                    }
                ]
            },
            {
                codigo: 1024566421,
                cohorte: '2023.2',
                periodoIngreso: '2023.2',
                semestreFinanciero: 2,
                matriculasFinancieras: [],
                descuentos: [],
                becas: [
                    { resolucion: 'RES-001', porcentaje: 50 }
                ],
                matriculasAcademicas: []
            }
        ];
        return of(mockEstudiantes).pipe(delay(1000));
    }

    obtenerEstudiante(codigo: number): Observable<EstudianteDTORespuesta> {
        const mockEstudiante: EstudianteDTORespuesta = {
            codigo: codigo,
            cohorte: '2024.1',
            periodoIngreso: '2024.1',
            semestreFinanciero: 1,
            matriculasFinancieras: [],
            descuentos: [],
            becas: [],
            matriculasAcademicas: []
        };
        return of(mockEstudiante).pipe(delay(500));
    }

    iniciarNuevaMatriculaFinanciera(): Observable<boolean> {
        return of(true).pipe(delay(500));
    }
}
