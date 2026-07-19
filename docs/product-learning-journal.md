# Product Learning Journal

> Este documento no es técnico. Es la memoria de producto: el registro de cómo evolucionó nuestra comprensión del problema, a partir de evidencia real de médicos y estudiantes, no de opiniones internas. Empieza a regir el **19 de julio de 2026**, cuando el founder suspendió el desarrollo de nuevas funcionalidades para entrar en una fase de aprendizaje.

## Reglas de este documento (léase antes de escribir cualquier entrada)

1. **Solo evidencia, nunca opiniones.** Una entrada no dice "creo que el dolor está en X" — dice "3 de 4 entrevistados mencionaron X sin que se les preguntara directamente, en estos términos: [cita]".
2. **Nada se fabrica.** Si no hubo entrevista real, no hay entrada. Ver la sección "Estado real de la evidencia" abajo — a la fecha de creación de este documento, **cero entrevistas reales se han conducido en este proyecto** (ver `docs/23-informe-customer-discovery.md`, sección 0). Esta es la razón por la que la tabla de hipótesis de abajo dice "aún incierta" en cada fila: no es cautela retórica, es literalmente el estado de la evidencia.
3. **Nunca se borra una entrada.** Las hipótesis cambian de estado hacia adelante (nueva entrada), pero el historial completo queda visible — para poder reconstruir meses después por qué el producto evolucionó de determinada manera.
4. **Toda entrada debe intentar refutar, no confirmar.** Si una ronda de entrevistas solo aporta evidencia a favor y ninguna en contra, eso en sí mismo es sospechoso (ver `docs/21-discovery-criterios-decision.md` §5) y debe anotarse como advertencia en la entrada.
5. **Cada entrada sigue la misma plantilla** (ver "Plantilla de entrada" al final).

## Quién puede alimentar este documento

Como agente operando en este entorno, no tengo canal propio para reclutar ni entrevistar médicos reales — no tengo acceso a redes sociales, WhatsApp, ni a ninguna base de usuarios. Cada entrada de este journal requiere que el founder (o quien conduzca la entrevista siguiendo `docs/18-discovery-protocolo-entrevistas.md` / `docs/24-discovery-piloto-metodologia.md` / `docs/25-discovery-guion-observacion-mvp.md`) traiga la evidencia cruda — notas, transcripción, grabación transcrita, o al menos las respuestas literales a las preguntas del protocolo — para que yo la analice contra las hipótesis. Sin ese insumo, no hay entrada nueva posible.

---

## Estado actual de las hipótesis (vivo — se actualiza tras cada ronda)

**Estados posibles:** `fortalecida` · `debilitada` · `refutada` · `aún incierta` (sin evidencia real todavía).

| ID | Hipótesis | Origen | Estado actual | Última entrada que la tocó |
|---|---|---|---|---|
| **H0** | El problema de navegar una carrera médica internacional es lo bastante doloroso/costoso/urgente para que un médico o estudiante de LatAm ya haya cambiado su comportamiento (gastado dinero, tiempo, tolerado frustración) por resolverlo — y ese dolor se concentra en la espera de homologación en España. | `docs/21-discovery-criterios-decision.md` §1 (la pregunta central del proyecto) | **aún incierta** | — (ninguna todavía) |
| **H1** | Un cuestionario de perfil corto y justificado no pierde usuarios por fricción. | `docs/16-hipotesis-sprint-1.md` | **aún incierta** | — |
| **H2** | La explicación (razones), no el porcentaje, es lo que el usuario explora. | `docs/16-hipotesis-sprint-1.md` | **aún incierta** | — |
| **H3** | "Qué te falta" y "qué acciones" mueven a la acción más que el puntaje solo. | `docs/16-hipotesis-sprint-1.md` | **aún incierta** | — |
| **H4** | Visualizar el futuro (línea de tiempo) es más motivador que una lista de pasos plana. | `docs/16-hipotesis-sprint-1.md` | **aún incierta** | — |
| **H5** | El motor de descubrimiento/explicación es el corazón del valor — vs. hipótesis rivales igual de plausibles: el valor real está en la confianza (verificación anti-estafa), en la comunidad (acompañamiento humano), o en el activo de datos exclusivo (Radar de Espera). | `docs/16-hipotesis-sprint-1.md` | **aún incierta** | — |
| **H6** | El dolor específico que more se concentra en la espera de homologación, no en decidir el país, ni en el examen, ni en conseguir plaza después. | `docs/21-discovery-criterios-decision.md` §3 | **aún incierta** | — |

> Nota de honestidad: estas siete filas existían **antes** de este documento (pre-registradas en Sprint 1 y en el Customer Discovery Sprint) — este journal no las inventa, las hereda y les da un lugar único donde su estado se actualiza con disciplina después de cada ronda real. Cualquier hipótesis nueva que emerja de una entrevista (algo que no anticipamos) se añade aquí con un ID nuevo (H7, H8...) en el momento en que aparece, marcada con el origen "emergente — entrevista del [fecha]".

---

## Prioridades actuales (vivo — se actualiza tras cada ronda)

*Aún no hay ronda de evidencia real que sustente ningún cambio de prioridad. Esta sección queda vacía a propósito — llenarla ahora, sin evidencia, sería inventar una narrativa de aprendizaje que no ha ocurrido.*

- **Qué construir ahora:** _pendiente de primera ronda_
- **Qué dejar de construir:** _pendiente_
- **Qué eliminar:** _pendiente_
- **Qué retrasar:** _pendiente_
- **Qué cambió respecto a la semana anterior:** _no aplica — esta es la semana 0 del journal_

---

## Patrones detectados (vivo — acumulativo entre entrevistas)

*Vacío. Se llena a partir de la primera entrada con evidencia real — dolores repetidos, lenguaje repetido, emociones repetidas, decisiones repetidas, errores repetidos, expectativas repetidas.*

---

## La pregunta que hay que responder tras las primeras entrevistas

> ¿Seguiríamos construyendo exactamente este producto después de escuchar a los usuarios?

Sin evidencia todavía, esta pregunta no tiene respuesta honesta — solo placeholder. Se responde explícitamente en la primera entrada que exista tras una ronda real, no antes.

---

## Registro cronológico de entradas

### Entrada 0 — 2026-07-19 — Creación del journal (sin evidencia nueva)

- **Evidencia nueva:** ninguna. Esta entrada documenta el cierre de la fase de arquitectura/MVP Beta y la apertura formal de la fase de aprendizaje, y deja registrado el estado exacto de cada hipótesis heredada en el momento cero, antes de cualquier entrevista.
- **Hipótesis afectadas:** ninguna cambia de estado — todas siguen `aún incierta` porque siguen sin evidencia real (ver `docs/23-informe-customer-discovery.md` §0: cero entrevistas reales conducidas hasta la fecha).
- **Decisiones tomadas:** se suspende el desarrollo de nuevas funcionalidades; el proyecto entra en modo de aprendizaje. Se crea este journal como memoria única de producto.
- **Funcionalidades descartadas:** ninguna todavía — descartar algo sin evidencia sería tan poco disciplinado como mantenerlo sin evidencia.
- **Funcionalidades nuevas:** ninguna.
- **Preguntas abiertas:**
  1. ¿Quién va a conducir las primeras entrevistas (piloto de 3-5, `docs/24`) y cuándo?
  2. ¿Cómo llegará la evidencia cruda (notas/transcripción) a este proceso para que se pueda analizar sin fabricar nada?
  3. ¿El founder quiere que el prototipo tenga una URL pública real antes de la Fase B (mostrar el MVP), o las entrevistas de Fase B se harán con el entorno actual compartido en pantalla?

---

## Plantilla de entrada (copiar para cada ronda nueva)

```
### Entrada N — [fecha] — [título breve: p. ej. "Piloto entrevista 1/3 — Fase A"]

- **Evidencia nueva:** [citas literales o paráfrasis fiel, nunca interpretación disfrazada de cita]
- **Hipótesis afectadas:** [ID — fortalecida/debilitada/refutada/aún incierta — por qué, con evidencia]
- **Decisiones tomadas:** [qué cambia en el producto o en el proceso, y por qué]
- **Funcionalidades descartadas:** [si aplica]
- **Funcionalidades nuevas:** [si aplica — algo que la evidencia sugirió y no existía]
- **Preguntas abiertas:** [lo que esta entrevista no resolvió, o generó de nuevo]
- **Evidencia refutante buscada activamente:** [obligatorio — qué se intentó específicamente para romper la hipótesis, y qué se encontró, aunque sea "nada"]
```
