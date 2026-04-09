import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerStrategy } from '../error-handler.strategy';

@Injectable()
export class ServerErrorStrategy implements ErrorHandlerStrategy {
  constructor(private readonly messageService: MessageService) {}

  handle(_error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error del servidor',
      detail: 'Error interno del servidor. Intente nuevamente más tarde.',
    });
  }
}
