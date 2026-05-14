# 📐 GUÍA PARA GENERAR LOS DIAGRAMAS FALTANTES

**Objetivo:** Crear 4 diagramas profesionales para incluir en la monografía  
**Tiempo estimado:** 2-3 horas  
**Herramienta:** draw.io (online o desktop)

---

## 1. DIAGRAMA BPMN AS-IS (Proceso Actual)

### Descripción
Muestra el flujo MANUAL actual de matrícula financiera SIN tu sistema.

### Elementos a incluar

**Actores (Carriles):**
- Estudiante
- Coordinador del Programa
- Sistema Actual (Excel/Base de Datos Antigua)

**Flujo:**
```
ESTUDIANTE:
1. Inicia → Solicita información financiera (teléfono/correo)

COORDINADOR:
2. Recibe solicitud (evento/entrada manual)
3. Accede a sistema anterior (Excel, BD antigua, archivos)
4. Busca datos del estudiante en múltiples fuentes
5. Compila información manualmente
6. Calcula montos, descuentos, estado (si lo hace)
7. Genera documento (reporte en Word, PDF manual)
8. Envía por correo al estudiante

ESTUDIANTE:
9. Recibe reporte
10. Fin
```

### Decisiones de Modelado AS-IS
- ✅ Muestra **ineficiencias**: "múltiples fuentes", "cálculos manuales"
- ✅ Tiempo entre paso 2 y 9: **variable (horas/días)**
- ✅ Riesgo de errores: alto (cálculos manuales)
- ✅ Actualización de datos: **NO es en tiempo real**

### Cómo crearlo en draw.io
1. Abre draw.io → New → Blank Diagram
2. Insertar 3 **Swimlanes** (Arrange → Layers → Swimlane)
3. Agregar **tareas redondeadas** (rounded rectangle) con color gris
4. Agregar **decisión** (diamond) si hay bifurcaciones
5. Conectar con flechas etiquetadas
6. Agregar **eventos** (círculos) al inicio y fin

**Paleta de colores (BPMN estándar):**
- Evento: Círculo verde/inicio
- Tarea: Rectángulo redondeado azul claro
- Decisión: Diamante naranja
- Fin: Círculo rojo

---

## 2. DIAGRAMA BPMN TO-BE (Proceso con tu Sistema)

### Descripción
Muestra el flujo AUTOMATIZADO con tu aplicación.

### Elementos a incluir

**Actores (Carriles):**
- Estudiante
- Frontend (tu aplicación Angular)
- Backend (Microservicios)
- Base de Datos Centralizada

**Flujo:**
```
ESTUDIANTE:
1. Accede a la aplicación desde navegador

FRONTEND:
2. Autentica vía Firebase
3. Solicita resumen de matrícula (GET /api/matricula-financiera/{id})

BACKEND:
4. Recibe solicitud autenticada
5. Consulta datos en BD centralizada
6. Calcula montos, descuentos, estado (TODO el backend)
7. Construye JSON con datos completos

FRONTEND:
8. Recibe JSON
9. Mapea DTO a modelo de dominio
10. Renderiza componentes con datos reactivos (Observable)

ESTUDIANTE:
11. Ve información financiera actualizada en tiempo REAL
12. (OPCIONAL) Solicita revisión de matrícula
    → Frontend envía POST /api/solicitudes
    → Backend procesa y guarda en BD
13. Fin
```

### Decisiones de Modelado TO-BE
- ✅ **Tiempo:** Instantáneo (milisegundos)
- ✅ **Actualización:** En tiempo real
- ✅ **Única fuente de verdad:** Backend
- ✅ **Errores:** Minimizados (sin cálculos manuales)
- ✅ **Accesibilidad:** 24/7 desde cualquier dispositivo

### Cómo crearlo en draw.io
1. Similar al AS-IS pero con 4 carriles
2. Usar color VERDE para "nuevo/eficiente"
3. Agregar símbolos de API: rectángulos con borde punteado para HTTP
4. Incluir **Data Store** (BD): símbolo de cilindro

**Paleta colores TO-BE:**
- Evento: Círculo verde
- Tarea: Rectángulo azul oscuro
- API: Rectángulo azul claro con borde punteado
- BD: Cilindro amarillo

---

## 3. DIAGRAMA ENTIDAD-RELACIÓN (ER / Modelo de Datos)

### Descripción
Muestra las tablas y relaciones de tu base de datos.

### Entidades Principales

**1. Estudiante**
```
PK: codigo (string)
- nombre (string)
- apellido (string)
- identificacion (number)
- email (string)
- cohorte (string)
- fechaIngreso (date)
- estado (enum: ACTIVO, EGRESADO, SUSPENDIDO)
FK: periodo_id
```

**2. PeriodoAcademico**
```
PK: id (int)
- numero (int: 1 o 2)
- año (int)
- fechaInicio (date)
- fechaFin (date)
- fechaFinMatricula (date)
- estado (enum: ABIERTO, CERRADO)
```

**3. MatriculaFinanciera**
```
PK: id (int)
- codigo_estudiante (FK → Estudiante)
- periodo_id (FK → PeriodoAcademico)
- semestreFinanciero (int)
- estaPago (boolean o null)
- estado (enum: PENDIENTE, AL_DIA, MORA, EXONERADO, BECADO)
- valorEnSMLV (number)
- fechaCreacion (date)
FK: estudiante, periodo
```

**4. BecaFinanciera**
```
PK: id (int)
- resolucion (string)
- tipo (enum: EGRESADO, DOCENTE, BECA_EXTERNA)
- porcentaje (number: 0-100)
- estado (enum: ACTIVA, INACTIVA)
- matricula_id (FK → MatriculaFinanciera)
```

**5. DescuentoFinanciero**
```
PK: id (int)
- tipo (enum: VOTACION, EGRESADO, OTRO)
- porcentaje (number: 0-100)
- estado (enum: ACTIVO, INACTIVO)
- matricula_id (FK → MatriculaFinanciera)
```

**6. ConfiguracionPresupuestaria**
```
PK: id (int)
- periodo_id (FK → PeriodoAcademico)
- valorSMLV (number)
- derechosBiblioteca (number)
- recursosComputacionales (number)
- porcentajeVotacionFijo (number)
- porcentajeEgresadoFijo (number)
```

**7. Materia**
```
PK: codigo (string)
- nombre (string)
- creditos (int)
- semestreAcademico (int)
- periodo_id (FK → PeriodoAcademico)
```

**8. MatriculaAcademica**
```
PK: id (int)
- estudiante_id (FK → Estudiante)
- materia_id (FK → Materia)
- calificacion (number)
- estado (enum: MATRICULADO, APROBADO, REPROBADO)
```

**9. SolicitudRevision**
```
PK: id (int)
- matricula_id (FK → MatriculaFinanciera)
- estudiante_id (FK → Estudiante)
- descripcion (text)
- estado (enum: PENDIENTE, APROBADA, RECHAZADA)
- fechaCreacion (date)
- fechaResolucion (date)
```

### Relaciones

```
Estudiante (1) ──→ (M) MatriculaFinanciera
Estudiante (1) ──→ (M) MatriculaAcademica
Estudiante (1) ──→ (M) SolicitudRevision

PeriodoAcademico (1) ──→ (M) MatriculaFinanciera
PeriodoAcademico (1) ──→ (M) ConfiguracionPresupuestaria
PeriodoAcademico (1) ──→ (M) Materia

MatriculaFinanciera (1) ──→ (M) BecaFinanciera
MatriculaFinanciera (1) ──→ (M) DescuentoFinanciero
MatriculaFinanciera (1) ──→ (M) SolicitudRevision

Materia (1) ──→ (M) MatriculaAcademica
```

### Cómo crearlo en draw.io

1. Insertar **Entidades** (rectángulos con 3 secciones):
   - Encabezado (nombre)
   - Atributos
   - Clave primaria (PK)

2. Para cada atributo mostrar:
   - Tipo de dato
   - Si es PK (subrayado)
   - Si es FK (con emoji 🔗 o nota)

3. Conectar con líneas etiquetadas:
   - `1..1` a `1..*` (relación uno-a-muchos)
   - `0..1` para opcionales

**Leyenda de líneas:**
- Línea sólida = Relación obligatoria
- Línea punteada = Relación opcional

### Estructura visual recomendada
```
        Estudiante ─┬─ MatriculaFinanciera ─┬─ BecaFinanciera
                    │                        └─ DescuentoFinanciero
                    ├─ MatriculaAcademica       └─ SolicitudRevision
                    └─ SolicitudRevision
        
        PeriodoAcademico ─┬─ MatriculaFinanciera
                          ├─ ConfiguracionPresupuestaria
                          └─ Materia ─── MatriculaAcademica
```

---

## 4. DIAGRAMA ARQUITECTURA DE CAPAS (Frontend)

### Descripción
Muestra cómo está estructurado tu Angular internamente.

### Capas (de arriba hacia abajo)

```
┌─────────────────────────────────────────────────────┐
│  CAPA 1: PRESENTACIÓN (Componentes Smart)           │
│                                                     │
│  MatriculaFinancieraComponent                       │
│  DetalleEstudianteComponent                         │
│  ResumenMatriculaEstudianteComponent                │
│  ProyeccionReporteComponent                         │
│  ReporteFinalComponent                              │
│  ReportePorGruposComponent                          │
│                                                     │
│  Responsabilidad:                                   │
│  - Capturar entrada del usuario                     │
│  - Inyectar servicios                               │
│  - Suscribirse a observables                        │
│  - Renderizar datos                                 │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  CAPA 2: COMPONENTES UI (Dumb Components)           │
│                                                     │
│  MatriculaStatusBadgeComponent                      │
│  OpcionesPresupuestoComponent                       │
│  PresupuestoFilterComponent                         │
│  [Otros componentes presentacionales puros]         │
│                                                     │
│  Responsabilidad:                                   │
│  - Solo renderizar datos (@Input)                   │
│  - Emitir eventos al padre (@Output)                │
│  - SIN lógica de negocio                            │
│  - SIN HTTP calls                                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  CAPA 3: SERVICIOS (Facade + Mapper)                │
│                                                     │
│  GestionMatriculaFinancieraFacadeService            │
│  - BehaviorSubject$                                 │
│  - Métodos públicos para casos de uso               │
│  - Orquesta API + Mapper                            │
│                                                     │
│  GestionMatriculaFinancieraMapperService            │
│  - Transforma DTO → Modelo de Dominio               │
│  - Normaliza datos                                  │
│                                                     │
│  GestionInformacionPresupuestariaFacadeService      │
│  GestionInformacionPresupuestariaMapperService      │
│  ExcelService (generación de reportes)              │
│                                                     │
│  Responsabilidad:                                   │
│  - Lógica de estado (RxJS)                          │
│  - Transformación de datos                          │
│  - Orquestación de casos de uso                     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  CAPA 4: API (HttpClient + DTOs)                    │
│                                                     │
│  GestionMatriculaFinancieraApiService               │
│  GestionInformacionPresupuestariaApiService         │
│  [Otros API Services]                               │
│                                                     │
│  DTOs (Contratos con Backend):                      │
│  - EstudianteDTORespuesta                           │
│  - MatriculaFinancieraDTORespuesta                  │
│  - PeriodoAcademicoDTORespuesta                     │
│  - BecaFinancieraDTORespuesta                       │
│  - [Otros DTOs]                                     │
│                                                     │
│  Responsabilidad:                                   │
│  - Llamadas HTTP puras (GET, POST, PUT, DELETE)    │
│  - Sin transformación lógica                        │
│  - Sin estado                                       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  CAPA 5: DOMINIO (Modelos TypeScript)               │
│                                                     │
│  models/domain-models.ts                            │
│  - Estudiante (class)                               │
│  - MatriculaFinanciera (class)                      │
│  - BecaFinanciera (class)                           │
│  - PeriodoAcademico (class)                         │
│  - ConfiguracionPresupuestaria (class)              │
│  - [Otros modelos]                                  │
│                                                     │
│  Responsabilidad:                                   │
│  - Representar entidades del negocio                │
│  - Métodos auxiliares (getters, validators)         │
│  - Tipos seguros (TypeScript)                       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  BACKEND (Fuera de este diagrama)                   │
│  - Microservicios Java/Spring Boot                  │
│  - Base de Datos Centralizada                       │
│  - Autenticación Firebase                           │
└─────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario interactúa con MatriculaFinancieraComponent (Smart)
                              ↓
           Se inyecta GestionMatriculaFinancieraFacadeService
                              ↓
           Facade llama a GestionMatriculaFinancieraApiService
                              ↓
           Api Service hace GET /api/matricula-financiera/{id}
                              ↓
           Backend retorna EstudianteDTORespuesta (JSON)
                              ↓
           Facade inyecta GestionMatriculaFinancieraMapperService
                              ↓
           Mapper transforma DTO → Estudiante (domain model)
                              ↓
           Facade emite BehaviorSubject$ con nuevo valor
                              ↓
           Component se suscribe a Observable$ y recibe Estudiante
                              ↓
           Component pasa datos a MatriculaStatusBadgeComponent (Dumb)
                              ↓
           Componente UI renderiza el Badge con [@Input]
                              ↓
           Usuario ve resultado final en navegador
```

### Cómo crearlo en draw.io

1. Insertar **5 rectángulos apilados** (uno por capa)
2. Colorear cada capa diferente:
   - Capa 1 (Presentación): Azul claro
   - Capa 2 (UI): Verde claro
   - Capa 3 (Servicios): Naranja claro
   - Capa 4 (API): Rojo claro
   - Capa 5 (Dominio): Gris claro
3. Dentro de cada rectángulo, escribir componentes/servicios
4. Agregar flechas bidireccionales mostrando dependencias
5. Anotar responsabilidades en cada capa

**Leyenda visual:**
- Flecha `→` = Depende de / Inyecta
- Flecha `←` = Retorna datos
- Línea punteada = Comunicación opcional

---

## 5. RESUMEN DE ACCIONES

### Para crear todos los diagramas:

1. **Abre draw.io** → File → New → Blank Diagram
2. **Para cada diagrama:**
   - Create a new page (+ icon en la parte inferior)
   - Nómbralo (BPMN AS-IS, BPMN TO-BE, ER, Capas Frontend)
   - Copia los elementos descritos arriba
   - Ajusta colores y posiciones
3. **Exporta final:**
   - Guarda como: `diagramas-monografia-completos.drawio`
   - También exporta cada diagrama como PNG (File → Export → PNG)
   - Resolución: 300 dpi, tamaño mínimo 1200x800 px

### Dentro de cada PNG, incluye:
- Título descriptivo (ej: "Figura 4.3 Diagrama BPMN AS-IS")
- Leyenda si es compleja
- Fuente: "Fuente: Elaboración propia"

---

## 6. REFERENCIAS PARA APOYARTE

- **BPMN 2.0 Spec:** https://www.omg.org/bpmn
- **draw.io BPMN shapes:** https://www.diagrams.net/doc/bpmn
- **ER Diagram Best Practices:** https://www.guru99.com/er-model-tutorial-dbms.html

---

**¿Necesitas que creemos un diagrama específico juntos ahora, o prefieres intentarlo y me muestras el resultado?** 🎨
