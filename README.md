# Frontend - Maestría en Computación

Aplicación web desarrollada con **Angular** para la gestión académica y administrativa de la Maestría en Computación de la Universidad del Cauca. Consume múltiples microservicios backend vía API REST.

## 📋 Descripción

Este frontend centraliza la interfaz de usuario para: autenticación, gestión de estudiantes y docentes, asignaturas, documentos, solicitudes, examen de valoración, seguimiento a egresados, líneas de investigación, evaluación docente, matrícula financiera e **información presupuestaria** (reportes financieros, proyección de reporte y reportes por grupos).

## 🏗️ Arquitectura

El proyecto está organizado por **módulos funcionales** con lazy loading. Cada módulo puede tener sus propios servicios, componentes y rutas, y consume uno o más backends mediante URLs configuradas en `environment`.

### Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Componentes y servicios globales
│   │   ├── components/          # Main, Home, Error, Notfound, Access
│   │   └── constants/           # api-url.ts (URLs por microservicio)
│   ├── shared/                  # Módulo compartido (directivas, pipes, etc.)
│   ├── modules/                 # Módulos de negocio (lazy loaded)
│   │   ├── gestion-autenticacion/
│   │   ├── gestion-estudiantes/
│   │   ├── gestion-docentes/
│   │   ├── gestion-asignaturas/
│   │   ├── gestion-documentos/
│   │   ├── gestion-solicitudes/
│   │   ├── gestion-examen-de-valoracion/
│   │   ├── gestion-egresados/
│   │   ├── gestion-expertos/
│   │   ├── gestion-lineas-investigacion/
│   │   ├── gestion-evaluacion-docentes/
│   │   ├── gestion-matricula-financiera/
│   │   └── gestion-informacion-presupuestaria/   # Reportes y proyección
│   │       ├── pages/
│   │       │   ├── reporte-final/
│   │       │   ├── proyeccion-reporte/
│   │       │   └── reporte-por-grupos/
│   │       ├── services/        # API, Facade, Mapper, Excel
│   │       ├── models/          # Domain models y DTOs
│   │       └── dto/
│   └── app-routing.module.ts    # Rutas principales
├── environments/
│   ├── environment.ts           # Desarrollo (localhost)
│   └── environment.prod.ts      # Producción
├── index.html
├── main.ts
├── styles.scss
└── polyfills.ts
```

---

## 🔌 Integración con microservicios

Cada módulo consume su backend mediante URLs definidas en `src/environments/environment.ts` (desarrollo) y `environment.prod.ts` (producción). Las funciones en `src/app/core/constants/api-url.ts` construyen las rutas por servicio.

### Información presupuestaria

- **URL desarrollo:** `http://localhost:8091/api/`
- **Endpoints usados:**
  - `reportes-estudiantes/proyeccion` (GET)
  - `reportes-estudiantes/proyeccion-estudiante` (PUT)
  - `reportes-estudiantes/configuracion-proyeccion` (PUT)
  - `reportes-estudiantes/financiero` (POST)
  - `reportes-grupos/obtener` (GET)
  - `periodos-academicos` (GET)

El módulo **gestion-informacion-presupuestaria** incluye:

- **Reporte final:** vista del reporte financiero por periodo.
- **Proyección reporte:** tabla editable de proyección por estudiante (% votación, beca, egresado; totales calculados). Los porcentajes se muestran en escala 0–100 y se envían al backend en ratio 0–1.
- **Reporte por grupos:** consulta por periodo y año.

---

## 🛠️ Tecnologías utilizadas

- **Angular 13**
- **TypeScript 4.4**
- **PrimeNG 13** – componentes UI (tablas, formularios, mensajes)
- **PrimeFlex** – utilidades CSS
- **RxJS 7.4**
- **Angular Fire** – integración con Firebase (autenticación/almacenamiento según configuración)
- **Chart.js** – gráficos
- **xlsx** – exportación a Excel (reportes)
- **jspdf / pdfmake / pdf-lib** – generación de PDF
- **Node.js y npm** – gestión de dependencias y scripts

## 📦 Requisitos previos

- **Node.js** 14.x o 16.x (recomendado LTS)
- **npm** 6+ (o yarn)
- IDE (VS Code, WebStorm, etc.) con soporte para Angular/TypeScript

## 🚀 Instalación y configuración

### Paso 1: Verificar requisitos

```bash
node -v   # Debe ser v14 o v16 LTS
npm -v
```

### Paso 2: Clonar el repositorio

```bash
git clone https://github.com/unicauca-maestria-computacion/ms-maestriacomputacion-front.git
cd ms-maestriacomputacion-front
```

### Paso 3: Instalar dependencias

```bash
npm install
```

Si aparecen vulnerabilidades o fallos de peer dependencies, puedes usar:

```bash
npm install --legacy-peer-deps
```

### Paso 4: Configurar URLs de backend (desarrollo)

Las URLs por defecto para desarrollo están en `src/environments/environment.ts`. El microservicio de **información presupuestaria** usa:

- `gestion_informacion_presupuestaria.api_url`: por defecto `http://localhost:8091/api/`

Asegúrate de que el backend de información presupuestaria esté levantado en el puerto configurado (por ejemplo 8091). Para otros módulos (solicitudes, autenticación, expertos, etc.) revisa y ajusta las entradas correspondientes en el mismo archivo.

### Paso 5: Ejecutar en modo desarrollo

```bash
npm start
```

o:

```bash
ng serve
```

La aplicación quedará disponible en **http://localhost:4200**.

### Paso 6: Compilar para producción

```bash
npm run build
```

o:

```bash
ng build --configuration production
```

El resultado se genera en `dist/maestria-computacion-front/`. En producción se usa `environment.prod.ts` (sustituido automáticamente por la configuración de `angular.json`).

### Paso 7: Ejecutar pruebas

```bash
ng test
```

---

## 📡 Rutas principales (información presupuestaria)

Dentro del módulo **información presupuestaria** (`/informacion-presupuestaria`):

| Ruta                | Componente           | Descripción                                      |
|---------------------|----------------------|--------------------------------------------------|
| `reporte-final`      | ReporteFinalComponent| Reporte financiero por periodo                    |
| `proyeccion-reporte` | ProyeccionReporteComponent | Proyección editable por estudiante (%, totales) |
| `reporte-por-grupos`| ReportePorGruposComponent   | Reporte por grupos (periodo y año)             |

El acceso está protegido con `RoleGuard`; se espera el rol `ROLE_COORDINADOR`.

---

## 🔧 Configuración de entornos

- **Desarrollo:** `src/environments/environment.ts` – APIs en localhost (puertos 8091, 8095, 8096, etc.).
- **Producción:** `src/environments/environment.prod.ts` – URLs de apptest.unicauca.edu.co (o las que definas). Firebase en producción puede inyectarse vía variables `window['env']` si se usa un script de configuración en el despliegue.

---

## 🐛 Solución de problemas habituales

**Puerto 4200 en uso**

```bash
ng serve --port 4300
```

**Error de CORS al llamar al backend**

- Verifica que el backend de información presupuestaria (u otro) permita el origen `http://localhost:4200` en desarrollo.
- Revisa que la URL en `environment.ts` coincida con la del backend (puerto 8091 por defecto para informacion-presupuestaria).

**Errores tras `npm install`**

- Prueba `npm ci` o `npm install --legacy-peer-deps`.
- Borra `node_modules` y `package-lock.json` y vuelve a instalar si es necesario.

**Build de producción falla**

- Revisa que no haya imports a `environment.ts` con valores solo de desarrollo.
- Ejecuta `ng build --configuration production` y revisa los mensajes de error en consola.

---

## 📚 Dependencias principales

- `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`, `@angular/animations` (~13.0.0)
- `primeng`, `primeicons`, `primeflex`
- `rxjs` (~7.4.0)
- `@angular/fire`, `firebase`
- `xlsx`, `jspdf`, `pdfmake`, `pdf-lib`
- `chart.js`, `date-fns`, `jwt-decode`

Las versiones exactas se encuentran en `package.json`.

---

## 👥 Contribuidores

- Universidad del Cauca - Maestría en Computación

## 📄 Licencia

Este proyecto es parte del trabajo de grado de la Maestría en Computación de la Universidad del Cauca.

## 🔗 Repositorios relacionados

- [Backend Información Presupuestaria](https://github.com/unicauca-maestria-computacion/ms-maestriacomputacion-back-info-presupuestaria)

## 📞 Soporte

Para más información o soporte, contactar al equipo de desarrollo del proyecto.

---

**Versión:** 0.0.1  
**Última actualización:** 2024
