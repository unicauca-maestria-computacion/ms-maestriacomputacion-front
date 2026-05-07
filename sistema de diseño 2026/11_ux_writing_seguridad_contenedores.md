# 11 — UX Writing, Comunicación y Seguridad (Design System TIC v3)

> Fuente: **Design System TIC v3** — Secciones "Pautas de Comunicación", "Seguridad", "Contenedores"
> Esta información no existe en los archivos anteriores del sistema de diseño.

---

## ✍️ UX Writing — Voz de la Marca Institucional

### Filosofía de comunicación

Todo texto en los sistemas de la Universidad del Cauca debe ser: **claro, asertivo, verídico, seguro e intuitivo**.

### Propósito del discurso
- Promover una educación integral de calidad
- Generar engagement con usuarios y ciudadanía
- Fomentar comunicación con transparencia y veracidad

### Tono del discurso
- Corporativo / Institucional
- Cercano / Amigable
- Informativo / Comunicativo

### Carácter del discurso
- Educativo
- Emocional
- Honesto

---

## 🗣️ Tratamiento Prenominal — Ustedeo

Los sistemas usan **ustedeo**: empleo formal del pronombre *usted*, que denota cortesía y amabilidad.

Se aplica en **modo indicativo, subjuntivo e imperativo** de la 3ª persona del singular:

| Modo | Ejemplo correcto |
|------|-----------------|
| **Indicativo** | "El formulario se diligenció exitosamente." |
| **Subjuntivo** | "Al cerrar sesión, todos los cambios realizados se perderán." |
| **Imperativo** | "Por seguridad, cambie su contraseña cada tres meses." |

### ✅ Reglas de UX Writing
1. Construir textos entendibles, con lenguaje claro e información funcional
2. Manejar cortesía y cercanía en mensajes de estado, confirmaciones, notificaciones de error y microinteracciones
3. Al anunciar un problema, **siempre proponer una solución posible**
4. Usar palabras que reflejen precisamente la función de cada componente (botones primarios, secundarios, terciarios)
5. Confirmar de forma **afirmativa y positiva** el éxito o error de las acciones
6. Evitar tecnicismos o lenguaje poco entendible
7. Considerar el mapa de calor / flujo de navegación al redactar contenidos

### 🚫 Evitar
- "Ha ocurrido un error" → sin solución propuesta ❌
- "Error 500" → tecnicismo incomprensible ❌
- "Tu formulario fue enviado" → tuteo informal ❌

### ✅ Preferir
- "No fue posible guardar los datos. Por favor, intente nuevamente." ✅
- "El formulario se diligenció exitosamente." ✅
- "Por seguridad, cambie su contraseña cada tres meses." ✅

---

## 🏛️ Valores a destacar en los productos software

Deben reflejarse en diseño, texto y comportamiento del sistema:

| Valor | Cómo se manifiesta en UI |
|-------|--------------------------|
| **Calidad** | Diseño limpio, sin errores visuales, componentes consistentes |
| **Seguridad** | Ícono candado en elementos sensibles, validaciones visibles |
| **Eficacia** | Flujos cortos, mensajes directos, acciones claras |
| **Innovación** | Uso de Material Design 3, diseño moderno y responsive |
| **Transparencia** | Políticas accesibles, mensajes honestos, feedback claro |

---

## 🔐 Seguridad en el Diseño UX

### Autenticación y Login

**Estructura visual del login institucional:**
```
┌──────────────────────────────────────────────┐
│  [Logo Unicauca]  [Nombre del Sistema]       │
├──────────────────┬───────────────────────────┤
│                  │                           │
│  Inicio de       │   [Imagen institucional   │
│  sesión          │    del sistema/programa]  │
│                  │                           │
│  [Correo         │                           │
│   institucional] │                           │
│                  │                           │
│  [Contraseña]    │                           │
│                  │                           │
│  [Iniciar sesión]│                           │
└──────────────────┴───────────────────────────┘
│ [Barra de colores del Plan de Desarrollo]    │
└──────────────────────────────────────────────┘
```

**Reglas de diseño del login:**
- Usar siempre el correo institucional `@unicauca.edu.co` (no correos personales)
- Mostrar error con color naranja `#FF6D0A` al ingresar datos inválidos
- Indicar validación exitosa con ícono ✓ y color `#5BAE40`
- Incluir indicador de fortaleza de contraseña en formularios de registro
- Recordatorio de cambio de contraseña **mínimo cada 3 meses** (notificación no intrusiva)

**Estados visuales del campo de correo:**
```
[Correo institucional]        → Estado vacío (placeholder)
[carolinamo@unicauca.edu.co ✓] → Estado válido (ícono check, sin borde error)
[carolinamo@gmail.com ⚠]      → Estado inválido ("Este correo no es válido. Requiere @unicauca.edu.co")
```

### Ícono Candado — Símbolo de Seguridad

El ícono **candado** (🔒 / Material Symbol: `lock`) debe usarse en:
- Componentes de texto que hagan referencia a la seguridad
- Junto a la Política de Protección de Datos Personales
- En notificaciones de seguridad (tipo 5)
- En el botón de Configuración → Política de Gestión de la Seguridad

### Configuración — Botón obligatorio en menú principal

Todo producto con marca institucional **debe tener en su menú principal** un botón de **Configuración** que dirija a:
1. Configuración de la cuenta del sistema
2. Política de Protección de Datos Personales *(enlace externo al portal web)*
3. Política de Gestión de la Seguridad de la Información *(enlace externo)*

> ⚠️ Los documentos de políticas **NO se alojan dentro del sistema**, sino en el portal web de la Universidad del Cauca. Se conectan mediante link externo.

### Pop-ups / Ventanas Emergentes
- Usar **solo en situaciones de alta prioridad** de seguridad
- El uso excesivo afecta negativamente la UX
- Limitar a situaciones críticas según necesidades del proyecto

---

## 📦 Sistema de Contenedores Institucional

> Complementa `04_shape_system.md` con los valores exactos del Design System TIC v3

### 7 Estilos de Forma de Contenedores

| Estilo de forma | Border Radius | Componentes |
|----------------|--------------|-------------|
| **Ninguno** | 0px | Pancartas, Barras inferiores, Diálogos pantalla completa, Listas, Barras de navegación, Rieles de navegación, Indicadores de progreso, Vista de búsqueda pantalla completa, Hojas laterales ancladas, Pestañas, Barras superiores de aplicaciones, Menú estándar |
| **Extra pequeño** | 4px | Menú autocompletar, Seleccionar menú, **Snackbars**, **Campos de texto** |
| **Pequeño** | 8px | Información sobre herramientas ricas en fichas |
| **Medio** | 12px | **Tarjetas**, FAB pequeñas, Barra de búsqueda |
| **Largo** | 16px | FAB extendidos, FAB, Cajones de navegación |
| **Extra grande** | 28px | Hojas inferiores, **Diálogos**, Hojas flotantes, FAB grandes, Selector de tiempo, Entrada de tiempo |
| **Lleno** | Full (9999px) | **Insignia**, **Botones**, Controles deslizantes, Botones de íconos interruptores |

> ⚠️ **Diferencia clave con Figma 2026:** El PDF TIC v3 define "Pequeño" como 8px y "Medio" como 12px para tarjetas, mientras que el Figma 2026 usa "Pequeño" como 14px y "Mediano" como 18px. **Para proyectos de la División TIC, usar los valores del PDF TIC v3 (esta tabla).**

---

## 🏗️ Layout de Sistema — Estructura General

Patrón de layout observado en los ejemplos del PDF:

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [Logo] [Nombre del sistema]          [Avatar] [Nombre] [▼]  │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  SIDEBAR     │  CONTENIDO PRINCIPAL                         │
│  #000066     │                                              │
│              │  [Notificación top-right si hay]             │
│  ✓ Item 1    │                                              │
│  ✓ Item 2    │                                              │
│  ✓ Item 3    │                                              │
│  ⚙ Config.  │                                              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│ FOOTER                                                       │
│ [Año] | [Nombre completo del sistema] | [Vicerrectoría]     │
│ División TIC | Versión 1.0.0                                │
└─────────────────────────────────────────────────────────────┘
```

**Colores del layout:**
- Sidebar: fondo `#000066`, texto e íconos `#FFFFFF`
- Header: fondo blanco, texto `#000066`
- Footer: texto pequeño, gris neutro
- Contenido: fondo blanco o `#F6F6F6` (neutro hover)

---

## 📋 Checklist de cumplimiento para nuevos sistemas

Antes de entregar un sistema con marca institucional de la Universidad del Cauca:

- [ ] Colores primario y secundario son los aprobados por el Consejo Superior
- [ ] El rojo (`#DB141C` / `#9D0311`) NO se usa como color de error
- [ ] Color de error es naranja `#FF6D0A`
- [ ] Tipografías: Titillium Web / Open Sans (o Fira Sans como alternativa)
- [ ] Tamaño mínimo de texto: 12px (Resolución 1519 de 2020)
- [ ] Botón "Configuración" visible en menú principal
- [ ] Políticas como link externo (no alojadas en el sistema)
- [ ] Ícono candado en secciones de seguridad / datos personales
- [ ] Notificaciones posicionadas esquina superior derecha, debajo del header
- [ ] Tratamiento prenominal con "ustedeo" en todos los textos
- [ ] Feedback claro: al anunciar error, siempre proponer solución
- [ ] Recordatorio de cambio de contraseña cada 3 meses
- [ ] Contraste mínimo WCAG 2.1 AA verificado
- [ ] Logo institucional visible en header
- [ ] Footer con año, nombre del sistema, vicerrectoría, División TIC, versión
