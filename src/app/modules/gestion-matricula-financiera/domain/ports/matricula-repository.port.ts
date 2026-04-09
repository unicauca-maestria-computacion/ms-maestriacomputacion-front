/**
 * CAPA: Dominio — Port
 * Contrato que define qué necesita la aplicación del repositorio de Matrícula.
 */

import { Observable } from 'rxjs';
import { MatriculaFinanciera } from '../../../gestion-matricula-financiera/domain/entities/matricula-financiera.entity';

export interface FiltroMatricula {
  readonly periodoAcademico?: string;
  readonly estado?: string;
  readonly codigoEstudiante?: string;
}

export interface MatriculaRepositoryPort {
  getMatriculas(filtro?: FiltroMatricula): Observable<MatriculaFinanciera[]>;
  getMatriculaById(id: string): Observable<MatriculaFinanciera>;
  getMatriculaByEstudiante(codigoEstudiante: string): Observable<MatriculaFinanciera[]>;
  registrarPago(matriculaId: string, montoPago: number): Observable<MatriculaFinanciera>;
}
