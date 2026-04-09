import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerStrategy } from '../error-handler.strategy';

@Injectable()
export class DefaultErrorStrategy implements ErrorHandlerStrategy {
  constructor(private readonly messageService: MessageService) {}

  handle(error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error inesperado',
      detail: `Error inesperado (${error.status}). Intente nuevamente más tarde.`,
    });
  }
}
