/**
 * CAPA: Infraestructura — Adapter
 * Implementación concreta del Port usando HttpClient de Angular.
 * Es el ÚNICO lugar del módulo que conoce la URL de la API y los DTOs del backend.
 * Aplica OCP: si cambia la API, solo se modifica este archivo.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PartidaPresupuestaria, EstadoPartida } from '../../domain/entities/partida-presupuestaria.entity';
import { FiltroPresupuesto, PresupuestoRepositoryPort } from '../../domain/ports/presupuesto-repository.port';

/** DTO que devuelve el backend — aislado en Infraestructura */
interface PartidaDto {
  id: string;
  codigo: string;
  descripcion: string;
  monto_asignado: number;
  monto_ejecutado: number;
  estado: string;
  anio_fiscal: number;
  fecha_creacion: string;
}

@Injectable()
export class HttpPresupuestoAdapter implements PresupuestoRepositoryPort {

  private readonly BASE_URL = '/api/presupuesto/partidas';

  constructor(private readonly http: HttpClient) {}

  getPartidas(filtro?: FiltroPresupuesto): Observable<PartidaPresupuestaria[]> {
    let params = new HttpParams();
    if (filtro?.anioFiscal) params = params.set('anio_fiscal', filtro.anioFiscal);
    if (filtro?.estado)     params = params.set('estado', filtro.estado);
    if (filtro?.codigoParcial) params = params.set('codigo', filtro.codigoParcial);

    return this.http.get<PartidaDto[]>(this.BASE_URL, { params }).pipe(
      map(dtos => dtos.map(this._mapToDomain))
    );
  }

  getPartidaById(id: string): Observable<PartidaPresupuestaria> {
    return this.http.get<PartidaDto>(`${this.BASE_URL}/${id}`).pipe(
      map(this._mapToDomain)
    );
  }

  crearPartida(partida: Omit<PartidaPresupuestaria, 'id' | 'fechaCreacion'>): Observable<PartidaPresupuestaria> {
    return this.http.post<PartidaDto>(this.BASE_URL, partida).pipe(
      map(this._mapToDomain)
    );
  }

  actualizarPartida(id: string, cambios: Partial<PartidaPresupuestaria>): Observable<PartidaPresupuestaria> {
    return this.http.patch<PartidaDto>(`${this.BASE_URL}/${id}`, cambios).pipe(
      map(this._mapToDomain)
    );
  }

  /** Mapea DTO del backend → Entidad de Dominio */
  private _mapToDomain(dto: PartidaDto): PartidaPresupuestaria {
    return PartidaPresupuestaria.create({
      id: dto.id,
      codigo: dto.codigo,
      descripcion: dto.descripcion,
      montoAsignado: dto.monto_asignado,
      montoEjecutado: dto.monto_ejecutado,
      estado: dto.estado as EstadoPartida,
      anioFiscal: dto.anio_fiscal,
      fechaCreacion: new Date(dto.fecha_creacion),
    });
  }
}
