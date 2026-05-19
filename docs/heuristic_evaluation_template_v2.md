# Evaluación Heurística de Nielsen
<!-- INSTRUCCIONES PARA LA IA QUE COMPLETE ESTE DOCUMENTO
═══════════════════════════════════════════════════════════
CONTEXTO: Esta plantilla es para evaluar sistemas web académicos/administrativos.
Recibirás capturas de pantalla de cada vista y debes completar cada sección.

FLUJO DE TRABAJO RECOMENDADO:
1. Analiza TODAS las capturas antes de escribir una sola evaluación.
2. Completa el índice con todas las vistas identificadas.
3. Evalúa vista por vista, en el orden del índice.
4. Completa el resumen consolidado AL FINAL, nunca antes.

REGLAS CRÍTICAS:
- Nunca escribas "Cumple" si hay al menos una deficiencia identificable → usa "Parcial".
- "No aplica" solo si la heurística es estructuralmente irrelevante (no como salida fácil).
- Las observaciones deben mencionar elementos concretos visibles en la captura
  (nombres de botones, campos, mensajes, tablas). Evita afirmaciones genéricas.
- La escala de severidad es OBLIGATORIA para todo estado que no sea "Cumple" o "No aplica".
- Elimina todos los bloques de comentarios HTML antes de entregar el documento final.
═══════════════════════════════════════════════════════════ -->

**Proyecto:** <!-- nombre del sistema, ej.: "Sistema de Matrícula Académica" -->  
**Módulo(s):** <!-- módulos incluidos en esta evaluación -->  
**Versión / Build:** <!-- número de versión, rama o commit -->  
**Fecha:** <!-- DD/MM/AAAA -->  
**Evaluador:** <!-- nombre del evaluador o "IA - [modelo]" -->

---

## 1. Índice de vistas

<!-- Completa esta tabla con TODAS las vistas que evaluarás.
     La columna "ID" se usa para referenciar hallazgos en el resumen consolidado.
     Estado: Pendiente → En evaluación → ✅ Completado -->

| ID  | Vista evaluada | Módulo | Estado |
|-----|---------------|--------|--------|
| V01 | <!-- nombre --> | <!-- módulo --> | Pendiente |
| V02 | <!-- nombre --> | <!-- módulo --> | Pendiente |
| V03 | <!-- nombre --> | <!-- módulo --> | Pendiente |
| V04 | <!-- nombre --> | <!-- módulo --> | Pendiente |
| V05 | <!-- nombre --> | <!-- módulo --> | Pendiente |

<!-- Agrega filas según el número real de vistas. -->

---

## 2. Escala de severidad

<!-- Esta escala se aplica en cada evaluación individual.
     No modificar: es parte del estándar metodológico. -->

| Nivel | Etiqueta | Criterio |
|-------|----------|----------|
| 0 | No es problema | Discrepancia cosmética sin impacto real en el usuario. |
| 1 | Cosmético | Problema menor; el usuario lo resuelve solo. Solo corregir si hay tiempo. |
| 2 | Menor | Causa fricción leve pero no bloquea la tarea. Prioridad media. |
| 3 | Mayor | Dificulta significativamente la tarea. Alta prioridad de corrección. |
| 4 | Catastrófico | Impide completar la tarea o causa pérdida de datos. Corrección inmediata. |

---

## 3. Evaluaciones individuales

<!-- ╔══════════════════════════════════════════════════════╗
     ║  BLOQUE REUTILIZABLE — copia desde aquí hasta       ║
     ║  "FIN DEL BLOQUE" por cada vista que evalúes.       ║
     ╚══════════════════════════════════════════════════════╝ -->

---

### V01 · <!-- Nombre de la vista -->

#### 3.1 Información de la vista

| Campo | Valor |
|-------|-------|
| ID | V01 |
| Nombre de la vista | <!-- ej.: "Gestión de Cursos — Listado" --> |
| Módulo | <!-- ej.: "Matrícula Académica" --> |
| Ruta / URL | <!-- ej.: `/gestion-matricula/cursos` o "Menú → Matrícula → Cursos" --> |
| Tipo de vista | <!-- Listado / Formulario / Modal / Dashboard / Flujo multipaso / Otro --> |
| Usuarios objetivo | <!-- ej.: "Coordinador académico", "Estudiante", "Administrador" --> |
| Propósito principal | <!-- Una oración: qué tarea central realiza el usuario en esta vista. --> |

#### 3.2 Captura de referencia

<!-- Inserta la captura de pantalla de la vista.
     Si hay múltiples estados relevantes (vacío, con datos, con error), incluye uno por estado.
     Formato: ![Descripción breve](ruta/imagen.png) -->

![Vista: <!-- nombre -->](<!-- ruta/imagen.png -->)

<!-- Si hay estados adicionales que muestren comportamientos relevantes: -->
<!-- ![Estado de error](ruta/imagen_error.png) -->

#### 3.3 Evaluación heurística

<!-- INSTRUCCIONES DE LLENADO PARA ESTA TABLA:
     - Columna "Estado": elige uno → ✅ Cumple | ⚠️ Parcial | ❌ No cumple | ➖ No aplica
     - Columna "Severidad": obligatoria si el estado es ⚠️ Parcial o ❌ No cumple.
       Usa el número de la escala (0–4). Deja "—" si el estado es ✅ o ➖.
     - Columna "Observación": 1–3 oraciones concretas.
       ✅ → describe QUÉ elemento satisface la heurística.
       ⚠️/❌ → describe QUÉ falla y DÓNDE se ve en la captura.
       ➖ → una oración justificando por qué no aplica. -->

| # | Heurística | Estado | Sev. | Observación |
|---|-----------|--------|------|-------------|
| H1 | **Visibilidad del estado del sistema** — El sistema informa al usuario de lo que ocurre mediante retroalimentación oportuna (indicadores de carga, confirmaciones, errores en tiempo real). | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H2 | **Relación sistema–mundo real** — Se usa el lenguaje y los conceptos del dominio del usuario, no jerga técnica interna. Los formatos de fecha, moneda y texto siguen convenciones locales. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H3 | **Control y libertad del usuario** — El usuario puede salir de flujos no deseados, cancelar acciones y deshacer cambios sin consecuencias graves. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H4 | **Consistencia y estándares** — Mismos íconos, etiquetas y patrones de interacción en toda la aplicación. Se respetan las convenciones de la plataforma (web/móvil). | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H5 | **Prevención de errores** — El diseño evita que ocurran errores: validaciones previas al envío, confirmación de acciones destructivas, restricción de opciones inválidas. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H6 | **Reconocer mejor que recordar** — Opciones, acciones y contexto previo son visibles. El usuario no necesita recordar información de pasos anteriores. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H7 | **Flexibilidad y eficiencia de uso** — Existen aceleradores para usuarios expertos: atajos, acciones masivas, filtros avanzados, exportación, etc. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H8 | **Diseño estético y minimalista** — Solo se muestra información relevante para la tarea. No hay elementos decorativos, datos redundantes o distractores visuales. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H9 | **Ayuda para recuperarse de errores** — Los mensajes de error usan lenguaje simple, identifican el problema con precisión y sugieren pasos concretos de corrección. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |
| H10 | **Ayuda y documentación** — Existe ayuda contextual (tooltips, placeholders, textos de apoyo, documentación enlazada) accesible desde la vista. | <!-- estado --> | <!-- 0–4 o — --> | <!-- observación concreta --> |

#### 3.4 Hallazgos y recomendaciones

<!-- Lista solo los hallazgos donde el estado fue ⚠️ Parcial o ❌ No cumple.
     Ordénalos de mayor a menor severidad.
     Formato por hallazgo:
       - [Hx · Sev. N] Descripción objetiva del problema. → Recomendación concreta de solución. -->

- [H? · Sev. ?] <!-- descripción del problema → recomendación -->
- [H? · Sev. ?] <!-- descripción del problema → recomendación -->
- [H? · Sev. ?] <!-- descripción del problema → recomendación -->

#### 3.5 Puntuación de la vista

<!-- Completa los contadores según los resultados de la tabla 3.3.
     El score se calcula sobre las heurísticas aplicables (excluye "No aplica").
     Fórmula: (Cumple × 1 + Parcial × 0.5) / Total aplicables × 10  →  redondear a 1 decimal. -->

| Resultado | Cantidad |
|-----------|---------|
| ✅ Cumple | <!-- N --> |
| ⚠️ Parcial | <!-- N --> |
| ❌ No cumple | <!-- N --> |
| ➖ No aplica | <!-- N --> |
| **Total aplicables** | <!-- N --> |
| **Score de usabilidad** | <!-- X.X / 10 --> |

<!-- FIN DEL BLOQUE — copia desde "### V0X" hasta aquí para cada vista adicional -->

---

### V02 · <!-- Nombre de la vista -->

#### 3.1 Información de la vista

| Campo | Valor |
|-------|-------|
| ID | V02 |
| Nombre de la vista | |
| Módulo | |
| Ruta / URL | |
| Tipo de vista | |
| Usuarios objetivo | |
| Propósito principal | |

#### 3.2 Captura de referencia

![Vista: ](<!-- ruta -->)

#### 3.3 Evaluación heurística

| # | Heurística | Estado | Sev. | Observación |
|---|-----------|--------|------|-------------|
| H1 | **Visibilidad del estado del sistema** | | | |
| H2 | **Relación sistema–mundo real** | | | |
| H3 | **Control y libertad del usuario** | | | |
| H4 | **Consistencia y estándares** | | | |
| H5 | **Prevención de errores** | | | |
| H6 | **Reconocer mejor que recordar** | | | |
| H7 | **Flexibilidad y eficiencia de uso** | | | |
| H8 | **Diseño estético y minimalista** | | | |
| H9 | **Ayuda para recuperarse de errores** | | | |
| H10 | **Ayuda y documentación** | | | |

#### 3.4 Hallazgos y recomendaciones

- [H? · Sev. ?]
- [H? · Sev. ?]

#### 3.5 Puntuación de la vista

| Resultado | Cantidad |
|-----------|---------|
| ✅ Cumple | |
| ⚠️ Parcial | |
| ❌ No cumple | |
| ➖ No aplica | |
| **Total aplicables** | |
| **Score de usabilidad** | |

---

<!-- Repite el bloque compacto (desde "### V0X" hasta "---") para cada vista adicional.
     El primer bloque (V01) es la versión expandida con instrucciones detalladas.
     Los bloques siguientes usan la versión compacta sin comentarios. -->

---

## 4. Resumen consolidado

<!-- Completar SOLO después de haber evaluado todas las vistas del índice.
     Si alguna vista sigue en estado "Pendiente", no completes esta sección. -->

### 4.1 Puntuaciones por vista

<!-- Copia el score calculado en la sección 3.5 de cada vista. -->

| ID | Vista | Score | Nivel |
|----|-------|-------|-------|
| V01 | <!-- nombre --> | <!-- X.X / 10 --> | <!-- ver tabla debajo --> |
| V02 | <!-- nombre --> | <!-- X.X / 10 --> | |
| V03 | <!-- nombre --> | <!-- X.X / 10 --> | |
| **Promedio del sistema** | | <!-- X.X / 10 --> | |

<!-- Niveles de referencia:
     9.0–10.0 → Excelente   |   7.0–8.9 → Bueno   |   5.0–6.9 → Aceptable
     3.0–4.9  → Deficiente  |   0.0–2.9 → Crítico -->

### 4.2 Estado global por heurística

<!-- Para cada heurística, el estado global es el PEOR estado encontrado entre todas las vistas.
     Orden: ❌ No cumple > ⚠️ Parcial > ✅ Cumple > ➖ No aplica
     La severidad máxima es la más alta registrada para esa heurística en cualquier vista. -->

| Heurística | Estado global | Sev. máx. | Vistas con problemas |
|-----------|---------------|-----------|----------------------|
| H1 · Visibilidad del estado | | | <!-- V0X, V0X --> |
| H2 · Relación sistema–mundo real | | | |
| H3 · Control y libertad | | | |
| H4 · Consistencia y estándares | | | |
| H5 · Prevención de errores | | | |
| H6 · Reconocer mejor que recordar | | | |
| H7 · Flexibilidad y eficiencia | | | |
| H8 · Diseño estético y minimalista | | | |
| H9 · Ayuda para recuperarse de errores | | | |
| H10 · Ayuda y documentación | | | |

### 4.3 Hallazgos críticos del sistema

<!-- Lista solo los hallazgos con severidad 3 o 4, de cualquier vista.
     Ordenados de mayor a menor severidad.
     Incluye la referencia a la vista (ID) y la heurística (Hx). -->

| Prioridad | Vista | H | Sev. | Descripción del problema | Recomendación |
|-----------|-------|---|------|--------------------------|---------------|
| 1 | V0? | H? | ? | <!-- problema --> | <!-- solución --> |
| 2 | V0? | H? | ? | | |
| 3 | V0? | H? | ? | | |

### 4.4 Patrones recurrentes

<!-- Problemas que aparecen en 2 o más vistas con la misma raíz.
     Estos son los más importantes para atacar estructuralmente. -->

- **[Nombre del patrón]** *(afecta V0X, V0X, V0X · H?)*: descripción del patrón y recomendación sistémica.
- **[Nombre del patrón]** *(afecta V0X, V0X · H?)*: descripción del patrón y recomendación sistémica.

### 4.5 Fortalezas del sistema

<!-- Aspectos que se cumplen de forma consistente en la mayoría de vistas.
     Mínimo 2, máximo 5. Sirven como referencia de buenas prácticas internas. -->

- <!-- fortaleza 1 -->
- <!-- fortaleza 2 -->
- <!-- fortaleza 3 -->

### 4.6 Roadmap de mejoras

<!-- Organiza todas las recomendaciones en tres horizontes de implementación.
     Corto plazo: bajo esfuerzo, alto impacto (severidad 3–4).
     Mediano plazo: esfuerzo medio, mejoras de eficiencia (severidad 2).
     Largo plazo: cambios estructurales o de bajo impacto inmediato (severidad 0–1). -->

#### Corto plazo (severidad 3–4 · implementar primero)

| # | Vista(s) | Mejora | Heurística |
|---|----------|--------|-----------|
| 1 | V0? | <!-- descripción --> | H? |
| 2 | V0? | <!-- descripción --> | H? |

#### Mediano plazo (severidad 2 · siguiente sprint o iteración)

| # | Vista(s) | Mejora | Heurística |
|---|----------|--------|-----------|
| 1 | V0? | <!-- descripción --> | H? |
| 2 | V0? | <!-- descripción --> | H? |

#### Largo plazo (severidad 0–1 · backlog)

| # | Vista(s) | Mejora | Heurística |
|---|----------|--------|-----------|
| 1 | V0? | <!-- descripción --> | H? |

---

## Apéndice: Guía de referencia rápida

<!-- Esta sección permanece en el documento final como referencia metodológica. -->

### Escala de estados

| Símbolo | Estado | Cuándo usarlo |
|---------|--------|---------------|
| ✅ | Cumple | La heurística se satisface completamente. Sin excepciones observables. |
| ⚠️ | Parcial | Se satisface en los casos principales pero falla en edge cases, flujos secundarios o en parte de los elementos. |
| ❌ | No cumple | No se satisface o hay problemas evidentes que afectan la tarea principal del usuario. |
| ➖ | No aplica | La heurística no tiene sentido en el contexto de esta vista. Requiere justificación explícita. |

### Preguntas diagnóstico por heurística

| H | Preguntas clave para evaluar con una captura |
|---|---------------------------------------------|
| H1 | ¿Hay spinner o skeleton en carga? ¿Se confirman acciones exitosas (toast, badge)? ¿Los errores aparecen inline o en tiempo real? ¿El usuario sabe si una operación está en curso? |
| H2 | ¿Los términos son del dominio del usuario o del sistema interno? ¿Las fechas usan formato local? ¿Los íconos tienen significado inequívoco sin tooltip? |
| H3 | ¿Hay botón "Cancelar" visible en formularios y modales? ¿Se puede deshacer la última acción? ¿El usuario puede salir de un flujo sin perder trabajo no guardado con advertencia? |
| H4 | ¿El mismo ícono significa lo mismo en todas las vistas? ¿Acciones equivalentes tienen el mismo nombre? ¿Los componentes de UI son coherentes con el resto del sistema? |
| H5 | ¿Los campos obligatorios se validan antes del envío? ¿Las acciones destructivas (eliminar, sobrescribir) requieren confirmación? ¿Se deshabilitan opciones que causarían estados inválidos? |
| H6 | ¿Las opciones de un selector están siempre visibles o requieren recordar valores? ¿El contexto previo (qué estaba seleccionado, de qué registro es este formulario) permanece visible? |
| H7 | ¿Hay selección múltiple o acciones masivas? ¿Existen filtros combinables? ¿Se puede exportar? ¿Hay atajos de teclado documentados? ¿Los usuarios frecuentes pueden actuar más rápido que los nuevos? |
| H8 | ¿Hay elementos decorativos sin función? ¿La densidad de información en pantalla es apropiada para la tarea? ¿Los modales son compactos y focalizados? ¿Hay columnas o campos que nadie usa? |
| H9 | ¿Los mensajes de error usan lenguaje simple (no códigos HTTP ni stack traces)? ¿Indican exactamente qué campo o acción falló? ¿Sugieren qué hacer para corregirlo? |
| H10 | ¿Hay tooltips en campos complejos? ¿Los placeholders dan ejemplos del formato esperado? ¿Hay un enlace a documentación o a un manual de usuario? ¿Existe ayuda inline para flujos complejos? |

### Fórmula de score por vista

```
Score = (Cumple × 1.0 + Parcial × 0.5 + No cumple × 0) / Total aplicables × 10
```

*Ejemplo: 6 Cumple + 2 Parcial + 1 No cumple + 1 No aplica → (6 + 1) / 9 × 10 = **7.8 / 10***
