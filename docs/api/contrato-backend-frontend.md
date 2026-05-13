# Contrato de Comunicación Backend-Frontend (Finanzas Maestría)

Este documento detalla los endpoints, DTOs y estructuras JSON utilizadas en los módulos de **Matrícula Financiera** e **Información Presupuestaria**, tras la refactorización para centralizar la lógica de negocio en el Backend.

---

## 1. Módulo: Información Presupuestaria

### 1.1 Reporte por Grupos (Cero Lógica)
**Endpoint:** `GET /reporte-por-grupos`
*   **Parámetros:** `anio` (int)
*   **Response DTO:** `ConsultaReportePorGruposDTORespuesta`
*   **JSON Response (Campos Clave):**
```json
{
  "totalIngresos": 150000000,
  "auiValor": 33000000,
  "excedentesMaestria": 5000000,
  "ingresosNetos": 112000000, // Calculado en Back
  "totalGastosGenerales": 45000000, // Calculado en Back
  "valorADistribuir": 67000000,
  "totalItem1": 53600000, // NUEVO: Suma global Item 1
  "totalItem2": 13400000, // NUEVO: Suma global Item 2
  "totalImprevistos": 6700000, // NUEVO: Suma global Imprevistos
  "totalVigenciasAnteriores": 12000000, // NUEVO: Suma global Vigencias
  "totalNeto": 100000000, // NUEVO: Total neto
  "aportePrimerSemestre": 50000000, // NUEVO: Aporte del semestre 1
  "aporteSegundoSemestre": 50000000, // NUEVO: Aporte del semestre 2
  "porcentajePrimerSemestre": 50.0, // NUEVO: Porcentaje del semestre 1
  "porcentajeSegundoSemestre": 50.0, // NUEVO: Porcentaje del semestre 2
  "participacionPrimerSemestre": 50.0, // NUEVO: Participación del semestre 1
  "participacionSegundoSemestre": 50.0, // NUEVO: Participación del semestre 2
  "participacionPorAnio": 100.0, // NUEVO: Participación anual
  "reportesPorGrupo": [
    {
      "nombreGrupo": "GTI",
      "presupuestoPorGrupoItem1": 25000000,
      "aportePrimerSemestre": 12500000,
      "totalNeto": 30000000
    }
  ]
}
```

### 1.2 Actualización de Participación
**Endpoint:** `PUT /reporte-por-grupos/participacion`
*   **Request JSON:**
```json
{
  "periodoAcademicoId": 1,
  "grupoId": 101,
  "porcentajeParticipacion": 25.0, // Valor 0-100
  "semestre": "PRIMER"
}
```

### 1.3 Proyección de Estudiante
**Endpoint:** `PUT /proyeccion-estudiantes`
*   **Request JSON:**
```json
{
  "codigoEstudiante": "2024101",
  "estaPago": true, // Simulación o real
  "aplicaVotacion": true,
  "porcentajeBeca": 15.0, // Valor 0-100
  "aplicaEgresado": false
}
```

---

## 2. Módulo: Matrícula Financiera

### 2.1 Listado de Estudiantes (Coordinador)
**Endpoint:** `POST /estudiantes`
*   **Request JSON:**
```json
{
  "tagPeriodo": 1,
  "anio": 2026
}
```
*   **Response JSON (Campos Críticos):**
```json
[
  {
    "codigo": "2024101",
    "nombre": "Juan",
    "apellido": "Perez",
    "estaPago": true, // Estado del pago en tesorería
    "estadoMatriculaFinanciera": true // Sincronizado con tesorería
  }
]
```

### 2.2 Detalle de Estudiante
**Endpoint:** `GET /estudiantes/{codigo}`
*   **Response JSON:** Incluye el desglose de materias, becas y descuentos aplicados.

---

## Cambios Realizados en los DTOs

### ConsultaReportePorGruposDTORespuesta (Frontend)
Se añadieron los siguientes campos para permitir la visualización de la fila **"Total"** sin cálculos en el cliente:
1.  `totalItem1`: Reemplaza el cálculo manual `valorADistribuir * item1`.
2.  `totalItem2`: Reemplaza el cálculo manual `valorADistribuir * item2`.
3.  `totalImprevistos`: Reemplaza el cálculo manual `valorADistribuir * imprevistos`.
4.  `totalVigenciasAnteriores`: Reemplaza la suma manual `.reduce()` de las vigencias de cada grupo.
5.  `ingresosNetos`: Se expuso para mostrar la base real antes de gastos generales.
6.  `totalGastosGenerales`: Se expuso para centralizar la suma de las categorías de gastos.
7.  `totalNeto`, `aportePrimerSemestre`, `aporteSegundoSemestre`, `porcentajePrimerSemestre`, `porcentajeSegundoSemestre`, `participacionPrimerSemestre`, `participacionSegundoSemestre`, `participacionPorAnio`: Nuevos campos agregados para delegar al backend los cálculos de porcentajes y totales agregados (evitando errores de redondeo o datos nulos en la UI).

### ProyeccionEstudianteDTORespuesta
Se habilitó el campo `estadoMatriculaFinanciera` (boolean) para diferenciar entre una **simulación** (`estaPago`) y un **pago real** en el sistema bancario. 

**Regla de Negocio:** Si `estadoMatriculaFinanciera` no es `null`, la interfaz de proyección bloquea la edición y muestra el tag de pago institucional.

---
*Documentación generada para estandarización de contratos de API v2026.*
