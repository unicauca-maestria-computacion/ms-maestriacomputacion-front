# 🧪 Plantilla de Documentación: Casos de Prueba de Sistema

> **¿Cómo usar este archivo?**
> Esta plantilla es genérica y reutilizable para cualquier proyecto de software. Cubre exactamente la estructura usada en documentación formal de QA: encabezado institucional, información del caso, descripción, precondiciones, pasos, pruebas funcionales, postcondiciones y resultados. Los bloques `> 💡 Instrucción:` explican qué escribir en cada campo. Elimínalos cuando el documento esté listo.
>
> **Estructura del documento:** Hay un bloque `## CP-HEXX-HUXX` por cada caso de prueba. Repite ese bloque completo para cada historia de usuario que necesite pruebas.

---

## 📌 Información General del Documento

| Campo | Valor |
|---|---|
| **Nombre del Proyecto** | `[Nombre del sistema o aplicación]` |
| **Institución / Organización** | `[Universidad, empresa u organización]` |
| **Departamento / Área** | `[Ej: Departamento de Sistemas, QA, Ingeniería]` |
| **Tipo de Documento** | Casos de Prueba de Sistema |
| **Versión del Documento** | `1.0` |
| **Fecha de Creación** | `YYYY-MM-DD` |
| **Última Actualización** | `YYYY-MM-DD` |

> 💡 **Instrucción:** Este bloque de información general encabeza el documento completo. Se llena una sola vez. El campo "Tipo de Documento" siempre será "Casos de Prueba de Sistema" para este tipo de archivo.

---

## 📋 Índice de Casos de Prueba

> 💡 **Instrucción:** Lista aquí todos los casos de prueba del documento antes de desarrollarlos. El ID sigue el patrón `CP-HEXX-HUXX-NOMBRE`, donde `HE` es la Historia Épica y `HU` es la Historia de Usuario. El nombre resume la funcionalidad probada en pocas palabras (todo en mayúsculas con guiones).

| ID del Caso de Prueba | Módulo del Sistema | Historia de Usuario | Descripción Breve |
|---|---|---|---|
| `CP-HE01-HU01-[NOMBRE]` | `[Módulo]` | `HE-01 – HU-01` | `[Qué se valida en este caso]` |
| `CP-HE01-HU02-[NOMBRE]` | `[Módulo]` | `HE-01 – HU-02` | `[Qué se valida en este caso]` |
| `CP-HE02-HU01-[NOMBRE]` | `[Módulo]` | `HE-02 – HU-01` | `[Qué se valida en este caso]` |
| *(agregar filas según sea necesario)* | | | |

---

## 📖 Detalle de Casos de Prueba

> 💡 **Instrucción:** Cada sección `## CP-HEXX-HUXX-NOMBRE` es un caso de prueba completo e independiente. Copia y repite el bloque completo para cada caso. El orden recomendado es: primero agrupar por épica (HE-01, HE-02…), y dentro de cada épica, ordenar por historia de usuario (HU-01, HU-02…).

---

## CP-HE01-HU01-`[NOMBRE-FUNCIONALIDAD]`

> 💡 **Instrucción:** El nombre en el encabezado debe coincidir con el ID del índice. Usa mayúsculas y guiones, sin espacios ni caracteres especiales. Ejemplo: `CP-HE01-HU01-CREAR-CURSO`, `CP-HE03-HU02-MATRICULAR-ESTUDIANTES`.

---

### Encabezado Institucional

| Campo | Valor |
|---|---|
| **Institución** | `[Nombre de la institución u organización]` |
| **Área / Departamento** | `[Ej: Departamento de Sistemas]` |
| **Contexto** | `[Ej: Práctica profesional, Proyecto de grado, Desarrollo interno]` |
| **Título del caso** | `[Nombre descriptivo del caso. Ej: Caso de Prueba – Creación de cursos]` |
| **Período / Fecha del documento** | `[Ej: Diciembre de 2025]` |

> 💡 **Instrucción:** Este encabezado es el "membrete" del caso. En documentos formales corresponde a la portada de cada caso. Adapta los campos a la institución del proyecto.

**Autor(es):**

| Campo | Valor |
|---|---|
| **Nombre(s)** | `[Nombre completo del autor o autores]` |
| **Docente / Supervisor** | `[Nombre del docente, supervisor o revisor]` |
| **Fecha** | `DD/MM/AAAA` |

---

### Información del Caso de Prueba

| Campo | Valor |
|---|---|
| **Caso de Prueba No.** | `CP-HU01` |
| **Versión de Ejecución** | `1` |
| **Fecha Ejecución** | `DD/MM/AAAA` |
| **Historia de Usuario** | `HE-01 – HU-01` |
| **Módulo del Sistema** | `[Nombre del módulo. Ej: Módulo Académico, Gestión de Matrículas]` |

> 💡 **Instrucción:** El **Caso de Prueba No.** es un ID corto interno (ej. `CP-HU01`). La **Versión de Ejecución** incrementa cada vez que se re-ejecuta el caso (empieza en 1). La **Fecha Ejecución** se llena al momento de ejecutar, no al escribir el documento.

---

### Descripción del Caso de Prueba

> 💡 **Instrucción:** Escribe aquí en 2-4 oraciones QUÉ se valida, en QUÉ vista o flujo se hace y QUÉ aspectos específicos se verifican (campos obligatorios, mensajes del sistema, reglas de negocio, flujo de cancelación, etc.). No describas pasos — eso va en la sección de Pasos. Ejemplo: *"Validar que el sistema permita crear cursos desde la vista Registrar Curso, verificando el cumplimiento de las reglas de negocio, las validaciones de campos obligatorios, la correcta notificación al usuario mediante mensajes del sistema y la posibilidad de cancelar la operación sin afectar la información existente."*

`[Descripción del objetivo y alcance del caso de prueba]`

---

### Caso de Prueba

#### a. Precondiciones

> 💡 **Instrucción:** Lista los requisitos que DEBEN cumplirse antes de ejecutar la prueba. Incluye: rol del usuario, estado de autenticación, datos que deben existir en el sistema, vista en la que debe estar el usuario, y cualquier configuración previa necesaria. Si no se cumplen las precondiciones, la prueba no puede ejecutarse.

- `[El usuario debe contar con el rol de [Rol requerido] y estar activo en el sistema.]`
- `[El usuario debe encontrarse autenticado en el sistema.]`
- `[Deben existir [entidades/datos necesarios] registrados en el sistema.]`
- `[El usuario debe encontrarse en la vista [Nombre de la vista].]`
- *(agregar ítems según sea necesario)*

#### b. Pasos de la Prueba

> 💡 **Instrucción:** Lista los pasos en orden secuencial numerado. Cada paso debe ser una acción concreta y verificable que el tester puede ejecutar. Los pasos incluyen tanto acciones del usuario como verificaciones del sistema. Los pasos que son escenarios alternos (ej. cancelar la operación) se indican con "(Escenario alterno)".

1. `[Ingresar al sistema con credenciales válidas.]`
2. `[Acceder al módulo **[Nombre del Módulo]**.]`
3. `[Hacer clic en el botón **[Nombre del Botón o Acción]**.]`
4. `[Visualizar la vista **[Nombre de la Vista]**.]`
5. `[Diligenciar los campos obligatorios del formulario.]`
6. `[Verificar que el botón **[Acción Principal]** se habilite.]`
7. `[Ejecutar la acción principal.]`
8. `[Verificar el mensaje mostrado por el sistema.]`
9. `[Verificar la redirección o cambio de estado en el sistema.]`
10. `[(Escenario alterno) Cancelar la operación y verificar que no se realicen cambios.]`
- *(agregar pasos según sea necesario)*

---

### Pruebas Funcionales

> 💡 **Instrucción:** Esta tabla es el corazón del caso de prueba. Cada fila es un **escenario de prueba funcional** verificable de forma independiente. Las columnas son:
> - **Descripción:** nombre corto del escenario (ej. "Acceso a la vista", "Validación de campos obligatorios", "Ejecución exitosa", "Cancelación del proceso").
> - **Rol:** actor que ejecuta la acción (debe coincidir con las precondiciones).
> - **Funcionalidad:** categoría de la prueba (ej. Navegación, Validaciones, Acción principal, Control de flujo, Regla de negocio, Consulta, Reporte).
> - **Acción o Evento:** acción específica del usuario (ej. "Hacer clic en Guardar", "Dejar campo vacío", "Confirmar eliminación").
> - **Resultado Esperado:** respuesta del sistema ante esa acción.
> - **Evidencia / Respuesta del Sistema:** campo para pegar screenshot o descripción de lo observado al ejecutar. Se deja vacío al redactar y se llena al ejecutar.
> - **Estado:** resultado de la ejecución. Valores posibles: `PASO` ✅, `FALLO` ❌, `BLOQUEADO` 🔒, `NO EJECUTADO` ⏳.

| Descripción | Rol | Funcionalidad | Acción o Evento | Resultado Esperado | Evidencia / Respuesta del Sistema | Estado |
|---|---|---|---|---|---|---|
| `Acceso a la vista` | `[Rol]` | `Navegación` | `Acceder a [Vista]` | `El sistema permite el acceso y muestra la vista correctamente` | *(llenar al ejecutar)* | `PASO` |
| `Visualización del formulario` | `[Rol]` | `Carga de información` | `Abrir la vista` | `El sistema muestra el formulario con todos sus campos` | *(llenar al ejecutar)* | `PASO` |
| `Validación de campos obligatorios` | `[Rol]` | `Validaciones` | `Dejar campo obligatorio vacío` | `El botón de acción se desactiva y se muestra mensaje de error en el campo` | *(llenar al ejecutar)* | `PASO` |
| `Ejecución exitosa` | `[Rol]` | `Acción principal` | `[Guardar / Registrar / Confirmar]` | `El sistema muestra mensaje de éxito y actualiza el estado` | *(llenar al ejecutar)* | `PASO` |
| `Cancelación del proceso` | `[Rol]` | `Control de flujo` | `Clic en Cancelar` | `El sistema cierra el formulario o regresa sin guardar cambios` | *(llenar al ejecutar)* | `PASO` |
| *(agregar filas según sea necesario)* | | | | | | |

> 💡 **Nota sobre escenarios adicionales comunes:** Considera incluir filas para: validación de duplicados, reglas de negocio específicas del módulo, estados inválidos del sistema (ej. registro sin datos previos), flujos de confirmación con mensaje modal, y retorno a la vista anterior.

---

#### c. Postcondiciones

> 💡 **Instrucción:** Lista el estado esperado del sistema DESPUÉS de que la prueba se ejecutó correctamente. Incluye qué debe haber pasado con los datos (creados, actualizados, no modificados), el estado de la vista, y cualquier efecto colateral esperado.

- `[El registro se crea/actualiza/elimina correctamente cuando la operación es exitosa.]`
- `[El registro aparece/desaparece reflejado en el listado correspondiente.]`
- `[No se generan registros cuando la operación es cancelada o los datos son inválidos.]`
- *(agregar ítems según sea necesario)*

---

### Resultados de la Prueba

#### Defectos y Desviaciones

> 💡 **Instrucción:** Documenta aquí cualquier comportamiento inesperado o diferente al resultado esperado encontrado durante la ejecución. Si no se encontraron defectos, escribe "No aplica". Si hay defectos, describe brevemente el paso donde ocurrió, el comportamiento real observado y el esperado.

`No aplica` *(o describir defecto encontrado)*

---

#### Veredicto

> 💡 **Instrucción:** Marca el resultado global del caso de prueba después de su ejecución completa. En markdown se representa con `[x]` para marcado y `[ ]` para no marcado.

- [ ] **Pasó** — Todos los escenarios produjeron el resultado esperado
- [ ] **Falló** — Uno o más escenarios no produjeron el resultado esperado

---

#### Observaciones

> 💡 **Instrucción:** Escribe aquí cualquier comentario relevante sobre la ejecución: comportamiento general del sistema, contexto que afectó la prueba, recomendaciones para futuras ejecuciones, o notas sobre escenarios que no se pudieron ejecutar. Si no hay observaciones, puedes dejar un resumen de una oración que confirme el comportamiento general.

`[El sistema [cumple / no cumple] con [funcionalidad principal] aplicando correctamente [aspectos validados].]`

---

**Tester:** `[Nombre del tester]`
**Firma:** ___________________________
**Fecha:** `DD/MM/AAAA`

---

---

## CP-HE01-HU02-`[NOMBRE-FUNCIONALIDAD]`

> 💡 **Instrucción:** Repite el bloque completo desde `### Encabezado Institucional` hasta `**Fecha:**` para cada nuevo caso de prueba. Solo cambia el ID en el encabezado `##` y los contenidos específicos de cada sección.

### Encabezado Institucional

| Campo | Valor |
|---|---|
| **Institución** | `[Nombre de la institución]` |
| **Área / Departamento** | `[Área]` |
| **Contexto** | `[Contexto del proyecto]` |
| **Título del caso** | `[Título descriptivo]` |
| **Período / Fecha del documento** | `[Período]` |

**Autor(es):**

| Campo | Valor |
|---|---|
| **Nombre(s)** | `[Nombre]` |
| **Docente / Supervisor** | `[Nombre]` |
| **Fecha** | `DD/MM/AAAA` |

### Información del Caso de Prueba

| Campo | Valor |
|---|---|
| **Caso de Prueba No.** | `CP-HU02` |
| **Versión de Ejecución** | `1` |
| **Fecha Ejecución** | `DD/MM/AAAA` |
| **Historia de Usuario** | `HE-01 – HU-02` |
| **Módulo del Sistema** | `[Módulo]` |

### Descripción del Caso de Prueba

`[Descripción del objetivo y alcance del caso de prueba]`

### Caso de Prueba

#### a. Precondiciones

- `[Precondición 1]`
- `[Precondición 2]`
- *(agregar según sea necesario)*

#### b. Pasos de la Prueba

1. `[Paso 1]`
2. `[Paso 2]`
3. `[Paso 3]`
- *(agregar según sea necesario)*

### Pruebas Funcionales

| Descripción | Rol | Funcionalidad | Acción o Evento | Resultado Esperado | Evidencia / Respuesta del Sistema | Estado |
|---|---|---|---|---|---|---|
| `[Escenario 1]` | `[Rol]` | `[Categoría]` | `[Acción]` | `[Resultado esperado]` | *(llenar al ejecutar)* | `PASO` |
| `[Escenario 2]` | `[Rol]` | `[Categoría]` | `[Acción]` | `[Resultado esperado]` | *(llenar al ejecutar)* | `PASO` |
| *(agregar filas según sea necesario)* | | | | | | |

#### c. Postcondiciones

- `[Postcondición 1]`
- `[Postcondición 2]`

### Resultados de la Prueba

#### Defectos y Desviaciones

`No aplica`

#### Veredicto

- [ ] **Pasó**
- [ ] **Falló**

#### Observaciones

`[Observaciones sobre la ejecución]`

**Tester:** `[Nombre]`
**Firma:** ___________________________
**Fecha:** `DD/MM/AAAA`

---

> 💡 **Instrucción:** Continúa agregando bloques `## CP-HEXX-HUXX-NOMBRE` para cada caso de prueba adicional del proyecto. Recuerda: un caso por historia de usuario.

---

## 📐 Convenciones y Guía Rápida

> 💡 **Instrucción:** Esta sección puede mantenerse como referencia del equipo o eliminarse una vez todos la hayan interiorizado.

### Nomenclatura de IDs

| Tipo | Patrón | Ejemplo |
|---|---|---|
| ID completo del caso | `CP-HEXX-HUXX-NOMBRE` | `CP-HE01-HU03-ACTUALIZAR` |
| ID corto interno | `CP-HUXX` | `CP-HU03` |
| Historia de Usuario referenciada | `HE-XX – HU-XX` | `HE-01 – HU-03` |

### Categorías de Funcionalidad (columna "Funcionalidad")

> Estas son las categorías más comunes observadas en casos de prueba reales. Úsalas para clasificar el tipo de verificación de cada escenario.

| Categoría | Cuándo usarla |
|---|---|
| `Navegación` | Acceso a vistas, redirecciones, retorno al listado |
| `Carga de información` | El sistema carga datos previos en el formulario |
| `Validaciones` | Verificación de campos obligatorios, formatos, duplicados |
| `Regla de negocio` | Restricciones específicas del dominio (ej. solo un grupo por asignatura) |
| `Acción principal` | Guardar, Registrar, Matricular, Eliminar, Actualizar |
| `Control de flujo` | Cancelar, Confirmar, Habilitar/deshabilitar botones |
| `Consulta académica` | Cargar listados, filtrar, buscar |
| `Confirmación` | Modales de confirmación antes de ejecutar acciones destructivas o irreversibles |
| `Reporte` | Visualización de resultados, resúmenes, exportaciones |
| `Pre-matrícula` | Flujos específicos de envío y aprobación de pre-matrículas |
| `Estado` | Cambios de estado de entidades (activo/inactivo/finalizado) |
| `Precarga` | Procesos de carga masiva desde periodos anteriores |

### Valores de Estado para Pruebas Funcionales

| Valor | Significado |
|---|---|
| `PASO` ✅ | El resultado obtenido coincide con el resultado esperado |
| `FALLO` ❌ | El resultado obtenido NO coincide con el resultado esperado |
| `BLOQUEADO` 🔒 | No se pudo ejecutar porque una dependencia o precondición no se cumplió |
| `NO EJECUTADO` ⏳ | El escenario aún no ha sido ejecutado |

### Escenarios Mínimos Recomendados por Tipo de Operación

| Tipo de operación | Escenarios mínimos a incluir |
|---|---|
| **Crear / Registrar** | Acceso a vista, validación campos obligatorios, ejecución exitosa, cancelación |
| **Actualizar / Editar** | Carga de datos existentes, validación obligatoria, actualización exitosa, cancelación, bloqueo si sin cambios |
| **Eliminar** | Solicitud de confirmación, eliminación exitosa, cancelación |
| **Listar / Consultar** | Listado con datos, listado sin datos (mensaje informativo), filtros/búsqueda |
| **Flujo complejo (matrícula)** | Acceso, carga inicial, selección de elementos, validación de duplicados, reglas de negocio, confirmación, ejecución, visualización de resultados, retorno al listado |
| **Cambiar estado** | Cambio exitoso, bloqueo en estado final, validaciones de restricción |

### Lista de Verificación antes de Entregar

- [ ] Todos los IDs del índice coinciden con los encabezados `##` de los casos
- [ ] Cada caso tiene al menos 3 escenarios en la tabla de Pruebas Funcionales
- [ ] Los campos "Versión de Ejecución" y "Fecha Ejecución" están actualizados
- [ ] Las precondiciones son verificables y están ordenadas de general a específica
- [ ] Los pasos están numerados y son secuenciales
- [ ] Cada fila de Pruebas Funcionales tiene un resultado esperado claro y verificable
- [ ] Las postcondiciones cubren tanto el camino exitoso como el cancelado
- [ ] El veredicto está marcado después de ejecutar
- [ ] Los defectos están documentados con detalle suficiente para reproducirlos
- [ ] Se eliminaron todos los textos de instrucción `[entre corchetes]`

---

## 🗃️ Historial de Cambios

| Versión | Fecha | Autor | Descripción del Cambio |
|---|---|---|---|
| `1.0` | `YYYY-MM-DD` | `[Nombre]` | Creación inicial del documento |
| `1.1` | `YYYY-MM-DD` | `[Nombre]` | `[Descripción]` |

---

*Documento generado con base en la estructura de Casos de Prueba de Sistema — Metodología de pruebas funcionales (caja negra)*
