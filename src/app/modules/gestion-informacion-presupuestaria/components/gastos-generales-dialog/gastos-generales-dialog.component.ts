import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GastoGeneral } from '../../models/domain-models';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-gastos-generales-dialog',
  templateUrl: './gastos-generales-dialog.component.html',
  styleUrls: ['./gastos-generales-dialog.component.scss']
})
export class GastosGeneralesDialogComponent implements OnInit, OnChanges {
  @Input() display: boolean = false;
  @Input() gastos: GastoGeneral[] = [];
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onCambio = new EventEmitter<void>();

  gastosEditables: GastoGeneral[] = [];
  editingGastoKey: number | null = null;
  clonedGasto: { [id: number]: GastoGeneral } = {};
  nuevoGasto: GastoGeneral | null = null;
  guardandoGastos: boolean = false;

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['display']?.currentValue === true) {
      this.prepararGastos();
    }
  }

  prepararGastos() {
    this.gastosEditables = this.gastos ? [...this.gastos] : [];
    this.editingGastoKey = null;
    this.clonedGasto = {};
    this.nuevoGasto = null;
    this.guardandoGastos = false;
  }

  cerrar() {
    this.displayChange.emit(false);
  }

  agregarNuevaFilaGasto() {
    if (this.nuevoGasto !== null || this.editingGastoKey !== null) return;

    this.nuevoGasto = {
      idGastoGeneral: -1,
      categoria: '',
      descripcion: '',
      monto: 0
    };
    this.gastosEditables.push(this.nuevoGasto);
  }

  guardarNuevoGasto() {
    if (!this.nuevoGasto) return;

    if (!this.nuevoGasto.categoria || !this.nuevoGasto.descripcion || this.nuevoGasto.monto <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Todos los campos son requeridos y el monto debe ser mayor a 0' });
      return;
    }

    this.guardandoGastos = true;

    const gastoDTO = {
      idGastoGeneral: 0,
      categoria: this.nuevoGasto.categoria,
      descripcion: this.nuevoGasto.descripcion,
      monto: this.nuevoGasto.monto
    };

    this.facadeService.crearGastoGeneral(gastoDTO).subscribe({
      next: (gastoCreado) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Gasto creado correctamente' });
        this.onCambio.emit();
        this.nuevoGasto = null;
        this.guardandoGastos = false;
        this.prepararGastos(); // Recargar de lo que venga por Input
      },
      error: (err) => {
        console.error('Error al crear gasto general', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el gasto' });
        this.guardandoGastos = false;
      }
    });
  }

  cancelarNuevoGasto() {
    if (!this.nuevoGasto) return;
    const index = this.gastosEditables.findIndex(g => g.idGastoGeneral === -1);
    if (index !== -1) {
      this.gastosEditables.splice(index, 1);
    }
    this.nuevoGasto = null;
  }

  onGastoEditInit(gasto: GastoGeneral) {
    if (this.editingGastoKey !== null || this.nuevoGasto !== null) return;
    this.editingGastoKey = gasto.idGastoGeneral;
    this.clonedGasto[gasto.idGastoGeneral] = { ...gasto };
  }

  onGastoEditSave(gasto: GastoGeneral) {
    if (!gasto.categoria || !gasto.descripcion || gasto.monto <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Todos los campos son requeridos y el monto debe ser mayor a 0' });
      return;
    }

    this.guardandoGastos = true;

    const gastoDTO = {
      idGastoGeneral: gasto.idGastoGeneral,
      categoria: gasto.categoria,
      descripcion: gasto.descripcion,
      monto: gasto.monto
    };

    this.facadeService.actualizarGastoGeneral(gastoDTO).subscribe({
      next: (gastoActualizado) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Gasto actualizado correctamente' });
        this.onCambio.emit();
        delete this.clonedGasto[gasto.idGastoGeneral];
        this.editingGastoKey = null;
        this.guardandoGastos = false;
        this.prepararGastos();
      },
      error: (err) => {
        console.error('Error al actualizar gasto general', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el gasto' });
        this.onGastoEditCancel(gasto);
        this.guardandoGastos = false;
      }
    });
  }

  onGastoEditCancel(gasto: GastoGeneral) {
    if (this.clonedGasto[gasto.idGastoGeneral]) {
      const index = this.gastosEditables.findIndex(g => g.idGastoGeneral === gasto.idGastoGeneral);
      if (index !== -1) {
        this.gastosEditables[index] = { ...this.clonedGasto[gasto.idGastoGeneral] };
      }
      delete this.clonedGasto[gasto.idGastoGeneral];
    }
    this.editingGastoKey = null;
  }

  confirmarEliminarGasto(gasto: GastoGeneral) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este gasto?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarGasto(gasto);
      }
    });
  }

  eliminarGasto(gasto: GastoGeneral) {
    this.guardandoGastos = true;
    this.facadeService.eliminarGastoGeneral(gasto.idGastoGeneral).subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Gasto eliminado correctamente' });
          this.onCambio.emit();
          this.editingGastoKey = null;
          delete this.clonedGasto[gasto.idGastoGeneral];
          this.prepararGastos();
        }
        this.guardandoGastos = false;
      },
      error: (err) => {
        console.error('Error al eliminar gasto general', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el gasto' });
        this.guardandoGastos = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(value);
  }
}
