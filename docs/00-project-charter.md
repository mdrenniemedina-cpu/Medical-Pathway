# Medical Pathway — Project Charter

> Documento vivo. Se actualiza en cada iteración relevante. No se borra historial: si una hipótesis cambia, se tacha o se mueve a "Descartado" con la razón, no se elimina.

## 1. Origen y problema observado (hipótesis inicial del founder)

Médicos y estudiantes de medicina de Latinoamérica quieren construir una carrera internacional, pero:
- No saben cuál es el mejor país destino para su perfil concreto.
- No tienen claro el camino (pasos, exámenes, idioma, documentos, tiempos, costes) para llegar ahí de forma segura y eficiente.
- Operan en un espacio con mucha desinformación y actores (academias, "gestores", agencias de reclutamiento) con incentivos no siempre alineados con el médico.

**Instrucción explícita del founder:** no asumir que la solución es "una plataforma para comparar países". El equipo (PM/UX/Arquitectura/CTO, en este caso Claude) debe investigar si ese es realmente el problema principal o si hay una necesidad de mayor impacto sin resolver, y proponerla con evidencia si la encuentra.

## 2. Usuario principal (segmento inicial)

- **Quién:** médicos graduados y estudiantes de medicina avanzados de países hispanohablantes de Latinoamérica.
- **Países de origen iniciales:** Honduras, Guatemala, El Salvador, Nicaragua, Costa Rica, Panamá, México, Colombia, Perú, Ecuador, Bolivia, República Dominicana (y otros hispanohablantes).
- **Países destino en el radar inicial:** Alemania, España, Estados Unidos, Canadá, Reino Unido, Australia, Nueva Zelanda, Suiza, Brasil.

## 3. Mercado inicial (beachhead) — a decidir con evidencia

El founder pide explícitamente que no se asuma un único país de lanzamiento. La decisión de beachhead market debe basarse en: tamaño del mercado, facilidad de adquisición de usuarios, potencial de crecimiento, monetización y complejidad regulatoria. Ver `docs/research/03-beachhead-market-analysis.md` (pendiente hasta cerrar investigación).

## 4. Modelo de negocio propuesto por el founder (a validar/retar)

- **Fase 1 (MVP):** B2C freemium — validar problema, generar confianza, construir comunidad.
- **Fase 2:** Suscripción premium — rutas personalizadas, seguimiento del proceso, IA especializada, gestión documental, alertas regulatorias, acompañamiento en homologación.
- **Fase 3:** Alianzas B2B — universidades, facultades de medicina, hospitales, sociedades científicas, academias de idiomas, empresas de reclutamiento médico, organizaciones de movilidad profesional.

Este modelo se evaluará críticamente en `docs/research/05-product-strategy-cuestionamiento.md` una vez cerrada la investigación de mercado y competencia.

## 5. Rol del equipo en este proyecto

Actuando como Product Manager, UX Researcher, Arquitecto de Software y CTO, con este orden de trabajo:
1. Investigar el problema y el mercado con evidencia (no asunciones).
2. Cuestionar las hipótesis del founder abiertamente, con razonamiento y evidencia.
3. Definir el MVP (qué SÍ y qué NO incluye, y por qué).
4. Diseñar la arquitectura del producto.
5. Documentar cada decisión relevante como ADR (Architecture/Product Decision Record) en `docs/decisions/`.

## 6. Estado de la investigación

| Área | Estado | Documento |
|---|---|---|
| Rutas de homologación España/Alemania/Brasil | Completo | `docs/research/01-pathways-spain-germany-brazil.md` |
| Rutas IMG EE.UU./Canadá | Completo | `docs/research/02-pathways-usa-canada.md` |
| Rutas Reino Unido/Australia/NZ/Suiza | Completo | `docs/research/03-pathways-uk-australia-nz-switzerland.md` |
| Competencia y tendencias de migración médica LatAm | Completo | `docs/research/04-competitive-landscape-and-market-sizing.md` |
| Beachhead market (recomendación) | Completo — propuesta pendiente de validación del founder | `docs/research/05-beachhead-market-analysis.md` |
| Cuestionamiento de la propuesta de producto | Completo — propuesta pendiente de validación del founder | `docs/research/06-product-strategy-cuestionamiento.md` |
| Matriz de decisión España vs. Alemania | Completo | `docs/research/07-matriz-beachhead-espana-alemania.md` |
| Momento crítico del recorrido (input al MVP) | Completo | `docs/research/08-momento-critico-espera.md` |
| Definición del MVP | **v3 — recorrido completo (Descubrir/Planificar/Acompañar/Continuar), Radar de Espera anidado en España** | `docs/03-mvp-definition.md` |
| Arquitectura del sistema (vista de alto nivel) | **v4 — recorrido de 4 preguntas humanas, remite al modelo de dominio detallado** | `docs/04-architecture.md` |
| Modelo de dominio (DDD) | Completo | `docs/05-domain-model-ddd.md` |
| Esquema de base de datos | Completo | `docs/06-database-schema.md` |
| Contratos de API | Completo | `docs/07-api-contracts.md` |
| Modelo de autenticación y autorización | Completo | `docs/08-auth-model.md` |
| Recomendación final (6 meses, recursos limitados) | Completo | `docs/09-recomendacion-final-6-meses.md` |
| Roadmap técnico por sprints | Completo | `docs/10-technical-roadmap-sprints.md` |
| Riesgos técnicos y mitigación | Completo | `docs/11-riesgos-tecnicos-mitigacion.md` |
| Estrategia de escalamiento multi-país | Completo | `docs/12-estrategia-escalamiento-multipais.md` |
| Calidad y confianza de datos del Radar | Completo | `docs/13-calidad-confianza-datos-radar.md` |
| Estrategia de retención y engagement | Completo | `docs/14-estrategia-retencion-engagement.md` |
| Registro de decisiones (ADR) | 14 decisiones documentadas | `docs/decisions/` |

**Decisiones ya validadas por el founder:** ADR-001 (España como beachhead), ADR-002 (núcleo = confianza/navegación, no comparador — refinado por ADR-009), ADR-007 (Radar de Espera como funcionalidad diferenciadora, alcance corregido por ADR-009), ADR-008 (datos agregados anónimos como foso), ADR-009 (recorrido completo, Radar anidado), ADR-010 a ADR-014 (diseño de dominio DDD, separación Cuenta/Perfil, extensibilidad multi-país, motor de confianza de datos, mecanismos de retención). Pendiente de validación explícita: ADR-003 (monetización adelantada por referidos, diferida a Fase 2).

## 7. Preguntas abiertas / riesgos identificados hasta ahora

- ¿Es "comparar países" el trabajo principal (JTBD) o es una capa superficial sobre un problema más profundo de **confianza** (mucha desinformación, agencias predatorias, cursos caros) y **acompañamiento personalizado paso a paso**?
- ¿Cómo se financia el MVP freemium si el B2B (universidades, hospitales, agencias) no llega hasta Fase 3? ¿Hay riesgo de runway sin ingresos tempranos?
- ¿Cómo se gestiona la responsabilidad legal/regulatoria de dar "orientación" sobre procesos migratorios y de homologación médica (no somos una gestoría ni damos asesoría legal migratoria)?
- ¿Existen ya competidores fuertes y con financiación en algún destino específico (p. ej. Alemania) que cambien la estrategia de entrada?
