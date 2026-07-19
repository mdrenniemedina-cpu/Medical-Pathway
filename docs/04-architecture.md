# Arquitectura del producto

> Diseñada para el alcance definido en `03-mvp-definition.md`. Prioriza velocidad de iteración y bajo coste operativo sobre escalabilidad prematura — coherente con la etapa (pre-PMF) del proyecto. Cada decisión relevante tiene su ADR en `decisions/`.

## 1. Principios de diseño

1. **Modular monolito, no microservicios.** El equipo es pequeño y el objetivo es velocidad de iteración, no escala masiva todavía. Módulos con límites claros para poder extraer servicios más adelante si hace falta (ver ADR-001).
2. **Transparencia como feature, no como nota legal.** Todo el contenido de rutas/procesos lleva fuente y fecha de última verificación visible al usuario — es la respuesta arquitectónica directa al problema de desinformación identificado en la investigación.
3. **Contenido gestionado, no scrapeado ni generado automáticamente en el MVP.** Dado el riesgo legal y reputacional de dar información incorrecta sobre procesos migratorios/médicos, el contenido de rutas se edita y versiona por un equipo editorial humano vía panel de administración, no por scraping automático o generación por IA sin supervisión (ver ADR-004).
4. **Privacidad y datos sensibles por diseño.** El gestor documental maneja pasaportes, títulos y datos profesionales — cifrado en reposo, control de acceso estricto, cumplimiento GDPR (usuarios que interactúan con autoridades españolas/UE) y normativas de protección de datos LatAm (ADR-003).
5. **Instrumentación desde el día uno.** Las métricas de éxito del MVP (retención, conversión, distribución de origen) son la forma de confirmar o refutar las hipótesis estratégicas documentadas — no son un "nice to have" posterior.

## 2. Componentes del sistema (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente web (responsive)                                    │
│  Next.js / React — SSR para SEO del "radar de destinos"      │
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTPS / REST o tRPC
┌───────────────────────────▼───────────────────────────────────┐
│  Backend modular monolito (Node.js/TypeScript, p.ej. NestJS)  │
│                                                                │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────────────┐│
│  │ Perfiles/Auth │ │ Contenido/CMS │ │ Rastreador de rutas   ││
│  │ (onboarding,  │ │ (radar +      │ │ (roadmap España,      ││
│  │ verificación  │ │ roadmap con   │ │ checklist, estado por ││
│  │ ligera)       │ │ fuente/fecha) │ │ usuario)              ││
│  └──────────────┘ └───────────────┘ └───────────────────────┘│
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────────────┐│
│  │ Gestor        │ │ Comunidad     │ │ Directorio de         ││
│  │ documental    │ │ (foro/Q&A     │ │ proveedores + tracking││
│  │ (subida,      │ │ moderado,     │ │ de referidos          ││
│  │ cifrado,      │ │ verificación) │ │ (afiliados vetados)   ││
│  │ vencimientos) │ │               │ │                       ││
│  └──────────────┘ └───────────────┘ └───────────────────────┘│
│  ┌──────────────┐ ┌───────────────────────────────────────┐  │
│  │ Notificaciones│ │ Analítica/eventos (retención,         │  │
│  │ (alertas       │ │ conversión, distribución de origen)   │  │
│  │ regulatorias)  │ └───────────────────────────────────────┘  │
│  └──────────────┘                                              │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│  PostgreSQL (datos transaccionales)                            │
│  Object storage cifrado (S3-compatible) — documentos           │
│  Cola de trabajos en background (recordatorios, alertas)       │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Modelo de datos (alto nivel)

- **User / Profile:** datos de onboarding, país de origen, destino(s) de interés, nivel de verificación (ninguno/correo profesional/título cargado), rol (usuario/mentor/moderador/editor de contenido/admin).
- **Destination:** uno por país (9 en catálogo), con metadatos del radar (tiempo, coste, idioma, demanda, dificultad) — cada campo con `source_url` y `verified_at`.
- **Pathway / PathwayStep:** solo España tiene pasos profundos en el MVP; cada `PathwayStep` tiene contenido versionado, fuente, fecha de verificación y checklist de sub-tareas.
- **UserPathwayProgress:** estado del usuario en cada paso (pendiente/en curso/hecho), documentos asociados.
- **Document:** metadatos + referencia cifrada al objeto en storage, fecha de vencimiento si aplica (p. ej. apostilla, certificado de antecedentes).
- **CommunityThread / CommunityReply:** con flags de moderación y de "estafa reportada" (alimenta la métrica de estafas bloqueadas).
- **Provider (directorio):** academia/traductor/gestor/agencia, estado de vetting editorial, tipo de comisión, tracking de referidos.
- **Event (analítica):** eventos de producto (onboarding completado, paso de checklist marcado, clic en directorio, upgrade a premium) para medir retención y conversión sin depender de herramientas de terceros desde el día uno.

## 4. Seguridad y privacidad

- Cifrado en tránsito (TLS) y en reposo (documentos y campos sensibles del perfil).
- Verificación de identidad profesional es **ligera** en el MVP (correo profesional o carga de título revisada por moderador humano) — no se construye un sistema de verificación de credenciales automatizado en esta fase (coste/complejidad no justificados todavía).
- Control de acceso por rol a nivel de módulo (un moderador de comunidad no tiene acceso al gestor documental de otros usuarios, etc.).
- Política de retención y borrado de documentos configurable por el usuario (derecho al olvido / portabilidad, requisito GDPR).
- Todo contenido informativo lleva disclaimer visible: "información con fines orientativos, no constituye asesoría legal ni migratoria" (mitigación de riesgo legal, ver `research/06-product-strategy-cuestionamiento.md`).

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
