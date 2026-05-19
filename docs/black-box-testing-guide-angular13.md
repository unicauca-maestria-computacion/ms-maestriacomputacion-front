# 🧪 Guía de Pruebas de Caja Negra — Frontend Angular 13

> **¿Qué es este documento?**
> Una guía de referencia para diseñar y ejecutar pruebas de caja negra sobre cualquier aplicación frontend desarrollada en Angular 13. Está organizada por categorías de prueba, cada una con su objetivo, los escenarios que cubre, los casos concretos a ejecutar y los criterios de éxito. No requiere conocer el código fuente — solo el comportamiento esperado de la interfaz.
>
> **¿Quién lo usa?** QA testers, desarrolladores que hacen pruebas propias, o una IA que va a generar casos de prueba para un proyecto específico en Angular 13.

---

## 📌 Información General

| Campo | Valor |
|---|---|
| **Framework objetivo** | Angular 13 |
| **Tipo de pruebas** | Caja negra (Black-box testing) |
| **Enfoque** | Pruebas funcionales de interfaz de usuario |
| **Nivel** | Sistema / Integración UI |
| **Versión del documento** | 1.0 |

---

## 🗂️ Categorías de Prueba Cubiertas

| # | Categoría | Descripción breve |
|---|---|---|
| 1 | Navegación y Enrutamiento | Rutas, guards, redirecciones, lazy loading |
| 2 | Formularios Reactivos | Validaciones, estados del formulario, submit |
| 3 | Interacción con Botones y Controles | Habilitación, deshabilitación, acciones |
| 4 | Listados y Tablas | Carga, paginación, filtros, búsqueda, estados vacíos |
| 5 | Mensajes y Notificaciones del Sistema | Éxito, error, advertencia, informativo |
| 6 | Modales y Diálogos de Confirmación | Apertura, confirmación, cancelación |
| 7 | Consumo de APIs REST | Estados de carga, errores HTTP, datos correctos |
| 8 | Autenticación y Autorización | Login, guards de ruta, roles, sesión |
| 9 | Comportamiento Responsivo | Adaptación a distintos tamaños de pantalla |
| 10 | Accesibilidad Básica | Navegación por teclado, contraste, etiquetas |
| 11 | Rendimiento Percibido | Tiempos de carga, spinners, feedback visual |
| 12 | Flujos de Negocio Críticos | CRUD completo, flujos con dependencias entre módulos |

---

## 1. 🧭 Navegación y Enrutamiento

**Objetivo:** Verificar que el router de Angular gestiona correctamente las rutas, redirecciones, guards y la carga de módulos.

**Base técnica Angular 13:** El Router de Angular 13 usa `RouterModule`, guards (`CanActivate`, `CanDeactivate`, `CanLoad`), y lazy loading con `loadChildren`. Todos estos puntos deben probarse desde la UI sin acceder al código.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 1.1 | Ruta válida directa | Navegar a una URL válida del sistema | La vista correspondiente carga correctamente | Aparece pantalla en blanco, error 404 o vista incorrecta |
| 1.2 | Ruta inexistente | Navegar a una URL que no existe en el sistema | Redirige a la página de error 404 o a la ruta por defecto | El sistema no gestiona la ruta y muestra pantalla en blanco |
| 1.3 | Ruta protegida sin sesión | Intentar acceder directamente a una ruta protegida sin estar autenticado | Redirige al login o a una página de acceso denegado | La ruta protegida carga sin autenticación |
| 1.4 | Ruta protegida con sesión válida | Acceder a una ruta protegida con sesión activa | La vista carga correctamente sin redirigir | Redirige innecesariamente o no carga |
| 1.5 | Ruta protegida por rol | Acceder a una ruta restringida con un rol no autorizado | Redirige a página de acceso denegado o inicio | La vista carga para un rol que no debería verla |
| 1.6 | Navegación con parámetros de ruta | Navegar a una ruta con `:id` o query params válidos | La vista carga con la información del parámetro | Carga sin datos o muestra error |
| 1.7 | Navegación con parámetros inválidos | Navegar con un `:id` que no existe en el backend | El sistema muestra mensaje de "no encontrado" | Pantalla en blanco o error sin manejar |
| 1.8 | Botón "Volver" del navegador | Navegar entre vistas y usar el botón Atrás del navegador | Regresa a la vista anterior con su estado | La vista anterior no carga o pierde el estado |
| 1.9 | Recarga de página (F5) en ruta protegida | Recargar la página estando en una vista protegida | Si hay sesión activa, la vista se mantiene; si no, redirige al login | La sesión se pierde en recarga o la ruta no funciona |
| 1.10 | Lazy loading de módulo | Navegar a un módulo cargado con lazy loading por primera vez | El módulo carga (puede haber un breve spinner) y la vista se muestra | El módulo nunca carga o da error de compilación |
| 1.11 | Links internos (routerLink) | Hacer clic en enlaces internos del menú o de la vista | Navega sin recargar la página completa (SPA) | La página recarga completamente al navegar |

---

## 2. 📝 Formularios Reactivos

**Objetivo:** Verificar que los formularios reactivos (`ReactiveFormsModule`) validan correctamente, gestionan el estado de sus controles y envían datos solo cuando son válidos.

**Base técnica Angular 13:** Los formularios reactivos en Angular 13 usan `FormGroup`, `FormControl` y `FormArray`. Los estados clave son: `valid`, `invalid`, `pristine`, `dirty`, `touched`, `untouched`. Los mensajes de error se muestran típicamente cuando el campo es `touched` e `invalid`.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 2.1 | Campo obligatorio vacío con foco y sin foco | Hacer clic en un campo obligatorio y salir sin escribir nada | Aparece mensaje de error indicando que el campo es requerido | No aparece mensaje o el campo no se marca como inválido |
| 2.2 | Campo obligatorio vacío al hacer submit | Intentar enviar el formulario con campos obligatorios vacíos | El botón de submit está deshabilitado o el formulario muestra todos los errores | El formulario se envía con campos vacíos |
| 2.3 | Campo con longitud mínima | Ingresar texto más corto que el mínimo requerido | Aparece mensaje de error de longitud mínima | No aparece mensaje o el formulario acepta el valor |
| 2.4 | Campo con longitud máxima | Intentar escribir más caracteres del máximo permitido | El campo deja de aceptar caracteres o muestra mensaje de error | El campo acepta más caracteres del límite |
| 2.5 | Campo de email con formato inválido | Ingresar texto sin formato de email (sin @, sin dominio) | Aparece mensaje de error de formato de email | El campo acepta el valor inválido sin error |
| 2.6 | Campo numérico con valor no numérico | Ingresar letras en un campo que solo acepta números | El campo no acepta letras o muestra mensaje de error | El campo acepta letras y permite continuar |
| 2.7 | Campo de fecha con fecha inválida | Ingresar una fecha en formato incorrecto o fuera de rango | Aparece mensaje de error de fecha inválida | La fecha inválida es aceptada |
| 2.8 | Validación cruzada entre campos | Ingresar fechas donde la fecha final es anterior a la inicial | El sistema muestra un mensaje de error de inconsistencia | El formulario acepta la inconsistencia sin avisar |
| 2.9 | Habilitación del botón de acción | Llenar todos los campos obligatorios correctamente | El botón de submit/guardar se habilita | El botón permanece deshabilitado con datos válidos |
| 2.10 | Deshabilitación del botón de acción | Limpiar o invalidar un campo obligatorio después de haberlo llenado | El botón de submit/guardar se deshabilita nuevamente | El botón permanece habilitado con datos inválidos |
| 2.11 | Envío exitoso del formulario | Llenar todos los campos válidos y hacer submit | El sistema procesa el formulario y muestra confirmación | Error al enviar con datos válidos |
| 2.12 | Reset del formulario | Cancelar o limpiar el formulario después de escribir datos | El formulario vuelve a su estado inicial sin datos | Los datos persisten después del reset |
| 2.13 | Campos con selector (dropdown) | Seleccionar una opción de un campo select | El campo registra la opción seleccionada y actualiza el formulario | El campo no registra la selección |
| 2.14 | Carga dinámica de opciones en select | Seleccionar un valor que dispara la carga de otro select dependiente | El segundo select se actualiza con las opciones correspondientes | El segundo select no se actualiza o muestra opciones incorrectas |
| 2.15 | Campo de texto con caracteres especiales | Ingresar caracteres especiales (`<`, `>`, `"`, `'`, `&`) | El campo los acepta o los sanitiza correctamente sin romper la UI | La interfaz se rompe o el backend rechaza los caracteres sin mensaje |
| 2.16 | Formulario en modo edición con datos precargados | Abrir el formulario de edición de un registro existente | Los campos muestran los valores actuales del registro | Los campos aparecen vacíos o con datos incorrectos |

---

## 3. 🔘 Interacción con Botones y Controles

**Objetivo:** Verificar que los controles interactivos (botones, toggles, checkboxes, radios) responden correctamente según el estado del sistema.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 3.1 | Botón deshabilitado no ejecuta acción | Hacer clic en un botón deshabilitado | No ocurre ninguna acción ni navegación | El botón deshabilitado ejecuta alguna acción |
| 3.2 | Botón habilitado ejecuta acción correcta | Hacer clic en un botón habilitado | Ejecuta la acción correspondiente (guardar, navegar, abrir modal) | No ocurre nada o ejecuta una acción incorrecta |
| 3.3 | Doble clic en botón de submit | Hacer doble clic rápido en el botón de guardar/confirmar | Solo se ejecuta una vez la acción (el botón se deshabilita tras el primer clic) | Se envían dos peticiones al backend o se duplica el registro |
| 3.4 | Botón de cancelar descarta cambios | Hacer cambios en un formulario y hacer clic en Cancelar | Los cambios no se guardan y la UI regresa al estado anterior | Los cambios se guardan aunque se canceló |
| 3.5 | Checkbox selección/deselección | Marcar y desmarcar un checkbox | El estado del checkbox y del modelo cambian correctamente | El checkbox no refleja su estado o no actualiza el modelo |
| 3.6 | Radio buttons excluyentes | Seleccionar un radio button cuando ya hay otro seleccionado | Solo queda seleccionado el último elegido | Varios radio buttons quedan seleccionados al mismo tiempo |
| 3.7 | Toggle activa/desactiva funcionalidad | Activar y desactivar un toggle | La funcionalidad asociada se activa o desactiva y la UI refleja el cambio | El toggle cambia visualmente pero no afecta la funcionalidad |
| 3.8 | Botón de acción destructiva muestra confirmación | Hacer clic en un botón de eliminar o acción irreversible | Aparece un diálogo de confirmación antes de ejecutar | La acción se ejecuta directamente sin confirmar |

---

## 4. 📋 Listados y Tablas

**Objetivo:** Verificar que los listados de datos cargan correctamente, paginan, filtran y gestionan el estado vacío.

**Base técnica Angular 13:** Los listados suelen implementarse con `*ngFor`, y la paginación con `MatPaginator` (Angular Material) o componentes propios. Los filtros reaccionan a eventos del formulario.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 4.1 | Carga inicial del listado | Acceder a una vista con tabla o listado | Los datos se muestran correctamente en la tabla | La tabla aparece vacía teniendo datos, o no carga |
| 4.2 | Estado vacío del listado | Acceder a un listado sin registros disponibles | Se muestra un mensaje informativo ("No se encontraron registros") | La tabla aparece en blanco sin mensaje o muestra error |
| 4.3 | Paginación — avanzar página | Hacer clic en "Siguiente página" en un listado paginado | Carga la siguiente página de registros | No cambia la página o carga los mismos datos |
| 4.4 | Paginación — retroceder página | Hacer clic en "Página anterior" | Carga la página anterior correctamente | Retrocede más de una página o no cambia |
| 4.5 | Paginación — cambiar registros por página | Cambiar el selector de "N registros por página" | La tabla se actualiza con el nuevo número de registros | El selector no tiene efecto |
| 4.6 | Filtro con resultados | Escribir un término de búsqueda que tiene coincidencias | La tabla muestra solo los registros que coinciden | Muestra todos los registros ignorando el filtro |
| 4.7 | Filtro sin resultados | Escribir un término de búsqueda sin coincidencias | La tabla muestra mensaje de "sin resultados" | Muestra registros que no coinciden o rompe la tabla |
| 4.8 | Filtro por columna específica | Aplicar filtro por una columna particular (ej. estado, fecha, tipo) | Solo filtra por esa columna y muestra resultados correctos | Filtra por columna incorrecta o mezcla columnas |
| 4.9 | Limpiar filtro | Borrar el texto del filtro o hacer clic en "Limpiar" | La tabla regresa a mostrar todos los registros | La tabla queda vacía o no regresa al estado original |
| 4.10 | Orden de columnas | Hacer clic en el encabezado de una columna ordenable | Los datos se reordenan ascendente/descendente | El orden no cambia o los datos se desordenan incorrectamente |
| 4.11 | Actualización del listado tras acción | Crear, editar o eliminar un registro y volver al listado | El listado refleja el cambio inmediatamente | El listado muestra datos desactualizados |
| 4.12 | Acciones por fila (editar, eliminar, ver) | Hacer clic en los íconos de acción de una fila específica | La acción se aplica solo a esa fila | La acción se aplica a la fila incorrecta o a todas |

---

## 5. 💬 Mensajes y Notificaciones del Sistema

**Objetivo:** Verificar que el sistema comunica correctamente al usuario el resultado de cada operación mediante mensajes claros, precisos y con el tipo correcto (éxito, error, advertencia, información).

**Base técnica Angular 13:** Suelen implementarse con `MatSnackBar`, `MatDialog`, componentes de alerta propios, o librerías como `ngx-toastr`.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 5.1 | Mensaje de éxito tras operación exitosa | Completar una operación correctamente (crear, actualizar, eliminar) | Aparece un mensaje de confirmación positiva (verde / ✓) con descripción clara | No aparece mensaje, aparece uno de error, o el mensaje es ambiguo |
| 5.2 | Mensaje de error tras falla en backend | Ejecutar una acción cuando el backend retorna error | Aparece mensaje de error descriptivo (rojo / ✗) informando qué falló | No aparece mensaje, la UI queda en estado de carga, o aparece mensaje de éxito |
| 5.3 | Mensaje de validación en formulario | Dejar campo obligatorio vacío y mover el foco | Aparece mensaje de error específico debajo del campo afectado | No aparece mensaje o aparece en ubicación incorrecta |
| 5.4 | Mensaje de advertencia en acción de riesgo | Intentar realizar una acción potencialmente destructiva | Aparece mensaje o modal de advertencia solicitando confirmación | La acción se ejecuta directamente sin advertencia |
| 5.5 | Mensaje informativo en estado vacío | Acceder a una sección sin datos disponibles | Aparece mensaje informativo neutro explicando la situación | Pantalla en blanco o mensaje de error confuso |
| 5.6 | Duración y cierre del mensaje toast | Aparecer un toast/snackbar de éxito o error | El mensaje se cierra automáticamente después del tiempo definido o al hacer clic en cerrar | El mensaje no desaparece nunca o desaparece demasiado rápido |
| 5.7 | Un solo mensaje por acción | Ejecutar una acción que muestra mensaje | Solo aparece un mensaje (no se apilan varios del mismo tipo) | Aparecen múltiples mensajes duplicados |
| 5.8 | Mensaje de error HTTP 401 | Operar con token expirado o sesión inválida | El sistema muestra mensaje de sesión expirada y redirige al login | La UI queda congelada, muestra error genérico o no redirige |
| 5.9 | Mensaje de error HTTP 403 | Intentar una acción sin permisos suficientes | El sistema muestra mensaje de acceso denegado | Muestra error 500, pantalla en blanco o no muestra nada |
| 5.10 | Mensaje de error HTTP 500 | El backend retorna error interno | Aparece mensaje genérico de error del servidor sin exponer detalles técnicos | Muestra stack trace o información técnica al usuario |

---

## 6. 🪟 Modales y Diálogos de Confirmación

**Objetivo:** Verificar que los modales y diálogos se abren, cierran y comunican datos correctamente, sin afectar el estado de la vista de fondo.

**Base técnica Angular 13:** Suelen implementarse con `MatDialog` de Angular Material. Los datos se pasan con `data` y se reciben con `MAT_DIALOG_DATA`.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 6.1 | Apertura del modal | Hacer clic en el botón que dispara el modal | El modal se abre correctamente con su contenido | El modal no se abre o se abre vacío |
| 6.2 | Cierre con botón Cancelar | Hacer clic en "Cancelar" dentro del modal | El modal se cierra sin ejecutar la acción ni guardar datos | El modal cierra pero ejecuta la acción de todos modos |
| 6.3 | Cierre haciendo clic fuera del modal | Hacer clic en el overlay oscuro fuera del modal | El modal se cierra (si está configurado así) o no se cierra (si requiere decisión explícita) | Comportamiento opuesto al esperado según la configuración |
| 6.4 | Cierre con tecla Escape | Presionar Escape con el modal abierto | El modal se cierra sin ejecutar la acción | El modal no responde a Escape o ejecuta la acción al cerrar |
| 6.5 | Confirmación ejecuta la acción | Hacer clic en "Confirmar" o "Aceptar" dentro del modal | La acción se ejecuta, el modal se cierra y la UI se actualiza | La acción no se ejecuta o el modal queda abierto |
| 6.6 | Modal con formulario — validaciones activas | Intentar confirmar un modal con formulario con campos inválidos | El botón de confirmación está deshabilitado o muestra errores | El modal permite confirmar con datos inválidos |
| 6.7 | Modal recibe datos del contexto correctamente | Abrir un modal de edición o confirmación desde una fila específica | El modal muestra los datos de esa fila, no de otra | El modal muestra datos incorrectos o vacíos |
| 6.8 | Múltiples modales no se apilan incorrectamente | Intentar abrir el mismo modal dos veces seguidas | Solo existe una instancia del modal abierta | Se apilan dos o más instancias del mismo modal |
| 6.9 | Vista de fondo no interactuable con modal abierto | Con un modal abierto, intentar interactuar con la vista de fondo | La vista de fondo no responde (overlay activo) | Se puede interactuar con la vista de fondo mientras el modal está abierto |

---

## 7. 🌐 Consumo de APIs REST

**Objetivo:** Verificar el comportamiento de la UI ante distintas respuestas del backend, sin acceder al código del servicio.

**Base técnica Angular 13:** Los servicios Angular 13 usan `HttpClient`. Los interceptores manejan tokens y errores globales. Es posible simular respuestas con herramientas de red del navegador o con mocks.

### Casos de prueba

| # | Escenario | Cómo simularlo | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 7.1 | Carga exitosa de datos (200 OK) | Acceder a una vista que consume una API | Los datos se muestran correctamente en la UI | La UI muestra error o datos incorrectos con respuesta 200 |
| 7.2 | Estado de carga (loading) | Acceder a una vista con conexión lenta (throttling en DevTools) | Se muestra un spinner o indicador de carga mientras llegan los datos | No hay indicador de carga y la UI queda en blanco |
| 7.3 | Error 400 — Bad Request | Enviar formulario con datos que el backend rechaza | La UI muestra el mensaje de error específico del backend | La UI muestra mensaje genérico o no muestra nada |
| 7.4 | Error 401 — No autorizado | Token inválido o expirado (borrar token en DevTools) | La UI redirige al login con mensaje de sesión expirada | La UI queda congelada o muestra error sin redirigir |
| 7.5 | Error 403 — Forbidden | Usuario sin permisos intenta acción restringida | La UI muestra mensaje de "Sin permisos" | La UI muestra error 500 o pantalla en blanco |
| 7.6 | Error 404 — Not Found | Acceder a un recurso que no existe | La UI muestra mensaje de "no encontrado" | La UI muestra error 500 o queda en blanco |
| 7.7 | Error 500 — Server Error | Backend retorna error interno | La UI muestra mensaje genérico de error del servidor | La UI expone información técnica o queda en bucle |
| 7.8 | Sin conexión a internet | Desactivar la red en DevTools (Offline) | La UI muestra mensaje de "sin conexión" o fallo de red | La UI queda en carga infinita sin mensaje |
| 7.9 | Timeout de la petición | Simular respuesta muy lenta | La UI cancela la petición tras el timeout y muestra mensaje de error | La UI espera indefinidamente sin notificar al usuario |
| 7.10 | Respuesta vacía (200 con array vacío) | API retorna lista vacía `[]` | La UI muestra el estado vacío con mensaje informativo | La UI rompe o muestra error en lugar del estado vacío |
| 7.11 | Reintentar tras error | Error de red seguido de acción manual del usuario | El usuario puede volver a intentar la acción sin recargar la página | Después de un error, la UI queda inutilizable sin recargar |

---

## 8. 🔐 Autenticación y Autorización

**Objetivo:** Verificar que el sistema de autenticación y control de acceso funciona correctamente desde la perspectiva del usuario.

**Base técnica Angular 13:** Suele implementarse con guards (`CanActivate`), interceptores HTTP para JWT, y servicios de autenticación. Con MSAL para Azure AD.

### Casos de prueba

| # | Escenario | Acción | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 8.1 | Login con credenciales válidas | Ingresar usuario y contraseña correctos | El sistema autentica al usuario y redirige al dashboard o vista principal | El login falla con credenciales válidas |
| 8.2 | Login con credenciales inválidas | Ingresar usuario o contraseña incorrectos | El sistema muestra mensaje de error de credenciales sin bloquear la UI | El sistema acepta las credenciales o muestra error técnico |
| 8.3 | Login con campos vacíos | Intentar hacer login sin llenar campos | El botón de login está deshabilitado o muestra validaciones | El formulario de login se envía vacío |
| 8.4 | Logout | Hacer clic en "Cerrar sesión" | Se destruye la sesión, se limpia el token y se redirige al login | La sesión no se destruye o se puede regresar con el botón Atrás |
| 8.5 | Acceso post-logout con botón Atrás | Después de hacer logout, presionar el botón Atrás del navegador | El sistema redirige nuevamente al login | Se puede acceder a vistas protegidas después del logout |
| 8.6 | Token expirado durante la sesión | Esperar a que el token expire o borrarlo manualmente en DevTools | Al intentar cualquier acción, el sistema detecta la expiración y redirige al login | El sistema sigue operando con token expirado o muestra errores sin explicación |
| 8.7 | Vista según rol: usuario con permisos | Iniciar sesión con un usuario que tiene un rol específico | Solo se muestran las opciones del menú y vistas correspondientes a ese rol | Se muestran opciones de roles superiores o de otros roles |
| 8.8 | Vista según rol: usuario sin permisos | Iniciar sesión con un rol básico | Las opciones restringidas no aparecen en el menú o están deshabilitadas | Las opciones de roles superiores son accesibles visualmente |
| 8.9 | Acceso directo por URL a ruta de otro rol | Intentar acceder por URL directa a una vista de un rol superior | El guard redirige a una vista de acceso denegado o al inicio | La vista carga para un rol que no debería verla |
| 8.10 | Persistencia de sesión al recargar | Recargar la página (F5) con sesión activa | La sesión se mantiene y la vista actual se conserva | La sesión se pierde en cada recarga |

---

## 9. 📱 Comportamiento Responsivo

**Objetivo:** Verificar que la interfaz se adapta correctamente a distintos tamaños de pantalla, especialmente en dispositivos móviles y tablets.

**Cómo probarlo:** Usar las DevTools del navegador (Chrome DevTools → Toggle device toolbar) o dispositivos físicos.

### Casos de prueba

| # | Escenario | Resolución a probar | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 9.1 | Menú de navegación en móvil | 375px (iPhone SE) | El menú colapsa en un ícono de hamburguesa o menú lateral | El menú ocupa toda la pantalla o los ítems se superponen |
| 9.2 | Formularios en pantalla pequeña | 375px – 414px | Todos los campos del formulario son accesibles y usables | Los campos se cortan, se superponen o el botón queda fuera de vista |
| 9.3 | Tablas en pantalla pequeña | 375px – 768px | La tabla hace scroll horizontal o se adapta a una vista de tarjetas | Las columnas se superponen o el contenido queda ilegible |
| 9.4 | Botones en móvil | 375px | Los botones tienen tamaño mínimo táctil (44x44px recomendado) | Los botones son demasiado pequeños para tocar con precisión |
| 9.5 | Modales en móvil | 375px | El modal ocupa el espacio adecuado y su contenido es legible y accesible | El modal se sale de la pantalla o el botón de cerrar no es accesible |
| 9.6 | Vista tablet | 768px – 1024px | La UI usa el espacio adicional sin dejar áreas en blanco exageradas | La UI escala como si fuera móvil desperdiciando espacio |
| 9.7 | Vista desktop estándar | 1280px – 1440px | La UI ocupa el espacio de forma equilibrada con márgenes apropiados | La UI se estira sin control o queda centrada en una franja estrecha |
| 9.8 | Orientación landscape en móvil | 667px × 375px (landscape) | La UI se adapta a la orientación horizontal sin romper el layout | El layout se rompe o los elementos se superponen en landscape |

---

## 10. ♿ Accesibilidad Básica

**Objetivo:** Verificar que la interfaz puede ser usada con teclado y que cumple requisitos mínimos de accesibilidad (WCAG 2.1 nivel AA básico).

### Casos de prueba

| # | Escenario | Cómo probarlo | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 10.1 | Navegación por teclado (Tab) | Presionar Tab repetidamente desde el inicio de la página | El foco se mueve en orden lógico por todos los elementos interactivos | El foco salta elementos o queda atrapado en un componente |
| 10.2 | Activación de botones con teclado | Navegar con Tab hasta un botón y presionar Enter o Space | El botón ejecuta su acción | El botón no responde al teclado |
| 10.3 | Indicador de foco visible | Navegar con Tab | Siempre hay un indicador visual claro de qué elemento está enfocado | El indicador de foco no es visible |
| 10.4 | Contraste de texto | Inspeccionar visualmente el texto sobre fondos de color | El contraste es suficiente para lectura (ratio mínimo 4.5:1 para texto normal) | Texto gris claro sobre blanco o colores de bajo contraste |
| 10.5 | Etiquetas en campos de formulario | Inspeccionar campos del formulario | Cada campo tiene una etiqueta visible o un `aria-label` asociado | Campos sin etiqueta o con placeholder como único identificador |
| 10.6 | Mensajes de error accesibles | Generar un error de validación y usar lector de pantalla o revisar el DOM | El mensaje de error está asociado al campo mediante `aria-describedby` | El mensaje de error no está vinculado al campo afectado |
| 10.7 | Imágenes con texto alternativo | Revisar imágenes decorativas e informativas | Las imágenes informativas tienen `alt` descriptivo; las decorativas tienen `alt=""` | Imágenes sin atributo `alt` o con `alt` vacío en imágenes informativas |
| 10.8 | Títulos de página únicos | Navegar entre vistas | El `<title>` del documento cambia con cada vista para reflejar el contenido actual | Todas las vistas tienen el mismo título genérico |

---

## 11. ⚡ Rendimiento Percibido

**Objetivo:** Verificar que la interfaz proporciona feedback visual adecuado durante operaciones que toman tiempo, y que los tiempos de carga son razonables.

**Cómo probarlo:** Usar Chrome DevTools → Network → Throttling (Fast 3G, Slow 3G) para simular conexiones lentas.

### Casos de prueba

| # | Escenario | Condición de prueba | Resultado Esperado | Criterio de fallo |
|---|---|---|---|---|
| 11.1 | Indicador de carga en peticiones lentas | Red throttleada a Fast 3G | Se muestra spinner o skeleton screen mientras cargan los datos | La UI queda en blanco sin indicar que está cargando |
| 11.2 | Botón deshabilitado durante petición en curso | Enviar formulario con red lenta | El botón de submit se deshabilita mientras la petición está en curso | El botón permanece activo y puede enviarse múltiples veces |
| 11.3 | Tiempo de carga inicial de la SPA | Primera carga de la aplicación en red normal | La aplicación carga y es interactiva en menos de 5 segundos | La carga inicial supera los 8-10 segundos sin justificación |
| 11.4 | Tiempo de respuesta de navegación interna | Navegar entre vistas con lazy loading | La navegación es instantánea o con delay máximo de 1-2 segundos | Cada navegación interna demora más de 3 segundos |
| 11.5 | Carga de listas grandes sin paginación | Lista con muchos registros sin paginar | La UI no se congela al renderizar muchos elementos | La UI se congela o el scroll es lento con listas grandes |
| 11.6 | Feedback en operaciones de larga duración | Acciones de procesamiento (ej. precarga masiva, exportación) | Se muestra indicador de progreso o mensaje de "procesando" | La UI queda sin feedback y el usuario no sabe si la operación está en curso |

---

## 12. 🔄 Flujos de Negocio Críticos (CRUD Completo)

**Objetivo:** Verificar los flujos de extremo a extremo más importantes de cualquier módulo, cubriendo la secuencia completa de operaciones.

> 💡 **Instrucción para la IA:** Esta sección es la más dependiente del proyecto específico. Los flujos genéricos de CRUD aplican a cualquier módulo, pero los flujos con dependencias entre módulos deben identificarse analizando el proyecto concreto. Los patrones que siguen aplican a cualquier módulo CRUD estándar en Angular 13.

### 12.1 Flujo CRUD Completo (aplica a cualquier módulo)

| Paso | Acción | Resultado Esperado |
|---|---|---|
| 1 | Acceder al listado del módulo | La lista carga correctamente |
| 2 | Crear un nuevo registro con datos válidos | El registro aparece en el listado |
| 3 | Editar el registro recién creado | Los cambios se guardan y se reflejan en el listado |
| 4 | Buscar el registro por algún campo | El registro aparece en los resultados |
| 5 | Eliminar el registro con confirmación | El registro desaparece del listado |
| 6 | Buscar el registro eliminado | No aparece en los resultados |

### 12.2 Flujo con dependencias entre módulos

> 💡 Muchos módulos en Angular 13 tienen dependencias entre sí. El patrón general a probar es:

| Escenario | Lo que se prueba |
|---|---|
| Módulo B depende de datos de Módulo A | Crear el registro en A, ir a B y verificar que el dato de A está disponible como opción |
| Eliminar registro en A que es usado en B | Verificar que el sistema previene la eliminación o avisa del impacto |
| Cambiar estado de un registro en A | Verificar que B refleja el nuevo estado (ej. un periodo inactivo no aparece en selects de matrícula) |
| Registro inactivo/finalizado en A | Verificar que no aparece como opción en formularios de B |

### 12.3 Flujos de confirmación de dos pasos

| Escenario | Lo que se prueba |
|---|---|
| Acción → Modal de confirmación → Confirmar | La acción se ejecuta y la UI se actualiza |
| Acción → Modal de confirmación → Cancelar | La acción NO se ejecuta y el estado del sistema no cambia |
| Acción → Modal → Confirmación con datos adicionales → Confirmar | Los datos del modal se procesan correctamente junto con la acción |

---

## 📐 Priorización de Pruebas

> 💡 No todos los proyectos tienen tiempo para ejecutar todo. Esta tabla ayuda a priorizar según el riesgo e impacto.

| Prioridad | Categorías | Razón |
|---|---|---|
| 🔴 Crítica | Autenticación (8), Formularios (2), Flujos de negocio (12) | Afectan directamente la funcionalidad central y la seguridad |
| 🟠 Alta | Mensajes del sistema (5), Consumo de APIs (7), Modales (6) | Afectan la experiencia y confiabilidad del sistema |
| 🟡 Media | Navegación (1), Listados (4), Botones (3) | Afectan la usabilidad cotidiana |
| 🟢 Normal | Responsivo (9), Rendimiento (11), Accesibilidad (10) | Mejoran la calidad pero raramente bloquean el uso |

---

## 📋 Checklist de Ejecución por Sprint

Antes de cada entrega o release, ejecutar al mínimo:

- [ ] Todos los flujos CRUD de los módulos entregados en el sprint (Sección 12.1)
- [ ] Formularios: campos obligatorios, validaciones, submit exitoso y cancelación (Sección 2)
- [ ] Mensajes de éxito y error para cada operación del sprint (Sección 5)
- [ ] Modales de confirmación para acciones destructivas (Sección 6)
- [ ] Pruebas de autenticación si se modificó el módulo de login o guards (Sección 8)
- [ ] Comportamiento con error 500 y sin conexión para los módulos del sprint (Sección 7)
- [ ] Al menos una prueba de navegación directa por URL para cada ruta nueva (Sección 1)

---

## 🗃️ Historial de Cambios

| Versión | Fecha | Autor | Descripción |
|---|---|---|---|
| `1.0` | `YYYY-MM-DD` | `[Nombre]` | Creación inicial |

---

*Guía de Pruebas de Caja Negra — Angular 13 Frontend · Metodología de pruebas funcionales sin acceso al código fuente*
