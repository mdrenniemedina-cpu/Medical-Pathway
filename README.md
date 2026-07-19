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

- [`docs/15-sprint-0-entregables.md`](docs/15-sprint-0-entregables.md) — esqueleto técnico del Sprint 0: árbol del repo, pruebas arquitectónicas, CI/CD, riesgos aceptados y propuesta de Sprint 1.
- [`docs/16-hipotesis-sprint-1.md`](docs/16-hipotesis-sprint-1.md) — hipótesis de negocio del Sprint 1, pre-registradas antes de construir.
- [`docs/17-informe-sprint-1.md`](docs/17-informe-sprint-1.md) — **informe de producto del Sprint 1: qué se aprendió de verdad, qué sigue sin validar, y el bloqueador real antes de Sprint 2.**

## Estado actual

Estrategia, diseño técnico, **Sprint 0 (esqueleto de código)** y **Sprint 1 (validación de la propuesta de valor)** completos: el producto acompaña el recorrido completo de un médico — descubrir el mejor país (con compatibilidad explicada y un motor de brechas 100% trazable: qué te falta y qué acciones concretas te ayudarían), visualizar su futuro con una línea de tiempo proyectada, y ser acompañado durante la espera (Radar de Espera, el diferenciador anidado). España es el beachhead de profundidad; la arquitectura de dominio (DDD, monolito modular con 9 bounded contexts) escala sin rediseñar el núcleo, y está protegida por pruebas arquitectónicas automatizadas. Todo el recorrido está instrumentado con analítica (eventos de frontend + eventos de dominio reales), incluyendo "fake doors" para medir demanda de Comunidad y Radar de Espera antes de construirlos — la aplicación práctica de no asumir dónde está el valor del producto. Verificado con un recorrido real en navegador (Playwright), no solo con la API. **El bloqueador identificado para Sprint 2 no es técnico:** hace falta exponer el producto a médicos/estudiantes reales para poder validar (o refutar) cualquier hipótesis — ver `docs/17-informe-sprint-1.md`.
