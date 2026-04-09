import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerStrategy } from '../error-handler.strategy';

@Injectable()
export class NoConnectionStrategy implements ErrorHandlerStrategy {
  constructor(private readonly messageService: MessageService) {}

  handle(_error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Sin conexión',
      detail: 'Error de conexión. Verifique su conexión a internet.',
    });
  }
}
