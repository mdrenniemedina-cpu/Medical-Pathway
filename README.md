# Medical Pathway

Plataforma para ayudar a médicos y estudiantes de medicina hispanohablantes de Latinoamérica a construir una carrera médica internacional con confianza, información verificada y acompañamiento paso a paso — no solo comparando países.

Este repositorio está en fase de **investigación y diseño de producto/arquitectura**, antes de escribir código. Toda decisión relevante queda documentada para poder retomarse en futuras iteraciones.

## Mapa de documentación

- [`docs/00-project-charter.md`](docs/00-project-charter.md) — visión, hipótesis del founder, estado del proyecto.
- `docs/research/` — investigación de campo:
  - [`01-pathways-spain-germany-brazil.md`](docs/research/01-pathways-spain-germany-brazil.md)
  - [`02-pathways-usa-canada.md`](docs/research/02-pathways-usa-canada.md)
  - [`03-pathways-uk-australia-nz-switzerland.md`](docs/research/03-pathways-uk-australia-nz-switzerland.md)
  - [`04-competitive-landscape-and-market-sizing.md`](docs/research/04-competitive-landscape-and-market-sizing.md)
  - [`05-beachhead-market-analysis.md`](docs/research/05-beachhead-market-analysis.md)
  - [`06-product-strategy-cuestionamiento.md`](docs/research/06-product-strategy-cuestionamiento.md)
  - [`07-matriz-beachhead-espana-alemania.md`](docs/research/07-matriz-beachhead-espana-alemania.md)
  - [`08-momento-critico-espera.md`](docs/research/08-momento-critico-espera.md)
- [`docs/03-mvp-definition.md`](docs/03-mvp-definition.md) — alcance del MVP (v3: recorrido completo Descubrir/Planificar/Acompañar/Continuar).
- [`docs/04-architecture.md`](docs/04-architecture.md) — arquitectura del sistema, vista de alto nivel (v4).
- [`docs/05-domain-model-ddd.md`](docs/05-domain-model-ddd.md) — modelo de dominio (DDD): bounded contexts, agregados, eventos.
- [`docs/06-database-schema.md`](docs/06-database-schema.md) — esquema de base de datos.
- [`docs/07-api-contracts.md`](docs/07-api-contracts.md) — contratos de API.
- [`docs/08-auth-model.md`](docs/08-auth-model.md) — autenticación y autorización.
- [`docs/09-recomendacion-final-6-meses.md`](docs/09-recomendacion-final-6-meses.md) — **la recomendación estratégica, léase primero.**
- [`docs/10-technical-roadmap-sprints.md`](docs/10-technical-roadmap-sprints.md) — roadmap técnico por sprints.
- [`docs/11-riesgos-tecnicos-mitigacion.md`](docs/11-riesgos-tecnicos-mitigacion.md) — riesgos técnicos y mitigación.
- [`docs/12-estrategia-escalamiento-multipais.md`](docs/12-estrategia-escalamiento-multipais.md) — escalar de España al resto sin rediseñar el núcleo.
- [`docs/13-calidad-confianza-datos-radar.md`](docs/13-calidad-confianza-datos-radar.md) — calidad y confianza de datos del Radar de Espera.
- [`docs/14-estrategia-retencion-engagement.md`](docs/14-estrategia-retencion-engagement.md) — estrategia de retención.
- [`docs/decisions/`](docs/decisions/) — registro de decisiones (ADR), incluyendo alternativas descartadas y criterios de revisión.

## Estado actual

Estrategia y diseño técnico completos: el producto acompaña el recorrido completo de un médico — descubrir el mejor país (con compatibilidad explicada, no un comparador), planificar un camino personalizado, ser acompañado durante la espera (Radar de Espera, el diferenciador anidado) y continuar durante toda la carrera internacional. España es el beachhead de profundidad; la arquitectura de dominio (DDD) está diseñada para escalar a más países, rutas, especialidades e idiomas sin rediseñar el núcleo. Ver `docs/09-recomendacion-final-6-meses.md` para la apuesta de producto y `docs/05-domain-model-ddd.md` en adelante para el diseño técnico completo. Aún no se ha iniciado la implementación de código.
