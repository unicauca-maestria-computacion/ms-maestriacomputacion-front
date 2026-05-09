
/**
 * Mapea el estado de pago al severity semántico de PrimeNG p-tag.
 * Siguiendo lineamientos institucionales TIC v3:
 * - success → PAGADO
 * - danger  → NO PAGADO
 * - warning → PENDIENTE
 */
export function getEstadoMatriculaSeverity(estaPago: boolean | undefined | null): 'success' | 'warning' | 'danger' | 'info' {
    if (estaPago === true)  return 'success';
    if (estaPago === false) return 'danger';
    return 'warning';
}

/**
 * Retorna la etiqueta de texto institucional para el estado de pago.
 * Definido en Información Presupuestaria: PAGADO, NO PAGADO, PENDIENTE.
 */
export function getEstadoMatriculaLabel(estaPago: boolean | undefined | null): string {
    if (estaPago === true)  return 'PAGADO';
    if (estaPago === false) return 'NO PAGADO';
    return 'PENDIENTE';
}
