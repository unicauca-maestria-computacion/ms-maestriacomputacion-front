# Arquitectura de Cero Lógica en Frontend (Lineamientos TIC v3 2026)

Este documento detalla la transición hacia una arquitectura donde el Frontend actúa exclusivamente como una capa de presentación, delegando la totalidad de la lógica de negocio y cálculos financieros al Backend.

## Principios Fundamentales
1. **Fuente Única de Verdad**: El Backend es el único responsable de calcular montos, descuentos, porcentajes agregados y estados de pago.
2. **Componentes Pasivos**: Los componentes de Angular no deben realizar operaciones aritméticas (`+`, `-`, `*`, `/`) sobre datos financieros.
3. **Mapeo Directo**: El `MapperService` debe realizar una transferencia directa de campos desde el DTO hacia el modelo de dominio, sin alterar los valores.
4. **Transformación en Vista**: Las transformaciones estéticas (ej: mostrar `0.22` como `22%`) deben realizarse mediante **Pipes** en el HTML, no mediante mutaciones del objeto en el TypeScript.

## Cambios Realizados

### Módulo de Información Presupuestaria
*   **Centralización de Totales**: Se añadieron campos de totales globales (`totalItem1`, `totalItem2`, `totalImprevistos`, `totalVigenciasAnteriores`) al DTO de respuesta del Backend.
*   **Eliminación de Normalización**: Se eliminó la función `normalizarPorcentajesParaDisplay` que multiplicaba valores por 100 en el cliente.
*   **Eliminación de Agregaciones Manuales**: Se eliminaron los métodos `.reduce()` que sumaban porcentajes para validación en tiempo real. Ahora el componente espera la respuesta del servidor para actualizar los totales.
*   **Limpieza de Proyecciones**: Se eliminaron las funciones `toPercent` y `toRatio`, permitiendo que el Backend maneje la escala de los valores recibidos.

### Módulo de Matrícula Financiera
*   **Validación de Triple Estado**: Se implementó la lógica de estados `true`, `false`, `null` para `estaPago`, asegurando que el frontend solo reaccione a los permisos enviados por el servidor.
*   **Bloqueo de Edición**: El botón de edición se habilita/deshabilita basándose estrictamente en el campo `estadoMatriculaFinanciera` (proveniente de datos reales de pago), bloqueando cualquier simulación manual cuando existe un pago real.

## Beneficios
*   **Integridad de Datos**: Se eliminan discrepancias entre lo que ve el usuario y lo que se guarda en la base de datos.
*   **Mantenibilidad**: Los cambios en las reglas de negocio (ej: cambiar el cálculo de un descuento) solo requieren modificaciones en el microservicio correspondiente.
*   **Rendimiento**: Se reduce la carga computacional en el navegador del cliente.

---
*Documentación generada como parte de la actualización de lineamientos institucionales 2026.*
