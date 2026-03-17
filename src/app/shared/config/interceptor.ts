import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AutenticacionService } from 'src/app/modules/gestion-autenticacion/services/autenticacion.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AutenticacionService,
        private messageService: MessageService
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let mensaje: string;

                if (!navigator.onLine || error.status === 0) {
                    mensaje = 'Error de conexión. Verifique su conexión a internet.';
                } else {
                    switch (error.status) {
                        case 400:
                            mensaje = 'Los datos enviados no son válidos. Por favor revise los campos.';
                            break;
                        case 401:
                            mensaje = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
                            break;
                        case 403:
                            mensaje = 'No tiene permisos para realizar esta acción.';
                            break;
                        case 404:
                            mensaje = 'El recurso solicitado no fue encontrado.';
                            break;
                        case 500:
                            mensaje = 'Error interno del servidor. Intente nuevamente más tarde.';
                            break;
                        default:
                            mensaje = `Error inesperado (${error.status}). Intente nuevamente más tarde.`;
                    }
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensaje
                });

                return throwError(() => error);
            })
        );
    }
}
