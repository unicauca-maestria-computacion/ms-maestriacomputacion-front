# 📦 Manual de Despliegue Local — Módulos Frontend + Microservicio

> **Anexo: Manual básico de despliegue**
> Este manual describe los pasos mínimos para desplegar localmente el frontend Angular 13 y el microservicio asociado al módulo documentado.

---

## 1. Información General

| Campo | Detalle |
|---|---|
| **Objetivo** | Describir los pasos mínimos para desplegar localmente el frontend y el microservicio correspondiente al módulo |
| **Alcance** | Frontend `ms-maestriacomputacion-front` (Angular 13) y microservicio Spring Boot del módulo |
| **Audiencia** | Equipo técnico (desarrollo y QA) |
| **Entorno** | Local (sin infraestructura externa) |

---

## 2. Requerimientos Técnicos

### 2.0 Herramientas Recomendadas

| Herramienta | Uso |
|---|---|
| **Visual Studio Code** | Edición del frontend Angular |
| **Extensión: Spring Boot Extension Pack** | Ejecutar el microservicio desde el IDE sin comandos manuales |
| **IntelliJ IDEA** *(opcional)* | Alternativa para el microservicio Spring Boot |

> 💡 Las extensiones de VS Code permiten ejecutar el microservicio directamente desde el IDE sin compilar o ejecutar todos los comandos manuales.

### 2.1 Frontend

| Requisito | Versión |
|---|---|
| Node.js | 16 LTS (recomendado) o Node 14 |
| npm | 6 |
| Angular CLI | 13 |

### 2.2 Microservicio `[nombre-del-microservicio]`

> 💡 **Instrucción:** Reemplaza `[nombre-del-microservicio]` con el nombre real del microservicio del módulo (ej: `gestion-matricula`, `gestion-cursos`, `gestion-periodos`).

| Requisito | Versión |
|---|---|
| Java JDK | 17 |
| Maven | 3.6 (o usar `./mvnw` incluido en el repo) |
| MySQL | 8 (o compatible) |

### 2.3 Puertos Locales Esperados

| Componente | Puerto |
|---|---|
| Frontend Angular | `4200` |
| Microservicio `[nombre-del-microservicio]` | `8087` |
| Base de datos MySQL | `3306` |

> 💡 Si hay conflicto de puertos, ajustar `server.port` en el microservicio y `api_url` correspondiente en el `environment.ts` del frontend.

---

## 3. Preparación del Entorno

### 3.1 Estructura de Repositorio (referencial)

```
ms-maestriacomputacion-front/        ← Frontend Angular 13
[nombre-del-microservicio]/          ← Microservicio Spring Boot del módulo
```

### 3.2 Repositorios

| Componente | Repositorio |
|---|---|
| **Frontend** | `GitHub - maestriacomputacion/ms-maestriacomputacion-front` |
| **Microservicio** | `GitHub - [usuario]/[nombre-del-microservicio]` |

> 💡 **Instrucción:** Reemplaza `[usuario]` y `[nombre-del-microservicio]` con los datos reales del repositorio del microservicio correspondiente al módulo.

### 3.3 Script de Base de Datos MySQL

Buscar el script en la carpeta compartida del proyecto:

```
[URL de carpeta compartida / Drive / repositorio donde está el script SQL]
```

El script crea y/o actualiza la base de datos `maestria_data` con las tablas necesarias para el módulo.

> 💡 Ejecutar el script antes de levantar el microservicio. Verificar que la base de datos `maestria_data` exista en MySQL antes de continuar.

### 3.4 Configuración de Entorno — Frontend

Editar `ms-maestriacomputacion-front/src/environments/environment.ts`:

```typescript
export const matricula_academica = {
  production: false,
  api_url: 'http://localhost:8087/api/',
};
```

**Notas:**
- Para pruebas locales del módulo, basta con que `api_url` apunte al microservicio en el puerto `8087`.
- El resto de endpoints puede mantenerse en local o en entornos de prueba según disponibilidad.
- No modificar `environment.prod.ts` para pruebas locales.

### 3.5 Configuración de Entorno — Microservicio

Editar `[nombre-del-microservicio]/src/main/resources/application.properties`:

```properties
server.port=8087

spring.datasource.url=jdbc:mysql://localhost:3306/maestria_data
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Email (recomendado usar variables de entorno)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=TU_USUARIO
spring.mail.password=TU_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Variables de entorno recomendadas para credenciales sensibles:**

| Variable | Descripción |
|---|---|
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la base de datos |
| `SPRING_MAIL_USERNAME` | Correo para envío de notificaciones |
| `SPRING_MAIL_PASSWORD` | Contraseña del correo |

> 💡 **Nunca versionar credenciales reales en `application.properties`.** Usar variables de entorno o un archivo `.env` ignorado por `.gitignore`.

---

## 4. Despliegue Local Paso a Paso

### 4.1 Base de Datos

1. Asegurarse de que **MySQL 8** esté activo y corriendo en el puerto `3306`.
2. Crear la base de datos si no existe:

```sql
CREATE DATABASE IF NOT EXISTS maestria_data
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

3. Ejecutar el script SQL del proyecto para crear las tablas necesarias:

```bash
mysql -u root -p maestria_data < script_maestria_data.sql
```

### 4.2 Microservicio `[nombre-del-microservicio]` (desarrollo)

```bash
cd [nombre-del-microservicio]
./mvnw spring-boot:run
```

> Alternativamente, desde **VS Code con Spring Boot Extension Pack**: abrir el proyecto y hacer clic en ▶ Run en el archivo principal de la aplicación (`*Application.java`).

API disponible en: `http://localhost:8087`

**Verificar que el microservicio levantó correctamente:**
- La consola debe mostrar `Started [NombreApplication] in X seconds`
- No deben aparecer errores de conexión a MySQL

### 4.3 Frontend (desarrollo)

```bash
cd ms-maestriacomputacion-front
npm install
npm start
```

Abrir en el navegador: `http://localhost:4200`

> 💡 Si es la primera vez que se instala el proyecto, `npm install` puede tardar varios minutos descargando las dependencias.

---

## 5. Verificación Rápida

Una vez levantados ambos componentes, verificar los siguientes puntos:

| Verificación | URL / Acción | Resultado Esperado |
|---|---|---|
| Frontend carga correctamente | `http://localhost:4200` | La pantalla de login o dashboard se muestra sin errores en consola |
| API del microservicio responde | `http://localhost:8087` | Retorna respuesta (puede ser 404 de ruta raíz, lo que indica que el server está activo) |
| Swagger UI disponible | `http://localhost:8087/swagger-ui.html` | Se muestra la documentación interactiva de los endpoints |
| OpenAPI JSON disponible | `http://localhost:8087/api-docs` | Se muestra el JSON de la especificación OpenAPI |
| Frontend consume el microservicio | Navegar al módulo correspondiente en `localhost:4200` | Los datos cargan correctamente desde `localhost:8087` sin errores CORS ni 0 en consola |

### 5.1 Verificación de Conectividad Frontend → Microservicio

Abrir las **DevTools del navegador** (F12) → pestaña **Network** y navegar al módulo:

- Las peticiones deben ir a `http://localhost:8087/api/...`
- Los códigos de respuesta deben ser `200 OK` para las consultas
- No deben aparecer errores **CORS** en la consola

> Si aparecen errores CORS, verificar la configuración `@CrossOrigin` o `WebMvcConfigurer` en el microservicio.

---

## 6. Solución de Problemas Comunes

| Problema | Causa probable | Solución |
|---|---|---|
| `npm install` falla | Versión de Node incompatible | Verificar que Node sea 16 LTS con `node -v` |
| `ng: command not found` | Angular CLI no instalado globalmente | Ejecutar `npm install -g @angular/cli@13` |
| Frontend no conecta al backend | `api_url` incorrecta en `environment.ts` | Verificar que apunte a `http://localhost:8087/api/` |
| Error CORS en consola del navegador | Microservicio no permite origen `localhost:4200` | Agregar `@CrossOrigin(origins = "http://localhost:4200")` o configurar `WebMvcConfigurer` |
| `Could not connect to MySQL` | MySQL no está corriendo o credenciales incorrectas | Verificar que MySQL esté activo y que `application.properties` tenga las credenciales correctas |
| `Unknown database 'maestria_data'` | La base de datos no fue creada | Ejecutar el script SQL de creación de base de datos |
| Puerto 8087 en uso | Otro proceso ocupa el puerto | Cambiar `server.port` en `application.properties` y `api_url` en `environment.ts` |
| Puerto 4200 en uso | Otra instancia de Angular corriendo | Ejecutar `npm start -- --port 4201` o detener el proceso previo |
| `java.lang.UnsupportedClassVersionError` | Versión de Java incorrecta | Verificar que Java 17 esté instalado con `java -version` |

---

## 7. Recomendaciones Finales

- Validar que **MySQL esté activo** y exista la base de datos `maestria_data` antes de levantar el microservicio.
- **No versionar credenciales reales** en `application.properties`. Usar variables de entorno.
- Si hay conflictos de puerto, ajustar `server.port` en el microservicio y `api_url` en el frontend.
- Mantener **Node 16 y Java 17** como versiones de referencia del proyecto.
- Ejecutar `npm install` cada vez que se haga `git pull` para asegurarse de tener dependencias actualizadas.
- Revisar la **consola del navegador** (F12) y la **consola del microservicio** en paralelo durante las pruebas para identificar errores de integración.

---

## 8. Módulos Cubiertos por Este Despliegue

> 💡 **Instrucción:** Lista aquí los módulos del frontend y los endpoints del microservicio que se activan con este despliegue. Esto ayuda al tester a saber exactamente qué puede probar una vez levantado el entorno.

| Módulo Frontend | Ruta Angular | Endpoint base del microservicio |
|---|---|---|
| `[Nombre del módulo, ej: Gestión de Matrículas]` | `/[ruta-angular]` | `http://localhost:8087/api/[recurso]` |
| `[Nombre del módulo]` | `/[ruta-angular]` | `http://localhost:8087/api/[recurso]` |
| *(agregar filas según sea necesario)* | | |

---

*Manual básico de despliegue — Proyecto ms-maestriacomputacion-front + microservicio Spring Boot · Entorno local*
