/**
 * CAPA: Dominio
 * Entidad central del módulo Presupuesto.
 * TypeScript puro — sin imports de Angular, sin HTTP, sin UI.
 * Aplica SRP: solo modela y valida la invariante de negocio.
 */

export type EstadoPartida = 'VIGENTE' | 'COMPROMETIDO' | 'DEVENGADO' | 'PAGADO' | 'ANULADO';

export interface PartidaPresupuestariaProps {
  readonly id: string;
  readonly codigo: string;
  readonly descripcion: string;
  readonly montoAsignado: number;
  readonly montoEjecutado: number;
  readonly estado: EstadoPartida;
  readonly anioFiscal: number;
  readonly fechaCreacion: Date;
}

export class PartidaPresupuestaria {
  readonly id: string;
  readonly codigo: string;
  readonly descripcion: string;
  readonly montoAsignado: number;
  readonly montoEjecutado: number;
  readonly estado: EstadoPartida;
  readonly anioFiscal: number;
  readonly fechaCreacion: Date;

  private constructor(props: PartidaPresupuestariaProps) {
    this.id = props.id;
    this.codigo = props.codigo;
    this.descripcion = props.descripcion;
    this.montoAsignado = props.montoAsignado;
    this.montoEjecutado = props.montoEjecutado;
    this.estado = props.estado;
    this.anioFiscal = props.anioFiscal;
    this.fechaCreacion = props.fechaCreacion;
  }

  /**
   * Factory method — garantiza que la entidad siempre sea válida (invariante).
   */
  static create(props: PartidaPresupuestariaProps): PartidaPresupuestaria {
    if (props.montoAsignado < 0) {
      throw new Error('El monto asignado no puede ser negativo.');
    }
    if (props.montoEjecutado > props.montoAsignado) {
      throw new Error('El monto ejecutado no puede superar el monto asignado.');
    }
    if (props.anioFiscal < 2000 || props.anioFiscal > 2100) {
      throw new Error('El año fiscal no es válido.');
    }
    return new PartidaPresupuestaria(props);
  }

  /** Value Object derivado: saldo disponible */
  get saldoDisponible(): number {
    return this.montoAsignado - this.montoEjecutado;
  }

  /** Porcentaje de ejecución presupuestaria */
  get porcentajeEjecucion(): number {
    if (this.montoAsignado === 0) return 0;
    return (this.montoEjecutado / this.montoAsignado) * 100;
  }

  get estaVigente(): boolean {
    return this.estado === 'VIGENTE';
  }
}
