# 📋 Plantilla de Documentación: Historias de Usuario

> **¿Cómo usar este archivo?**
> Este documento es una plantilla genérica pensada para que una IA (o un humano) la llene para **cualquier proyecto de software**. Cada sección tiene instrucciones en bloque `> 💡 Instrucción:` que explican qué poner ahí. Cuando el documento esté listo, esas instrucciones se eliminan y queda solo el contenido real.

---

## 📌 Información General del Proyecto

| Campo | Valor |
|---|---|
| **Nombre del Proyecto** | `[Nombre del sistema o aplicación]` |
| **Versión del Documento** | `1.0` |
| **Fecha de Creación** | `YYYY-MM-DD` |
| **Última Actualización** | `YYYY-MM-DD` |
| **Autor(es)** | `[Nombre(s) del equipo o responsable]` |
| **Cliente / Stakeholder Principal** | `[Nombre de la organización o cliente]` |

> 💡 **Instrucción:** Reemplaza cada campo entre corchetes `[ ]` con los datos reales del proyecto. La versión del documento debe incrementarse cada vez que se hagan cambios significativos.

---

## 🗂️ Índice de Historias Épicas

> 💡 **Instrucción:** Una **Historia Épica (HE)** agrupa varias historias de usuario relacionadas bajo una funcionalidad grande. Completa esta tabla con todas las épicas del proyecto antes de detallarlas. El ID sigue el patrón `HE-01`, `HE-02`, etc.

| ID | Rol | Funcionalidad / Módulo | Objetivo |
|---|---|---|---|
| `HE-01` | `[Rol principal, ej: Como administrador]` | `[Nombre del módulo, ej: Gestión de usuarios]` | `[Para qué sirve este módulo en el sistema]` |
| `HE-02` | `[Rol]` | `[Módulo]` | `[Objetivo]` |
| `HE-03` | `[Rol]` | `[Módulo]` | `[Objetivo]` |
| *(agregar filas según sea necesario)* | | | |

---

## 📖 Detalle de Historias de Usuario

> 💡 **Instrucción:** Copia y repite el bloque completo de una sección `### HE-XX` por cada Historia Épica del proyecto. Dentro de cada épica, repite el bloque `#### HU-XX` por cada Historia de Usuario específica. El patrón de ID de Historia de Usuario es `HU-01`, `HU-02`, etc. (reinicia en cada épica).

---

### HE-01 — `[Nombre del Módulo / Funcionalidad Principal]`

> 💡 **Instrucción:** Reemplaza el título con el nombre real del módulo (ej: `Gestión de Cursos`, `Autenticación`, `Reportes`).

---

#### HU-01 — `[Título corto de la historia]`

> 💡 **Instrucción:** El título debe resumir en pocas palabras qué quiere hacer el usuario (ej: `Crear un nuevo usuario`, `Exportar reporte en PDF`).

**Enunciado de la Historia**

| Campo | Detalle |
|---|---|
| **ID Épica** | `HE-01` |
| **ID Historia** | `HU-01` |
| **Rol** | `Como [tipo de usuario, ej: administrador, cliente, docente]` |
| **Característica / Funcionalidad** | `Quiero [acción concreta que desea realizar]` |
| **Razón / Resultado** | `Para [beneficio o resultado esperado]` |

> 💡 **Instrucción:** Sigue el formato estándar de historias de usuario: *"Como [rol], quiero [acción], para [beneficio]"*. El rol debe ser consistente con los actores definidos en el sistema.

**Criterios de Aceptación**

> 💡 **Instrucción:** Cada criterio sigue el formato **Dado / Cuando / Entonces** (Given / When / Then), que describe un escenario de comportamiento verificable. Agrega tantos escenarios como sean necesarios para cubrir: el camino feliz (éxito), errores de validación, casos borde y cancelación.

| # Escenario | Criterio (Título) | Contexto (Dado que...) | Evento (Cuando...) | Resultado Esperado (Entonces...) |
|---|---|---|---|---|
| `1` | `[Título del escenario, ej: Registro exitoso]` | `Dado que [estado inicial del sistema o del usuario]` | `Cuando [acción que realiza el usuario]` | `Entonces [comportamiento o respuesta del sistema]` |
| `2` | `[Validación de campo requerido]` | `Dado que [contexto]` | `Cuando [deja un campo vacío o ingresa dato inválido]` | `Entonces [el sistema muestra mensaje de error o desactiva el botón]` |
| `3` | `[Cancelación de la operación]` | `Dado que [contexto]` | `Cuando [hace clic en Cancelar]` | `Entonces [el sistema descarta cambios y vuelve al estado anterior]` |
| *(agregar filas según sea necesario)* | | | | |

**Información Adicional**

| Campo | Detalle |
|---|---|
| **Reglas de Negocio** | `[Restricciones o condiciones especiales, ej: "Solo usuarios con rol ADMIN pueden acceder". Dejar vacío si no aplica.]` |
| **Vista del Prototipo** | `[Nombre de la pantalla en Figma o link al prototipo. Dejar vacío si no existe aún.]` |
| **Lineamientos Técnicos** | `[Notas para el equipo de desarrollo: campos obligatorios marcados con (*), endpoints requeridos, comportamiento especial del frontend/backend, etc.]` |

> 💡 **Instrucción:** Los lineamientos técnicos son opcionales pero muy útiles. Incluye aquí cualquier detalle que ayude al desarrollador a implementar correctamente la historia (ej: validaciones en frontend, reglas de la API, estructura de datos esperada).

---

#### HU-02 — `[Título corto de la historia]`

**Enunciado de la Historia**

| Campo | Detalle |
|---|---|
| **ID Épica** | `HE-01` |
| **ID Historia** | `HU-02` |
| **Rol** | `Como [rol]` |
| **Característica / Funcionalidad** | `Quiero [acción]` |
| **Razón / Resultado** | `Para [beneficio]` |

**Criterios de Aceptación**

| # Escenario | Criterio (Título) | Contexto (Dado que...) | Evento (Cuando...) | Resultado Esperado (Entonces...) |
|---|---|---|---|---|
| `1` | `[Título]` | `Dado que [contexto]` | `Cuando [acción]` | `Entonces [resultado]` |
| `2` | `[Título]` | `Dado que [contexto]` | `Cuando [acción]` | `Entonces [resultado]` |

**Información Adicional**

| Campo | Detalle |
|---|---|
| **Reglas de Negocio** | `[O "N/A"]` |
| **Vista del Prototipo** | `[O "Pendiente"]` |
| **Lineamientos Técnicos** | `[O "N/A"]` |

---

> 💡 **Instrucción:** Repite el bloque `#### HU-XX` para cada historia adicional dentro de esta épica.

---

### HE-02 — `[Nombre del Módulo]`

> 💡 **Instrucción:** Repite la estructura completa de la sección `### HE-XX` para cada nueva épica.

#### HU-01 — `[Título]`

**Enunciado de la Historia**

| Campo | Detalle |
|---|---|
| **ID Épica** | `HE-02` |
| **ID Historia** | `HU-01` |
| **Rol** | `Como [rol]` |
| **Característica / Funcionalidad** | `Quiero [acción]` |
| **Razón / Resultado** | `Para [beneficio]` |

**Criterios de Aceptación**

| # Escenario | Criterio (Título) | Contexto (Dado que...) | Evento (Cuando...) | Resultado Esperado (Entonces...) |
|---|---|---|---|---|
| `1` | `[Título]` | `Dado que [contexto]` | `Cuando [acción]` | `Entonces [resultado]` |
| `2` | `[Título]` | `Dado que [contexto]` | `Cuando [acción]` | `Entonces [resultado]` |

**Información Adicional**

| Campo | Detalle |
|---|---|
| **Reglas de Negocio** | `[O "N/A"]` |
| **Vista del Prototipo** | `[O "Pendiente"]` |
| **Lineamientos Técnicos** | `[O "N/A"]` |

---

## 📐 Convenciones y Guía Rápida de Llenado

> 💡 **Instrucción:** Esta sección puede mantenerse en el documento final como referencia para el equipo, o eliminarse una vez todos la hayan leído.

### Nomenclatura de IDs

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Historia Épica | `HE-##` | `HE-01`, `HE-02` |
| Historia de Usuario | `HU-##` (reinicia por épica) | `HU-01`, `HU-02` |
| Escenario / Criterio | Número secuencial dentro de HU | `1`, `2`, `3` |

### Roles Típicos (ejemplos)

> Adaptar según el sistema. Los roles deben ser consistentes en todo el documento.

- `Como administrador del sistema`
- `Como usuario registrado`
- `Como coordinador / gestor`
- `Como cliente / visitante`
- `Como operador / técnico`

### Estructura del Criterio de Aceptación (BDD)

```
Dado que  → Estado inicial (precondición)
Cuando    → Acción del usuario
Entonces  → Respuesta del sistema (resultado verificable)
```

**Escenarios mínimos recomendados por historia:**

| Escenario | Descripción |
|---|---|
| ✅ Camino feliz | El flujo funciona correctamente con datos válidos |
| ❌ Error de validación | El usuario ingresa datos inválidos o deja campos vacíos |
| 🚫 Cancelación | El usuario abandona la operación sin guardar |
| ⚠️ Caso borde | Situación límite (datos duplicados, registros inexistentes, etc.) |

### Lista de Verificación antes de Entregar

- [ ] Todos los IDs son únicos y siguen el patrón correcto
- [ ] Cada historia tiene al menos 2 criterios de aceptación
- [ ] El rol es consistente con el actor real del sistema
- [ ] Los criterios siguen el formato Dado / Cuando / Entonces
- [ ] Las reglas de negocio críticas están documentadas
- [ ] Se eliminaron todos los textos de instrucción `[entre corchetes]`
- [ ] El índice de épicas está completo y actualizado

---

## 🗃️ Historial de Cambios

> 💡 **Instrucción:** Registra aquí los cambios importantes al documento para mantener trazabilidad.

| Versión | Fecha | Autor | Descripción del Cambio |
|---|---|---|---|
| `1.0` | `YYYY-MM-DD` | `[Nombre]` | Creación inicial del documento |
| `1.1` | `YYYY-MM-DD` | `[Nombre]` | `[Descripción]` |

---

*Documento generado con base en la estructura de Historias de Usuario — Metodología ágil (formato BDD)*
