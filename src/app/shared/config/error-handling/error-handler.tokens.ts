/**
 * InjectionTokens para cada estrategia de error.
 * El interceptor depende de estas abstracciones, nunca de las clases concretas (DIP).
 */
import { InjectionToken } from '@angular/core';
import { ErrorHandlerStrategy } from './error-handler.strategy';

export const NO_CONNECTION_STRATEGY  = new InjectionToken<ErrorHandlerStrategy>('NO_CONNECTION_STRATEGY');
export const BAD_REQUEST_STRATEGY    = new InjectionToken<ErrorHandlerStrategy>('BAD_REQUEST_STRATEGY');
export const UNAUTHORIZED_STRATEGY   = new InjectionToken<ErrorHandlerStrategy>('UNAUTHORIZED_STRATEGY');
export const FORBIDDEN_STRATEGY      = new InjectionToken<ErrorHandlerStrategy>('FORBIDDEN_STRATEGY');
export const NOT_FOUND_STRATEGY      = new InjectionToken<ErrorHandlerStrategy>('NOT_FOUND_STRATEGY');
export const SERVER_ERROR_STRATEGY   = new InjectionToken<ErrorHandlerStrategy>('SERVER_ERROR_STRATEGY');
export const DEFAULT_ERROR_STRATEGY  = new InjectionToken<ErrorHandlerStrategy>('DEFAULT_ERROR_STRATEGY');

/** Mapa de código HTTP → token de estrategia */
export const ERROR_HANDLER_MAP: Record<number | 'default', InjectionToken<ErrorHandlerStrategy>> = {
  0:         NO_CONNECTION_STRATEGY,
  400:       BAD_REQUEST_STRATEGY,
  401:       UNAUTHORIZED_STRATEGY,
  403:       FORBIDDEN_STRATEGY,
  404:       NOT_FOUND_STRATEGY,
  500:       SERVER_ERROR_STRATEGY,
  default:   DEFAULT_ERROR_STRATEGY,
};
