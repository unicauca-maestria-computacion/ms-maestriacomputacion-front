# Justificación de la Metodología — Scrum Lite

**Proyecto:** Sistema de Gestión de Maestría en Computación — Frontend Angular
**Fecha:** 2026-05-04

---

## 1. Selección de Metodología

Para el desarrollo del sistema de gestión de la Maestría en Computación se adoptó **Scrum Lite**, una adaptación del framework Scrum (Schwaber & Sutherland, 2020) diseñada para equipos de 3 personas.

### ¿Por qué Scrum y no otra metodología?

| Metodología | Evaluación | Decisión |
|-------------|-----------|----------|
| **Waterfall** | Requiere requisitos completamente definidos desde el inicio. No permite adaptarse a cambios del backend durante el desarrollo | ❌ Descartada |
| **Kanban** | No tiene sprints ni velocidad medible. Dificulta la planificación académica con fechas de entrega fijas | ❌ Descartada |
| **XP (Extreme Programming)** | Requiere pair programming y TDD estricto. Overhead alto para equipo de 3 personas | ❌ Descartada |
| **Scrum Lite** | Iterativo, adaptable a cambios de API del backend, permite entregas incrementales, métricas claras de velocidad | ✅ Seleccionada |

### Razones específicas para elegir Scrum Lite

1. **Desarrollo iterativo:** Los módulos del frontend dependen de los endpoints del backend. Scrum permite adaptar el trabajo cuando los contratos de API cambian entre sprints.

2. **Entregas incrementales:** Cada sprint produce un incremento funcional demostrable, lo que facilita la validación con el Director de Grupo.

3. **Visibilidad del progreso:** El burndown chart y la velocidad por sprint permiten al Director de Grupo monitorear el avance sin necesidad de reuniones extensas.

4. **Adaptado para 3 personas:** Scrum Lite reduce el overhead de ceremonias manteniendo los beneficios del framework.

---

## 2. Adaptaciones Realizadas al Scrum Estándar

El Scrum Guide 2020 permite equipos de hasta 3 personas y no prescribe ceremonias rígidas, solo sus propósitos. Las siguientes adaptaciones se realizaron:

| Ceremonia estándar | Duración estándar | Adaptación Scrum Lite | Razón |
|-------------------|------------------|----------------------|-------|
| Sprint Planning | 8 horas (sprint 4 semanas) | 1.5 horas | Sprint de 2 semanas, equipo pequeño con comunicación directa |
| Daily Scrum | 15 minutos presencial | 15 min o asíncrono por chat | Horarios académicos variables |
| Sprint Review | 4 horas | 1 hora | Solo 3 participantes, demo directa |
| Sprint Retrospectiva | 3 horas | 45 minutos | Formato Start/Stop/Continue simplificado |

---

## 3. Roles Asignados

| Rol Scrum | Persona | Responsabilidades Principales |
|-----------|---------|------------------------------|
| **Product Owner + Scrum Master** | Director de Grupo | Priorizar el backlog, definir criterios de aceptación, facilitar ceremonias, eliminar impedimentos |
| **Developer (Backend)** | Desarrollador Backend | Implementar API REST, lógica de negocio, base de datos, documentar endpoints |
| **Developer (Frontend)** | Daniel Felipe Contreras Tobar | Implementar SPA Angular, módulos asignados, tests unitarios, documentación frontend |

### Nota sobre la combinación de roles PO + SM

En equipos de 3 personas es común que el Director de Grupo asuma ambos roles. La clave es ser consciente del conflicto potencial: como PO quiere más features, como SM debe proteger la capacidad del equipo. En este proyecto se resolvió siendo transparente en el Sprint Planning sobre la capacidad real del equipo.

---

## 4. Ceremonias Adoptadas

| Ceremonia | Frecuencia | Duración | Participantes | Artefacto generado |
|-----------|-----------|----------|---------------|-------------------|
| Sprint Planning | Inicio de cada sprint | 1.5 horas | Los 3 | Sprint Backlog |
| Daily Standup | Diario (L-V) | 15 min | Los 3 | Registro semanal |
| Sprint Review | Fin de cada sprint | 1 hora | Los 3 | Acta de review |
| Retrospectiva | Fin de cada sprint | 45 min | Los 3 | Acta de retrospectiva |

---

## 5. Herramientas Utilizadas

| Herramienta | Uso |
|-------------|-----|
| GitHub | Control de versiones, code review, issues |
| GitHub Projects | Sprint board (To Do / In Progress / Done) |
| Discord / WhatsApp | Daily standup asíncrono |
| Google Docs | Actas de ceremonias |
| Kiro (AI IDE) | Asistencia en implementación y documentación |

---

## 6. Definition of Done (DoD)

Una historia de usuario está **DONE** cuando:

**Frontend:**
- [ ] Componentes implementados siguiendo los estándares del proyecto (Pattern B, OnPush, takeUntil)
- [ ] Tests unitarios escritos con cobertura ≥ 80% en Facades y Mappers
- [ ] Sin errores de compilación TypeScript
- [ ] Sin `console.log` en código de producción
- [ ] Revisión de código aprobada por el Director de Grupo
- [ ] Funcionalidad probada manualmente en el entorno de desarrollo

**Integración:**
- [ ] Integración Frontend-Backend probada manualmente
- [ ] Código mergeado a la rama `develop`

---

## 7. Referencias

- Schwaber, K. & Sutherland, J. (2020). *The Scrum Guide*. Scrum.org. https://scrumguides.org
- Rubin, K. S. (2012). *Essential Scrum: A Practical Guide to the Most Popular Agile Process*. Addison-Wesley.
