import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PeriodoAcademicoDTOPeticion, PeriodoAcademicoDTORespuesta } from '../dto/periodo-academico.dto';
import { EstudianteDTORespuesta } from '../dto/estudiante.dto';

@Injectable({
    providedIn: 'root'
})
export class GestionMatriculaFinancieraFakeApiService {

    constructor() { }

    obtenerEstudiantes(periodo: PeriodoAcademicoDTOPeticion): Observable<EstudianteDTORespuesta[]> {
        const año = periodo.año;
        const per = periodo.periodo;

        const fechaA = new Date(`${año}-02-20T00:00:00`);
        const fechaB = new Date(`${año}-02-21T00:00:00`);
        const fechaC = new Date(`${año}-02-22T00:00:00`);

        const mockEstudiantes: EstudianteDTORespuesta[] = [
            {
                codigo: '1087453621',
                nombre: 'Laura',
                apellido: 'Pérez',
                identificacion: 1087453621,
                cohorte: '2023.1',
                periodoIngreso: '2023.1',
                semestreFinanciero: 3,
                matriculasFinancieras: [{ fechaMatricula: fechaA, valorMatricula: 7800000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [{ tipoDescuento: 'Votación', porcentaje: 10 }],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1024566421',
                nombre: 'María',
                apellido: 'Tobar',
                identificacion: 1024566421,
                cohorte: '2023.2',
                periodoIngreso: '2023.2',
                semestreFinanciero: 2,
                matriculasFinancieras: [{ fechaMatricula: fechaA, valorMatricula: 8200000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [],
                becas: [{ resolucion: 'RES-001', porcentaje: 50 }],
                matriculasAcademicas: []
            },
            {
                codigo: '1022453221',
                nombre: 'Diana',
                apellido: 'López',
                identificacion: 1022453221,
                cohorte: '2024.1',
                periodoIngreso: '2024.1',
                semestreFinanciero: 1,
                matriculasFinancieras: [{ fechaMatricula: fechaB, valorMatricula: 9000000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [{ tipoDescuento: 'Votación', porcentaje: 10 }],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1007554022',
                nombre: 'Natalia',
                apellido: 'García',
                identificacion: 1007554022,
                cohorte: '2024.1',
                periodoIngreso: '2024.1',
                semestreFinanciero: 1,
                matriculasFinancieras: [{ fechaMatricula: fechaB, valorMatricula: 9000000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1090733402',
                nombre: 'Sofía',
                apellido: 'Ramírez',
                identificacion: 1090733402,
                cohorte: '2024.1',
                periodoIngreso: '2024.1',
                semestreFinanciero: 1,
                matriculasFinancieras: [{ fechaMatricula: fechaC, valorMatricula: 9000000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1045678123',
                nombre: 'Carlos',
                apellido: 'Mendoza',
                identificacion: 1045678123,
                cohorte: '2024.1',
                periodoIngreso: '2024.1',
                semestreFinanciero: 1,
                matriculasFinancieras: [{ fechaMatricula: fechaA, valorMatricula: 9500000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1056789456',
                nombre: 'Andrés',
                apellido: 'Castro',
                identificacion: 1056789456,
                cohorte: '2023.2',
                periodoIngreso: '2023.2',
                semestreFinanciero: 2,
                matriculasFinancieras: [{ fechaMatricula: fechaB, valorMatricula: 8800000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [{ tipoDescuento: 'Votación', porcentaje: 10 }],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1067890789',
                nombre: 'Valentina',
                apellido: 'Ruiz',
                identificacion: 1067890789,
                cohorte: '2023.1',
                periodoIngreso: '2023.1',
                semestreFinanciero: 3,
                matriculasFinancieras: [{ fechaMatricula: fechaC, valorMatricula: 7500000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [],
                becas: [{ resolucion: 'RES-002', porcentaje: 25 }],
                matriculasAcademicas: []
            },
            {
                codigo: '1078901012',
                nombre: 'Andrés',
                apellido: 'Gómez',
                identificacion: 1078901012,
                cohorte: '2024.1',
                periodoIngreso: '2024.1',
                semestreFinanciero: 1,
                matriculasFinancieras: [{ fechaMatricula: fechaA, valorMatricula: 9200000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [],
                becas: [],
                matriculasAcademicas: []
            },
            {
                codigo: '1089012345',
                nombre: 'Juliana',
                apellido: 'Sánchez',
                identificacion: 1089012345,
                cohorte: '2022.2',
                periodoIngreso: '2022.2',
                semestreFinanciero: 4,
                matriculasFinancieras: [{ fechaMatricula: fechaB, valorMatricula: 6900000, objPeriodoAcademico: { periodo: per, año: año } }],
                descuentos: [{ tipoDescuento: 'Votación', porcentaje: 10 }],
                becas: [],
                matriculasAcademicas: []
            }
        ];
        return of(mockEstudiantes).pipe(delay(1000));
    }

    obtenerEstudiante(codigo: string): Observable<EstudianteDTORespuesta> {
        const mockEstudiante: EstudianteDTORespuesta = {
            codigo: codigo,
            nombre: 'Estudiante',
            apellido: 'Prueba',
            identificacion: Number(codigo),
            cohorte: '2024.1',
            periodoIngreso: '2024.1',
            semestreFinanciero: 1,
            matriculasFinancieras: [
                {
                    fechaMatricula: new Date(),
                    valorMatricula: 9500000,
                    objPeriodoAcademico: { periodo: 1, año: 2024 }
                }
            ],
            descuentos: [
                { tipoDescuento: 'Votación', porcentaje: 10 }
            ],
            becas: [
                 { resolucion: 'RES-2024-001', porcentaje: 50 }
            ],
            matriculasAcademicas: [
                {
                    semestre: 1,
                    objPeriodoAcademico: { periodo: 1, año: 2024 },
                    materias: [
                        {
                            codigo_oid: 'SIS-501',
                            materia: 'Ingeniería de Software Avanzada',
                            grupoClase: 'A',
                            semestreAcademico: 1,
                            objDocente: { nombre: 'Dr. Juan Pérez' }
                        },
                        {
                            codigo_oid: 'SIS-502',
                            materia: 'Arquitectura de Software',
                            grupoClase: 'A',
                            semestreAcademico: 1,
                            objDocente: { nombre: 'Dra. María Rodriguez' }
                        },
                         {
                            codigo_oid: 'SIS-503',
                            materia: 'Gestión de Proyectos TI',
                            grupoClase: 'B',
                            semestreAcademico: 1,
                            objDocente: { nombre: 'MSc. Carlos Lopez' }
                        }
                    ]
                }
            ]
        };
        return of(mockEstudiante).pipe(delay(500));
    }

    iniciarNuevaMatriculaFinanciera(): Observable<boolean> {
        return of(true).pipe(delay(500));
    }

    obtenerPeriodosAcademicos(): Observable<PeriodoAcademicoDTORespuesta[]> {
        const mockPeriodos: PeriodoAcademicoDTORespuesta[] = [
            { periodo: 1, año: 2023 },
            { periodo: 2, año: 2023 },
            { periodo: 1, año: 2024 },
            { periodo: 2, año: 2024 }
        ];
        return of(mockPeriodos).pipe(delay(500));
    }
}
