import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacionService } from 'src/app/modules/gestion-autenticacion/services/autenticacion.service';
import { ERROR_HANDLER_MAP } from './error-handling/error-handler.tokens';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private readonly authService: AutenticacionService,
        private readonly injector: Injector
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Determinar la clave: sin conexión → 0, con código HTTP → el código, desconocido → 'default'
                const key = (!navigator.onLine || error.status === 0)
                    ? 0
                    : (ERROR_HANDLER_MAP[error.status] ? error.status : 'default');

                const token = ERROR_HANDLER_MAP[key as number | 'default'];
                this.injector.get(token).handle(error);

                return throwError(() => error);
            })
        );
    }
}
