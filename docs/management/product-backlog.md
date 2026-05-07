# Product Backlog — ms-maestriacomputacion-front

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Product Owner:** Director de Grupo
**Última actualización:** 2026-05-04
**Total de historias:** 22
**Historias completadas:** 22 (100%)

> **Nota:** Este backlog cubre únicamente los módulos implementados por el Desarrollador Frontend:
> `gestion-matricula-financiera` e `gestion-informacion-presupuestaria`.
> Las historias se derivan del código real implementado en el repositorio.

---

## Resumen por Épica

| ID Épica | Épica | Total HU | Done | In Progress | To Do |
|----------|-------|----------|------|-------------|-------|
| EP-01 | Gestión de Matrícula Financiera | 7 | 7 | 0 | 0 |
| EP-02 | Gestión de Información Presupuestaria | 15 | 15 | 0 | 0 |
| **Total** | | **22** | **22** | **0** | **0** |

---

## EP-01: Gestión de Matrícula Financiera

**Módulo Angular:** `gestion-matricula-financiera`
**Ruta base:** `/gestion-matricula-financiera`

---

### HU-001 — Consultar lista de estudiantes matriculados

**Como** Coordinador,
**quiero** ver la lista de todos los estudiantes matriculados en un período académico,
**para** tener una visión general del estado financiero del programa.

**Criterios de Aceptación:**
- CA-1: Al ingresar al módulo, se carga automáticamente el período académico más reciente
- CA-2: La tabla muestra código, nombre completo, semestre financiero y estado de pago de cada estudiante
- CA-3: El estado de pago se muestra con badge visual: PAGADO (verde), NO PAGADO (rojo), PENDIENTE (amarillo)
- CA-4: Si no hay estudiantes para el período, se muestra el mensaje "No se encontraron estudiantes matriculados"

**Prioridad:** Alta | **Story Points:** 5 | **Estado:** ✅ Done

---

### HU-002 — Filtrar estudiantes por período académico

**Como** Coordinador,
**quiero** seleccionar un período académico diferente en un dropdown,
**para** consultar los estudiantes de períodos anteriores.

**Criterios de Aceptación:**
- CA-1: El dropdown muestra todos los períodos disponibles en formato `{año}-{período}`
- CA-2: Al cambiar el período, la tabla se actualiza automáticamente
- CA-3: El período seleccionado se mantiene si el usuario navega al detalle y vuelve

**Prioridad:** Alta | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-003 — Filtrar estudiantes por semestre financiero

**Como** Coordinador,
**quiero** filtrar la lista de estudiantes por semestre financiero,
**para** ver solo los estudiantes de un semestre específico.

**Criterios de Aceptación:**
- CA-1: El dropdown de semestre se construye dinámicamente con los semestres presentes en la lista cargada
- CA-2: La opción "Todos" (valor 0) muestra todos los estudiantes sin filtrar
- CA-3: El filtro se aplica localmente sin hacer una nueva petición al backend
- CA-4: El semestre seleccionado se mantiene si el usuario navega y vuelve

**Prioridad:** Media | **Story Points:** 2 | **Estado:** ✅ Done

---

### HU-004 — Buscar estudiante por nombre o código

**Como** Coordinador,
**quiero** buscar un estudiante escribiendo en un campo de búsqueda,
**para** encontrar rápidamente a un estudiante específico sin navegar por toda la lista.

**Criterios de Aceptación:**
- CA-1: El campo de búsqueda filtra en tiempo real por código, nombre, apellido, cohorte y período de ingreso
- CA-2: La búsqueda es insensible a mayúsculas/minúsculas
- CA-3: La tabla muestra paginación (10, 25, 50 registros por página)

**Prioridad:** Media | **Story Points:** 2 | **Estado:** ✅ Done

---

### HU-005 — Ver detalle de matrícula financiera de un estudiante

**Como** Coordinador,
**quiero** ver la información financiera completa de un estudiante específico,
**para** revisar sus becas, descuentos, materias y estado de pago detallado.

**Criterios de Aceptación:**
- CA-1: Al hacer clic en "Ver detalle", se navega a `/gestion-matricula-financiera/detalle/{codigo}`
- CA-2: Se muestra la información completa: datos personales, semestre, valor en SMLV, becas, descuentos y materias
- CA-3: Si el estudiante no se encuentra, se muestra mensaje de error y se redirige a la lista
- CA-4: El botón "Volver" regresa a la lista con el filtro anterior restaurado

**Prioridad:** Alta | **Story Points:** 5 | **Estado:** ✅ Done

---

### HU-006 — Consultar resumen de matrícula propia (estudiante)

**Como** Estudiante,
**quiero** consultar el estado y detalle de mi propia matrícula financiera,
**para** saber cuánto debo pagar, qué descuentos tengo y qué materias estoy cursando.

**Criterios de Aceptación:**
- CA-1: El estudiante accede a `/gestion-matricula-financiera/resumen` y ve su propia información
- CA-2: Si no hay ID en la ruta, se usa el código del usuario autenticado automáticamente
- CA-3: Se muestra el mismo detalle que ve el coordinador pero sin opciones de edición
- CA-4: Si no se encuentra información, se muestra mensaje apropiado

**Prioridad:** Alta | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-007 — Solicitar revisión de matrícula

**Como** Estudiante,
**quiero** solicitar una revisión de mi matrícula financiera si encuentro algún error,
**para** que el coordinador pueda corregir la información.

**Criterios de Aceptación:**
- CA-1: El botón "Solicitar Revisión" está disponible en el resumen de matrícula del estudiante
- CA-2: Al hacer clic, se navega al módulo de solicitudes con el tipo `RE_MATR` preseleccionado
- CA-3: El flujo de solicitud continúa en el módulo de gestión de solicitudes

**Prioridad:** Media | **Story Points:** 2 | **Estado:** ✅ Done

---

## EP-02: Gestión de Información Presupuestaria

**Módulo Angular:** `gestion-informacion-presupuestaria`
**Ruta base:** `/informacion-presupuestaria`

---

### HU-008 — Navegar entre vistas del módulo presupuestario

**Como** Coordinador,
**quiero** navegar entre las tres vistas del módulo (Reporte Final, Proyección, Por Grupos) usando tabs,
**para** acceder rápidamente a la información que necesito.

**Criterios de Aceptación:**
- CA-1: La barra de navegación muestra tres opciones: Reporte Final, Proyección Reporte, Reporte Por Grupos
- CA-2: Al seleccionar una opción, se navega a la ruta correspondiente
- CA-3: La opción activa se resalta visualmente
- CA-4: Al ingresar a `/informacion-presupuestaria`, se redirige automáticamente a `reporte-final`

**Prioridad:** Alta | **Story Points:** 2 | **Estado:** ✅ Done

---

### HU-009 — Navegar entre períodos académicos con flechas

**Como** Coordinador,
**quiero** navegar entre períodos académicos usando flechas anterior/siguiente,
**para** consultar información de diferentes períodos sin usar un dropdown.

**Criterios de Aceptación:**
- CA-1: Se muestran flechas de navegación con el período actual en el centro
- CA-2: La flecha izquierda navega al período anterior; la derecha al siguiente
- CA-3: Las flechas se deshabilitan cuando no hay período anterior o siguiente
- CA-4: Al cambiar el período, el reporte se recarga automáticamente
- CA-5: Si no hay períodos disponibles, se muestra el mensaje configurado

**Prioridad:** Alta | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-010 — Consultar reporte financiero final

**Como** Coordinador,
**quiero** ver el reporte financiero definitivo de un período académico cerrado,
**para** conocer los ingresos reales, descuentos aplicados y el total neto del período.

**Criterios de Aceptación:**
- CA-1: El selector de período muestra solo períodos cerrados/finalizados
- CA-2: La tabla muestra por estudiante: cédula, nombre, matrícula, % votación, % beca, valor beca, % egresado, recursos computacionales, biblioteca, grupo de investigación, descuentos y total neto
- CA-3: Al pie de la tabla se muestran los totales: Total Bruto, Total Descuentos, Ingresos Totales Después de Descuentos
- CA-4: El panel de configuración muestra los valores de referencia: Biblioteca, Recursos Computacionales, Valor SMLV (solo lectura)

**Prioridad:** Alta | **Story Points:** 8 | **Estado:** ✅ Done

---

### HU-011 — Editar configuración financiera del período de proyección

**Como** Coordinador,
**quiero** editar los valores de Biblioteca, Recursos Computacionales y Valor SMLV del período activo,
**para** ajustar los parámetros base de los cálculos de matrícula.

**Criterios de Aceptación:**
- CA-1: El botón de edición de cabecera activa los campos de configuración
- CA-2: Solo se puede editar la cabecera si no hay ninguna fila en edición simultáneamente
- CA-3: Al guardar, se actualiza la configuración en el backend y se recalcula la proyección
- CA-4: Al cancelar, los valores vuelven a los originales sin llamar al backend

**Prioridad:** Alta | **Story Points:** 5 | **Estado:** ✅ Done

---

### HU-012 — Editar datos de proyección de un estudiante

**Como** Coordinador,
**quiero** editar el estado de pago, aplicación de votación, porcentaje de beca y aplicación de egresado de un estudiante en la proyección,
**para** ajustar los datos antes de que el período cierre.

**Criterios de Aceptación:**
- CA-1: Cada fila de la tabla tiene un botón de edición que activa la edición inline
- CA-2: El porcentaje de beca no puede ser negativo ni superar 100%
- CA-3: Al guardar, el backend recalcula todos los valores y retorna la proyección actualizada
- CA-4: Al cancelar, la fila vuelve exactamente a los valores antes de la edición
- CA-5: No se puede editar una fila si la cabecera está en edición

**Prioridad:** Alta | **Story Points:** 8 | **Estado:** ✅ Done

---

### HU-013 — Consultar reporte de distribución por grupos de investigación

**Como** Coordinador,
**quiero** ver cómo se distribuye el presupuesto entre los grupos de investigación de la maestría,
**para** conocer el aporte de cada grupo en el período.

**Criterios de Aceptación:**
- CA-1: El selector de período muestra años (no semestres) de períodos activos y cerrados
- CA-2: Se muestra un gráfico de barras con la participación porcentual de cada grupo
- CA-3: La tabla muestra por grupo: total neto, aportes por semestre, participaciones y presupuesto
- CA-4: Se muestran los totales de distribución: AUI Universidad, Ingresos Netos, Transferencia Unicauca, Excedentes Maestría, Valor a Distribuir

**Prioridad:** Alta | **Story Points:** 8 | **Estado:** ✅ Done

---

### HU-014 — Editar porcentaje de participación de un grupo

**Como** Coordinador,
**quiero** editar el porcentaje de participación de un grupo de investigación por semestre,
**para** ajustar la distribución del presupuesto según las necesidades del programa.

**Criterios de Aceptación:**
- CA-1: Solo se puede editar si el período es editable (`esEditable = true`)
- CA-2: La suma de porcentajes de todos los grupos no puede superar 100%
- CA-3: Al guardar, el backend recalcula la distribución y retorna el reporte actualizado
- CA-4: Al cancelar, los valores vuelven a los originales

**Prioridad:** Alta | **Story Points:** 5 | **Estado:** ✅ Done

---

### HU-015 — Editar distribución de ingresos (AUI y Excedentes)

**Como** Coordinador,
**quiero** editar el porcentaje de AUI Universidad y el valor de Excedentes de la Maestría,
**para** ajustar la distribución de ingresos del período.

**Criterios de Aceptación:**
- CA-1: Los campos de AUI (%) y Excedentes (valor COP) son editables cuando el período lo permite
- CA-2: Al guardar, el backend recalcula el Valor a Distribuir
- CA-3: No se puede editar si hay otra sección en edición simultáneamente

**Prioridad:** Media | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-016 — Editar porcentajes de ítems del presupuesto

**Como** Coordinador,
**quiero** editar los porcentajes de Ítem 1 e Ítem 2 del presupuesto,
**para** ajustar la asignación de recursos entre los dos ítems presupuestales.

**Criterios de Aceptación:**
- CA-1: La suma de Ítem 1 + Ítem 2 no puede superar 100%
- CA-2: Al guardar, el backend recalcula los presupuestos por grupo
- CA-3: Al cancelar, los valores vuelven a los originales

**Prioridad:** Media | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-017 — Editar porcentaje de imprevistos

**Como** Coordinador,
**quiero** editar el porcentaje de imprevistos del presupuesto,
**para** reservar un porcentaje del presupuesto para gastos no planificados.

**Criterios de Aceptación:**
- CA-1: El campo de imprevistos (%) es editable cuando el período lo permite
- CA-2: Al guardar, el backend recalcula los montos de imprevistos por grupo
- CA-3: Al cancelar, el valor vuelve al original

**Prioridad:** Media | **Story Points:** 2 | **Estado:** ✅ Done

---

### HU-018 — Editar vigencias anteriores por grupo

**Como** Coordinador,
**quiero** editar el valor de vigencias anteriores de cada grupo de investigación,
**para** incluir saldos de períodos anteriores en el presupuesto actual.

**Criterios de Aceptación:**
- CA-1: La fila de "Vigencias Anteriores" en la tabla de imprevistos es editable
- CA-2: Se puede editar el valor de cada grupo individualmente
- CA-3: Al guardar, el backend actualiza los valores secuencialmente por grupo

**Prioridad:** Media | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-019 — Gestionar gastos generales del período

**Como** Coordinador,
**quiero** crear, editar y eliminar gastos generales del período presupuestario,
**para** registrar los gastos administrativos que afectan el valor a distribuir.

**Criterios de Aceptación:**
- CA-1: El botón "Gastos Generales" abre un modal con la lista de gastos del período
- CA-2: Se puede agregar un nuevo gasto con categoría, descripción y monto (monto > 0 requerido)
- CA-3: Se puede editar un gasto existente con restauración al cancelar
- CA-4: Se puede eliminar un gasto con confirmación previa
- CA-5: Al crear/editar/eliminar, el reporte por grupos se actualiza automáticamente

**Prioridad:** Alta | **Story Points:** 8 | **Estado:** ✅ Done

---

### HU-020 — Descargar reporte financiero en Excel

**Como** Coordinador,
**quiero** descargar el reporte financiero en formato Excel,
**para** compartirlo con otros miembros del programa o archivarlo.

**Criterios de Aceptación:**
- CA-1: El botón de descarga abre un modal para seleccionar tipo de reporte y período
- CA-2: Se puede descargar: Reporte Final, Proyección de Reporte, o Reporte por Grupos
- CA-3: El archivo Excel tiene múltiples hojas con formato profesional (colores, totales, filtros)
- CA-4: Si no hay datos para el período seleccionado, se muestra advertencia sin descargar

**Prioridad:** Alta | **Story Points:** 8 | **Estado:** ✅ Done

---

### HU-021 — Ver reporte final con datos calculados por el backend

**Como** Coordinador,
**quiero** que todos los valores financieros del reporte (matrícula, descuentos, totales) sean calculados por el backend,
**para** garantizar la consistencia y exactitud de los datos.

**Criterios de Aceptación:**
- CA-1: El frontend no recalcula ningún valor financiero — todos vienen del backend
- CA-2: Los campos `valorMatricula`, `valorDescuentoBeca`, `totalNetoConDerechos` se muestran directamente del backend
- CA-3: El View Model `ReporteFinalVM` solo reorganiza los datos para presentación, sin recalcular

**Prioridad:** Alta | **Story Points:** 3 | **Estado:** ✅ Done

---

### HU-022 — Manejo de errores y estados de carga

**Como** Coordinador,
**quiero** ver indicadores de carga y mensajes de error claros cuando algo falla,
**para** saber qué está pasando y qué acción tomar.

**Criterios de Aceptación:**
- CA-1: Durante cualquier operación, se muestra un overlay de carga con mensaje descriptivo
- CA-2: Si una operación falla, se muestra un toast de error con mensaje en español
- CA-3: El overlay de carga siempre se oculta al terminar la operación (éxito o error)
- CA-4: Los errores HTTP 401 redirigen al login; los 403 redirigen a la página de acceso denegado

**Prioridad:** Alta | **Story Points:** 3 | **Estado:** ✅ Done
