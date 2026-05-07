# Checklist de Preparación para Producción — ms-maestriacomputacion-front

**Fecha:** 2026-05-04
**Módulos:** gestion-matricula-financiera, gestion-informacion-presupuestaria

---

## Tipos de pruebas requeridas para ir a producción

Para entregar código a producción en un proyecto Angular de nivel académico/profesional se requieren los siguientes tipos de pruebas:

---

## 1. Pruebas Unitarias ✅ COMPLETADAS

Verifican que cada pieza de código funciona de forma aislada.

| Tipo | Herramienta | Estado | Tests |
|------|-------------|--------|-------|
| Facades (lógica de estado) | Jasmine + SpyObj | ✅ | 32 |
| Mappers (transformación de datos) | Jasmine puro | ✅ | 21 |
| Componentes UI dumb | TestBed + Jasmine | ✅ | 8 |
| Pipes compartidos | Jasmine puro | ✅ | 10 |
| **Total** | | **✅** | **71** |

**Cobertura estimada:** ~93% en los módulos cubiertos.

---

## 2. Pruebas de Integración ⚠️ PARCIALES

Verifican que los componentes funcionan correctamente juntos (componente + facade + template).

| Escenario | Estado | Notas |
|-----------|--------|-------|
| MatriculaFinancieraComponent carga y filtra estudiantes | ⚠️ Manual | Requiere TestBed completo con HttpClientTestingModule |
| DetalleEstudianteComponent carga datos por ID de ruta | ⚠️ Manual | Requiere RouterTestingModule |
| ProyeccionReporteComponent edita y guarda fila | ⚠️ Manual | Flujo complejo con múltiples estados |
| ReportePorGruposComponent actualiza porcentajes | ⚠️ Manual | Requiere mock de ConfirmationService |

**Recomendación:** Crear al menos un test de integración por componente de página (Smart) antes de producción.

---

## 3. Pruebas de Edge Cases ⚠️ PARCIALES

Ver catálogo completo en `EdgeCases_Catalog.md`.

| Estado | Cantidad |
|--------|----------|
| ✅ Cubiertos por tests unitarios | 17 |
| ⚠️ Pendientes validación manual | 14 |
| **Total identificados** | **31** |

**Edge cases críticos pendientes (bloquean producción):**
- [ ] EC-COM-02 — Acceso sin rol autorizado
- [ ] EC-COM-03 — Token JWT expirado
- [ ] EC-MF-07 — Sesión expirada al cargar detalle
- [ ] EC-IP-03 — Porcentaje de beca > 100%
- [ ] EC-IP-08 — Suma de porcentajes > 100%

---

## 4. Pruebas de Seguridad ⚠️ PENDIENTES

| Verificación | Estado | Notas |
|-------------|--------|-------|
| RoleGuard bloquea acceso sin rol correcto | ⚠️ Pendiente | Validar manualmente con usuario ROLE_ESTUDIANTE |
| AuthGuard redirige a login sin token | ⚠️ Pendiente | Validar manualmente |
| No hay datos sensibles en `localStorage` sin cifrar | ⚠️ Pendiente | Revisar AuthService |
| No hay `console.log` con datos de usuarios | ✅ Corregido | Eliminados en esta sesión |
| Inputs no ejecutan XSS | ⚠️ Pendiente | Angular escapa por defecto, pero validar |

---

## 5. Pruebas de Rendimiento ⚠️ PENDIENTES

| Verificación | Estado | Notas |
|-------------|--------|-------|
| Tabla de estudiantes con 500+ registros | ⚠️ Pendiente | Verificar paginación y rendimiento |
| Tabla de proyección con 200+ estudiantes | ⚠️ Pendiente | Verificar scroll y renderizado |
| Lazy loading de módulos activo | ✅ Verificado | Configurado en routing |
| `OnPush` en componentes dumb | ✅ Verificado | Todos los componentes UI tienen OnPush |
| `trackBy` en `*ngFor` dinámicos | ⚠️ Pendiente | Verificar en templates de tablas |

---

## 6. Pruebas de Accesibilidad ⚠️ PENDIENTES

Basadas en WCAG 2.1 AA.

| Verificación | Estado |
|-------------|--------|
| Todos los botones tienen `aria-label` o texto visible | ⚠️ Pendiente |
| Inputs de formulario tienen `label` asociado | ⚠️ Pendiente |
| Contraste de colores ≥ 4.5:1 | ⚠️ Pendiente (PrimeNG cumple por defecto) |
| Navegación por teclado funcional | ⚠️ Pendiente |
| Mensajes de error accesibles con `aria-describedby` | ⚠️ Pendiente |

---

## 7. Pruebas Responsive ⚠️ PENDIENTES

| Breakpoint | Estado |
|-----------|--------|
| Mobile (375px) | ⚠️ Pendiente |
| Tablet (768px) | ⚠️ Pendiente |
| Desktop (1280px) | ⚠️ Pendiente |
| Wide (1920px) | ⚠️ Pendiente |

Las tablas usan `responsiveLayout="stack"` de PrimeNG, lo que debería funcionar en mobile.

---

## 8. Pruebas de Regresión ⚠️ PENDIENTES

Verificar que los cambios realizados no rompieron funcionalidad existente:

| Cambio realizado | Verificación requerida |
|-----------------|----------------------|
| Eliminación de `console.log` en 5 componentes | Verificar que el manejo de errores sigue funcionando |
| Refactorización de `actualizarConfiguracionReporteFinanciero` en ApiService | Verificar que la actualización de configuración funciona end-to-end |
| Reemplazo de métodos `formatCurrency`/`formatPercent` por pipes | Verificar que todos los valores se muestran correctamente en los 3 componentes |
| Eliminación de `loading: boolean` en MatriculaFinancieraComponent | Verificar que el spinner sigue funcionando via LoadingService |

---

## Checklist Final de Producción

### Código
- [x] Sin `console.log` en código de producción
- [x] Sin `fdescribe` ni `fit` en tests
- [x] Lazy loading configurado para todos los módulos
- [x] Guards aplicados a todas las rutas protegidas
- [x] `OnPush` en todos los componentes dumb
- [x] `takeUntil(destroy$)` en todas las suscripciones manuales
- [x] `ngOnDestroy` implementado en todos los componentes con suscripciones
- [ ] Sin `any` types sin justificación documentada
- [ ] `trackBy` en todos los `*ngFor` dinámicos

### Tests
- [x] 71 tests unitarios pasando
- [x] Cobertura ≥ 80% en Facades y Mappers
- [ ] Al menos 1 test de integración por componente Smart
- [ ] Edge cases críticos validados manualmente

### Seguridad
- [ ] RoleGuard validado manualmente
- [ ] AuthGuard validado manualmente
- [ ] Token JWT no expuesto en localStorage sin cifrar

### Documentación
- [x] Plan de pruebas unitarias (`unit-test-plan.md`)
- [x] Reporte de cobertura (`TestCoverage_Report.md`)
- [x] Catálogo de edge cases (`EdgeCases_Catalog.md`)
- [x] Checklist de producción (este documento)
- [x] Documentación técnica de módulos (`module-documentation.md`)
- [x] Contratos de API (`API_Contracts.md`)
