/**
 * CAPA: Dominio — Port (Interface)
 * Define el contrato que la capa de Aplicación necesita del mundo exterior.
 * No importa Angular, no importa HttpClient. TypeScript puro.
 * Aplica DIP: el dominio depende de esta abstracción, nunca del adapter concreto.
 */

import { Observable } from 'rxjs';
import { PartidaPresupuestaria } from '../entities/partida-presupuestaria.entity';

export interface FiltroPresupuesto {
  readonly anioFiscal?: number;
  readonly estado?: string;
  readonly codigoParcial?: string;
}

export interface PresupuestoRepositoryPort {
  getPartidas(filtro?: FiltroPresupuesto): Observable<PartidaPresupuestaria[]>;
  getPartidaById(id: string): Observable<PartidaPresupuestaria>;
  crearPartida(partida: Omit<PartidaPresupuestaria, 'id' | 'fechaCreacion'>): Observable<PartidaPresupuestaria>;
  actualizarPartida(id: string, cambios: Partial<PartidaPresupuestaria>): Observable<PartidaPresupuestaria>;
}
