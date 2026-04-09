/**
 * CAPA: Aplicación — InjectionToken
 * Vincula el Port (interface) con el Adapter concreto mediante el DI de Angular.
 * Aplica DIP: el Facade inyecta el token, nunca la clase HttpPresupuestoAdapter directamente.
 */

import { InjectionToken } from '@angular/core';
import { PresupuestoRepositoryPort } from '../../domain/ports/presupuesto-repository.port';

export const PRESUPUESTO_REPOSITORY = new InjectionToken<PresupuestoRepositoryPort>(
  'PRESUPUESTO_REPOSITORY'
);
