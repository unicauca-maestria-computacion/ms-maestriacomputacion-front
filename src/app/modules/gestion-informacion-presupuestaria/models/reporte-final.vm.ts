/**
 * CAPA: Presentación — Presentation Model (View Model)
 * Encapsula los cálculos financieros del Reporte Final.
 * SRP: el componente solo renderiza; este modelo calcula.
 * Los cálculos se mueven aquí desde ReporteFinalComponent.
 */

import { ConfiguracionReporteFinanciero, ProyeccionEstudiante } from './domain-models';

export interface ReporteFinalVM extends ProyeccionEstudiante {
  readonly nombreEstudiante: string;
  readonly matricula: number;
  readonly valorBeca: number;
  readonly valorEgresado: number;
  readonly recursosComputacionales: number;
  readonly biblioteca: number;
  readonly grupoDescuentos: number;
  readonly totalNeto: number;
}

/**
 * Factory pura: transforma un ProyeccionEstudiante + configuración en un ReporteFinalVM.
 * Sin efectos secundarios. Fácil de testear unitariamente.
 */
export function mapToReporteFinalVM(
  e: ProyeccionEstudiante,
  cfg: ConfiguracionReporteFinanciero,
): ReporteFinalVM {
  // valorMatricula = nº de SMLVs; matrícula en COP = valorMatricula × valorSMLV
  const matricula = (cfg.valorMatricula || 0) * (cfg.valorSMLV || 0);
  const recursosComputacionales = cfg.recursosComputacionales || 0;
  const biblioteca = cfg.biblioteca || 0;

  // porcentajeBeca/Votacion/Egresado son ratios decimales (0.20 = 20%)
  const valorBeca      = matricula * (e.porcentajeBeca     || 0);
  const valorEgresado  = matricula * (e.porcentajeEgresado || 0);
  const valorVotacion  = matricula * (e.porcentajeVotacion || 0);
  const grupoDescuentos = valorBeca + valorEgresado + valorVotacion;
  const totalNeto = matricula + recursosComputacionales + biblioteca - grupoDescuentos;

  return {
    ...e,
    nombreEstudiante: `${e.nombre || ''} ${e.apellido || ''}`.trim(),
    matricula,
    valorBeca,
    valorEgresado,
    recursosComputacionales,
    biblioteca,
    grupoDescuentos,
    totalNeto,
  };
}
