# Documento de Requisitos

## Introducción

Este documento describe los requisitos funcionales para la implementación completa de los módulos **Matrícula Financiera** (`gestion-matricula-financiera`) e **Información Presupuestaria** (`gestion-informacion-presupuestaria`) en el frontend Angular 13 del sistema de gestión de la Maestría en Computación de la Universidad del Cauca.

Ambos módulos ya cuentan con estructura base (rutas, componentes vacíos, DTOs, modelos de dominio, API service y Facade). El objetivo es implementar la lógica de presentación, interacción y estado reactivo completos, siguiendo la arquitectura hexagonal Pattern B, el Sistema de Diseño Unicauca 2026 y los lineamientos de accesibilidad WCAG 2.1 AA.

---

## Glosario

- **Sistema**: El frontend Angular 13 del sistema de gestión de la Maestría en Computación.
- **Coordinador**: Usuario autenticado con rol `ROLE_COORDINADOR`. Gestiona matrículas y reportes presupuestarios.
- **Estudiante**: Usuario autenticado con rol `ROLE_ESTUDIANTE`. Consulta su propia matrícula financiera.
- **Facade**: Servicio Angular que centraliza el estado reactivo del módulo mediante `BehaviorSubject` y expone `Observable` públicos de solo lectura.
- **ViewModel (vm$)**: Observable combinado con `combineLatest` que agrega todo el estado de una vista en un único stream.
- **Período Académico**: Unidad temporal de la maestría identificada por `tagPeriodo` (1 o 2) y `anio`.
- **Matrícula Financiera**: Registro del valor en SMLV que un estudiante debe pagar en un período académico, junto con sus descuentos y becas aplicables.
- **Estado de Matrícula**: Valor que indica la situación de pago del estudiante: `PENDIENTE`, `AL_DIA`, `MORA`, `EXONERADO`, `BECADO`, `ANULADO`.
- **Proyección de Estudiantes**: Estimación del valor de matrícula de cada estudiante para el período de proyección activo.
- **Reporte Financiero Final**: Consolidado definitivo de ingresos por matrículas de un período cerrado.
- **Reporte por Grupos**: Distribución del presupuesto de la maestría entre los grupos de investigación para un año dado.
- **Gasto General**: Ítem de egreso registrado en la configuración del reporte por grupos (ej. servicios, materiales).
- **Configuración de Reporte**: Parámetros numéricos que afectan el cálculo del reporte (SMLV, porcentajes AUI, excedentes, imprevistos, ítems).
- **RoleGuard**: Guard Angular que protege rutas verificando el rol del usuario autenticado.
- **PrimeNG**: Biblioteca de componentes UI utilizada en el proyecto (tablas, diálogos, formularios, botones).
- **Design System Unicauca 2026**: Sistema de diseño institucional con colores primario `#000066`, secundario `#9D0311`, error `#FF6D0A`, tipografías Titillium Web y Open Sans.
- **Ustedeo**: Tratamiento prenominal formal en tercera persona del singular, obligatorio en todos los textos de la interfaz.
- **RE_MATR**: Código del tipo de solicitud "Revisión de Matrícula", ya implementado en el módulo de solicitudes.
- **SMLV**: Salario Mínimo Legal Vigente. Unidad de medida del valor de matrícula.
- **AUI**: Administración, Uso e Infraestructura. Porcentaje descontado del ingreso neto antes de distribuir entre grupos.

---

## Requisitos

---

### Requisito 1: Listado de Matrículas Financieras (Coordinador)

**User Story:** Como Coordinador, quiero ver el listado de todos los estudiantes con su estado de matrícula financiera para un período académico seleccionado, de modo que pueda hacer seguimiento y tomar decisiones de gestión.

#### Criterios de Aceptación

1. WHEN el Coordinador accede a la ruta `/gestion-matricula-financiera`, THE Sistema SHALL cargar y mostrar la lista de períodos académicos disponibles en un selector desplegable.
2. WHEN el Coordinador selecciona un período académico en el selector, THE Sistema SHALL consultar al Facade el listado de estudiantes para ese período y actualizar la tabla de resultados.
3. WHILE el Sistema está cargando los datos de estudiantes, THE Sistema SHALL mostrar un indicador de progreso (spinner) y deshabilitar el selector de período.
4. THE Sistema SHALL mostrar en la tabla las columnas: código del estudiante, nombre completo, semestre financiero, valor en SMLV, estado de matrícula y acciones disponibles.
5. WHEN el listado de estudiantes está disponible, THE Sistema SHALL mostrar el total de estudiantes encontrados como contador en el encabezado de la tabla.
6. THE Sistema SHALL permitir al Coordinador filtrar la tabla por nombre o código de estudiante mediante un campo de búsqueda con debounce de 300ms.
7. THE Sistema SHALL permitir al Coordinador filtrar la tabla por estado de matrícula (`PENDIENTE`, `AL_DIA`, `MORA`, `EXONERADO`, `BECADO`, `ANULADO`) mediante un selector de estado.
8. IF la consulta de estudiantes retorna un error HTTP, THEN THE Sistema SHALL mostrar un mensaje de error con texto en ustedeo que proponga una acción correctiva (ej. "No fue posible cargar las matrículas. Por favor, intente nuevamente o contacte al administrador.").
9. IF el listado de estudiantes está vacío para el período seleccionado, THEN THE Sistema SHALL mostrar un estado vacío informativo con ícono y mensaje en ustedeo.
10. THE Sistema SHALL aplicar el color institucional `#000066` en el encabezado de la tabla y respetar el contraste mínimo WCAG 2.1 AA (4.5:1) en todos los textos.
11. THE Sistema SHALL mostrar el estado de matrícula de cada estudiante como una etiqueta (`p-tag`) con color semántico: verde para `AL_DIA`/`EXONERADO`/`BECADO`, naranja `#FF6D0A` para `PENDIENTE`/`MORA`, gris para `ANULADO`.
12. WHERE el Coordinador tiene permiso `ROLE_COORDINADOR`, THE Sistema SHALL mostrar el botón "Iniciar nueva matrícula" para generar el proceso de matrícula del período activo.
13. WHEN el Coordinador hace clic en "Iniciar nueva matrícula", THE Sistema SHALL mostrar un diálogo de confirmación en ustedeo antes de ejecutar la operación.
14. WHEN el Coordinador confirma el inicio de nueva matrícula, THE Sistema SHALL llamar al Facade, mostrar el spinner y, al completarse, mostrar una notificación de éxito tipo `success`.
15. IF la operación de iniciar matrícula falla, THEN THE Sistema SHALL mostrar una notificación de error tipo `error` con color `#FF6D0A` y mensaje en ustedeo con propuesta de solución.

---

### Requisito 2: Detalle de Matrícula de un Estudiante (Coordinador)

**User Story:** Como Coordinador, quiero ver el detalle completo de la matrícula financiera de un estudiante específico, de modo que pueda revisar su información académica, financiera y los descuentos aplicados.

#### Criterios de Aceptación

1. WHEN el Coordinador hace clic en el nombre o código de un estudiante en el listado, THE Sistema SHALL navegar a la ruta `/gestion-matricula-financiera/detalle/:id` y cargar los datos del estudiante seleccionado.
2. THE Sistema SHALL mostrar en el detalle: nombre completo, código, identificación, cohorte, período de ingreso, semestre financiero, semestre académico y estado de pago.
3. THE Sistema SHALL mostrar el valor de matrícula en SMLV y su equivalente en pesos colombianos calculado con el SMLV vigente del período.
4. THE Sistema SHALL mostrar la lista de materias matriculadas del estudiante con: código, nombre de la materia, docente y grupo de clase.
5. THE Sistema SHALL mostrar la lista de becas y descuentos aplicados al estudiante con: tipo, porcentaje, resolución y estado.
6. WHILE el Sistema está cargando el detalle del estudiante, THE Sistema SHALL mostrar un skeleton loader o spinner en el área de contenido.
7. IF el estudiante no tiene matrícula financiera registrada para el período activo, THEN THE Sistema SHALL mostrar un mensaje informativo en ustedeo indicando que no hay matrícula generada para el período seleccionado.
8. THE Sistema SHALL mostrar un botón "Volver al listado" que navegue a `/gestion-matricula-financiera` preservando los filtros activos del Facade.
9. IF la carga del detalle del estudiante retorna un error HTTP 404, THEN THE Sistema SHALL mostrar un estado vacío con mensaje en ustedeo y botón para volver al listado.
10. IF la carga del detalle del estudiante retorna un error HTTP distinto de 404, THEN THE Sistema SHALL mostrar un mensaje de error con propuesta de solución en ustedeo.
11. THE Sistema SHALL aplicar `ChangeDetectionStrategy.OnPush` en el componente `DetalleEstudianteComponent` y usar `async pipe` en el template para todas las suscripciones.

---

### Requisito 3: Resumen de Matrícula del Estudiante (Estudiante)

**User Story:** Como Estudiante, quiero ver el resumen de mi propia matrícula financiera con el costo detallado, de modo que pueda conocer cuánto debo pagar y qué descuentos me aplican.

#### Criterios de Aceptación

1. WHEN el Estudiante accede a la ruta `/gestion-matricula-financiera/resumen` o `/gestion-matricula-financiera/resumen/:id`, THE Sistema SHALL cargar primero los períodos académicos disponibles y luego los datos de matrícula del estudiante autenticado.
2. THE Sistema SHALL mostrar el período académico activo como una etiqueta (`p-tag`) en el encabezado de la vista.
3. THE Sistema SHALL mostrar el valor de matrícula en SMLV del estudiante para el período activo.
4. THE Sistema SHALL mostrar la lista de becas y descuentos aplicados con su porcentaje y tipo.
5. THE Sistema SHALL mostrar las materias matriculadas del estudiante para el período activo.
6. THE Sistema SHALL mostrar siempre visible el botón "Solicitar Revisión" que navega al flujo de radicación con el tipo `RE_MATR` preseleccionado.
7. IF el Estudiante no tiene matrícula registrada para el período activo (error 404), THEN THE Sistema SHALL mostrar un estado vacío informativo en ustedeo sin redirigir al listado, y el botón "Solicitar Revisión" SHALL permanecer visible.
8. WHILE el Sistema está cargando los datos de matrícula, THE Sistema SHALL mostrar un indicador de progreso.
9. THE Sistema SHALL aplicar `ChangeDetectionStrategy.OnPush` en el componente `ResumenMatriculaEstudianteComponent` y usar `async pipe` en el template.
10. THE Sistema SHALL mostrar el estado de pago del estudiante (`estaPago`) con un ícono y texto descriptivo en ustedeo (ej. "Su matrícula está al día" / "Su matrícula tiene un saldo pendiente").

---

### Requisito 4: Proyección de Estudiantes (Coordinador)

**User Story:** Como Coordinador, quiero ver y editar la proyección de estudiantes para el período de proyección activo, de modo que pueda ajustar los valores estimados de matrícula antes de generar el reporte final.

#### Criterios de Aceptación

1. WHEN el Coordinador accede a la ruta `/gestion-informacion-presupuestaria/proyeccion-reporte`, THE Sistema SHALL cargar el período de proyección activo y la lista de estudiantes proyectados mediante el Facade.
2. THE Sistema SHALL mostrar el período de proyección activo en el encabezado de la vista como etiqueta informativa.
3. THE Sistema SHALL mostrar en la tabla de proyección las columnas: nombre del estudiante, identificación, grupo de investigación, valor en SMLV, estado de matrícula financiera, aplica votación, aplica egresado, porcentaje de beca, valor matrícula calculado, descuentos y valor neto.
4. WHILE el Sistema está cargando la proyección, THE Sistema SHALL mostrar un spinner y deshabilitar las acciones de edición.
5. THE Sistema SHALL permitir al Coordinador editar en línea el valor en SMLV de un estudiante en la tabla de proyección mediante un campo de entrada numérico.
6. WHEN el Coordinador guarda un cambio en la proyección de un estudiante, THE Sistema SHALL llamar al Facade con `exhaustMap` para evitar envíos duplicados, mostrar el spinner y actualizar la fila en la tabla al recibir la respuesta.
7. IF la actualización de la proyección de un estudiante falla, THEN THE Sistema SHALL mostrar una notificación de error tipo `error` con mensaje en ustedeo y propuesta de solución.
8. THE Sistema SHALL mostrar los totales del reporte (total ingresos, total descuentos, total neto) en una fila de resumen al pie de la tabla.
9. THE Sistema SHALL permitir al Coordinador editar los parámetros de configuración del reporte (SMLV, biblioteca, recursos computacionales, porcentaje votación fijo, porcentaje egresado fijo) mediante un panel de configuración colapsable.
10. WHEN el Coordinador guarda la configuración del reporte, THE Sistema SHALL llamar al Facade, actualizar el estado y mostrar una notificación de éxito.
11. IF la actualización de la configuración falla, THEN THE Sistema SHALL mostrar una notificación de error con mensaje en ustedeo.
12. THE Sistema SHALL aplicar `ChangeDetectionStrategy.OnPush` en el componente `ProyeccionReporteComponent` y usar `vm$` con `combineLatest` para el estado de la vista.

---

### Requisito 5: Reporte Financiero Final (Coordinador)

**User Story:** Como Coordinador, quiero ver el reporte financiero final de un período académico cerrado, de modo que pueda consultar el consolidado definitivo de ingresos por matrículas.

#### Criterios de Aceptación

1. WHEN el Coordinador accede a la ruta `/gestion-informacion-presupuestaria/reporte-final`, THE Sistema SHALL cargar la lista de períodos académicos activos y cerrados en un selector.
2. WHEN el Coordinador selecciona un período en el selector, THE Sistema SHALL consultar al Facade el reporte financiero final para ese período y actualizar la tabla.
3. WHILE el Sistema está cargando el reporte, THE Sistema SHALL mostrar un spinner y deshabilitar el selector de período.
4. THE Sistema SHALL mostrar en la tabla las mismas columnas que la proyección: nombre, identificación, grupo, valor SMLV, descuentos y valor neto.
5. THE Sistema SHALL mostrar los totales del reporte (total ingresos, total descuentos, total neto) en una fila de resumen al pie de la tabla.
6. THE Sistema SHALL mostrar los parámetros de configuración del reporte (SMLV, biblioteca, recursos computacionales, porcentajes) en un panel de solo lectura o editable según el estado del período.
7. WHERE el período seleccionado está activo (no cerrado), THE Sistema SHALL permitir al Coordinador editar los parámetros de configuración del reporte.
8. THE Sistema SHALL ofrecer al Coordinador la opción de descargar el reporte en formato Excel mediante el botón "Descargar Excel".
9. WHEN el Coordinador hace clic en "Descargar Excel", THE Sistema SHALL generar y descargar el archivo Excel con los datos del reporte actualmente visible.
10. IF la carga del reporte falla, THEN THE Sistema SHALL mostrar un mensaje de error en ustedeo con propuesta de solución.
11. IF el período seleccionado no tiene reporte generado, THEN THE Sistema SHALL mostrar un estado vacío informativo en ustedeo.
12. THE Sistema SHALL aplicar `ChangeDetectionStrategy.OnPush` en el componente `ReporteFinalComponent` y usar `vm$` con `combineLatest` para el estado de la vista.

---

### Requisito 6: Reporte por Grupos de Investigación (Coordinador)

**User Story:** Como Coordinador, quiero ver y editar el reporte de distribución presupuestaria entre los grupos de investigación para un año dado, de modo que pueda ajustar los parámetros y descargar el reporte final.

#### Criterios de Aceptación

1. WHEN el Coordinador accede a la ruta `/gestion-informacion-presupuestaria/reporte-por-grupos`, THE Sistema SHALL cargar la lista de años disponibles y el reporte del año más reciente mediante el Facade.
2. WHEN el Coordinador selecciona un año diferente en el selector, THE Sistema SHALL consultar al Facade el reporte por grupos para ese año y actualizar la vista.
3. THE Sistema SHALL mostrar en la tabla las columnas: nombre del grupo, porcentaje de participación, porcentaje primer semestre, porcentaje segundo semestre, vigencias anteriores, presupuesto por grupo, aporte primer semestre, aporte segundo semestre e imprevistos.
4. THE Sistema SHALL mostrar los totales agregados del reporte en una fila de resumen al pie de la tabla.
5. WHERE el reporte es editable (`esEditable === true`), THE Sistema SHALL permitir al Coordinador editar en línea el porcentaje de participación de cada grupo.
6. WHEN el Coordinador guarda un cambio de participación de un grupo, THE Sistema SHALL llamar al Facade con `exhaustMap`, mostrar el spinner y actualizar la tabla al recibir la respuesta.
7. WHERE el reporte es editable, THE Sistema SHALL permitir al Coordinador editar los parámetros globales: porcentaje AUI, excedentes de maestría, vigencias anteriores por grupo, ítems (item1, item2) e imprevistos.
8. WHEN el Coordinador guarda un parámetro global, THE Sistema SHALL llamar al método correspondiente del Facade y actualizar el estado reactivo.
9. THE Sistema SHALL mostrar la sección de gastos generales con la lista de gastos registrados (categoría, descripción, monto).
10. WHERE el reporte es editable, THE Sistema SHALL permitir al Coordinador crear un nuevo gasto general mediante un diálogo con campos: categoría, descripción y monto.
11. WHERE el reporte es editable, THE Sistema SHALL permitir al Coordinador editar un gasto general existente mediante el mismo diálogo de creación pre-poblado.
12. WHERE el reporte es editable, THE Sistema SHALL permitir al Coordinador eliminar un gasto general con confirmación previa en ustedeo.
13. WHEN el Coordinador confirma la eliminación de un gasto general, THE Sistema SHALL llamar al Facade, actualizar la lista y mostrar una notificación de éxito.
14. IF cualquier operación de actualización del reporte por grupos falla, THEN THE Sistema SHALL mostrar una notificación de error tipo `error` con mensaje en ustedeo y propuesta de solución.
15. THE Sistema SHALL ofrecer al Coordinador la opción de descargar el reporte por grupos en formato Excel mediante el botón "Descargar Excel".
16. WHEN el Coordinador hace clic en "Descargar Excel", THE Sistema SHALL generar y descargar el archivo Excel con los datos del reporte actualmente visible.
17. THE Sistema SHALL aplicar `ChangeDetectionStrategy.OnPush` en el componente `ReportePorGruposComponent` y usar `vm$` con `combineLatest` para el estado de la vista.

---

### Requisito 7: Gestión de Gastos Generales (Coordinador)

**User Story:** Como Coordinador, quiero crear, editar y eliminar gastos generales en el reporte por grupos, de modo que el presupuesto refleje todos los egresos reales de la maestría.

#### Criterios de Aceptación

1. THE Sistema SHALL mostrar el diálogo de gastos generales con los campos: categoría (texto libre), descripción (texto libre) y monto (numérico positivo).
2. THE Sistema SHALL validar que los campos categoría, descripción y monto sean obligatorios antes de permitir el guardado.
3. IF el Coordinador intenta guardar un gasto con campos vacíos o monto inválido, THEN THE Sistema SHALL mostrar mensajes de validación en ustedeo junto a cada campo inválido.
4. WHEN el Coordinador guarda un nuevo gasto general, THE Sistema SHALL llamar al Facade con `exhaustMap`, cerrar el diálogo al recibir respuesta exitosa y mostrar una notificación de éxito.
5. WHEN el Coordinador edita un gasto general existente, THE Sistema SHALL pre-poblar el diálogo con los valores actuales del gasto seleccionado.
6. WHEN el Coordinador guarda la edición de un gasto general, THE Sistema SHALL llamar al Facade con `exhaustMap`, cerrar el diálogo al recibir respuesta exitosa y mostrar una notificación de éxito.
7. WHEN el Coordinador solicita eliminar un gasto general, THE Sistema SHALL mostrar un diálogo de confirmación con el nombre del gasto y texto en ustedeo antes de ejecutar la eliminación.
8. IF la creación o edición de un gasto general falla, THEN THE Sistema SHALL mantener el diálogo abierto y mostrar el mensaje de error en ustedeo con propuesta de solución.

---

### Requisito 8: Descarga de Reportes en Excel

**User Story:** Como Coordinador, quiero descargar los reportes financieros en formato Excel, de modo que pueda compartirlos y procesarlos fuera del sistema.

#### Criterios de Aceptación

1. THE Sistema SHALL generar el archivo Excel del reporte financiero final con las columnas: nombre, identificación, grupo, valor SMLV, descuentos aplicados y valor neto, más una fila de totales.
2. THE Sistema SHALL generar el archivo Excel del reporte por grupos con las columnas: nombre del grupo, porcentajes de participación, aportes por semestre, vigencias anteriores, presupuesto por grupo e imprevistos, más una fila de totales.
3. THE Sistema SHALL nombrar los archivos Excel descargados con el formato: `reporte-financiero-{anio}-{tagPeriodo}.xlsx` y `reporte-grupos-{anio}.xlsx` respectivamente.
4. WHEN el Coordinador hace clic en "Descargar Excel", THE Sistema SHALL generar el archivo en el cliente (sin llamada al backend) usando los datos ya cargados en el estado del Facade.
5. IF los datos del reporte no están cargados al momento de solicitar la descarga, THEN THE Sistema SHALL mostrar un mensaje en ustedeo indicando que primero debe cargar el reporte.
6. THE Sistema SHALL aplicar estilos básicos al archivo Excel: encabezados en negrita con fondo color `#000066` y texto blanco, filas alternadas con fondo claro.

---

### Requisito 9: Navegación y Acceso por Roles

**User Story:** Como administrador del sistema, quiero que cada ruta esté protegida por el rol correcto, de modo que los usuarios solo accedan a las vistas que les corresponden.

#### Criterios de Aceptación

1. THE Sistema SHALL proteger todas las rutas del módulo `gestion-matricula-financiera` con `RoleGuard` aplicando el rol correspondiente: `ROLE_COORDINADOR` para `/`, `/detalle/:id`; `ROLE_ESTUDIANTE` para `/resumen` y `/resumen/:id`.
2. THE Sistema SHALL proteger todas las rutas del módulo `gestion-informacion-presupuestaria` con `RoleGuard` aplicando `ROLE_COORDINADOR` para `/reporte-final`, `/proyeccion-reporte` y `/reporte-por-grupos`.
3. IF un usuario intenta acceder a una ruta sin el rol requerido, THEN THE RoleGuard SHALL redirigir al usuario a la ruta de acceso denegado o al inicio de sesión según la configuración del guard existente.
4. THE Sistema SHALL mostrar en el menú lateral solo las opciones de navegación correspondientes al rol del usuario autenticado.
5. WHEN el Estudiante accede al módulo de matrícula financiera, THE Sistema SHALL cargar automáticamente los datos de su propia matrícula sin requerir selección de período manual.

---

### Requisito 10: Accesibilidad y Diseño Institucional

**User Story:** Como usuario del sistema, quiero que la interfaz sea accesible y siga los lineamientos del Sistema de Diseño Unicauca 2026, de modo que la experiencia sea consistente, inclusiva y alineada con la identidad institucional.

#### Criterios de Aceptación

1. THE Sistema SHALL usar el color primario `#000066` para encabezados, botones de acción principal y elementos de énfasis, y el color de error `#FF6D0A` (naranja) para estados de error y alertas — nunca el rojo institucional `#9D0311` para errores.
2. THE Sistema SHALL aplicar la tipografía Titillium Web en encabezados (`h1`–`h4`) y Open Sans en textos de cuerpo, respetando el tamaño mínimo de 12px (Resolución 1519 de 2020).
3. THE Sistema SHALL garantizar un contraste mínimo de 4.5:1 entre texto y fondo en todos los componentes (WCAG 2.1 AA).
4. THE Sistema SHALL usar `border-radius: 9999px` (full) en todos los botones de acción, siguiendo el sistema de forma del Design System TIC v3.
5. THE Sistema SHALL usar `border-radius: 12px` en tarjetas y contenedores de información, y `border-radius: 28px` en diálogos modales.
6. THE Sistema SHALL incluir atributos `aria-label` descriptivos en todos los botones de acción (ej. "Descargar reporte financiero en Excel"), íconos decorativos con `aria-hidden="true"` y campos de formulario con `label` asociado.
7. THE Sistema SHALL usar ustedeo en todos los textos de la interfaz: mensajes de estado, confirmaciones, notificaciones, etiquetas de campos y textos de ayuda.
8. WHEN el Sistema muestra un mensaje de error, THE Sistema SHALL siempre incluir una propuesta de acción correctiva en el mismo mensaje (ej. "No fue posible guardar. Por favor, intente nuevamente.").
9. THE Sistema SHALL posicionar las notificaciones (toast) en la esquina superior derecha, debajo del header, con los 5 tipos institucionales: `success` (verde `#5BAE40`), `warning` (amarillo `#FFB000`), `info` (azul `#00AAE5`), `error` (naranja `#FF6D0A`), `security` (rojo `#FF554C`).
10. THE Sistema SHALL aplicar `trackBy` en todos los `*ngFor` de listas y tablas para optimizar el rendimiento del renderizado.

---

### Requisito 11: Calidad del Código y Pruebas

**User Story:** Como desarrollador del equipo, quiero que el código de los módulos tenga pruebas unitarias con cobertura mínima del 80%, de modo que los cambios futuros no introduzcan regresiones.

#### Criterios de Aceptación

1. THE Sistema SHALL incluir specs de prueba (`*.spec.ts`) para el `GestionMatriculaFinancieraFacadeService` que cubran: carga de estudiantes, carga de períodos, manejo de errores HTTP y actualización del estado reactivo.
2. THE Sistema SHALL incluir specs de prueba para el `GestionMatriculaFinancieraMapperService` que cubran: mapeo de `EstudianteDTORespuesta` a `Estudiante`, mapeo de `PeriodoAcademicoDTORespuesta` a `PeriodoAcademico` y mapeo inverso.
3. THE Sistema SHALL incluir specs de prueba para el `GestionInformacionPresupuestariaFacadeService` que cubran: carga de proyección, actualización de proyección, carga de reporte por grupos, gestión de gastos generales y manejo de errores.
4. THE Sistema SHALL incluir specs de prueba para el `GestionInformacionPresupuestariaMapperService` que cubran: mapeo de DTOs de respuesta a modelos de dominio y la propiedad de round-trip (mapeo → dominio → DTO → dominio produce resultado equivalente).
5. FOR ALL mapeos de DTOs a modelos de dominio, THE MapperService SHALL producir un objeto de dominio con todos los campos requeridos definidos (sin `undefined` en campos obligatorios).
6. FOR ALL operaciones del Facade que modifican el estado, THE FacadeService SHALL emitir el nuevo estado en el `BehaviorSubject` correspondiente antes de completar el Observable.
7. THE Sistema SHALL mantener una cobertura de pruebas mínima del 80% en líneas de código para los archivos `facade.service.ts` y `mapper.service.ts` de ambos módulos.
