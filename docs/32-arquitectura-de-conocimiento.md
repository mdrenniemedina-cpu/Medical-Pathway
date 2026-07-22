# Medical Pathway — Arquitectura de Conocimiento (v1.0)

> **Naturaleza de este documento:** especificación fundacional de la Base de Conocimiento, no contenido de ningún país. No es código ni una propuesta de funcionalidad — es investigación/diseño, la misma categoría de trabajo que `docs/00-project-charter.md` a `docs/14-*` (fase de arquitectura, previa a construir). Por eso **no** entra en el congelamiento de alcance de la Beta (ese congelamiento aplica a nuevo código de producto, no a investigación) — aun así, se avisa explícitamente porque es un documento de gran alcance, tal como se acordó señalar cada vez.
>
> **Disciplina de honestidad de todo el proyecto, aplicada aquí:** se distingue explícitamente **hecho** (verificable, con fuente citada), **recomendación** (juicio profesional de este equipo, justificado) e **hipótesis** (a validar con evidencia real, nunca tratada como conclusión). La Fase 11 (entrevistas) es un **ejercicio de diseño simulado**, marcado así en su encabezado — no es evidencia real y no debe mezclarse con `docs/product-learning-journal.md`, que documenta únicamente entrevistas reales.

---

## Fase 1 — Mapa integral del recorrido del médico

El recorrido actual del producto se resume en 4 preguntas (Descubrir/Planificar/Acompañar/Continuar, `docs/03-mvp-definition.md`). Esa capa de producto sigue siendo válida como **fachada de usuario**, pero la Base de Conocimiento necesita un mapa más granular por debajo, porque cada una de esas 4 preguntas oculta docenas de etapas reales.

### Macro-fases y etapas (hecho + recomendación de estructuración)

| Macro-fase | Etapas |
|---|---|
| **A. Decisión** | A1. Duda inicial ("¿debería emigrar?") · A2. Autoevaluación de motivaciones (económica, profesional, familiar, seguridad, especialización) · A3. Exploración exploratoria de países sin compromiso · A4. Decisión de comprometerse con 1-3 rutas candidatas |
| **B. Preparación de perfil** | B1. Consolidar documentación académica existente · B2. Identificar brechas de idioma · B3. Identificar brechas de experiencia clínica/certificaciones · B4. Presupuestar el proceso · B5. Planificar tiempo disponible (¿sigue trabajando mientras tanto?) |
| **C. Idioma** | C1. Elegir examen/certificación objetivo · C2. Preparación (cursos, autoestudio) · C3. Presentar examen · C4. Esperar resultado · C5. Renovación si vence antes de usarlo |
| **D. Legalización documental** | D1. Apostilla/legalización del título · D2. Traducción jurada · D3. Autenticación consular (cuando aplica) |
| **E. Reconocimiento/homologación académica** | E1. Elegir vía (homologación directa, convalidación, examen de suficiencia) · E2. Solicitud formal ante el organismo · E3. Pago de tasas · E4. Espera de resolución · E5. Posible examen de conocimientos (ej. exámenes de habilitación) · E6. Resolución (aprobado/objetado/denegado) |
| **F. Colegiación / autorización administrativa** | F1. Inscripción en colegio médico u organismo regulador · F2. Pago de cuotas · F3. Emisión de credencial |
| **G. Vía migratoria (paralela, no secuencial)** | G1. Elegir tipo de visa/permiso · G2. Requisitos migratorios propios (no médicos) · G3. Trámite consular · G4. Llegada y trámites locales (residencia, seguridad social, cuenta bancaria) |
| **H. Inserción profesional** | H1. Decidir vía clínica vs. académica vs. investigación · H2. Búsqueda de empleo/plaza · H3. Proceso de selección/entrevistas · H4. Negociación de contrato |
| **I. Formación adicional (cuando aplica)** | I1. Examen de acceso a especialidad (ej. MIR-equivalente) · I2. Postulación a plazas de residencia/fellowship · I3. Cursar la especialidad · I4. Reconocimiento de especialidad ya obtenida en origen |
| **J. Adaptación** | J1. Adaptación cultural y lingüística en el entorno laboral real (distinto del idioma certificado) · J2. Entender el sistema de salud local (referencias, historia clínica, jerarquías) · J3. Red de apoyo (comunidad de médicos migrantes) |
| **K. Ejercicio y continuidad** | K1. Primeros meses ejerciendo · K2. Educación médica continua exigida localmente · K3. Renovación periódica de licencia · K4. Posible traída de familia · K5. Posible movimiento a un segundo país (recorrido puede repetirse) |

**Nota honesta:** las macro-fases D-F son las que hoy tiene profundidad real en el producto (España, `db/seed/seed.ts`). G, H, I, J, K son macro-fases completas que **hoy no existen en ningún bounded context** — ni siquiera como esqueleto. Esto es información nueva para el roadmap (ver Fase 12), no una crítica al trabajo ya hecho: Sprint 0-1 deliberadamente acotaron el alcance a D-F como beachhead (ADR-001).

---

## Fase 2 — Descubrimiento de información por etapa (método + muestra aplicada)

Aplicar las 10 preguntas del brief a las ~45 etapas de la Fase 1 es un ejercicio de *contenido*, no de *arquitectura* — excede lo que este documento debe producir (el propio brief pide "diseña la arquitectura que hará posible documentar... no escribas todavía el contenido"). Lo que sí corresponde aquí es fijar la **plantilla exacta** y aplicarla completa a 2 etapas representativas, una de cada tipo (documental vs. de espera), para validar que la plantilla funciona antes de escalarla a las ~45.

### Plantilla (una fila por etapa)

| Campo | Descripción |
|---|---|
| ¿Qué necesita saber el usuario? | Lista de hechos mínimos indispensables |
| ¿Qué preguntas suele hacerse? | Formuladas en primera persona, lenguaje real, no jerga |
| ¿Qué errores son frecuentes? | Solo incluir con fuente real (foro, testimonio, o marcado explícitamente como hipótesis) |
| ¿Qué decisiones debe tomar? | Puntos de bifurcación reales, no ilustrativos |
| Volatilidad | `alta` (revisar cada ≤3 meses) / `media` (≤12 meses) / `baja` (revisar solo si cambia normativa) |
| Depende de | `país` / `perfil` / `momento del proceso` / combinación — explícito, no implícito |
| Automatizable por Medical Pathway | `sí, hoy` / `sí, con datos que no tenemos todavía` / `no, requiere criterio humano` |

### Aplicación a E2 (Solicitud formal de homologación ante el organismo)

- **Qué necesita saber:** organismo exacto a quien dirigirse, formulario/plataforma, documentos anexos exigidos, plazo de resolución oficial vs. real.
- **Preguntas frecuentes:** "¿Puedo trabajar mientras espero?", "¿Puedo apelar si me la niegan?", "¿Vence algo mientras espero?".
- **Errores frecuentes (hipótesis, sin fuente propia todavía — marcar y validar en Fase 10/entrevistas reales):** enviar traducción no jurada, no reunir el expediente completo antes de iniciar el reloj de plazos.
- **Decisiones:** iniciar antes o después de rendir el examen de idioma; iniciar desde el país de origen o ya en destino.
- **Volatilidad:** media (cambia con reformas administrativas, no constantemente).
- **Depende de:** país (organismo distinto) y perfil (tipo de título: pregrado/especialidad cambia el expediente exigido).
- **Automatizable:** sí, hoy — es exactamente lo que `RutaHomologacion`/`EtapaRuta` (`catalogo/domain`) ya modelan como etapa `documental`/`registro`.

### Aplicación a E4 (Espera de resolución — la etapa de mayor dolor identificada en investigación previa, ver `docs/research/08-momento-critico-espera.md`)

- **Qué necesita saber:** tiempo típico real (no el legal-oficial, casi siempre distinto), qué puede hacer mientras espera, cómo consultar el estado.
- **Preguntas frecuentes:** "¿Cuánto están tardando en mi caso concreto?", "¿Es normal que no haya respuesta?".
- **Errores frecuentes (hipótesis):** no preparar nada más durante la espera, tratándola como tiempo perdido en vez de tiempo útil (idioma, ahorro, red de contactos).
- **Decisiones:** ¿buscar trabajo no clínico mientras tanto? ¿empezar a preparar el examen de habilitación en paralelo?
- **Volatilidad:** alta — el tiempo real de espera cambia con el volumen de expedientes acumulados (exactamente el problema que Radar de Espera intenta resolver, `decisions/ADR-008`).
- **Depende de:** país, y del momento (backlog acumulado varía mes a mes) — no depende del perfil individual.
- **Automatizable:** parcialmente hoy (duración típica con fuente, `catalogo/domain`), y **hoy no** para la estimación en tiempo real por cohorte — ese es exactamente el propósito de Radar de Espera, diseñado pero sin datos reales todavía (`docs/13-calidad-confianza-datos-radar.md`).

**Conclusión de la Fase 2:** la plantilla funciona y expone algo importante: **la mayoría de "errores frecuentes" y "qué hacer mientras se espera" hoy son hipótesis nuestras, no hechos verificados** — esto se convierte en input directo para el protocolo de entrevistas ya existente (`docs/18-discovery-protocolo-entrevistas.md`), que debería, de hecho, preguntar explícitamente por errores cometidos en cada etapa para llenar esta plantilla con evidencia real en vez de hipótesis del equipo.

---

## Fase 3 — Arquitectura de la Base de Conocimiento

### Evaluación de la estructura propuesta por el founder

La cadena `País → Ruta → Etapa → Paso → Documento → Institución → Costo → Tiempo → Requisito → Fuente → ...` **mezcla dos tipos de cosas distintos**: una jerarquía real de composición (País contiene Rutas, Ruta contiene Etapas) y un conjunto de **atributos que cuelgan de múltiples niveles a la vez**, no de uno solo en cadena. Por ejemplo: "Costo" no es un hijo de "Documento" exclusivamente — una Etapa completa tiene costo propio (ej. tasa de examen) independiente de si tiene documentos asociados; "Fuente" no cuelga solo del final de la cadena, cada atributo individual necesita su propia fuente (ya implementado así en `AtributoConFuente`, ver Fase 6).

### Estructura recomendada: jerarquía de composición + atributos transversales (hub-and-spoke)

```
País (Destino)
 └─ Ruta (RutaProfesional — generaliza RutaHomologacion, ver PRODUCT_ITERATION_V2.md Fase 3)
     └─ Etapa (EtapaRuta)
         └─ Paso (nuevo nivel — hoy Etapa es el nivel más fino; el brief pide un nivel más granular)

Atributos transversales, adjuntables a Ruta, Etapa o Paso (no solo al final de la cadena):
 - Documento requerido
 - Institución involucrada
 - Costo (AtributoConFuente)
 - Tiempo (AtributoConFuente)
 - Requisito (condición que debe cumplirse, ligada a un campo del Perfil Internacional)
 - Fuente (obligatoria en cada atributo individual, no en el conjunto)
 - Observaciones
 - Errores frecuentes (con procedencia: oficial / experiencia de usuarios — ver Fase 7)
 - Preguntas frecuentes
 - Checklist (lista de Requisitos con estado, ver Fase 8)
 - Estado del usuario (pendiente/en proceso/completado — vive en Ruta del Médico, no en Catálogo, ver Fase 5)
 - Acciones sugeridas (motor de brechas, ya existe parcialmente)
 - Recordatorios (Notificaciones, hoy esqueleto)
 - Notas (del usuario, privadas)
 - Actualizaciones (historial de cambios del dato, ver Fase 6)
```

**Por qué "hub-and-spoke" y no una cadena lineal:** una cadena obliga a que todo cuelgue de un único padre; un modelo hub-and-spoke permite que "Costo" se adjunte tanto a una Etapa completa (ej. tasa administrativa) como a un Paso específico (ej. costo de una traducción jurada puntual) sin forzar una jerarquía artificial. Esto **ya es, de hecho, cómo está construido hoy** el dominio (`AtributoConFuente` se usa tanto en `Destino` como en `EtapaRuta`, en niveles distintos de la jerarquía) — la recomendación es formalizar explícitamente este patrón como regla de arquitectura de conocimiento, no solo como convención de código implícita.

---

## Fase 4 — Ficha perfecta: "Solicitar homologación de título médico"

| Campo | Contenido |
|---|---|
| Identificador único | `etapa-{pais}-solicitud-homologacion` |
| Nombre | Solicitud formal de homologación de título médico |
| Tipo | `documental` / `registro` |
| País(es) donde aplica | Explícito, uno o varios (algunos trámites son supranacionales, ej. UE) |
| Ruta(s) a la que pertenece | Explícito — puede pertenecer a más de una ruta (ejercicio general y especialidad pueden compartir esta etapa) |
| Descripción funcional | Qué es, en lenguaje llano |
| Orden / dependencias | Qué etapa(s) deben completarse antes (`prerequisitoEtapaId`, ya existe) |
| Duración típica | Valor + fuente + fecha de verificación (`AtributoConFuente`) |
| Duración real observada (cuando exista, vía Radar de Espera) | Distinta de la típica-oficial, con nivel de confianza y tamaño de muestra |
| Costo | Valor + moneda + fuente + fecha |
| Institución responsable | Nombre oficial, tipo (ministerio/colegio/organismo privado delegado), enlace, canal de contacto oficial |
| Documentos requeridos | Lista, cada uno con: nombre, formato aceptado, si requiere apostilla/traducción, vigencia (si aplica) |
| Requisitos de elegibilidad | Condiciones ligadas a campos del Perfil Internacional (ej. tipo de título, país de graduación) |
| Fuente oficial | URL exacta, fecha de publicación, fecha de última revisión nuestra |
| Nivel de confianza del dato | Ver Fase 6 |
| Observaciones | Matices que no caben en los campos estructurados |
| Errores frecuentes | Con procedencia (oficial/experiencia), ver Fase 7 |
| Preguntas frecuentes | Formuladas como las haría el usuario real |
| Checklist derivado | Auto-generado desde "Documentos requeridos" + "Requisitos de elegibilidad" |
| Acciones sugeridas si no cumple | Ligado al motor de brechas |
| Config. por perfil | Qué campos de esta ficha cambian según el perfil (`esConfigurablePorPerfil`, ya existe como flag) |
| Historial de cambios | Ver Fase 6 |
| Estado de verificación | `verificado` / `pendiente de revisión` / `desactualizado sospechoso` |
| Responsable de mantenimiento | Rol, no persona (para que sobreviva rotación de equipo) |

---

## Fase 5 — Modelo conceptual (entidades)

| Entidad | Definición | Relación con el dominio ya construido |
|---|---|---|
| **Usuario** | Persona con cuenta | `identidad-acceso/Cuenta` — ya existe |
| **Perfil Internacional** | Concepto central único del usuario | Ya existe, ver `PRODUCT_ITERATION_V2.md`/`docs/31` para extensiones propuestas |
| **País** | Entidad geográfica/jurisdiccional | `catalogo/Destino` — ya existe |
| **Ruta profesional** | Camino concreto dentro de un país (ejercicio general, especialidad, investigación...) | Generalización de `RutaHomologacion`, propuesta no implementada (`PRODUCT_ITERATION_V2.md` Fase 3) |
| **Etapa** | Fase dentro de una ruta | `catalogo/EtapaRuta` — ya existe |
| **Paso** | Unidad más fina dentro de una etapa | **No existe todavía** — nuevo nivel de granularidad |
| **Documento** | Papel/archivo requerido | No existe como entidad propia — hoy implícito en texto de `EtapaRuta.descripcion` |
| **Institución** | Organismo/entidad involucrada | No existe como entidad propia — hoy implícito |
| **Costo** | Atributo monetario | `AtributoConFuente<{valor,moneda}>` — patrón ya existe, se reutiliza |
| **Tiempo** | Atributo temporal | `AtributoConFuente<number>` — patrón ya existe |
| **Requisito** | Condición ligada a un campo del Perfil | No existe como entidad propia — hoy la lógica vive implícita en `ReglaCompatibilidad` |
| **Idioma** | Competencia lingüística | `CompetenciaIdiomatica` — existe, propuesta de extensión en `docs/31` |
| **Certificación** | Examen/credencial de idioma o profesional | Propuesta en `docs/31` (idioma) — falta certificación profesional/especialidad como concepto separado |
| **Examen** | Prueba de habilitación (no de idioma) | No existe — nuevo |
| **Visa** | Permiso migratorio | No existe — nueva macro-fase completa (G en Fase 1) |
| **Licencia** | Autorización final para ejercer | Implícita como resultado de la ruta — no modelada como entidad propia con su propio ciclo de vencimiento/renovación |
| **Especialidad** | Subespecialización médica | No existe — relacionado con macro-fase I |
| **Organismo regulador** | Ente que administra requisitos | Se solapa con "Institución" — recomendación: modelarlos como el mismo concepto, distinguido por un campo `tipo` |
| **Fuente** | Procedencia verificable de un dato | `AtributoConFuente` — ya es transversal, no una entidad aparte, por diseño |
| **Notificación / Recordatorio** | Aviso al usuario | Bounded context `Notificaciones` — existe como esqueleto |
| **Archivo** | Documento subido por el usuario | No existe — requiere almacenamiento de archivos, infraestructura nueva |
| **Comentario** | Nota del usuario o de otros médicos | No existe — se solapa con bounded context `Comunidad` (esqueleto) |
| **Experiencia de otros médicos** | Conocimiento práctico agregado | Se solapa con `Comunidad` y con Fase 7 de este documento |
| **Historial** | Registro temporal de cambios de estado/datos | No existe como concepto transversal — hoy cada contexto lo resolvería por separado si lo necesitara |

**Recomendación de secuencia (no implementar todavía, es lectura para el roadmap):** "Paso", "Documento", "Institución" y "Requisito" son las cuatro entidades nuevas de mayor apalancamiento — son las que permiten que la "ficha perfecta" (Fase 4) deje de ser texto libre dentro de `EtapaRuta.descripcion` y se vuelva estructurada y consultable.

---

## Fase 6 — Sistema de calidad de la información

El patrón `AtributoConFuente` ya existente cubre hoy: valor, URL de fuente, fecha de verificación. El brief pide una versión más completa — propuesta de extensión (no implementada):

```ts
interface AtributoConFuenteV2<T> {
  valor: T;
  fuenteUrl: string;
  fechaPublicacionFuente?: string;   // cuándo el organismo publicó el dato (nuevo)
  fechaUltimaRevisionNuestra: string; // cuándo Medical Pathway lo revisó (hoy "fechaVerificacion")
  nivelEvidencia: 'fuente_primaria_oficial' | 'fuente_secundaria_confiable' | 'experiencia_agregada' | 'hipotesis_equipo'; // nuevo
  nivelConfianza: 'alto' | 'medio' | 'bajo'; // nuevo — distinto de nivelEvidencia: una fuente primaria puede tener baja confianza si es ambigua
  frecuenciaEsperadaDeCambio: 'alta' | 'media' | 'baja'; // nuevo, ver Fase 2
  responsableDeRevision: string; // rol, no persona — nuevo
  version: number; // nuevo
  historialDeCambios: Array<{ version: number; fecha: string; valorAnterior: T; motivo: string }>; // nuevo
  estadoDeVerificacion: 'verificado' | 'pendiente_revision' | 'desactualizado_sospechoso'; // nuevo
}
```

**Esto es una extensión aditiva** del VO ya existente (`atributo-con-fuente.vo.ts`), no un reemplazo — compatible con la regla de "no romper rutas existentes" del founder en mensajes anteriores.

---

## Fase 7 — Conocimiento oficial vs. conocimiento práctico

Dos colecciones separadas, nunca fusionadas en el mismo campo:

1. **Conocimiento oficial** — todo lo que hoy captura `AtributoConFuente`: requisito, costo, tiempo, documento, con fuente primaria oficial.
2. **Conocimiento práctico** — errores frecuentes, consejos, advertencias, "qué hacer mientras esperas" — **siempre con procedencia explícita** (`experiencia_agregada` en `nivelEvidencia`, Fase 6) y, cuando exista suficiente volumen (k-anonimato, mismo principio ya usado en Radar de Espera, `ADR-008`), agregado estadísticamente en vez de citas individuales sueltas.

**Regla de presentación (recomendación de diseño, no implementada):** en la UI, lo oficial se muestra primero con el badge de fuente ya existente (`.badge-fuente`); lo práctico se muestra en una sección visualmente distinta, con un badge distinto (ej. "Experiencia de otros médicos") — nunca en el mismo bloque visual, para que el usuario nunca confunda un requisito legal con un consejo informal.

---

## Fase 8 — Sistema de acompañamiento

| Elemento | Estado hoy |
|---|---|
| Checklist | No existe — se deriva naturalmente de "Documentos requeridos" + "Requisitos" (Fase 4/5) una vez existan como entidades |
| Progreso | Existe una barra `<progress>` genérica en onboarding — **no** progreso real por requisitos (ver crítica ya hecha en `PRODUCT_ITERATION_V2.md` punto 8, Fase 5) |
| Cronograma / tiempo restante | Existe parcialmente (`proyeccion.html`, meses estimados) — falta por-etapa con estado individual |
| Documentos pendientes | No existe |
| Próximo paso | Existe parcialmente (`analizarBrechas` sugiere una acción, no necesariamente el "próximo paso" cronológico) |
| Alertas / recordatorios / vencimientos | Bounded context `Notificaciones` — esqueleto, sin lógica |
| Subida de archivos / verificación documental | No existe — requiere almacenamiento de archivos |
| Seguimiento del proceso (estado por etapa) | Pertenece a **Ruta del Médico** — hoy solo el evento `EntroAEtapaDeEspera`, el resto del bounded context está sin construir |

**Lectura para el roadmap:** el "sistema de acompañamiento" completo es, en términos de bounded contexts existentes, básicamente **terminar de construir Ruta del Médico y Notificaciones** — no son bounded contexts nuevos, son los dos que ya existen como esqueleto deliberado desde Sprint 0 (ver `docs/15-sprint-0-entregables.md`).

---

## Fase 9 — Escalabilidad

La arquitectura de bounded contexts ya fue diseñada explícitamente para esto desde Sprint 0 (`docs/12-estrategia-escalamiento-multipais.md`, `ADR-012`): un `Destino` nuevo, una `Ruta` nueva, o un `EtapaRuta` nuevo son **filas de datos**, no cambios de esquema ni de código. Lo que la arquitectura de conocimiento de este documento añade sobre eso:

- **Profesión sanitaria distinta de medicina** (enfermería, odontología, etc.): requiere que "Ruta profesional" no asuma implícitamente "médico" — el campo `tipoRuta`/`profesion` debe existir desde el diseño de la Fase 3, no añadirse después.
- **Múltiples organismos reguladores por país** (ej. regulación por estado/provincia, no nacional): el modelo `Destino` hoy asume un país = una jurisdicción única — países federales (EE.UU., Canadá, Australia) rompen ese supuesto y requieren un nivel jurisdiccional intermedio entre País y Ruta.
- **Múltiples tipos de visa por ruta**: hoy no existe el concepto de Visa en absoluto (macro-fase G, Fase 1) — es la brecha de escalabilidad más grande identificada en este documento.

---

## Fase 10 — Investigación de mercado (competidores análogos, con fuentes reales)

**Categoría 1 — Gestión de casos migratorios (la más cercana funcionalmente):** INSZoom, Docketwise, eimmigration, Imagility — plataformas para abogados/firmas de inmigración, no para el migrante individual. Centralizan intake del cliente, generación automática de formularios, seguimiento de plazos, portal para que el cliente suba documentos y vea estado. **Qué hacen bien:** un solo intake alimenta múltiples formularios automáticamente; seguimiento de plazos con alertas. **Qué dejan sin resolver (oportunidad para Medical Pathway):** están diseñadas para que un profesional (abogado) gestione el caso de un tercero — no para que el propio migrante se autogestione sin intermediario, y no explican el "por qué" de cada requisito en lenguaje llano, ni dan una clasificación de compatibilidad antes de empezar. ([Comparativa 2026](https://gitnux.org/best/immigration-case-management-software/), [Imagility](https://imagility.co/e-guide/top-immigration-software-solutions-compared/))

**Categoría 2 — Verificación de credenciales médicas (adyacente, no competidora directa):** FCVS (Federation Credentials Verification Service, operado por FSMB) y EPIC (ECFMG) son los sistemas reales que centralizan y verifican credenciales de médicos graduados internacionalmente para licenciamiento en EE.UU. **Qué hacen bien:** son la fuente primaria oficial real para ese trámite específico — cualquier contenido nuestro sobre homologación en EE.UU. debe citarlos como fuente, no inventar el proceso. **Qué dejan sin resolver:** son sistemas de verificación de documentos, no de orientación — no ayudan a decidir *qué* país o ruta perseguir, ni dan compatibilidad ni plan de acción. ([FSMB/FCVS](https://www.fsmb.org/fcvs/credentials-verification-process/), [ECFMG/EPIC](https://www.ecfmg.org/psv/)). Medical Pathway **nunca debe presentarse como sustituto** de estos organismos oficiales — al contrario, debe citarlos y enlazarlos como fuente primaria cuando aplique.
**Aclaración de honestidad:** no encontré evidencia de un organismo equivalente centralizado para España/Alemania en esta búsqueda — la investigación de campo previa (`docs/research/01-pathways-spain-germany-brazil.md`) ya identificó los organismos específicos de esos países; no se repite aquí.

**Categoría 3 — Tracking de certificaciones/compliance (patrón de UX análogo, no del dominio médico):** Docebo, Expiration Reminder, "Certification Tracking App", plataformas GRC como Scrut. **Qué hacen bien:** recordatorios automáticos de vencimiento, dashboards de progreso, rutas de certificación que desbloquean niveles. **Qué podríamos aprender:** el patrón de "ruta de certificación con hitos que desbloquean lo siguiente" es estructuralmente muy parecido a lo que necesitamos para Etapas/Pasos con `prerequisitoEtapaId` — validación de que el modelo de dependencias ya elegido (Fase 3/5) es un patrón de industria probado, no una invención nuestra. ([Comparativa apps de certificación](https://www.remindax.com/blog/top-lms-alternatives-for-certification-management/), [Expiration Reminder](https://www.expirationreminder.com/solutions/certification-tracking-software))

**Conclusión honesta de la Fase 10:** no encontré, en esta búsqueda, ninguna plataforma que combine las tres categorías (orientación de decisión + gestión de proceso + verificación oficial) específicamente para migración médica — esto es consistente con la tesis original del proyecto (`docs/06-product-strategy-cuestionamiento.md`), pero **no es una prueba de que el mercado esté vacío**, solo de que esta búsqueda puntual no encontró un competidor directo; una investigación de mercado más profunda (con herramientas de inteligencia competitiva, no solo búsqueda web) sigue siendo trabajo pendiente, no concluido aquí.

Sources:
- [Top 10 Best Immigration Case Management Software of 2026](https://gitnux.org/best/immigration-case-management-software/)
- [Immigration Software Solutions Compared - Imagility](https://imagility.co/e-guide/top-immigration-software-solutions-compared/)
- [FSMB | Credentials Verification Process](https://www.fsmb.org/fcvs/credentials-verification-process/)
- [EPIC: EPIC Overview (ECFMG)](https://www.ecfmg.org/psv/)
- [Top 15 LMS Alternatives for Certification Management](https://www.remindax.com/blog/top-lms-alternatives-for-certification-management/)
- [Certification Tracking Software - Expiration Reminder](https://www.expirationreminder.com/solutions/certification-tracking-software)

---

## Fase 11 — Entrevistas simuladas ⚠️ EJERCICIO DE DISEÑO, NO EVIDENCIA REAL

> Marcado explícitamente: esto es una técnica de diseño (proto-personas), no una entrevista real. **No se registra en `docs/product-learning-journal.md`** — ese documento es exclusivamente para evidencia real de médicos reales. Aquí sirve para estresar el modelo conceptual de las Fases 3-5, no para tomar decisiones de producto.

| Persona | Necesidad dominante | Qué expone del modelo |
|---|---|---|
| Recién graduado, sin experiencia clínica formal | Entender requisitos desde cero, sin saber ni el vocabulario | La "ficha perfecta" (Fase 4) debe funcionar sin conocimiento previo — glosario implícito en cada término técnico |
| Residente en curso | ¿Le sirve reconocer su residencia parcial, o debe reiniciar? | Requiere modelar "avance parcial reconocible" — no contemplado hoy en ningún VO |
| Especialista con años de práctica | Reconocimiento de especialidad, no título base | Confirma la necesidad de "Ruta" separada de "Especialidad" (Fase 5) |
| Con familia/hijos | Tiempo y costo total del núcleo familiar, no solo el propio | El modelo de Costo/Tiempo (Fase 3) asume un individuo — escalar a unidad familiar es una brecha nueva, no identificada en fases anteriores |
| Poca capacidad económica | Necesita ver primero las rutas más baratas, no las más rápidas | Confirma que "Costo" debe ser un criterio de clasificación tan visible como el idioma (ya lo es parcialmente en el motor, `motor-compatibilidad.service.ts` no pondera costo hoy — **brecha real del motor actual**, no solo del brief) |
| Solo quiere trabajar (no especializarse) | Ruta más corta a ejercicio general | Confirma la necesidad de separar "Ruta: ejercicio general" de "Ruta: especialidad" (ya cubierto en `PRODUCT_ITERATION_V2.md`) |
| Quiere hacer residencia | Ruta académica, no de homologación directa | Igual que el anterior, distinta rama |

**Hallazgo transversal de este ejercicio:** el motor de compatibilidad actual (`motor-compatibilidad.service.ts`) no pondera **costo** como criterio, solo idioma/demanda/tiempo/complejidad — para un perfil de "poca capacidad económica" esto es una laguna real del modelo actual, independiente de todo lo demás en este documento. Se registra aquí como hallazgo, a validar con entrevistas reales antes de actuar.

---

## Fase 12 — Roadmap intelectual

| Pregunta | Respuesta |
|---|---|
| ¿Qué información necesita existir primero? | Documento, Institución, Requisito, Paso — las 4 entidades de mayor apalancamiento (Fase 5) |
| ¿Cómo debe organizarse? | Hub-and-spoke (Fase 3), no cadena lineal |
| ¿Cómo debe mantenerse? | Por rol responsable (no persona), con frecuencia esperada de cambio explícita (Fase 6) |
| ¿Cómo debe verificarse? | Estado de verificación explícito por atributo, nunca implícito (Fase 6) |
| ¿Cómo debe evolucionar? | Historial de cambios versionado por atributo (Fase 6), nunca sobrescritura silenciosa |
| ¿Qué puede automatizar IA? | Detección de contenido potencialmente desactualizado (comparar fecha de revisión vs. frecuencia esperada); no la verificación en sí — eso requiere fuente primaria humana |
| ¿Qué siempre requerirá validación humana? | Toda fuente primaria oficial (Fase 6, `nivelEvidencia`); todo conocimiento práctico agregado (Fase 7) antes de publicarse como patrón, no como cita aislada |
| ¿Qué funcionalidades aportan más valor primero? | Terminar Documento/Institución/Requisito como entidades (Fase 5) — desbloquea Checklist real (Fase 8) sin construir nada más nuevo |
| ¿Qué puede esperar? | Visa (macro-fase G completa), unidad familiar como criterio (Fase 11), comparador de rutas (ya así decidido en `PRODUCT_ITERATION_V2.md` Fase 6) |

**Recomendación final de secuencia (para decidir junto con `PRODUCT_ITERATION_V2.md` y `docs/31`, no en paralelo aislado):** el orden de mayor apalancamiento con menor riesgo es Documento → Institución → Requisito → Paso, porque estas 4 entidades no rompen nada existente (son aditivas), y son el prerequisito real de "Checklist" y "Perfil Internacional enriquecido" que tanto este documento como `PRODUCT_ITERATION_V2.md` (Fase 5) piden — es la misma conclusión desde dos ángulos distintos, lo cual es una señal de consistencia, no una coincidencia forzada.
