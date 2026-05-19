# Bitácora de Implementación y Adaptación Visual: Lineamientos TIC v3 (Maestría en Computación)

Este documento detalla todas las modificaciones, configuraciones y desarrollos realizados en el front-end de la aplicación (`ms-maestriacomputacion-front`) para dar cumplimiento estricto a las directrices de identidad y accesibilidad establecidas en el **Manual del Sistema de Diseño Visual TIC v3 (Universidad del Cauca)**, aplicadas de manera transversal y con especial énfasis en los módulos de **Matrícula Financiera** e **Información Presupuestaria**.

---

## 1. Fundamento de Identidad Institucional (Paleta de Colores)

Se definieron e integraron como variables globales CSS en `:root` (dentro de `src/styles.scss`) los colores corporativos oficiales de la Universidad del Cauca, sustituyendo los colores genéricos o predeterminados del framework/plantilla (ej. azules de PrimeNG LARA):

```scss
:root {
    /* === PALETA INSTITUCIONAL OFICIAL (TIC v3) === */
    --color-primary: #000066;          /* Azul Unicauca (Oficial) */
    --color-primary-light: #5056AC;    /* Azul Unicauca Ligero */
    --color-primary-dark: #07184A;     /* Azul Unicauca Oscuro */
    
    --color-secondary: #9D0311;        /* Rojo Unicauca (Oficial) */
    --color-secondary-light: #DB141C;  /* Rojo Unicauca Ligero (Bordes / Acentuados) */
    
    /* === ACCESIBILIDAD === */
    --color-accessibility: #249300;    /* Verde Accesibilidad Oficial */
    
    /* === SEMÁNTICA Y ESTADOS === */
    --color-tertiary: #1D72D3;         /* Azul Informativo */
    --color-success: #5BAE40;          /* Verde Plan de Desarrollo / Pagado */
    --color-warning: #FFB000;          /* Amarillo Plan de Desarrollo / Pendiente */
    --color-error: #FF6D0A;            /* Naranja de Alerta Oficial / No Pagado */
    
    /* === NEUTROS === */
    --text-main: #454444;              /* Texto Principal (Gris Oscuro de alta legibilidad) */
    --text-secondary: #777680;         /* Texto Secundario */
    --border-light: #E0E0E0;
    --bg-light: #F4F4F4;
}
```

### Impacto y Aplicación:
*   **Encabezados y Títulos:** Todos los encabezados del sitio (`h1` a `h6`) heredan de forma predeterminada el color `--color-primary` (Azul Unicauca).
*   **Fondo de Componentes Clave:** El footer del layout principal ahora adopta la barra de colores institucional mediante un bloque decorativo con las proporciones cromáticas correctas.

---

## 2. Jerarquía Tipográfica y Escala de Desarrollo

Se eliminaron las fuentes predeterminadas del navegador e importaron las familias oficiales a través de `src/index.html` (Google Fonts):

*   **Titillium Web:** Empleada exclusivamente para títulos y elementos de encabezado (`h1` a `h6`) por su aspecto moderno, geométrico y corporativo.
*   **Open Sans:** Utilizada para todo el cuerpo de texto, párrafos y tablas gracias a sus excelentes propiedades de lectura en pantallas digitales.

### Estructura de Clases y Pesos Aplicados (`src/styles.scss`):

| Selector | Fuente | Peso (Weight) | Tamaño (Size) | Altura de Línea (Line Height) |
| :--- | :--- | :--- | :--- | :--- |
| **`h1, .h1`** | Titillium Web | **700 (Bold)** | 32px | 41px |
| **`h2, .h2`** | Titillium Web | **700 (Bold)** | 22px | 30px |
| **`h3, .h3`** | Titillium Web | **600 (SemiBold)**| 18px | 22.5px |
| **`h4, .h4`** | Titillium Web | **700 (Bold)** | 16px | 30px |
| **`h5, .h5`** | Titillium Web | **600 (SemiBold)**| 16px | 30px |
| **`h6, .h6`** | Titillium Web | **400 (Regular)** | 14px | 23px |
| **`body`** | Open Sans | **400 (Regular)** | 14px | 26px |

---

## 3. Módulos Afectados y Cambios Realizados

### A. Módulo de Matrícula Financiera
Se adaptaron las vistas de los estudiantes para reflejar un esquema visual limpio de alta fidelidad:
1.  **Etiquetas de Estado de Pago (Badges):**
    *   Se reemplazaron los colores estándar de PrimeNG por colores semánticos institucionales sólidos para denotar el estado de la matrícula.
    *   **Pagado (`true`):** Verde institucional (`--color-success` / `#5BAE40`).
    *   **No Pagado (`false`):** Rojo institucional (`--color-secondary-light` / `#DB141C`).
    *   **Pendiente (`null` / `undefined`):** Amarillo institucional (`--color-warning` / `#FFB000`).
2.  **Tarjeta de Solicitud de Revisión (Vista Coordinador):**
    *   Integración de una tarjeta de control (`p-card`) estilizada en el detalle del estudiante (`detalle-estudiante.component.html`), permitiendo al coordinador iniciar y enviar revisiones con botones que utilizan la paleta corporativa y micro-interacciones hover consistentes.

### B. Módulo de Información Presupuestaria
1.  **Estandarización Terminológica ("Excedentes Maestría"):**
    *   En cumplimiento con las directrices de claridad de la Maestría, se modificó el término visual **"Vigencias Anteriores"** por su nombre real y administrativo: **"Excedentes Maestría"**.
    *   **Reportes en Pantalla:** Actualización en `reporte-por-grupos.component.ts` de todos los títulos de presupuestos, tablas de proyecciones y diálogos informativos.
    *   **Reportes en Excel:** Actualización en `excel.service.ts` para que los libros generados dinámicamente y descargados por el usuario reflejen la columna e identificador exacto de *"Excedentes Maestría"*.

---

## 4. Componente Transversal: Footer Institucional Premium

Se rediseñó desde cero el componente `AppFooterComponent` para actuar como el ancla de marca de la aplicación. Cuenta con las siguientes características:

*   **Identificación Legal:** Inclusión del NIT oficial (`891500319-2`) y la leyenda de vigilancia del Ministerio de Educación Nacional.
*   **Bloque de Contacto Autorizado:** Datos directos de la Facultad de Ingeniería Electrónica y Telecomunicaciones, extensión del programa y correos de contacto (`eposgradosfiet@unicauca.edu.co`).
*   **Enlace de Soporte Directo:** Integración hacia la plataforma SATIS de la Universidad para soporte técnico.
*   **Sección de Logos:** Renderizado en alta calidad y con fondo contrastado (`#F4F4F4`) de los logos oficiales:
    *   Escudo Oficial de la Universidad del Cauca.
    *   Logotipo de Marca País **GOV.CO**.
    *   Certificaciones de calidad **ICONTEC** e **IQNet**.
*   **Redes Sociales:** Botones interactivos con hover de escala y filtros de color para las redes institucionales (LinkedIn, Facebook, Instagram, YouTube, TikTok y X).

---

## 5. Menú e Infraestructura de Accesibilidad Dinámica

Se diseñó e implementó un widget flotante persistente (`acc-menu` en color verde `--color-accessibility` / `#249300`) que permite a los usuarios adaptar toda la interfaz web según sus necesidades particulares de navegación.

### Características de Accesibilidad Soportadas:

1.  **Ajuste Dinámico de Tipografía:**
    *   Permite aumentar o reducir el tamaño de letra en un rango seguro de 14px a 24px en toda la página de manera reactiva mediante Angular `Renderer2`.
2.  **Ajuste Dinámico de Espaciado (Letter-Spacing):**
    *   Facilita la lectura ampliando o estrechando el espacio entre caracteres en un rango de -2px a 4px.
3.  **Escala de Grises Completa:**
    *   Filtro CSS inyectado en `document.documentElement` para eliminar distracciones de color y beneficiar a usuarios con dificultades de atención o fatiga visual.
4.  **Alto Contraste Invertido:**
    *   Inversión inteligente del 80% en los tonos cromáticos del sitio para garantizar legibilidad en entornos oscuros o a personas con baja visión.
5.  **Fuente Especializada para Dislexia (OpenDyslexic):**
    *   Carga y conmutación en tiempo real de la fuente de código abierto `OpenDyslexic` en todo el DOM, agregando peso a la base de los caracteres para prevenir la rotación visual de las letras.
6.  **Agrandamiento de Cursor:**
    *   Sustitución del puntero predeterminado por un cursor de alta escala y silueta de alto contraste para facilitar la ubicación espacial del cursor.
7.  **Resaltador de Enlaces:**
    *   Inyección de fondos amarillos y textos azules sobre todas las etiquetas de enlace (`<a>`) de forma instantánea.
8.  **Persistencia con LocalStorage:**
    *   El componente serializa y guarda la configuración de accesibilidad del usuario de manera que, al recargar el sitio web o navegar entre componentes, el diseño adaptativo se aplica de inmediato sin interrupciones.

---

Este conjunto de adaptaciones no solo asegura el cumplimiento de la norma técnica colombiana de accesibilidad web, sino que eleva la calidad estética general de la plataforma de la Maestría en Computación, brindando una experiencia premium, institucional y moderna.
