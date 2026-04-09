/**
 * Contrato base para todas las estrategias de manejo de errores HTTP.
 * Aplica ISP: interfaz mínima y específica.
 * Aplica OCP: nuevas estrategias se agregan sin modificar el interceptor.
 */
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorHandlerStrategy {
  handle(error: HttpErrorResponse): void;
}
