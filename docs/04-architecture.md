# Arquitectura del producto

> Diseñada para el alcance definido en `03-mvp-definition.md`. Prioriza velocidad de iteración y bajo coste operativo sobre escalabilidad prematura — coherente con la etapa (pre-PMF) del proyecto. Cada decisión relevante tiene su ADR en `decisions/`.
>
> **Changelog v2:** tras identificar la espera de resolución de homologación como el momento de mayor dolor (`research/08-momento-critico-espera.md`), el componente de mayor prioridad de construcción deja de ser el rastreador de roadmap genérico y pasa a ser el **motor de agregación anónima de tiempos de espera** ("Radar de Espera"). El resto de la arquitectura (monolito modular, stack, seguridad) se mantiene; lo que cambia es qué módulo se construye primero y con más profundidad. Ver `decisions/ADR-007` y `decisions/ADR-008`.

## 1. Principios de diseño

1. **Modular monolito, no microservicios.** El equipo es pequeño y el objetivo es velocidad de iteración, no escala masiva todavía. Módulos con límites claros para poder extraer servicios más adelante si hace falta (ver ADR-001).
2. **Transparencia como feature, no como nota legal.** Todo el contenido de rutas/procesos lleva fuente y fecha de última verificación visible al usuario — es la respuesta arquitectónica directa al problema de desinformación identificado en la investigación.
3. **Contenido gestionado, no scrapeado ni generado automáticamente en el MVP.** Dado el riesgo legal y reputacional de dar información incorrecta sobre procesos migratorios/médicos, el contenido de rutas se edita y versiona por un equipo editorial humano vía panel de administración, no por scraping automático o generación por IA sin supervisión (ver ADR-004).
4. **Privacidad y datos sensibles por diseño.** El gestor documental maneja pasaportes, títulos y datos profesionales — cifrado en reposo, control de acceso estricto, cumplimiento GDPR (usuarios que interactúan con autoridades españolas/UE) y normativas de protección de datos LatAm (ADR-003).
5. **Instrumentación desde el día uno.** Las métricas de éxito del MVP (retención, conversión, distribución de origen) son la forma de confirmar o refutar las hipótesis estratégicas documentadas — no son un "nice to have" posterior.

## 2. Componentes del sistema (MVP v2)

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente web (responsive)                                    │
│  Next.js / React — SSR para SEO del "radar de destinos"      │
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTPS / REST o tRPC
┌───────────────────────────▼───────────────────────────────────┐
│  Backend modular monolito (Node.js/TypeScript, p.ej. NestJS)  │
│                                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ★ NÚCLEO: Radar de Espera                              │  │
│  │ (registro de expedientes, agregación anónima con       │  │
│  │  umbral k-anonimato, estimaciones por ventana de envío  │  │
│  │  y comunidad autónoma) — máxima prioridad de build      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────────────┐│
│  │ Perfiles/Auth │ │ Contenido/CMS │ │ Checklist pre-envío   ││
│  │ (onboarding,  │ │ (radar de 9   │ │ (reduce riesgo de     ││
│  │ verificación  │ │ destinos +    │ │ subsanación, alertas  ││
│  │ ligera)       │ │ contexto      │ │ anti-estafa           ││
│  │               │ │ editorial)    │ │ contextuales)         ││
│  └──────────────┘ └───────────────┘ └───────────────────────┘│
│  ┌──────────────┐ ┌───────────────────────────────────────┐  │
│  │ Comunidad     │ │ Notificaciones + Analítica (retención, │  │
│  │ (segmentada   │ │ volumen de datos agregados,            │  │
│  │ por ventana   │ │ distribución de origen)                │  │
│  │ de envío)     │ │                                         │  │
│  └──────────────┘ └───────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Gestor documental mínimo + directorio anti-estafa      │   │
│  │ (alcance reducido en v2 — ver 03-mvp-definition.md)     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│  PostgreSQL (datos transaccionales + agregados anónimos)       │
│  Object storage cifrado (S3-compatible) — documentos mínimos   │
│  Cola de trabajos en background (recálculo de agregados,       │
│  recordatorios, alertas)                                        │
└─────────────────────────────────────────────────────────────────┘
```

El "Radar de Espera" es, en esta versión, el módulo que se construye primero y con mayor cuidado — es el activo de datos que constituye el foso defendible del producto (ver ADR-008). Los demás módulos existen para sostenerlo (checklist reduce ruido en los datos al minimizar subsanaciones; comunidad y alertas anti-estafa dan valor inmediato mientras se acumula suficiente dato agregado para que las estimaciones sean útiles).

## 3. Modelo de datos (alto nivel)

- **User / Profile:** datos de onboarding, país de origen, destino(s) de interés, nivel de verificación (ninguno/correo profesional/título cargado), rol (usuario/mentor/moderador/editor de contenido/admin).
- **SubmissionRecord (núcleo del Radar de Espera):** fecha de envío, tipo de expediente/especialidad, comunidad autónoma, fecha de resolución (si ya ocurrió) y resultado. Vinculado al usuario para permitirle ver/editar su propio dato, pero **nunca expuesto individualmente a otros usuarios** — solo alimenta agregados.
- **WaitTimeAggregate:** vista/tabla derivada de `SubmissionRecord`, agrupada por ventana de envío + comunidad autónoma, recalculada periódicamente. Solo se publica una estimación si el grupo supera un umbral mínimo de registros (k-anonimato, ver ADR-008) — evita poder inferir el dato de un individuo concreto.
- **Destination:** uno por país (9 en catálogo), con metadatos del radar (tiempo, coste, idioma, demanda, dificultad) — cada campo con `source_url` y `verified_at`.
- **PreSubmissionChecklistItem / UserChecklistProgress:** checklist de preparación pre-envío y su estado por usuario — su función es reducir subsanaciones, no ser un gestor documental completo.
- **Document (alcance mínimo en v2):** solo lo necesario para la checklist pre-envío, cifrado, con fecha de vencimiento si aplica.
- **CommunityThread / CommunityReply:** segmentado por ventana de envío del usuario; con flags de moderación y de "estafa reportada" (alimenta la métrica de estafas bloqueadas).
- **ScamAlert (contenido editorial):** alertas contextuales mostradas durante la fase de espera, versionadas con fuente.
- **Provider (directorio, alcance reducido en v2):** solo para función anti-estafa (proveedores verificados vs. reportados como fraudulentos); el catálogo extenso de monetización por referidos se difiere a Fase 2.
- **Event (analítica):** eventos de producto (registro de expediente, consulta de estimación, uso recurrente durante la espera, paso de checklist marcado) — la señal más importante ahora es la recurrencia de consulta durante la espera, no solo el onboarding.

## 4. Seguridad y privacidad

- Cifrado en tránsito (TLS) y en reposo (documentos y campos sensibles del perfil).
- Verificación de identidad profesional es **ligera** en el MVP (correo profesional o carga de título revisada por moderador humano) — no se construye un sistema de verificación de credenciales automatizado en esta fase (coste/complejidad no justificados todavía).
- Control de acceso por rol a nivel de módulo (un moderador de comunidad no tiene acceso al gestor documental de otros usuarios, etc.).
- Política de retención y borrado de documentos configurable por el usuario (derecho al olvido / portabilidad, requisito GDPR).
- Todo contenido informativo lleva disclaimer visible: "información con fines orientativos, no constituye asesoría legal ni migratoria" (mitigación de riesgo legal, ver `research/06-product-strategy-cuestionamiento.md`).
- **Umbral de k-anonimato para el Radar de Espera:** ninguna estimación agregada (`WaitTimeAggregate`) se publica si el grupo subyacente (ventana de envío + comunidad autónoma) tiene menos de un número mínimo de registros (a definir, p. ej. 5-10) — evita que un grupo pequeño permita inferir el dato individual de un usuario concreto. Este es el control de privacidad más crítico del producto, porque el activo de datos central depende de que los usuarios confíen en que su información individual nunca se expone (ver ADR-008).

## 5. Stack propuesto (MVP)

| Capa | Elección | Razón |
|---|---|---|
| Frontend | Next.js (React) | SSR/SEO para el radar de destinos (canal de adquisición orgánica), ecosistema maduro |
| Backend | Node.js + TypeScript (NestJS) | Mismo lenguaje que frontend, estructura modular por dominio desde el inicio, facilita futura extracción de servicios |
| Base de datos | PostgreSQL | Relacional, encaja con el modelo de datos (perfiles, rutas, progreso); soporta JSON para contenido flexible del CMS |
| Almacenamiento de documentos | S3-compatible cifrado | Estándar de la industria, cifrado nativo, control de acceso por política |
| CMS de contenido | Panel de administración interno (no headless CMS de terceros en MVP) | El contenido requiere campos específicos (fuente, fecha de verificación, disclaimers) que un CMS genérico no modela bien de fábrica; se reconsidera si el equipo editorial crece |
| Notificaciones | Cola de trabajos (p. ej. BullMQ sobre Redis) + email transaccional | Alertas de cambios regulatorios y vencimientos de documentos no son tiempo-crítico, encolar es suficiente |
| Hosting | Plataforma gestionada (p. ej. Render/Fly.io) sobre contenedores Docker | Minimiza carga operativa antes de PMF; portable a AWS/GCP si el volumen lo justifica |

## 6. Qué se difiere explícitamente (y por qué no es deuda técnica, es alcance)

- **Microservicios:** innecesarios al tamaño actual; el modular monolito ya define los límites de dominio para extraer servicios cuando (si) haga falta.
- **Scraping/IA automatizada de contenido regulatorio:** riesgo legal y de calidad demasiado alto para el MVP; el contenido se mantiene editorialmente.
- **Verificación de identidad profesional fuerte (KYC médico):** se aborda si la comunidad crece lo suficiente para que la verificación ligera actual deje de ser suficiente.
- **Internacionalización de contenido profundo a los otros 8 destinos:** condicionado a validar retención en España primero (ver criterio de salida del MVP).

## Historial de decisiones

Ver `decisions/` para el registro formal (ADR) de cada decisión arquitectónica y de producto relevante, incluyendo su justificación y alternativas consideradas.
