import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerStrategy } from '../error-handler.strategy';

@Injectable()
export class ForbiddenStrategy implements ErrorHandlerStrategy {
  constructor(private readonly messageService: MessageService) {}

  handle(_error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Acceso denegado',
      detail: 'No tiene permisos para realizar esta acción.',
    });
  }
}
