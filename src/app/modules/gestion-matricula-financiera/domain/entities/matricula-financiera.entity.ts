/**
 * CAPA: Dominio
 * Entidad central del módulo Matrícula Financiera.
 * TypeScript puro — sin imports de Angular.
 */

export type EstadoMatricula = 'PENDIENTE' | 'AL_DIA' | 'MORA' | 'EXONERADO' | 'BECADO' | 'ANULADO';
export type ModalidadPago   = 'CONTADO' | 'CUOTAS' | 'BECA' | 'CONVENIO';

export interface MatriculaFinancieraProps {
  readonly id: string;
  readonly codigoEstudiante: string;
  readonly nombreEstudiante: string;
  readonly periodoAcademico: string;
  readonly montoTotal: number;
  readonly montoPagado: number;
  readonly numeroCuotas: number;
  readonly cuotasPagadas: number;
  readonly estado: EstadoMatricula;
  readonly modalidadPago: ModalidadPago;
  readonly fechaMatricula: Date;
  readonly fechaVencimiento: Date;
}

export class MatriculaFinanciera {
  readonly id: string;
  readonly codigoEstudiante: string;
  readonly nombreEstudiante: string;
  readonly periodoAcademico: string;
  readonly montoTotal: number;
  readonly montoPagado: number;
  readonly numeroCuotas: number;
  readonly cuotasPagadas: number;
  readonly estado: EstadoMatricula;
  readonly modalidadPago: ModalidadPago;
  readonly fechaMatricula: Date;
  readonly fechaVencimiento: Date;

  private constructor(props: MatriculaFinancieraProps) {
    Object.assign(this, props);
  }

  static create(props: MatriculaFinancieraProps): MatriculaFinanciera {
    if (props.montoTotal < 0) {
      throw new Error('El monto total no puede ser negativo.');
    }
    if (props.montoPagado > props.montoTotal) {
      throw new Error('El monto pagado no puede superar el monto total.');
    }
    if (props.cuotasPagadas > props.numeroCuotas) {
      throw new Error('Las cuotas pagadas no pueden superar el número de cuotas.');
    }
    return new MatriculaFinanciera(props);
  }

  get saldoPendiente(): number {
    return this.montoTotal - this.montoPagado;
  }

  get porcentajePago(): number {
    if (this.montoTotal === 0) return 100;
    return (this.montoPagado / this.montoTotal) * 100;
  }

  get estaAlDia(): boolean {
    return this.estado === 'AL_DIA' || this.estado === 'EXONERADO' || this.estado === 'BECADO';
  }

  get tieneMora(): boolean {
    return this.estado === 'MORA';
  }
}
