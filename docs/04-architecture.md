# Arquitectura del producto

> Diseñada para el alcance definido en `03-mvp-definition.md`. Prioriza velocidad de iteración y bajo coste operativo sobre escalabilidad prematura — coherente con la etapa (pre-PMF) del proyecto. Cada decisión relevante tiene su ADR en `decisions/`.
>
> **Changelog v2:** tras identificar la espera de resolución de homologación como el momento de mayor dolor (`research/08-momento-critico-espera.md`), el componente de mayor prioridad de construcción deja de ser el rastreador de roadmap genérico y pasa a ser el **motor de agregación anónima de tiempos de espera** ("Radar de Espera"). Ver `decisions/ADR-007` y `decisions/ADR-008`.
>
> **Changelog v3:** el founder corrigió el alcance — el producto es el recorrido completo del médico (descubrir → comparar → planificar → acompañar), y el Radar de Espera se **anida** dentro de la etapa de acompañamiento como su funcionalidad diferenciadora, no como el producto entero. Se revive el motor de descubrimiento/comparación personalizada y el plan paso a paso (presentes en v1, retirados en v2), ahora con la disciplina de profundidad asimétrica por destino que v2 introdujo. Ver `decisions/ADR-009`.
>
> **Changelog v4:** el founder afinó el recorrido a **4 preguntas humanas** (Descubrir / Planificar / Acompañar / Continuar — la "comparación" queda absorbida dentro de Descubrir, como parte del mismo resultado explicado) y pidió diseñar primero el dominio (DDD) antes de esquema o API. El modelo de datos de este documento queda **superseded** por `05-domain-model-ddd.md` (dominio) y `06-database-schema.md` (esquema concreto) — este documento mantiene la vista de componentes de alto nivel y remite a los documentos detallados para cada pieza (API en `07-api-contracts.md`, autenticación en `08-auth-model.md`, sprints en `10-technical-roadmap-sprints.md`, riesgos en `11-riesgos-tecnicos-mitigacion.md`, escalamiento en `12-estrategia-escalamiento-multipais.md`, calidad de datos en `13-calidad-confianza-datos-radar.md`, retención en `14-estrategia-retencion-engagement.md`). Ver `decisions/ADR-010` a `ADR-014`.

## 1. Principios de diseño

1. **Modular monolito, no microservicios.** El equipo es pequeño y el objetivo es velocidad de iteración, no escala masiva todavía. Módulos con límites claros para poder extraer servicios más adelante si hace falta (ver ADR-001).
2. **Transparencia como feature, no como nota legal.** Todo el contenido de rutas/procesos lleva fuente y fecha de última verificación visible al usuario — es la respuesta arquitectónica directa al problema de desinformación identificado en la investigación.
3. **Contenido gestionado, no scrapeado ni generado automáticamente en el MVP.** Dado el riesgo legal y reputacional de dar información incorrecta sobre procesos migratorios/médicos, el contenido de rutas se edita y versiona por un equipo editorial humano vía panel de administración, no por scraping automático o generación por IA sin supervisión (ver ADR-004).
4. **Privacidad y datos sensibles por diseño.** El gestor documental maneja pasaportes, títulos y datos profesionales — cifrado en reposo, control de acceso estricto, cumplimiento GDPR (usuarios que interactúan con autoridades españolas/UE) y normativas de protección de datos LatAm (ADR-003).
5. **Instrumentación desde el día uno.** Las métricas de éxito del MVP (retención, conversión, distribución de origen) son la forma de confirmar o refutar las hipótesis estratégicas documentadas — no son un "nice to have" posterior.

## 2. El recorrido de 4 preguntas humanas (marco de producto)

| Etapa | Pregunta del usuario | Bounded context(s) que la sirven (ver `05-domain-model-ddd.md`) | Alcance (los 9 destinos) | Alcance (España) |
|---|---|---|---|---|
| 1. Descubrir | "¿Cuál es el mejor país para mí?" | Descubrimiento y Compatibilidad + Catálogo | Motor de coincidencia transparente y explicable (compatibilidad % + razones) sobre los 9 destinos | Igual, sin trato especial — el motor no favorece a España artificialmente |
| 2. Planificar | "¿Qué tengo que hacer ahora?" | Ruta del Médico + Catálogo | Roadmap ligero por destino, reutilizando `research/01-03` | Roadmap profundo, personalizado por perfil, con checklist accionable |
| 3. Acompañar | "¿Voy bien?" | Ruta del Médico + **Radar de Espera** (anidado) | Solo disponible donde exista una etapa de tipo "espera" modelada | Radar de Espera activo: distribución de tiempos por cohorte, no un contador simple |
| 4. Continuar | "¿Qué sigue?" | Comunidad + Notificaciones + Oportunidades | Comunidad y alertas genéricas + directorio anti-estafa mínimo | Igual profundidad que el resto — esta etapa no es España-específica por naturaleza |

**Importante — esto es lenguaje de usuario, no arquitectura de módulos:** un bounded context no es una pantalla. La "etapa 3" no es un módulo de código — es la pregunta que el usuario hace cuando llega a una etapa de tipo espera dentro de su propia Ruta Personalizada, y ahí es donde el contexto Radar de Espera aparece, anidado, sin ser su propia pantalla independiente. El Radar de Espera se modela de forma completamente genérica (ligado a cualquier `EtapaPersonalizada` de tipo `espera`, no solo a España) para poder activarse en el futuro sobre otros pasos de espera conocidos (la cita del Kenntnisprüfung en Alemania, la verificación de fuente en Canadá) sin rediseño — ver `12-estrategia-escalamiento-multipais.md`.

Ver `05-domain-model-ddd.md` para el detalle completo de bounded contexts, agregados, invariantes y eventos de dominio que hacen operativo este recorrido.

## 3. Componentes del sistema (MVP v3)

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente web (responsive)                                    │
│  Next.js / React — SSR para SEO de descubrimiento/comparación│
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTPS / REST o tRPC
┌───────────────────────────▼───────────────────────────────────┐
│  Backend modular monolito (Node.js/TypeScript, p.ej. NestJS)  │
│                                                                │
│  ┌──────────────┐ ┌───────────────────────┐ ┌───────────────┐│
│  │ Perfiles/Auth │ │ Motor de Descubrimiento│ │ Comparación   ││
│  │ (onboarding   │ │ (matching transparente │ │ personalizada ││
│  │ enriquecido:  │ │ perfil × destino,      │ │ (shortlist +  ││
│  │ idiomas,      │ │ explicable, no IA de   │ │ explicación   ││
│  │ presupuesto,  │ │ caja negra)            │ │ "por qué")    ││
│  │ urgencia,     │ └───────────────────────┘ └───────────────┘│
│  │ tolerancia a  │ ┌───────────────────────────────────────┐  │
│  │ riesgo)       │ │ Contenido/CMS (radar de 9 destinos +   │  │
│  └──────────────┘ │ roadmaps por destino, fuente/fecha)     │  │
│                    └───────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Rastreador de rutas (Pathway/PathwayStep genérico;      │   │
│  │ profundo + checklist accionable solo para España)       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ★ Radar de Espera (anidado en el PathwayStep de          │  │
│  │  homologación de España): registro de expedientes,      │  │
│  │  agregación anónima con umbral k-anonimato, estimaciones │  │
│  │  por ventana de envío y comunidad autónoma               │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────────────┐│
│  │ Comunidad     │ │ Gestor        │ │ Notificaciones +       ││
│  │ (segmentada,  │ │ documental    │ │ Analítica (embudo      ││
│  │ moderada,     │ │ mínimo +      │ │ completo: descubrimiento│
│  │ anti-estafa)  │ │ directorio    │ │ → comparación → plan →││
│  │               │ │ anti-estafa   │ │ acompañamiento → espera)││
│  └──────────────┘ └───────────────┘ └───────────────────────┘│
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│  PostgreSQL (datos transaccionales + agregados anónimos)       │
│  Object storage cifrado (S3-compatible) — documentos mínimos   │
│  Cola de trabajos en background (recálculo de agregados,       │
│  recordatorios, alertas)                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Por qué esto no diluye la disciplina de foco de v2:** el Motor de Descubrimiento y la Comparación reutilizan el mismo dataset del radar (ya investigado, con fuente y fecha) — no es contenido nuevo ni superficial, es una capa de personalización sobre datos ya sólidos. El Roadmap "ligero" de los otros 8 destinos también reutiliza directamente el contenido ya producido en `research/01-03` (los pasos de cada país ya están documentados) — no requiere nueva investigación, solo estructurarlo en el modelo de contenido. La única inversión de ingeniería genuinamente nueva y no trivial sigue siendo el Radar de Espera (motor de agregación con privacidad) — que se mantiene como la funcionalidad de mayor cuidado, ahora correctamente posicionada dentro del recorrido en lugar de ser todo el recorrido.

**Motor de Descubrimiento — cómo funciona (importante: no es un modelo de IA):** es una función de puntuación determinista y explicable sobre atributos ya conocidos de cada destino (barrera de idioma, tiempo, coste, demanda, dificultad, complejidad regulatoria) frente a atributos del perfil del usuario (idiomas que domina, presupuesto, urgencia, tolerancia a examen competitivo vs. ruta más lenta pero segura, prioridad entre ingreso a largo plazo y rapidez de práctica). El resultado siempre se muestra con la razón ("te recomendamos España porque no hay barrera de idioma y tu presupuesto es limitado; Alemania aparece como alternativa a considerar si priorizas ingreso a largo plazo pese a la barrera de idioma"). Esto es deliberadamente distinto de un motor de IA de recomendación: sigue siendo válida la decisión de no usar IA para esto (ver `decisions/ADR-002`) porque un sistema de reglas transparente no tiene el riesgo de "autoridad falsa" que sí tiene un modelo opaco entrenado sin suficiente contenido verificado por destino.

## 4. Modelo de datos (alto nivel — ver `05-domain-model-ddd.md` y `06-database-schema.md` para el detalle autoritativo)

- **User / Profile:** datos de onboarding **enriquecidos para el motor de descubrimiento** — país de origen, especialidad, años de experiencia, idiomas que domina (además de español), presupuesto aproximado, urgencia/tiempo disponible, tolerancia a examen competitivo vs. ruta más lenta pero segura, prioridad entre ingreso a largo plazo y rapidez de práctica, destino(s) de interés explícito si ya los tiene, nivel de verificación, rol.
- **Destination:** uno por país (9 en catálogo), con metadatos del radar (tiempo, coste, idioma, demanda, dificultad, complejidad regulatoria) — cada campo con `source_url` y `verified_at`. Es la base de datos que alimenta tanto el Motor de Descubrimiento como la Comparación personalizada.
- **DestinationMatchRule:** reglas de puntuación/peso que relacionan atributos de `Profile` con atributos de `Destination` (p. ej. "si idioma_alemán = ninguno, penalizar Alemania/Suiza") — versionadas y editables por el equipo de producto, no un modelo entrenado; permite mostrar siempre la razón de cada recomendación (requisito de transparencia, ver `decisions/ADR-005`).
- **Pathway / PathwayStep:** uno por destino; España tiene pasos profundos con checklist accionable (apostilla → traducción → homologación → colegiación → [MIR opcional]); los otros 8 destinos tienen pasos a nivel de resumen, generados a partir del contenido ya investigado en `research/01-03`, sin checklist accionable todavía.
- **UserPathwayProgress:** estado del usuario en cada paso de su destino elegido (pendiente/en curso/hecho).
- **SubmissionRecord (núcleo del Radar de Espera, anidado en un `PathwayStep`):** fecha de envío, tipo de expediente/especialidad, comunidad autónoma, fecha de resolución (si ya ocurrió) y resultado. Vinculado al usuario para permitirle ver/editar su propio dato, pero **nunca expuesto individualmente a otros usuarios** — solo alimenta agregados. Modelado con referencia genérica a `pathway_step_id` (no hardcoded a España) para poder activarse sobre otros pasos de espera en el futuro sin rediseño.
- **WaitTimeAggregate:** vista/tabla derivada de `SubmissionRecord`, agrupada por ventana de envío + comunidad autónoma, recalculada periódicamente. Solo se publica una estimación si el grupo supera un umbral mínimo de registros (k-anonimato, ver `decisions/ADR-008`).
- **PreSubmissionChecklistItem / UserChecklistProgress:** checklist de preparación pre-envío (España) y su estado por usuario — reduce subsanaciones.
- **Document (alcance mínimo):** solo lo necesario para la checklist pre-envío, cifrado, con fecha de vencimiento si aplica.
- **CommunityThread / CommunityReply:** segmentado por destino elegido y, para España, por ventana de envío; con flags de moderación y de "estafa reportada".
- **ScamAlert (contenido editorial):** alertas contextuales mostradas durante la fase de espera, versionadas con fuente.
- **Provider (directorio, alcance reducido):** solo para función anti-estafa (proveedores verificados vs. reportados como fraudulentos); el catálogo extenso de monetización por referidos se difiere a Fase 2.
- **Event (analítica):** eventos de producto a lo largo de **todo el embudo** — onboarding/perfil completado, resultado de descubrimiento visto, comparación consultada, destino elegido, paso de plan marcado, registro de expediente, consulta de estimación de espera — permite medir en qué etapa se pierden usuarios, no solo la retención dentro de una sola etapa.

## 5. Seguridad y privacidad

- Cifrado en tránsito (TLS) y en reposo (documentos y campos sensibles del perfil).
- Verificación de identidad profesional es **ligera** en el MVP (correo profesional o carga de título revisada por moderador humano) — no se construye un sistema de verificación de credenciales automatizado en esta fase (coste/complejidad no justificados todavía).
- Control de acceso por rol a nivel de módulo (un moderador de comunidad no tiene acceso al gestor documental de otros usuarios, etc.).
- Política de retención y borrado de documentos configurable por el usuario (derecho al olvido / portabilidad, requisito GDPR).
- Todo contenido informativo lleva disclaimer visible: "información con fines orientativos, no constituye asesoría legal ni migratoria" (mitigación de riesgo legal, ver `research/06-product-strategy-cuestionamiento.md`).
- **Umbral de k-anonimato para el Radar de Espera:** ninguna estimación agregada (`WaitTimeAggregate`) se publica si el grupo subyacente (ventana de envío + comunidad autónoma) tiene menos de un número mínimo de registros (a definir, p. ej. 5-10) — evita que un grupo pequeño permita inferir el dato individual de un usuario concreto. Este es el control de privacidad más crítico del producto, porque el activo de datos central depende de que los usuarios confíen en que su información individual nunca se expone (ver ADR-008).

## 6. Stack propuesto (MVP)

| Capa | Elección | Razón |
|---|---|---|
| Frontend | Next.js (React) | SSR/SEO para el radar de destinos (canal de adquisición orgánica), ecosistema maduro |
| Backend | Node.js + TypeScript (NestJS) | Mismo lenguaje que frontend, estructura modular por dominio desde el inicio, facilita futura extracción de servicios |
| Base de datos | PostgreSQL | Relacional, encaja con el modelo de datos (perfiles, rutas, progreso); soporta JSON para contenido flexible del CMS |
| Almacenamiento de documentos | S3-compatible cifrado | Estándar de la industria, cifrado nativo, control de acceso por política |
| CMS de contenido | Panel de administración interno (no headless CMS de terceros en MVP) | El contenido requiere campos específicos (fuente, fecha de verificación, disclaimers) que un CMS genérico no modela bien de fábrica; se reconsidera si el equipo editorial crece |
| Notificaciones | Cola de trabajos (p. ej. BullMQ sobre Redis) + email transaccional | Alertas de cambios regulatorios y vencimientos de documentos no son tiempo-crítico, encolar es suficiente |
| Hosting | Plataforma gestionada (p. ej. Render/Fly.io) sobre contenedores Docker | Minimiza carga operativa antes de PMF; portable a AWS/GCP si el volumen lo justifica |

## 7. Qué se difiere explícitamente (y por qué no es deuda técnica, es alcance)

- **Microservicios:** innecesarios al tamaño actual; el modular monolito ya define los límites de dominio para extraer servicios cuando (si) haga falta.
- **Scraping/IA automatizada de contenido regulatorio, y cualquier motor de recomendación basado en modelos entrenados (no reglas transparentes):** riesgo legal y de calidad demasiado alto para el MVP; el contenido y el matching se mantienen editoriales/basados en reglas explicables.
- **Verificación de identidad profesional fuerte (KYC médico):** se aborda si la comunidad crece lo suficiente para que la verificación ligera actual deje de ser suficiente.
- **Roadmap profundo + checklist accionable + Radar de Espera para los otros 8 destinos:** condicionado a validar retención y volumen de datos en España primero (ver criterio de salida del MVP). El descubrimiento y la comparación sí cubren los 9 destinos desde el MVP — lo que se difiere es la profundidad de ejecución, no la cobertura de decisión.

## Historial de decisiones

Ver `decisions/` para el registro formal (ADR) de cada decisión arquitectónica y de producto relevante, incluyendo su justificación y alternativas consideradas.
