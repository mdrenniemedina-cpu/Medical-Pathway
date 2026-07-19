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
- [`docs/17-informe-sprint-1.md`](docs/17-informe-sprint-1.md) — informe de producto del Sprint 1: qué se aprendió de verdad, qué sigue sin validar, y el bloqueador real antes de Sprint 2.
- **Customer Discovery Sprint** (desarrollo de nuevas funcionalidades suspendido — prioridad: aprendizaje, no ingeniería):
  - [`docs/18-discovery-protocolo-entrevistas.md`](docs/18-discovery-protocolo-entrevistas.md) — protocolo de entrevistas (Mom Test).
  - [`docs/19-discovery-plan-reclutamiento.md`](docs/19-discovery-plan-reclutamiento.md) — plan de reclutamiento de 10-15 usuarios reales.
  - [`docs/20-discovery-metricas-e-instrumentos.md`](docs/20-discovery-metricas-e-instrumentos.md) — métricas e instrumentos de observación.
  - [`docs/21-discovery-criterios-decision.md`](docs/21-discovery-criterios-decision.md) — criterios de interpretación y marco de decisión (perseverar/pivotar/repriorizar), pre-registrados.
  - [`docs/22-discovery-evidencia-secundaria.md`](docs/22-discovery-evidencia-secundaria.md) — evidencia pública real (no fabricada) recopilada mientras se organizan las entrevistas.
  - [`docs/23-informe-customer-discovery.md`](docs/23-informe-customer-discovery.md) — **informe de estado: qué es real, qué falta, y los próximos pasos acordados.**
  - [`docs/24-discovery-piloto-metodologia.md`](docs/24-discovery-piloto-metodologia.md) — fase piloto (3-5 entrevistas): valida el protocolo, no el producto; separa problema (Fase A) de observación del prototipo (Fase B).
  - [`docs/25-discovery-guion-observacion-mvp.md`](docs/25-discovery-guion-observacion-mvp.md) — guión de observación think-aloud del prototipo real, solo tras cerrar la Fase A.
  - [`docs/discovery-templates/`](docs/discovery-templates/) — plantillas CSV listas para usar (reclutamiento, métricas del estudio principal, y piloto por separado).

## Estado actual

Estrategia, diseño técnico, **Sprint 0** y **Sprint 1** completos y validados técnicamente. **El desarrollo de nuevas funcionalidades está suspendido a petición del founder** — la prioridad actual es un Customer Discovery Sprint con usuarios reales, no más ingeniería. El kit completo de ejecución está listo (protocolo, reclutamiento, métricas, criterios de decisión pre-registrados), complementado con evidencia secundaria pública real (un colectivo de médicos afectados por la espera de homologación en España, con ~30.000 expedientes atascados documentados). **Lo que falta no es código — es que alguien con acceso a personas reales ejecute 10-15 entrevistas 1:1**; ver `docs/23-informe-customer-discovery.md` para las opciones concretas de cómo proceder.
