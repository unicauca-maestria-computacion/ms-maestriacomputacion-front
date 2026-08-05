import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// === INTERCEPCIÓN DE LOGINS MOCK PARA PRUEBAS (ANTES DE QUE ANGULAR BOOTSTRAPEE Y NORMALICE LA URL) ===
const initHref = window.location.href.toLowerCase();
let isMock = false;
let mockUser: any = null;
let mockToken = '';

if (initHref.includes('coordinador')) {
    isMock = true;
    mockUser = {
        id: 1,
        username: 'alberto',
        email: 'alberto@unicauca.edu.co',
        role: ['ROLE_COORDINADOR'],
        phoneNumber: '3110000000',
        academicCode: 'DOC001',
        firstName: 'ALBERTO',
        lastName: 'COORDINADOR',
        idType: 'CEDULA_CIUDADANIA',
        idNumber: '1061700000'
    };
    mockToken = 'mock-token-coordinador';
} else if (initHref.includes('estudiante')) {
    isMock = true;
    mockUser = {
        id: 121,
        username: 'bperdomo',
        email: 'bperdomo@unicauca.edu.co',
        role: ['ROLE_ESTUDIANTE'],
        phoneNumber: '300121',
        academicCode: '67_1002963109',
        firstName: 'BRAYAN DANIEL',
        lastName: 'PERDOMO',
        idType: 'CEDULA_CIUDADANIA',
        idNumber: '1002963109'
    };
    mockToken = 'mock-token-estudiante';
} else if (initHref.includes('tutor') || initHref.includes('docente')) {
    isMock = true;
    mockUser = {
        id: 1,
        username: 'alberto',
        email: 'alberto@unicauca.edu.co',
        role: ['ROLE_DOCENTE'],
        phoneNumber: '3110000000',
        academicCode: 'DOC001',
        firstName: 'ALBERTO',
        lastName: 'DOCENTE',
        idType: 'CEDULA_CIUDADANIA',
        idNumber: '12345678'
    };
    mockToken = 'mock-token-docente';
}

if (isMock && mockUser) {
    console.log('[Entry Interceptor] Detectado acceso mock. Guardando sesión...');
    localStorage.setItem('mockAuth', 'true');
    localStorage.setItem('loggedInUser', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);
    
    console.log('[Entry Interceptor] Redirigiendo limpiamente a la raíz...');
    window.location.replace(window.location.origin + '/');
} else {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
}
