import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPercent'
})
export class FormatPercentPipe implements PipeTransform {
  /**
   * El backend envía porcentajes como proporciones decimales (ej: 0.50 = 50%).
   * Si el valor está en el rango (0, 1] se multiplica ×100 antes de formatear.
   * Valores ya en escala de 100 (>1) se muestran directamente.
   */
  transform(value: number | null | undefined, decimals: number = 2): string {
    if (value == null || typeof value !== 'number' || isNaN(value)) return '–';
    const displayValue = (value > 0 && value <= 1) ? value * 100 : value;
    return `${Number(displayValue).toFixed(decimals)} %`;
  }
}
