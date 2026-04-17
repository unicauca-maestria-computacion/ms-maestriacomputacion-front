import { Injectable } from '@angular/core';

/** Totales agregados para proyección y reporte final. */
export interface TotalesReporte {
  /** Suma de matrículas brutas (solo estaPago === true). */
  totalNeto: number;
  /** Suma de descuentos (solo estaPago === true). */
  totalDescuentos: number;
  /** totalNeto − totalDescuentos */
  totalIngresos: number;
}

/**
 * Servicio centralizado para extraer los totales financieros
 * enviados por el backend en los reportes.
 *
 * El backend SIEMPRE calcula y retorna totalNeto, totalDescuentos
 * y totalIngresos (solo estudiantes con estaPago === true).
 * El frontend no recalcula — confía en esos valores.
 */
@Injectable({ providedIn: 'root' })
export class TotalesReporteService {

  /**
   * Extrae los totales directamente desde el DTO del backend.
   * Si un campo llega null/undefined (no debería ocurrir), cae a 0.
   */
  fromBackend(dto: {
    totalNeto?: number | null;
    totalDescuentos?: number | null;
    totalIngresos?: number | null;
  }): TotalesReporte {
    return {
      totalNeto:       dto.totalNeto       ?? 0,
      totalDescuentos: dto.totalDescuentos ?? 0,
      totalIngresos:   dto.totalIngresos   ?? 0,
    };
  }
}
