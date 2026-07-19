# Customer Discovery Sprint — Criterios de interpretación y metodología de decisión

> **Alcance: estudio principal (10-15 personas) únicamente.** La fase piloto (3-5 contactos cercanos, ver `24-discovery-piloto-metodologia.md`) no aporta evidencia hacia estos umbrales — es una muestra de conveniencia, demasiado pequeña y sesgada por diseño (red personal del founder) para leerse cuantitativamente, y su propósito es validar el protocolo, no el problema. Ningún resultado del piloto debe mover ninguno de los umbrales de abajo.

> Pre-registrado **antes** de recolectar cualquier dato, siguiendo la misma disciplina de `docs/16-hipotesis-sprint-1.md`: definir qué contaría como evidencia a favor y qué contaría como evidencia en contra, antes de tener resultados que puedan sesgar la definición de "éxito". Si al final del sprint se siente la tentación de ajustar estos umbrales para que el resultado obtenido "cuente" como validación, esa tentación es en sí misma una señal de alerta y debe documentarse, no ejecutarse.

## 1. La pregunta que este sprint intenta responder

No es "¿les gusta la idea?". Es: **¿el problema de navegar una carrera médica internacional es lo bastante doloroso, costoso o urgente como para que un médico o estudiante de LatAm ya haya cambiado su comportamiento (gastado dinero, tiempo, tolerado frustración) por resolverlo — y, específicamente, se concentra ese dolor donde el founder cree que se concentra (la espera de homologación en España)?**

## 2. Qué cuenta como evidencia FUERTE de un problema importante

- Múltiples entrevistados relatan haber gastado dinero real (no solo tiempo) en intentos de resolver este problema, sin que se les preguntara de forma que sugiriera la respuesta.
- Frustración o mención de estafas/desinformación aparece **espontáneamente**, antes de que el entrevistador pregunte directamente por ello.
- Entrevistados describen haber buscado activamente múltiples fuentes/personas/grupos para resolver dudas — señal de que las alternativas actuales no bastan.
- Los relatos incluyen episodios concretos y fechados (no generalidades tipo "siempre es difícil").

## 3. Qué cuenta como evidencia DÉBIL o REFUTANTE (buscarla activamente, no ignorarla)

- La mayoría dice que "sería útil" pero ninguno gastó dinero o tiempo significativo — clásico falso positivo de cortesía.
- Aparecen con frecuencia casos de personas que resolvieron esto sin mayor dificultad, o que decidieron no intentarlo sin sentirlo como una pérdida.
- Los entrevistados califican la urgencia consistentemente baja (1-4/10) incluso cuando se les da espacio para explicar por qué sería alta.
- Las alternativas gratuitas actuales (grupos de Facebook, amigos que ya lo hicieron) se describen como "suficientes" por la mayoría.
- El dolor reportado se concentra en una fase **distinta** a la espera de homologación (p. ej., en decidir el país, o en el examen, o en conseguir plaza después) — esto no refuta que el problema general sea real, pero sí refutaría la hipótesis específica de dónde debe enfocarse el producto (ver ADR-001/ADR-007).

## 4. Marco de decisión

| Resultado | Umbral orientativo (sobre 10-15 entrevistas) | Decisión |
|---|---|---|
| **Perseverar** — el problema es real y agudo, y se concentra donde asumimos | ≥70% reporta urgencia ≥7/10 con razón concreta (no genérica) **Y** ≥50% ya invirtió dinero o tiempo significativo **Y** la fase de mayor frustración espontánea coincide con la espera de homologación (o al menos con el tramo de trámites/burocracia en general) | Continuar Sprint 2 según lo planeado, con mayor confianza |
| **Pivotar el foco del producto** (no necesariamente el mercado) — el problema es real pero está en otra fase | Urgencia alta (≥7/10) en una mayoría, **pero** la frustración espontánea se concentra en una fase distinta a la espera (p. ej., decisión de país, o el examen, o conseguir empleo después) | Replantear en qué paso del recorrido invertir la próxima profundidad de producto — puede seguir siendo España, pero no necesariamente el Radar de Espera como primer diferenciador |
| **Cambiar prioridades** (confirma la sospecha H5 del founder) — el interés espontáneo en comunidad o en datos compartidos supera al interés en el motor de descubrimiento | Mención espontánea (sin preguntar directamente) de "me ayudaría hablar con alguien que ya lo vivió" o "me gustaría saber qué le pasó a otros como yo" en una proporción notable de entrevistas, más que cualquier mención espontánea sobre comparar países | Reordenar Sprint 2 hacia Comunidad o hacia acelerar el Radar de Espera antes que profundizar Descubrimiento |
| **Replantear el problema/segmento** — evidencia refutante domina | <30% reporta urgencia ≥5/10, o nadie gastó tiempo/dinero real, o la mayoría considera las alternativas gratuitas actuales suficientes | Detener la construcción de producto sobre esta hipótesis; volver a investigación de problema antes de seguir construyendo cualquier funcionalidad |

Estos umbrales son **orientativos, no mecánicos** — con N=10-15 un resultado en el límite (p. ej. 65% en vez de 70%) debe leerse con criterio cualitativo (¿las razones detrás del número son convincentes y específicas, o vagas?), no aplicarse como un corte automático. El **contenido** de las citas pesa más que el porcentaje exacto.

## 5. Disciplina anti-sesgo de confirmación

- El informe final (`docs/23-informe-customer-discovery.md`) **debe** incluir una sección obligatoria titulada "la evidencia refutante más fuerte encontrada" — incluso si la conclusión general es "perseverar". Si esa sección queda vacía o débil, es una señal de que el proceso de entrevista no estuvo buscando genuinamente refutación (revisar si se siguieron las preguntas 🔎 del protocolo).
- Cualquier entrevista descartada de la síntesis (por ejemplo, por no calificar en el screener) debe quedar registrada igual, con la razón de descarte — para evitar "limpiar" la muestra post-hoc de los casos incómodos.
- Se recomienda que una segunda persona (no quien condujo las entrevistas) revise al menos 3 transcripciones/grabaciones de forma independiente antes de la síntesis final, para contrastar si llega a conclusiones distintas — mitiga el riesgo de que quien entrevistó, inconscientemente, escuche solo lo que espera oír.
