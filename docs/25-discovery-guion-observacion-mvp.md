# Customer Discovery Sprint — Guión de observación del MVP (Fase B)

> Se ejecuta **únicamente después** de completar la Fase A (el problema, `18-discovery-protocolo-entrevistas.md`) completa y sin contaminar, y **únicamente** con la segunda mitad de la muestra piloto (ver `24-discovery-piloto-metodologia.md`). Nunca se combinan ambas fases en la misma sesión sin haber cerrado primero la Fase A por completo.

## Objetivo

No es "¿les gusta la interfaz?" (el founder ya pidió explícitamente no priorizar estética). Es: **¿lo que el entrevistado acaba de contarnos sobre su problema (Fase A) conecta con lo que el prototipo le ofrece, o hay una desconexión?** La comparación intra-persona (su propio relato vs. su propia reacción al ver el producto) es más fuerte que cualquiera de las dos partes por separado — permite ver si estamos resolviendo el problema que la persona describió, o uno distinto que nosotros asumimos.

## Transición de Fase A a Fase B (guión literal)

> "Gracias por contarme todo eso. Ahora, si te parece, me gustaría mostrarte algo que estamos construyendo — no para que lo evalúes o me digas si te gusta, sino para que lo uses como lo usarías normalmente mientras yo observo. Te voy a pedir que pienses en voz alta mientras navegas: dime qué esperas que pase, qué te confunde, qué te sorprende, aunque sea algo mínimo. No hay respuestas correctas ni incorrectas, y no te voy a ayudar a menos que te quedes completamente atascado — eso también es información valiosa."

## Método: think-aloud (pensar en voz alta)

- El entrevistador comparte pantalla o entrega el dispositivo/enlace y observa en silencio, sin guiar, salvo bloqueo total (>30 segundos sin ninguna acción ni verbalización).
- Cada vez que el entrevistado se detiene, pedir: "¿qué estás pensando ahora mismo?" — nunca sugerir qué hacer.
- Registrar textualmente las expresiones espontáneas ("ah, esto no lo sabía", "¿esto es verdad?", "no entiendo por qué me dice esto"), no solo un resumen.

## Tareas a observar (usando el prototipo real de Sprint 1)

| Paso | Tarea que se le pide | Qué observar y registrar |
|---|---|---|
| 1 | "Crea tu cuenta y completa tu perfil como lo harías normalmente." | ¿Duda en alguna pregunta del onboarding? ¿Abandona o se frustra en algún paso? ¿Pregunta por qué le pedimos cierto dato? |
| 2 | "Ahora mira tu resultado." (pantalla de compatibilidad) | Reacción inicial al ver el % — ¿lo primero que hace es leer el número o buscar la explicación? ¿Reacciona con sorpresa, escepticismo, indiferencia? |
| 3 | "Sin que te diga nada, haz lo que te parezca natural con esta pantalla." | ¿Expande las razones espontáneamente? ¿Expande las acciones recomendadas? ¿Ignora ambas y solo mira el número? (esto es evidencia directa para H2/H3 de `docs/16-hipotesis-sprint-1.md`, ahora con observación real en vez de solo analítica) |
| 4 | "¿Confiarías en este porcentaje? ¿Por qué sí o por qué no?" | Verbatim textual — es la pregunta más directa sobre si el motor de explicación genera confianza real |
| 5 | "Ahora mira tu proyección de futuro para este destino." | ¿Entiende la línea de tiempo sin explicación adicional? ¿Comenta algo sobre las fuentes citadas? |
| 6 | (Sin indicación) — observar si nota y/o interactúa con los "fake doors" (comunidad / radar de espera) | ¿Los nota espontáneamente? ¿Hace clic sin que se le pida? Esto es la observación cualitativa que complementa la señal cuantitativa de `interes_comunidad_expresado`/`interes_radar_expresado` — aquí se puede preguntar *por qué* hizo o no hizo clic, algo que el evento de analítica no puede decirnos |
| 7 | "¿Qué falta acá que esperarías encontrar?" | Respuesta abierta — comparar contra lo que el entrevistado mismo describió como su problema en la Fase A |

## Preguntas de cierre de la Fase B

- "Piensa en lo que me contaste al principio sobre tu propia situación — ¿sientes que esto responde a eso, o se siente como algo distinto?" *(la pregunta más importante de toda la Fase B — fuerza la comparación intra-persona explícitamente)*
- "Si esto existiera hoy tal como lo viste, ¿qué harías diferente en tu proceso?" *(todavía busca comportamiento, no una opinión genérica — nótese que sigue evitando "¿lo usarías?")*
- "¿Hay algo que viste que directamente no te sirve o te parece innecesario?" *(pregunta 🔎 de refutación aplicada al producto, no solo al problema)*

## Plantilla de registro (Fase B)

```markdown
### Observación MVP — Entrevista piloto #[N]

**Tarea 1 (onboarding):** dudas/abandonos observados —
**Tarea 2 (primera reacción al resultado):** —
**Tarea 3 (interacción espontánea con razones/acciones):** expandió razones [sí/no] · expandió acciones [sí/no] · orden en que lo hizo —
**Tarea 4 (¿confía en el %?):** cita textual —
**Tarea 5 (proyección de futuro):** comprensión sin ayuda [sí/no] · comentario sobre fuentes —
**Tarea 6 (fake doors):** notó comunidad [sí/no] · clic comunidad [sí/no] · notó radar [sí/no] · clic radar [sí/no] · razón dada —
**Tarea 7 (qué falta):** —

**Comparación intra-persona (la más importante):** ¿lo que pidió en la Fase A aparece resuelto, parcialmente resuelto, o ausente en el prototipo? —

**Evidencia de desconexión problema↔solución (buscar activamente, no solo confirmar encaje):**
```

## Advertencia de honestidad

Esta fase, igual que el resto del Customer Discovery Sprint, **requiere un entrevistador humano con acceso a la persona y al prototipo corriendo** — no puede ejecutarse dentro de esta sesión. El prototipo mismo ya fue validado técnicamente (recorrido automatizado en navegador, ver `docs/17-informe-sprint-1.md`), por lo que está listo para usarse en esta fase sin trabajo adicional de ingeniería.
