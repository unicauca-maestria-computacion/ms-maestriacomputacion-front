**Propuesta** ** de **  **F**  **ront-**  **E**  **nd** ** para los módulos de **  **m** **atrícula **  **f** **inanciera e **  **i** **nformación ** **de presupuesto para el prototipo ** **del **  **sistema académico-administrativo de la Maestría en Computación** ** **  
   
    
   
   
 **   
   
    
   
 *Anteproyecto de Trabajo de Grado* *  
   
  *Modalidad: Práctica Profesional  
   
    
   
 [**Daniel Felipe Contreras Tobar** **  
   
  **104615010808*  
 *  
  *  
 *  
 * *Asesor de la empresa:* * * * * *PhD. Luz Marina Sierra Martínez*  
 *  
  *  
 *  
 * *D* * * *irectora* * * *: * * *Magister* * * *. L* * * *aura María Orozco García*  
 *  
  *  
 *  
  *  
 *  
  *  
 *  
  *  
 *  
 Universidad del Cauca*  
   
  ** **Facultad de Ingeniería Electrónica y Telecomunicaciones ** **  
   
  ** **Programa Ingeniería de Sistemas** **  
   
  **Popayán, abril de 2025  
   
    
   
 **TABLA DE CONTENIDO**  
   
    
   
 Lista de figuras  
   
 Lista de tablas  
   
 ](about:blank "about:blank")[1.Justificación y Planteamiento del Problema4  
   
 ](#anchor-1 "#anchor-1")[2.Marco teórico7  
   
 ](#anchor-2 "#anchor-2")[2.1.Maestría en Computación7  
   
 ](#anchor-3 "#anchor-3")[2.2.Marco Legal y Normativo7  
   
 ](#anchor-4 "#anchor-4")[2.3.Metodología Ágil SCRUM8  
   
 ](#anchor-5 "#anchor-5")[2.4.Tecnologías para el Desarrollo8  
   
 ](#anchor-6 "#anchor-6")[2.4.1.Angular8  
   
 ](#anchor-7 "#anchor-7")[2.4.2.Docker9  
   
 ](#anchor-8 "#anchor-8")[2.4.3.MySQL9  
   
 ](#anchor-9 "#anchor-9")[2.4.4.Figma9  
   
 ](#anchor-10 "#anchor-10")[2.5.Experiencia de Usuario y Diseño UX/UI9  
   
 ](#anchor-11 "#anchor-11")[2.6.Validación y Pruebas del Sistema9  
   
 ](#anchor-12 "#anchor-12")[2.7.Alcance y Relevancia del Proyecto10  
   
 ](#anchor-13 "#anchor-13")[2.8.Trabajos relacionados10  
   
 ](#anchor-14 "#anchor-14")[3.Objetivos11  
   
 ](#anchor-15 "#anchor-15")[3.1.Objetivo General11  
   
 ](#anchor-16 "#anchor-16")[3.2.Objetivos Específicos11  
   
 ](#anchor-17 "#anchor-17")[4.Actividades y cronograma12  
   
 ](#anchor-18 "#anchor-18")[5.Recursos, presupuesto y fuentes de financiación15  
   
 ](#anchor-19 "#anchor-19")[6.Condiciones de entrega16  
   
 ](#anchor-20 "#anchor-20")[7.Referencias bibliográficas17  
   
 ](#anchor-21 "#anchor-21")[Carta de aceptación de la empresa19  
   
 ](#anchor-22 "#anchor-22")[Acta de propiedad intelectual19  
   
    
   
    
   
    
   
 ](#anchor-23 "#anchor-23")  
   
    
   
 **LISTA** ** DE **  **F**  **IGURAS**  
   
    
   
 Figura 1. Formato utilizado para matriculas ..…………………………………………4  
   
 Figura 2. Ejemplo de información de presupuesto del programa por semestre .……5  
   
 Figura 3. Ejemplo de información de presupuesto del programa por año ……………6  
   
 Figura 4. Ejemplo de información aporte por grupo, ingresos netos y excedentes del programa y de cada grupo .……………………………………………………………...6  
   
    
   
    
   
    
   
 **LISTA** ** DE **  **TABLAS**  
   
    
   
 Tabla 1 Cronograma general del proyecto……………………………………………..12  
   
 Tabla 2. Presupuesto del proyecto…………………………………….……………….15  
   
    
   
    
   
    
1. **JUSTIFICACIÓN Y PLANTEAMIENTO DEL PROBLEMA**  
   
   
 La Maestría en Computación de la Universidad del Cauca es un programa líder en formación de posgrado, reconocido por su enfoque en investigación y desarrollo tecnológico [1]. En el desarrollo de sus actividades, el programa realiza varios procesos académicos y administrativos, atendiendo las diferentes directrices del Ministerio de Educación Nacional (como decretos, acuerdos y resoluciones), de los Consejos Superior, Académico y de Facultad, del Centro de Posgrados de la Universidad del Cauca (acuerdos y resoluciones), y del Reglamento específico de la Maestría expedido mediante Resolución 8.4.2-90.14/055 de 2014.  
   
 Uno de los procesos administrativos más importantes que realiza el programa cada semestre es reportar al Centro de Posgrados las matrículas académica y financiera de cada estudiante. De este reporte se desprende la información relacionada con los ingresos y egresos del programa en cada semestre y año.  
   
 Estos procesos administrativos asociados a la matrícula financiera y la gestión presupuestaria son realizados por el coordinador académico del programa de forma manual, con el riesgo de se puedan cometer errores debido al detalle que se debe tener en cuenta. Además, la matricula financiera es un proceso que debe ir de la mano con la matricula académica del estudiante.  
   
 El correcto desarrollo de estos procesos es fundamental para el programa, dado que de esto depende que se pueda llevar un control adecuado de las finanzas del programa, lo que garantiza su viabilidad en el tiempo. Además, contar con esta información permite al programa tomar decisiones importantes para apoyar a sus estudiantes al otorgar becas y descuentos acordes a la normatividad universitaria y nacional, al mismo tiempo que ejecutar los gastos propios del funcionamiento del programa.  
   
 El proceso de matrícula financiera se realiza simultáneamente con la matrícula académica, según el formato y las indicaciones del Centro de Posgrados de la Universidad del Cauca. En la actualidad el formato utilizado es:  
   
   
   
 *Figura * *1*  *. Formato utilizado para matriculas. Tomado de la Coordinación del programa.*  
   
 En la Figura 1, se puede apreciar cada uno de los elementos que se deben tener en cuenta en la matricula del programa, los que se tienen en cuenta para la matricula financiera son:  
- Identificación del estudiante, código o número de cedula para el caso de estudiantes de primer semestre a quienes aún no se les ha asignado el código.  
- Nombres completos del estudiante  
- Valor de la matrícula en salarios mínimos legales vigentes, en donde el número varía de acuerdo con el semestre en el que este, si es un estudiante de 1 a 4 semestre o reingreso el valor corresponde a 6 salarios (en la actualidad) y si es de 5 a 8 semestre, siempre y cuando solo vaya a matricular trabajo de grado 2 el valor corresponde a 1 salario [3].  
- El semestre financiero puede variar del semestre académico, a nivel académico solo existen 4 semestres mientras que financieramente la Universidad le ofrece al estudiante dos años adicionales a la duración nominal del programa[1], para finalizar su programa. Adicionalmente, cuando un estudiante no alcanza a sustentar en los 30 días del inicio del siguiente periodo deberá realizar matricula académica a pesar de estar en 9no semestre y por consiguiente pagar un salario mínimo mensual legal vigente [2].  
- Descuento por votación, el 10% de descuento de votación depende de que el estudiante haya presentado el certificado de votación de las elecciones indicadas y en las fechas establecidas. Este descuento se aplica a todos los estudiantes que cumplan con las indicaciones, sin importar si tiene otro descuento.  
- Descuento por egresado, este descuento es del 5% y solo se aplica a estudiantes de 1 a 4 semestre que se hayan graduado de su pregrado en la Universidad del Cauca y que cuenten con el descuento del votación del 10% [4]. En caso de tener otro beneficio de descuento en la matrícula, se aplica el que más beneficie al estudiante.  
- Resolución No., cuando un estudiante recibe el beneficio de una beca, esta se notifica a través de una resolución cuyo número debe ir en este campo, si al momento de hacer la entrega de este formato no se cuenta con la resolución, en caso de que se vaya a hacer un descuento por beca trabajo u otro concepto se coloca pendiente en este campo [5].  
- % Beca, aquí se indica el porcentaje de beca asociado al concepto de la resolución.  
   
 A partir de esta información, el coordinador puede sacar reportes financieros del programa como:  
- Lista de estudiantes con sus aportes (pagos), descuentos, y los ingresos netos por cada estudiante, similar a como se presenta en la Figura 2, una vez se ha confirmado cuáles estudiantes van a matricular en ese semestre.  
- De esta información se pueden sacar los ingresos netos del programa, total de descuentos, total del valor aportado por grupo en cada semestre y el total al año.  
   
    
   
 *Figura * *2* *. Ejemplo de información de presupuesto del programa* * por semestre*  *.  Tomado de la Coordinación del programa.*  
- Con la información anterior, el programa puede sacar totales anuales, como se puede ver en la siguiente tabla:  
   
    
   
   
 *Figura * *3* *. Ejemplo de información de presupuesto del programa por año.  Tomado de la Coordinación del programa.*  
- Adicionalmente, el coordinador puede obtener el rubro que le queda al programa y a cada grupo, según el aporte de cada uno, como se muestra en la Figura 4.  
   
   
    
 *Figura * *4* *. Ejemplo de información aporte por grupo, ingresos netos y excedentes del programa y de cada grupo.  Tomado de la Coordinación del programa.*  
   
    
   
 Como se mencionó anteriormente, en la actualidad este trabajo se realiza de forma manual, de tal forma que si surge algún cambio se hace necesario revisarlo todo, además, pueden ocurrir errores involuntarios que generan trabajo adicional que se podría ahorrar si se contará con algún apoyo tecnológico, así como agilidad en los procesos, en la actualización de datos y en la toma de decisiones.  
   
 Teniendo en cuenta lo anterior, y con el ánimo de completar el prototipo del Sistema Académico administrativo de la Maestría en Computación de la Universidad del Cauca, se han propuesto dos prácticas profesionales para apoyar la matricula financiera (en coordinación con otras dos prácticas profesionales que desarrollan el módulo de matrícula académica) y la obtención de información de presupuesto del programa así: una propuesta desarrollará el front-end y otra el back-end.   
   
 La propuesta descrita en este documento tiene como objetivo proponer el desarrollo de un front-end para los módulos de Matrícula Financiera e Información presupuestaria del Programa integrado con el sistema académico administrativo de la Maestría en computación. Este sistema apoyará tecnológicamente los procesos actuales, favoreciendo el cumplimiento de normativas como el Acuerdo Nº 044 de 2012 [2], el Acuerdo Superior Nº 056 de 2013 [3], Acuerdo superior No. 017 de 2023 [4] y el Acuerdo Nº 085 de 2008 sobre becas y exenciones [5].   
   
 Adicional a lo mencionado, esta propuesta apoyará: 1) la reducción de la carga de trabajo administrativo, permitiendo que el personal se enfoque en tareas más estratégicas y de mayor valor para la Maestría en Computación; y 2) una mejor experiencia del usuario a través de interfaces diseñadas con principios de UX/UI, haciendo el sistema más accesible, eficiente y fácil de usar para todos los involucrados.  
   
    
1. **MARCO TEÓRICO**  
   
   
 3. ## **MAESTRÍA EN COMPUTACIÓN**  
   
 La Maestría en Computación, adscrita a la Facultad de Ingeniería Electrónica y Telecomunicaciones (FIET) de la Universidad del Cauca, es un programa académico enfocado en formar investigadores y profesionales que contribuyan al avance de la tecnología y la ciencia de la computación. Desde su creación, mediante el Acuerdo Superior Nº 067 de 2007 [7], ha promovido una educación de alta calidad, fomentando la innovación y la eficiencia en los procesos académicos y administrativos que sustentan su funcionamiento.  
   
 El sistema académico-administrativo de la Maestría en computación, que se encuentran en desarrollo, requiere los módulos de Matrícula Financiera e Información Presupuestaria, fundamentales para la planificación y ejecución de los procesos del programa, a la fecha el sistema cuenta con gestión de usuarios, gestión de estudiantes, gestión de solicitudes, gestión de docentes, gestión de certificados de votaciones, gestión de expertos y gestión de evaluación docente.  
   
    
   
 4. ## **MARCO LEGAL Y NORMATIVO**  
   
 Los procesos administrativos de la Maestría están regulados por normativas específicas que establecen lineamientos claros para su operación. Entre los documentos más relevantes se encuentran:  
- Acuerdo No. 044 de 2012 [2], establece las reglas para el pago de matrícula financiera de estudiantes en etapas avanzadas, como el trabajo de grado.  
- Acuerdo Superior No. 056 de 2013 [3], define los costos de matrícula para estudiantes de posgrado, diferenciando entre créditos y semestres matriculados.  
- Acuerdo No. 085 de 2008 [5], regula las becas-trabajo, incentivos y exenciones aplicables.  
- Acuerdo No. 035 de 1992 [6], establece los procedimientos generales para la gestión académica y administrativa de los programas de posgrado.  
   
 Estos acuerdos son fundamentales para el diseño del sistema de matrícula académica y financiera, ya que proporcionan las bases para la automatización de cálculos financieros, la aplicación de descuentos, la asignación de becas y la correcta gestión presupuestaria de la Maestría en Computación. El cumplimiento de estas normativas permitirá optimizar los procesos internos, mejorar la experiencia del usuario y garantizar la conformidad con los lineamientos institucionales vigentes.  
   
    
1. **METODOLOGÍA ÁGIL SCRUM**  
SCRUM es una metodología ágil que ha demostrado ser efectiva en el desarrollo de sistemas complejos, permitiendo iteraciones rápidas y la entrega incremental de valor. En este proyecto, se aplicará SCRUM para gestionar el desarrollo del front-end en ciclos iterativos (sprints) de dos semanas, asegurando que cada fase del proyecto se alinee con los objetivos propuestos [8].  
   
 Entre las prácticas clave de SCRUM se incluyen:  
- Sprint Planning: Definición del alcance de cada iteración.  
- Daily Scrum: Reuniones diarias para revisar avances y resolver bloqueos.  
- Sprint Review: Revisión de los entregables al finalizar cada sprint.  
- Sprint Retrospective: Análisis de los aspectos positivos y de las oportunidades de mejora en cada iteración.  
   
 El uso de SCRUM facilitará que el sistema se desarrolle de forma organizada y centrada en las necesidades del usuario, maximizando la colaboración entre los miembros del equipo.  
   
    
1. **TECNOLOGÍAS PARA EL DESARROLLO**  
Para garantizar el éxito del proyecto, se han seleccionado las siguientes tecnologías:  
   
 7. ### **Angular**  
   
 Angular es un framework ampliamente utilizado para desarrollar aplicaciones web dinámicas y escalables. Su capacidad para gestionar aplicaciones de una sola página (SPA) y su estructura basada en componentes hacen que sea ideal para construir sistemas modulares y reutilizables. Ventajas: Modularidad, manejo eficiente del DOM y escalabilidad. [9].  
- Aplicación en el proyecto: Creación de componentes que gestionen funcionalidades específicas como cálculos automáticos de matrículas y visualización de proyecciones presupuestarias.  
1. **Docker**  
Docker permite crear contenedores que encapsulan la aplicación y sus dependencias, asegurando un entorno consistente desde el desarrollo hasta la producción. Ventajas: Despliegue simplificado y compatibilidad entre entornos. [10].  
- Aplicación en el proyecto: Despliegue del front-end y pruebas en ambientes controlados.  
1. **MySQL**  
Esta base de datos relacional será el núcleo del almacenamiento de la información, facilitando la gestión de datos sensibles como matrículas, descuentos y presupuestos. Ventajas: Soporte robusto para transacciones y consultas complejas. [11].  
- Aplicación en el proyecto: Almacenamiento seguro de información financiera y académica.  
1. **Figma**  
Figma será utilizado para diseñar las interfaces del sistema, asegurando una experiencia de usuario óptima. Ventajas: Colaboración en tiempo real y prototipado interactivo [12].  
- Aplicación en el proyecto: Diseño de pantallas intuitivas para los módulos de Matrícula Financiera e Información Presupuestaria.  
   
    
1. **EXPERIENCIA DE USUARIO Y DISEÑO UX/UI**  
El diseño centrado en el usuario (UX/UI) es clave para el éxito de sistemas administrativos donde interactúan distintos perfiles como estudiantes, coordinadores y personal administrativo [13]. En este proyecto se aplicará una evaluación práctica basada en principios fundamentales de eficiencia, consistencia y accesibilidad, enfocándose en aspectos para validar manualmente. Se realizarán pruebas con usuarios nuevos para observar si logran completar tareas sin ayuda, se cronometrarán acciones básicas para verificar eficiencia (≤30 segundos), y se aplicarán encuestas cualitativas breves para recoger impresiones sobre la facilidad de uso. Además, se validará la accesibilidad mediante navegación con teclado, pruebas de contraste visual con extensiones como WAVE y revisión del diseño a 200% de zoom. Se verificará también que el diseño sea adaptable a dispositivos móviles usando Chrome DevTools, y que los errores estén bien manejados a través de mensajes claros y recuperables. Este proceso iterativo permite identificar mejoras desde etapas tempranas, reduciendo errores posteriores y favoreciendo una mejor experiencia de usuario desde todos los roles del sistema [14] [15].  
   
 12. ## **VALIDACIÓN Y PRUEBAS DEL SISTEMA**  
   
 La calidad del software es un componente crítico del proyecto, especialmente considerando la sensibilidad de los datos que se manejarán en los módulos de Matrícula Financiera e Información Presupuestaria. Las pruebas de software, ejecutadas durante y después del desarrollo, garantizarán que el sistema cumpla con los requisitos establecidos y funcione correctamente[16] [17].  
   
 Se emplearán herramientas como:  
- Jasmine y Karma: Para realizar pruebas unitarias y de integración en los componentes del front-end [16] [17].   
- Pruebas funcionales: Para asegurar que el sistema cumpla con las expectativas de los usuarios mediante pruebas específicas de casos de uso. [18].  
- Pruebas de aceptación: Facilita la validación final con los usuarios clave antes del despliegue [19].  
   
 El enfoque de pruebas se puede aplicar incluso en la fase de producción de un sistema, garantizando que el sistema entregue resultados confiables y de alta calidad.  
   
    
1. **ALCANCE Y RELEVANCIA DEL PROYECTO**  
El desarrollo de los módulos de Matrícula Financiera e Información Presupuestaria busca optimizar la gestión de la Maestría en Computación a través de:  
- **Automatización de procesos manuales**, reduciendo errores y mejorando la eficiencia operativa.  
- **Incorporación de tecnologías actuales** para ofrecer una interfaz intuitiva y una experiencia de usuario fluida.  
- **Apoyo a la toma de decisiones**, mediante el acceso rápido y confiable a datos financieros y presupuestarios relevantes.  
   
    
1. **TRABAJOS RELACIONADOS**  
En 2023, la División de Estudios Profesionales para Ejecutivos (EPE) de la Universidad Peruana de Ciencias Aplicadas (UPC) implementó un sistema de matrícula digital con automatización de procesos para la asignación de vacantes en AWS para el Ministerio de Educación [20]; el objetivo principal de este sistema fue optimizar el proceso de asignación de vacantes, permitiendo una gestión más eficiente y transparente. La implementación incluyó la automatización de tareas clave en el flujo de trabajo, lo que redujo tiempos de procesamiento y mejoró la experiencia del usuario. La experiencia de la UPC en la automatización de procesos de matrícula puede servir como referencia para la presente propuesta, especialmente en la gestión de la asignación de cupos, la optimización del flujo de trabajo y la generación de reportes de matrícula.  
   
 En 2023, Sydle publicó un artículo sobre la optimización de los procesos de matrícula en instituciones educativas [21], en el cual se resalta la importancia de la organización y eficiencia para garantizar la satisfacción del estudiante y el éxito del negocio educativo. El artículo proporciona diversas recomendaciones para mejorar la gestión del proceso de matrícula, incluyendo la automatización de tareas, la simplificación de formularios y una comunicación efectiva con los estudiantes. Las estrategias sugeridas por Sydle resultan relevantes para el presente proyecto, ya que se busca optimizar el proceso de matrícula académica y financiera, incorporando flujos de aprobación de matrícula y notificación automática.  
   
 En 2019, la Universidad Técnica de Machala desarrolló un sistema de información para la gestión de matrículas en la Facultad de Ciencias Empresariales [22], el sistema se diseñó para automatizar el proceso de matrícula, desde la inscripción hasta la generación de horarios y el control de pagos. La experiencia de la Universidad Técnica de Machala en la implementación de un sistema de matrícula integral puede aportar ideas para el diseño e implementación del presente proyecto, especialmente en la gestión de la información académica y financiera de los estudiantes.  
   
 Como se puede apreciar, existen varios trabajos previos que pueden servir como referencia para el desarrollo de la presente propuesta. No obstante, es importante tener en cuenta que cada institución educativa tiene procesos específicos que no siempre son replicables en otros contextos. Además, los recursos disponibles para la implementación de soluciones pueden variar considerablemente. Por estas razones, se considera pertinente la ejecución de esta práctica profesional que se enfoque desarrollar los módulos software para los procesos de matrícula académica y financiera, tomando en cuenta las particularidades del entorno educativo y las tecnologías más adecuadas para garantizar una implementación eficaz y eficiente.  
   
 15. # **OBJETIVOS**  
   
 16. ## **OBJETIVO GENERAL**  
   
 Proponer el desarrollo de un front-end para los módulos de Matrícula Financiera e Información Presupuestaria para el prototipo del sistema académico-administrativo de la Maestría en Computación, con el fin de apoyar la gestión administrativa del programa.  
   
 17. ## **OBJETIVOS ESPECÍFICOS**  
- Diseñar la interfaz de usuario de los módulos de matrícula financiera e información presupuestaria a partir de la identificación de requisitos funcionales y no funcionales definidos en el backlog y sus historias de usuario, validadas por el coordinador de programa, y garantizando que la interfaz sea intuitiva y visualmente coherente con la identidad del sistema.  
- Construir los componentes que permitan gestionar el Front-End de los módulos, mediante el diseño de plantillas, validaciones del lado del cliente y la inclusión de una interactividad fluida y consistencia visual.  
- Integrar los servicios REST del back-end con el front-end, asegurando la interoperabilidad y manteniendo la integridad de los datos.  
- Evaluar el atributo satisfacción[[1] de los módulos construidos e integrados mediante la interacción del coordinador y otros usuarios, y la aplicación de una encuesta de percepción.](#anchor-24 "#anchor-24")  
1. **ACTIVIDADES Y CRONOGRAMA**  
Para una mejor organización y gestión del proyecto, se ha dividido el trabajo en fases con sus respectivas actividades y un cronograma detallado. Esto permitirá un seguimiento más preciso del progreso y la correcta asignación de tiempo y recursos.  
   
 El proyecto estará conformado por 6 fases, cada fase estará compuesta por sprints, los cuales tienen una duración de dos semanas cada uno, además, cada fase contendrá diferentes etapas que variaran según el propósito de estas. Según la proyección se estima completar el proyecto en un lapso de 6 meses.  
   
 *Tabla * * *1* * * Cronograma general del proyecto*  
   
 | | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|  
   
 | **Actividades** |  **Mes / Semana** | | | | | | | | | | | | | | | | | | | | | | | |  
   
 |  | Mes 1 | | | | Mes 2 | | | | Mes 3 | | | | Mes 4 | | | | Mes 5 | | | | Mes 6 | | | |  
   
 |  | 1 | 2 | 3 | 4 | 1 | 2 | 3 | 4 | 1 | 2 | 3 | 4 | 1 | 2 | 3 | 4 | 1 | 2 | 3 | 4 | 1 | 2 | 3 | 4 |  
   
 | **ORGANIZACIÓN INICIAL** | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 | Refinar requerimientos |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Revisión y diseño de arquitectura |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Primera versión de product Backlog |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Ambiente de desarrollo |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | **MÓDULO DE MATRÍCULA FINANCIERA** | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 | Reunión de Planificación del Sprint |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Desarrollo e implementación defuncionalidades. |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Reunión Diaria de Seguimiento:Actualización del progreso,discusión de obstáculos |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Resolución de posiblesobstáculos o problemas técnicos. |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Preparación para la reunión derevisión y retrospectiva del sprint |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Reunión de revisión defuncionalidades implementadas |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Reunión retrospectiva ypreparación del siguiente sprint |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | **MÓDULO DE I**  **NFORMACION PRESUPUESTARIA** | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 | Reunión de Planificación del Sprint |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Desarrollo e implementación defuncionalidades. |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Reunión Diaria de Seguimiento:Actualización del progreso,discusión de obstáculos |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Resolución de posiblesobstáculos o problemas técnicos. |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Preparación para la reunión derevisión y retrospectiva del sprint |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Reunión de revisión defuncionalidades implementadas |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Reunión retrospectiva ypreparación del siguiente sprint |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | **DESPLIEGUE** | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 | Subir sprint backlog del producto |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Despliegue del front-end |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Prueba de aplicación con usuarios |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | Resolución de hallazgos |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 | **DOCUMENTACIÓN** | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 | Realización y revisión de documento final |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |  
   
 |   | | | | | | | | | | | | | | | | | | | | | | | | |  
   
 19. # **RECURSOS, PRESUPUESTO Y FUENTES DE FINANCIACIÓN**  
   
    
   
 En la Tabla 2 se relacionan los recursos y presupuesto requeridos para el desarrollo de este proyecto, conforme a la guía definida por el Comité de investigación de la FIET para elaboración de trabajos de grado.  
   
 *Tabla * * *2.* * * * * *Presupuesto* * * del proyecto*  
   
 | | | | | |  
   
 |-|-|-|-|-|  
   
 | **Recursos** |  **Fuentes** | | |  **Total** |  
   
 |  | **Estudiante** |  |  **Departamento - FIET** |  **Universidad del Cauca (Maestría en computación)** |  
   
 | Personal | $15.044.400 | $2.507.400 | $626.850 | $18.178.650 |  
   
 | Equipo | $4.000.000 | $1.500.000 | 0 | $5.500.000 |  
   
 | Software | 0 | 0 | 0 | 0 |  
   
 | Viajes y Salidas | 0 | 0 | 0 | 0 |  
   
 | Bibliografía | 0 | 0 | 0 | 0 |  
   
 | Materiales | $64.900 | 0 | 0 | $64.900 |  
   
 | Servicios técnicos | 0 | 0 | 0 | 0 |  
   
 | Publicaciones | 0 | 0 | 0 | 0 |  
   
 | Administración | 0 | 0 | 0 | 0 |  
   
 | Comunicaciones | 0 | 0 | 0 | 0 |  
   
 | ARL | 0 | 0 | $60.000 | $60.000 |  
   
 | **TOTAL** | $19.109.300 | $4.007.400 | $686.850 | $23.803.550 |  
   
 20. # **CONDICIONES DE ENTREGA**  
   
    
   
 Al finalizar el presente trabajo de grado en modalidad Práctica Profesional, se obtendrán los siguientes productos:  
   
 **Documento final** que describe el trabajo realizado, los resultados obtenidos y el proceso de desarrollo, subdividido en los siguientes capítulos:  
- **Capítulo 1: Descripción de la propuesta**: Presentación del proyecto, objetivos y alcance del desarrollo del front-end para los módulos de Matrícula Financiera e Información Presupuestaria. Explicación de los conceptos fundamentales, tecnologías utilizadas y metodologías aplicadas durante el desarrollo del sistema.  
- **Capítulo ** **2** **: ** **Diseño de la interfaz **  **de los módulos desarrollados** ** **Descripción detallada del proceso de recolección de requisitos y construcción del product backlog y descripción detallada de las interfaces propuestas para los módulos  
- **Capítulo ** **3** **: **  **Construcción** ** ** **del **  **front-end** ** **  **los módulos**: Detalle sobre la implementación de los módulos de matrícula financiera e información presupuestaria, destacando los principios de diseño UX/UI y la integración con el back-end.   
- **Capítulo 4:**   **I** **ntegración y evaluación de los módulos**: Descripción del proceso de integración de los módulos desarrollados con el sistema existente, incluyendo pruebas funcionales y de usabilidad.  
- **Capítulo 5: Conclusiones, lecciones aprendidas y trabajo futuro**: Reflexión sobre el proceso de desarrollo, los aprendizajes obtenidos y las posibles mejoras para futuras implementaciones.  
 **Implementación del ** ** **front-end** ** ** del Módulo de Matrícula Financiera** del Sistema Académico Administrativo para la Maestría en Computación, que incluirá el diseño del módulo y la integración con los servicios back-end, cumpliendo con los requisitos funcionales y no funcionales establecidos.  
   
 **Implementación del ** **front-end** ** del Módulo de Información ** **del **  **Presupuest** **o** del Sistema Académico Administrativo para la Maestría en Computación, centrado en la accesibilidad, la experiencia del usuario y la automatización de los procesos administrativos.  
1. **REFERENCIAS BIBLIOGRÁFICAS**  
   
1. “Maestría en Computación - Universidad del Cauca”, Facultad de Ingeniería Electrónica y Telecomunicaciones, 2025. [En línea]. Disponible: [https://fiet.unicauca.edu.co/maestriacomputacion/. [Accedido: 14-mar-2025].](https://fiet.unicauca.edu.co/maestriacomputacion/ "https://fiet.unicauca.edu.co/maestriacomputacion/")  
2. Universidad del Cauca, “Acuerdo No 044 de 2012, sobre pago de matrícula financiera para estudiantes próximos a sustentar,” Acuerdo, 2012. [En línea]. Disponible: [https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-044-de-2012. [Accedido: 14-mar-2025].](https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-044-de-2012 "https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-044-de-2012")  
3. Universidad del Cauca, “Acuerdo Superior Nº 056 de 2013, sobre costo de matrícula para estudiantes de posgrado en trabajo de grado,” Acuerdo, 2013. [En línea]. Disponible:  [https://www.unicauca.edu.co/archivos/centro_posgrados/normativa/CPN_66b0f19cd3ac51_43079422.pdf . [Accedido: 14-mar-2025].](https://www.unicauca.edu.co/archivos/centro_posgrados/normativa/CPN_66b0f19cd3ac51_43079422.pdf "https://www.unicauca.edu.co/archivos/centro_posgrados/normativa/CPN_66b0f19cd3ac51_43079422.pdf")  
4. Universidad del Cauca, “Acuerdo superior No. 017 de 2023, sobre descuento en programas de posgrado para los egresados.” [En línea]. Disponible: [https://www.unicauca.edu.co/posgrados/sites/default/files/ac_017_2023-06-08_aprueba_descuento_en_matra_cula_posgrados_para_egresados_unicaucano.pdf. [Accedido: 14-mar-2025].](https://www.unicauca.edu.co/posgrados/sites/default/files/ac_017_2023-06-08_aprueba_descuento_en_matra_cula_posgrados_para_egresados_unicaucano.pdf "https://www.unicauca.edu.co/posgrados/sites/default/files/ac_017_2023-06-08_aprueba_descuento_en_matra_cula_posgrados_para_egresados_unicaucano.pdf")  
5. Universidad del Cauca, “Acuerdo No. 085 de 2008, sobre incentivos y exenciones para el personal activo perteneciente al cuerpo profesoral y administrativo, al igual que para el cuerpo de docentes ocasionales y catedráticos, pensionados y estudiantes regulares. Acuerdo 015 de 2011,” Acuerdo, 2011. [En línea]. Disponible: [https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-085-de-2008#:~:text=DEFINICI%C3%93N%3A%20Los%20incentivos%20de%20que,del%20Cauca%20en%20el%20%C3%A1mbito. [Accedido: 14-mar-2025].](#anchor-25 "#anchor-25")  
6. Universidad del Cauca, “Acuerdo No. 035 de 1992, sobre estatuto para el funcionamiento académico y administrativo,” Acuerdo, 1992. [En línea]. Disponible: [https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-035-de-1992-0. [Accedido: 14-mar-2025].](https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-035-de-1992-0 "https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-035-de-1992-0")  
7. Universidad del Cauca, “Acuerdo No. 067 de 2007, por el cual se crea el Programa de Postgrado MAESTRIA EN INGENIERIA, Área Computación.,” Acuerdo, 2013. [En línea]. Disponible:  [https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-067-de-2007. [Accedido: 14-mar-2025].](https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-067-de-2007 "https://portal.unicauca.edu.co/versionP/documentos/acuerdos/acuerdo-no-067-de-2007")  
8. Scrum 1 documentation. [En línea]. Disponible: https://metodologiascrum.readthedocs.io/en/latest/. [Accedido: 14-mar-2025].  
9. Angular. [En línea]. Disponible: [https://v13.angular.io/docs. [Accedido: 14-mar-2025].](https://v13.angular.io/docs "https://v13.angular.io/docs")  
10. «Get started». (2024, 16 septiembre). Docker Documentation. [En línea]. Disponible: [https://docs.docker.com/get-started/. [Accedido: 14-mar-2025].](https://docs.docker.com/get-started/ "https://docs.docker.com/get-started/")  
11. MySQL, “MySQL Documentation”. [En línea]. Disponible: [https://dev.mysql.com/doc/. [Accedido: 14-mar-2025].](https://dev.mysql.com/doc/ "https://dev.mysql.com/doc/")  
12. Figma Basics (Español) - Primeros pasos en Figma | Figma. [En línea]. Disponible: [https://www.figma.com/community/file/923140611594993345/figma-basics-espanol-primeros-pasos-en-figma. [Accedido: 14-mar-2025].](https://www.figma.com/community/file/923140611594993345/figma-basics-espanol-primeros-pasos-en-figma "https://www.figma.com/community/file/923140611594993345/figma-basics-espanol-primeros-pasos-en-figma")  
13. Norman, D. A. (2013). The Design of Everyday Things. Basic Books.  
14. ISO 9241-210:2019. *Ergonomics of human-system interaction – Human-* *centred* * design for interactive systems*.  
15. Krug, S. (2014). *Don't Make Me Think, Revisited: A * * *Common Sense* * * Approach to Web Usability*. New Riders. [En línea]. Disponible:https://eng317hannah.wordpress.ncsu.edu/files/2020/01/Krug_Steve_Dont_make_me_think_revisited___a_cz-lib.org_.pdf. [Accedido: 25-mar-2025].  
16. Jasmine. (n.d.). Jasmine: Behavior-driven JavaScript. [En línea]. Disponible: [https://jasmine.github.io/. [Accedido: 14-mar-2025].](https://jasmine.github.io/ "https://jasmine.github.io/")  
17. Karma. (n.d.). Karma: Spectacular test runner for JavaScript. [En línea]. Disponible: [https://karma-runner.github.io/. [Accedido: 14-mar-2025].](https://karma-runner.github.io/ "https://karma-runner.github.io/")  
18. Sommerville, Ian. *Ingeniería del software*. 10ª ed., Pearson Educación, 2011.  
19. Pressman, Roger S., y Maxim, Bruce R. *Ingeniería del Software: Un enfoque práctico*. 8ª ed., McGraw-Hill, 2015.  
20. Ríos, Z. M. (2023). Implementación de un sistema de matrícula digital con automatización de los procesos para la asignación de vacantes en AWS para el Ministerio de Educación. Universidad Peruana de Ciencias Aplicadas (UPC). [En línea]. Disponible:  [https://repositorioacademico.upc.edu.pe/handle/10757/675393 [Accedido: 14-mar-2025].](https://repositorioacademico.upc.edu.pe/handle/10757/675393 "https://repositorioacademico.upc.edu.pe/handle/10757/675393")  
21. Sydle. (2023). Proceso de matrícula: ¿cómo funciona y cómo organizarlo? [En línea]. Disponible: [https://www.sydle.com/es/blog/proceso-de-matricula-63e27c29a128f13e2e83c1a9 [Accedido: 25-mar-2025].](https://www.sydle.com/es/blog/proceso-de-matricula-63e27c29a128f13e2e83c1a9 "https://www.sydle.com/es/blog/proceso-de-matricula-63e27c29a128f13e2e83c1a9")  
22. Universidad Técnica de Machala. (2019). Facultad de Ciencias [En línea]. Disponible: [https://www.utmachala.edu.ec.](https://www.utmachala.edu.ec "https://www.utmachala.edu.ec")  
**CARTA DE ACEPTACIÓN DE LA EMPRESA**  
TODO  
   
    
**ACTA DE PROPIEDAD INTELECTUAL**  
TODO  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsScYxpg/i2XMYARvRrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA22YBcnkstSpAAAAAElFTkSuQmCC)  
[[1] El atributo satisfacción evalúa la percepción positiva general del usuario al interactuar con el sistema. La satisfacción del usuario está influenciada por la usabilidad, la estética y la capacidad del sistema para cumplir con sus necesidades (citar el ISO).  ](#anchor-26 "#anchor-26")  
