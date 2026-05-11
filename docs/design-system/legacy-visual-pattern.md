# Patrón Visual Consolidado (Legacy / Master Style)

Este documento describe el estándar visual aplicado en la rama actual. A diferencia del **Design System TIC v3 2026**, esta versión prioriza la consistencia con el núcleo original de la aplicación para evitar una ruptura estética abrupta.

## 1. Identidad Visual
*   **Colores**: Se utiliza la paleta por defecto de PrimeNG 13 (Saga Blue) con personalizaciones leves en el archivo `styles.scss`.
*   **Tipografía**: Uso de la fuente nativa del sistema o la configurada globalmente en el proyecto base (generalmente sans-serif estándar).
*   **Iconografía**: Uso extensivo de **PrimeIcons (pi)**.

## 2. Componentes de UI
En esta rama, NO se utilizan los componentes con prefijo `uni-`. Se deben usar componentes estándar de PrimeNG:
*   `p-table`: Tablas estándar con scroll y paginación básica.
*   `p-card`: Contenedores simples sin los radios de curvatura extendidos (28px) de la versión 2026.
*   `p-button`: Botones estándar con las clases `p-button-outlined`, `p-button-danger`, etc.

## 3. Disposición de Pantalla (Layout)
*   Se mantiene el layout de navegación lateral/superior clásico.
*   Densidad de información media (no optimizada para alta densidad administrativa).

## 4. Cuándo usar este patrón
Este patrón debe seguirse para **todo mantenimiento o corrección de errores** en los módulos de Matrícula Financiera e Información Presupuestaria dentro de esta rama. 

**IMPORTANTE**: Si se requiere implementar una nueva funcionalidad que deba cumplir con los lineamientos 2026, dicha implementación debe realizarse en la rama `lineamientos-u` o planificarse como una migración visual completa de este branch.

---
*Nota: Este documento coexiste con la documentación del Design System 2026 para marcar una frontera clara entre lo técnico (Pattern B) y lo visual (Legacy).*
