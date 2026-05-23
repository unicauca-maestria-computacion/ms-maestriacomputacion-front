import { gestion_autenticacion } from 'src/environments/environment';
import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/core/services/app.menu.service';
import { HttpClient } from '@angular/common/http';
import { AuthToken } from '../models/authToken';
import jwt_decode from 'jwt-decode';

interface Usuario {
    id?: number;
    username: string;
    email: string;
    role: string[];
    phoneNumber: string;
    academicCode: string;
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
}

@Injectable({
    providedIn: 'root',
})
export class AutenticacionService {
    private isLoggedInStatus: boolean = false;
    private userRole: string = '';
    private loggedInUser: Usuario | null = null;
    private isMockSession: boolean = false;
    loginSuccess$: EventEmitter<void> = new EventEmitter<void>();
    logoutSuccess$: EventEmitter<void> = new EventEmitter<void>();

    private backendAuthUrl = gestion_autenticacion.api_url;

    constructor(
        private afAuth: AngularFireAuth,
        private http: HttpClient,
        private menuService: MenuService,
        private router: Router,
        private ngZone: NgZone
    ) {
        // Autologin para pruebas/simulación (/coordinador y /estudiante)
        const href = window.location.href.toLowerCase();
        let isMock = false;
        let mockUser: Usuario | null = null;
        let mockToken = '';

        console.log('[AutenticacionService] Constructor inicializado. URL actual:', href);

        if (href.includes('coordinador')) {
            isMock = true;
            this.isMockSession = true;
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
            console.log('[AutenticacionService] Detectado acceso directo de Coordinador:', mockUser);
        } else if (href.includes('estudiante')) {
            isMock = true;
            this.isMockSession = true;
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
            console.log('[AutenticacionService] Detectado acceso directo de Estudiante:', mockUser);
        }

        if (isMock && mockUser) {
            console.log('[AutenticacionService] Aplicando sesión simulada en localStorage...');
            localStorage.setItem('mockAuth', 'true');
            localStorage.setItem('loggedInUser', JSON.stringify(mockUser));
            localStorage.setItem('token', mockToken);
            
            console.log('[AutenticacionService] Redirigiendo limpiamente a la raíz "/" para evitar desincronización de rutas...');
            window.location.replace(window.location.origin + '/');
            return;
        }

        // Recuperar el usuario autenticado del localStorage al iniciar
        const storedUser = localStorage.getItem('loggedInUser');
        const currentMockAuthStatus = localStorage.getItem('mockAuth');
        console.log('[AutenticacionService] Carga inicial de localStorage - storedUser:', storedUser ? 'existe' : 'null', 'mockAuth:', currentMockAuthStatus);
        
        if (currentMockAuthStatus === 'true') {
            this.isMockSession = true;
            console.log('[AutenticacionService] Sesión simulada restaurada de localStorage.');
        }

        if (storedUser) {
            this.isLoggedInStatus = true;
            this.loggedInUser = JSON.parse(storedUser);
        }

        // Suscribirse al estado de autenticación sin sobrescribir loggedInUser
        this.afAuth.authState.subscribe((user) => {
            const mockAuthVal = localStorage.getItem('mockAuth');
            console.log('[AutenticacionService] Emisión afAuth.authState - user:', user ? user.email : 'null', 'mockAuth:', mockAuthVal, 'isMockSession:', this.isMockSession);
            
            // Evitamos cerrar sesión si es una autenticación simulada (mockAuth)
            if (this.isMockSession || mockAuthVal === 'true') {
                console.log('[AutenticacionService] Ignorando Firebase authState porque mockAuth está activo.');
                return;
            }

            if (user && user.email?.endsWith('@unicauca.edu.co')) {
                console.log('[AutenticacionService] Autenticación real de Firebase detectada exitosamente.');
                this.isLoggedInStatus = true;

                // Configura solo los valores básicos, si no se ha autenticado con backend aún
                if (!this.loggedInUser) {
                    this.loggedInUser = {
                        username: user.displayName || '', // Asigna el nombre de usuario
                        email: user.email,
                        role: [], // Define un arreglo vacío o asigna roles según sea necesario
                        phoneNumber: '',
                        academicCode: '',
                        firstName: '',
                        lastName: '',
                        idType: '',
                        idNumber: '',
                    };
                    localStorage.setItem(
                        'loggedInUser',
                        JSON.stringify(this.loggedInUser)
                    );
                }

                this.menuService.emitAlertLogin();
                this.loginSuccess$.emit();
            } else {
                console.log('[AutenticacionService] Usuario no autenticado en Firebase y mockAuth inactivo. Ejecutando logout...');
                this.logout();
            }
        });
    }

    login(): void {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account', // Forzar el selector de cuenta
        });

        this.afAuth
            .signInWithPopup(provider)
            .then((result) => {
                if (
                    result.user &&
                    result.user.email?.endsWith('@unicauca.edu.co')
                ) {
                    result.user.getIdToken().then((firebaseToken) => {
                        const authToken = new AuthToken(firebaseToken);
                        this.sendTokenToBackend(authToken);
                    });
                } else {
                    this.logout();
                }
            })
            .catch((error) => {});
    }

    private sendTokenToBackend(authToken: AuthToken): void {
        this.http
            .post<{ token: string; tokenOriginal: string }>(
                this.backendAuthUrl,
                authToken
            )
            .subscribe(
                (response) => {
                    const backendAuthToken = AuthToken.nuevoAuthToken(response);
                    const jwtToken = backendAuthToken.token;

                    // Almacenar el beared token proporcionado por el backend
                    const tokenOriginal = response.tokenOriginal;
                    localStorage.setItem('token', tokenOriginal);

                    this.isLoggedInStatus = true;

                    // Decodificar el token y extraer la información del usuario
                    const decodedToken: any = jwt_decode(jwtToken);
                    this.loggedInUser = {
                        username: decodedToken.username,
                        email: decodedToken.correo,
                        role: decodedToken.rol || [],
                        phoneNumber: decodedToken.telefono,
                        academicCode: decodedToken.codigoAcademico,
                        firstName: decodedToken.nombres,
                        lastName: decodedToken.apellidos,
                        idType: decodedToken.tipoIdentificacion,
                        idNumber: decodedToken.numeroIdentificacion,
                    };

                    // Guardar el usuario decodificado en el localStorage
                    localStorage.setItem(
                        'loggedInUser',
                        JSON.stringify(this.loggedInUser)
                    );

                    this.menuService.emitAlertLogin();
                    this.loginSuccess$.emit();
                },
                (error) => {
                    this.logout();
                }
            );
    }

    logout(): void {
        console.log('[AutenticacionService] logout() invocado. Limpiando localStorage...');
        this.afAuth.signOut().then(() => {
            this.isLoggedInStatus = false;
            this.loggedInUser = null;
            // Limpiar el localStorage de los datos requeridos
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('token');
            localStorage.removeItem('est');
            localStorage.removeItem('estEgresado');
            localStorage.removeItem('mockAuth');
            console.log('[AutenticacionService] localStorage limpiado. Navegando a ""...');
            this.router.navigate(['']);

            // Emitir evento de logout
            this.logoutSuccess$.emit();
        });
    }

    isLoggedIn(): boolean {
        return this.isLoggedInStatus;
    }

    getLoggedInUser(): Usuario | null {
        return this.loggedInUser;
    }

    getRole(): string[] | null {
        return this.loggedInUser ? this.loggedInUser.role : [];
    }

    getFullName(): string {
        return this.loggedInUser ? this.loggedInUser.username : '';
    }

    getEmail(): string {
        return this.loggedInUser ? this.loggedInUser.email : '';
    }

    hasRole(role: string): boolean {
        return this.loggedInUser
            ? this.loggedInUser.role.includes(role)
            : false;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
