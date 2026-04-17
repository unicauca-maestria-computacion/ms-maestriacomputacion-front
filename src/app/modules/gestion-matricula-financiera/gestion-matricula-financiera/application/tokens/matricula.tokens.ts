/**
 * CAPA: Aplicación — InjectionToken
 * Vincula el Port de Matrícula con su Adapter concreto via DI de Angular.
 */

import { InjectionToken } from '@angular/core';
import { MatriculaRepositoryPort } from '../../domain/ports/matricula-repository.port';

export const MATRICULA_REPOSITORY = new InjectionToken<MatriculaRepositoryPort>(
  'MATRICULA_REPOSITORY'
);
