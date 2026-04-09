import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerStrategy } from '../error-handler.strategy';

@Injectable()
export class NotFoundStrategy implements ErrorHandlerStrategy {
  constructor(private readonly messageService: MessageService) {}

  handle(_error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'No encontrado',
      detail: 'El recurso solicitado no fue encontrado.',
    });
  }
}
