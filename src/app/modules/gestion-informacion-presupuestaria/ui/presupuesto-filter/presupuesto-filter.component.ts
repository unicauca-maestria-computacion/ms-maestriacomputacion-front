import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

export interface FiltroPresupuesto {
  anioFiscal?: number;
  estado?: string | null;
  codigoParcial?: string;
}

@Component({
  selector: 'app-presupuesto-filter',
  templateUrl: './presupuesto-filter.component.html',
  styleUrls: ['./presupuesto-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoFilterComponent implements OnInit, OnDestroy {

  @Input() anioFiscalActual: number = new Date().getFullYear();
  @Output() filtroAplicado = new EventEmitter<FiltroPresupuesto>();
  @Output() filtroLimpiado = new EventEmitter<void>();

  readonly estadosDisponibles: string[] = ['VIGENTE', 'COMPROMETIDO', 'DEVENGADO', 'PAGADO', 'ANULADO'];

  filterForm!: FormGroup;

  private readonly _destroy$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      anioFiscal:    [this.anioFiscalActual],
      estado:        [null],
      codigoParcial: [''],
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((valor: FiltroPresupuesto) => {
      this.filtroAplicado.emit(valor);
    });
  }

  onLimpiar(): void {
    this.filterForm.reset({ anioFiscal: this.anioFiscalActual, estado: null, codigoParcial: '' });
    this.filtroLimpiado.emit();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
