import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorHandlerStrategy } from '../error-handler.strategy';

@Injectable()
export class BadRequestStrategy implements ErrorHandlerStrategy {
  constructor(private readonly messageService: MessageService) {}

  handle(_error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Datos inválidos',
      detail: 'Los datos enviados no son válidos. Por favor revise los campos.',
    });
  }
}
