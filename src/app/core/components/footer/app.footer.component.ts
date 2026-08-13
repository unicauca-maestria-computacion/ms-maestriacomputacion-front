import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styles: [`
        :host {
            display: block;
            margin-left: -4rem;
            margin-right: -2rem;
            margin-bottom: -2rem;
        }

        @media (max-width: 991px) {
            :host {
                margin-left: -2rem;
            }
        }

        :host-context(.layout-overlay) {
            margin-left: -2rem;
        }

        :host-context(.layout-static-sidebar-inactive) {
            margin-left: -2rem;
        }

        /* ═══ Barra de colores institucional ═══ */
        .uni-footer-color-bar {
            display: flex;
            width: 100%;
            height: 11px;
            margin-top: 20px;
        }

        .uni-footer-color-bar__segment {
            flex: 1;
            height: 100%;
        }

        .uni-footer-color-bar__segment--rojo    { background-color: #DB141C; }
        .uni-footer-color-bar__segment--naranja  { background-color: #FF6C08; }
        .uni-footer-color-bar__segment--amarillo { background-color: #FFB000; }
        .uni-footer-color-bar__segment--azul     { background-color: #00AAE5; }
        .uni-footer-color-bar__segment--morado   { background-color: #5A00BA; }

        /* ═══ Main Footer Container ═══ */
        .uni-footer {
            background-color: #F4F4F4;
            padding: 60px 5% 40px 5%;
            font-family: 'Open Sans', sans-serif;
            color: #454444;
            border-top: 1px solid #E0E0E0;
        }

        .uni-footer__container {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            gap: 60px;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* ═══ Column 1: Logos ═══ */
        .uni-footer__col-logos {
            flex: 1.5;
            min-width: 300px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }

        .uni-footer__uni-title {
            font-size: 18px;
            font-weight: 700;
            margin: 0;
            color: #000066;
        }

        .uni-footer__uni-title a {
            color: inherit;
            text-decoration: none;
        }

        .uni-footer__project-title {
            font-size: 14px;
            font-weight: 600;
            margin: 5px 0;
            color: #454444;
        }

        .uni-footer__nit {
            font-size: 13px;
            font-weight: 400;
            margin: 0 0 20px 0;
        }

        .uni-footer__logo-group {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 25px;
            margin: 25px 0;
            flex-wrap: wrap;
        }

        .uni-footer__logo-main { height: 80px; width: auto; }
        .uni-footer__logo-gov { height: 35px; width: auto; }
        .uni-footer__logo-icontec { height: 45px; width: auto; }

        /* ═══ Social Media ═══ */
        .uni-footer__social-section {
            margin-top: 20px;
        }

        .uni-footer__social-title {
            font-size: 15px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #000066;
        }

        .uni-footer__social-links {
            display: flex;
            gap: 12px;
            justify-content: flex-start;
        }

        .uni-footer__social-icon {
            width: 32px;
            height: 32px;
            transition: transform 0.2s ease, filter 0.2s ease;
            cursor: pointer;
        }

        .uni-footer__social-icon:hover {
            transform: scale(1.1);
        }

        /* ═══ Columns 2 & 3: Links & Contact ═══ */
        .uni-footer__col-links, .uni-footer__col-contact {
            flex: 1;
            min-width: 250px;
        }

        .uni-footer__heading {
            font-size: 16px;
            font-weight: 700;
            margin: 0 0 15px 0;
            color: #000066;
            border-bottom: 2px solid #DB141C;
            display: inline-block;
            padding-bottom: 4px;
        }

        .uni-footer__list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .uni-footer__list-item {
            margin-bottom: 12px;
            font-size: 13.5px;
            line-height: 1.6;
        }

        .uni-footer__list-item a {
            color: #454444;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .uni-footer__list-item a:hover {
            color: #A3A3A3;
            text-decoration: underline;
        }

        /* ═══ Bottom Bar ═══ */
        .uni-footer__bottom {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #D1D1D1;
            text-align: center;
            font-size: 12px;
            font-style: italic;
        }

        .uni-footer__support-link {
            display: inline-block;
            color: #000066;
            text-decoration: none;
            font-weight: 600;
        }

        .uni-footer__support-link:hover {
            text-decoration: underline;
        }

        .uni-footer__bottom-links {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-top: 5px;
        }

        .uni-footer__version {
            color: #777680;
            font-size: 11px;
        }

        /* ═══ Accessibility Component ═══ */
        .acc-menu {
            position: fixed;
            top: 20%;
            right: 0;
            z-index: 1000;
        }

        .acc-menu__btn {
            width: 50px;
            height: 50px;
            background-color: var(--color-accessibility, #249300);
            border: 1px solid var(--color-accessibility, #249300);
            border-radius: 6px 0 0 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
        }

        .acc-menu__btn:hover {
            background-color: #ffffff;
        }

        .acc-menu__btn svg {
            fill: #ffffff;
            transition: fill 0.2s ease;
        }

        .acc-menu__btn:hover svg {
            fill: #4CAF50;
        }

        .acc-menu__dropdown {
            position: absolute;
            top: 55px;
            right: 0;
            background-color: #fff;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            width: 260px;
            border-radius: 8px;
            padding: 10px 0;
            list-style: none;
            margin: 0;
            overflow: hidden;
            display: none;
        }

        .acc-menu__dropdown--visible {
            display: block;
        }

        .acc-menu__item {
            padding: 12px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s ease;
            font-size: 13px;
            font-weight: 600;
            color: #454444;
        }

        .acc-menu__item:hover {
            background-color: #f9f9f9;
        }

        .acc-menu__item svg {
            width: 24px;
            height: 24px;
        }

        @media (max-width: 768px) {
            .uni-footer__container {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .uni-footer__col-links, .uni-footer__col-contact {
                width: 100%;
            }
        }
    `]
})
export class AppFooterComponent implements OnInit {
    showAccMenu = false;
    private config: any = {};

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {
        this.cargarConfiguracionesGuardadas();
    }

    toggleAccMenu(): void {
        this.showAccMenu = !this.showAccMenu;
    }

    private guardarConfiguracion(tipo: string, valor: any): void {
        this.config[tipo] = valor;
        localStorage.setItem('accesibilidad_config', JSON.stringify(this.config));
    }

    private cargarConfiguracionesGuardadas(): void {
        const saved = localStorage.getItem('accesibilidad_config');
        if (saved) {
            this.config = JSON.parse(saved);
            this.aplicarConfiguraciones();
        }
    }

    private aplicarConfiguraciones(): void {
        if (this.config.tamanioFuente) this.aplicarTamanio(this.config.tamanioFuente);
        if (this.config.espaciado !== undefined) this.aplicarEspaciado(this.config.espaciado);
        this.aplicarFiltro();
        if (this.config.fuenteDislexia) this.renderer.addClass(document.documentElement, 'dislexia-font');
        if (this.config.cursorGrande) this.renderer.addClass(document.documentElement, 'cursor-grande');
        if (this.config.enlacesResaltados) this.aplicarResaltadoEnlaces(true);
    }

    ajustarTamanio(operador: 'aumentar' | 'disminuir'): void {
        const tam_ref = this.getTamanioRef();
        if ((tam_ref <= 14 && operador === 'disminuir') || (tam_ref >= 24 && operador === 'aumentar')) return;

        const incremento = operador === 'aumentar' ? 2 : -2;
        const nuevoTam = tam_ref + incremento;
        this.aplicarTamanio(nuevoTam);
        this.guardarConfiguracion('tamanioFuente', nuevoTam);
    }

    private getTamanioRef(): number {
        const el = document.getElementById('siguenos-ref') || document.body;
        return parseFloat(window.getComputedStyle(el).fontSize) || 16;
    }

    // Se usa una variable CSS + clase global en <html> en lugar de recorrer el DOM con
    // querySelectorAll('*'), porque este componente solo se inicializa una vez: los
    // elementos que Angular renderiza después (al navegar entre rutas, tablas que cargan
    // datos, diálogos, etc.) nunca recibían el estilo inline y la opción parecía dejar
    // de funcionar tras el primer cambio de página.
    private aplicarTamanio(nuevoTam: number): void {
        document.documentElement.style.setProperty('--acc-font-size', `${nuevoTam}px`);
        this.renderer.addClass(document.documentElement, 'acc-font-override');
    }

    ajustarEspaciado(operador: 'aumentar' | 'disminuir'): void {
        const esp_ref = this.getEspaciadoRef();
        if ((esp_ref <= -2 && operador === 'disminuir') || (esp_ref >= 4 && operador === 'aumentar')) return;

        const incremento = operador === 'aumentar' ? 1 : -1;
        const nuevoEsp = esp_ref + incremento;
        this.aplicarEspaciado(nuevoEsp);
        this.guardarConfiguracion('espaciado', nuevoEsp);
    }

    private getEspaciadoRef(): number {
        const el = document.getElementById('siguenos-ref') || document.body;
        return parseFloat(window.getComputedStyle(el).letterSpacing) || 0;
    }

    private aplicarEspaciado(nuevoEsp: number): void {
        document.documentElement.style.setProperty('--acc-letter-spacing', `${nuevoEsp}px`);
        this.renderer.addClass(document.documentElement, 'acc-letter-spacing-override');
    }

    // Contraste y escala de grises se combinan en un solo `filter` en <html>: antes cada
    // toggle sobrescribía el filtro completo comprobando solo si contenía 'invert' o
    // 'grayscale', así que activar uno apagaba el otro en vez de sumarse.
    toggleContraste(): void {
        this.config.contraste = !this.config.contraste;
        this.aplicarFiltro();
        this.guardarConfiguracion('contraste', this.config.contraste);
    }

    toggleGrayscale(): void {
        this.config.grayscale = !this.config.grayscale;
        this.aplicarFiltro();
        this.guardarConfiguracion('grayscale', this.config.grayscale);
    }

    private aplicarFiltro(): void {
        const filtros: string[] = [];
        if (this.config.contraste) filtros.push('invert(80%)');
        if (this.config.grayscale) filtros.push('grayscale(100%)');
        this.renderer.setStyle(document.documentElement, 'filter', filtros.join(' '));
    }

    toggleDislexia(): void {
        const isSet = document.documentElement.classList.contains('dislexia-font');
        if (isSet) {
            this.renderer.removeClass(document.documentElement, 'dislexia-font');
        } else {
            this.renderer.addClass(document.documentElement, 'dislexia-font');
        }
        this.guardarConfiguracion('fuenteDislexia', !isSet);
    }

    toggleCursor(): void {
        const isSet = document.documentElement.classList.contains('cursor-grande');
        if (isSet) {
            this.renderer.removeClass(document.documentElement, 'cursor-grande');
        } else {
            this.renderer.addClass(document.documentElement, 'cursor-grande');
        }
        this.guardarConfiguracion('cursorGrande', !isSet);
    }

    toggleResaltarEnlaces(): void {
        const current = this.config.enlacesResaltados || false;
        this.aplicarResaltadoEnlaces(!current);
        this.guardarConfiguracion('enlacesResaltados', !current);
    }

    private aplicarResaltadoEnlaces(resaltar: boolean): void {
        if (resaltar) {
            this.renderer.addClass(document.documentElement, 'acc-resaltar-enlaces');
        } else {
            this.renderer.removeClass(document.documentElement, 'acc-resaltar-enlaces');
        }
    }

    restablecer(): void {
        localStorage.removeItem('accesibilidad_config');
        this.config = {};
        this.renderer.setStyle(document.documentElement, 'filter', '');
        this.renderer.removeClass(document.documentElement, 'dislexia-font');
        this.renderer.removeClass(document.documentElement, 'cursor-grande');
        this.aplicarResaltadoEnlaces(false);

        this.renderer.removeClass(document.documentElement, 'acc-font-override');
        document.documentElement.style.removeProperty('--acc-font-size');
        this.renderer.removeClass(document.documentElement, 'acc-letter-spacing-override');
        document.documentElement.style.removeProperty('--acc-letter-spacing');
    }

    openCentroRelevo(): void {
        window.open("https://centroderelevo.gov.co/632/w3-channel.html", "_blank");
        this.showAccMenu = false;
    }
}
