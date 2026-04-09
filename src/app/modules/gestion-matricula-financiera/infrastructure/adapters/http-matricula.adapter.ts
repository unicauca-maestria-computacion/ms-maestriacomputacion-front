/**
 * CAPA: Infraestructura — Adapter
 * Implementación HTTP del Port de Matrícula.
 * Único lugar que conoce los DTOs del backend y las URLs de la API.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MatriculaFinanciera,
  EstadoMatricula,
  ModalidadPago,
} from '../../domain/entities/matricula-financiera.entity';
import { FiltroMatricula, MatriculaRepositoryPort } from '../../domain/ports/matricula-repository.port';

interface MatriculaDto {
  id: string;
  codigo_estudiante: string;
  nombre_estudiante: string;
  periodo_academico: string;
  monto_total: number;
  monto_pagado: number;
  numero_cuotas: number;
  cuotas_pagadas: number;
  estado: string;
  modalidad_pago: string;
  fecha_matricula: string;
  fecha_vencimiento: string;
}

@Injectable()
export class HttpMatriculaAdapter implements MatriculaRepositoryPort {

  private readonly BASE_URL = '/api/matricula/financiera';

  constructor(private readonly http: HttpClient) {}

  getMatriculas(filtro?: FiltroMatricula): Observable<MatriculaFinanciera[]> {
    let params = new HttpParams();
    if (filtro?.periodoAcademico)  params = params.set('periodo', filtro.periodoAcademico);
    if (filtro?.estado)            params = params.set('estado', filtro.estado);
    if (filtro?.codigoEstudiante)  params = params.set('codigo_estudiante', filtro.codigoEstudiante);

    return this.http.get<MatriculaDto[]>(this.BASE_URL, { params }).pipe(
      map(dtos => dtos.map(this._mapToDomain))
    );
  }

  getMatriculaById(id: string): Observable<MatriculaFinanciera> {
    return this.http.get<MatriculaDto>(`${this.BASE_URL}/${id}`).pipe(
      map(this._mapToDomain)
    );
  }

  getMatriculaByEstudiante(codigoEstudiante: string): Observable<MatriculaFinanciera[]> {
    return this.http.get<MatriculaDto[]>(`${this.BASE_URL}/estudiante/${codigoEstudiante}`).pipe(
      map(dtos => dtos.map(this._mapToDomain))
    );
  }

  registrarPago(matriculaId: string, montoPago: number): Observable<MatriculaFinanciera> {
    return this.http.post<MatriculaDto>(`${this.BASE_URL}/${matriculaId}/pagos`, { monto: montoPago }).pipe(
      map(this._mapToDomain)
    );
  }

  private _mapToDomain(dto: MatriculaDto): MatriculaFinanciera {
    return MatriculaFinanciera.create({
      id: dto.id,
      codigoEstudiante: dto.codigo_estudiante,
      nombreEstudiante: dto.nombre_estudiante,
      periodoAcademico: dto.periodo_academico,
      montoTotal: dto.monto_total,
      montoPagado: dto.monto_pagado,
      numeroCuotas: dto.numero_cuotas,
      cuotasPagadas: dto.cuotas_pagadas,
      estado: dto.estado as EstadoMatricula,
      modalidadPago: dto.modalidad_pago as ModalidadPago,
      fechaMatricula: new Date(dto.fecha_matricula),
      fechaVencimiento: new Date(dto.fecha_vencimiento),
    });
  }
}
