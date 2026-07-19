# Customer Discovery Sprint — Fase piloto (3–5 entrevistas)

> Decisión del founder tras revisar el kit de descubrimiento: antes de reclutar la muestra completa de 10-15 personas (`19-discovery-plan-reclutamiento.md`), se ejecuta primero un **piloto con 3-5 contactos cercanos**. El objetivo del piloto **no es el problema ni el producto — es el propio protocolo**: identificar sesgos, preguntas confusas, y confirmar que el instrumento realmente extrae información útil antes de invertir en el reclutamiento completo. Además, el founder introdujo una separación metodológica importante (ver §2): no mostrar el producto a todos los entrevistados por igual.

## 1. Qué NO es esta fase (para no confundirla con el estudio principal)

- **No cuenta para los umbrales de decisión de `21-discovery-criterios-decision.md`** (perseverar/pivotar/repriorizar/replantear). Esos umbrales están calibrados para una muestra de 10-15 con las cuotas de diversidad ya definidas; una muestra piloto de 3-5 contactos cercanos del founder es, por diseño, no representativa (sesgo de red personal) y demasiado pequeña para leerse cuantitativamente.
- **No se mezcla en la misma hoja de cálculo que el estudio principal.** Usa su propio tracker (`discovery-templates/tracker-piloto.csv`), con una columna `tipo_evidencia = piloto` para que incluso si alguien combina archivos más adelante, quede visualmente marcada y no se cuente por error hacia los umbrales del estudio principal.
- El contenido de lo que digan sobre el problema **sí es aprendizaje cualitativo legítimo** (no se descarta), pero se reporta por separado, explícitamente etiquetado como exploratorio — nunca como "N de 15" ni como evidencia que mueve el marcador de decisión.

## 2. La separación metodológica clave: problema primero, producto después (y no para todos)

Instrucción explícita del founder, y la razón por la que importa: si se muestra el producto desde la primera pregunta, la conversación se desplaza naturalmente hacia opinar sobre la interfaz ("esto se ve bien", "yo pondría el botón más arriba") en vez de sobre el problema real — contaminando exactamente la señal que el protocolo de `18-discovery-protocolo-entrevistas.md` fue diseñado para proteger (Mom Test: nunca describir el producto antes de entender el problema).

**Estructura de la muestra piloto (3-5 personas):**

| Entrevistas | Contenido |
|---|---|
| **Primeras 2-3** | **Solo Fase A: el problema.** Protocolo completo de `18-discovery-protocolo-entrevistas.md`, sin ninguna mención ni pantalla del producto. Cierre estándar (sin mostrar nada, aunque el entrevistado pregunte — se puede prometer "te muestro algo en una futura conversación"). |
| **Resto de la muestra piloto (1-3 personas, según cuántas se logren agendar)** | **Fase A (el problema) + Fase B (observación del MVP real).** Se completa primero toda la Fase A tal como con los anteriores, y solo *después* de cerrada esa parte se pasa a mostrar el prototipo funcional de Sprint 1 y observar la interacción (ver `25-discovery-guion-observacion-mvp.md`). |

Esto separa deliberadamente dos preguntas que nunca deben mezclarse en la misma evidencia:
1. **¿El problema realmente duele?** — Fase A, todas las entrevistas piloto.
2. **¿Nuestra solución responde a ese dolor?** — Fase B, solo en la segunda mitad de la muestra piloto, y siempre *después* de haber obtenido el relato del problema sin contaminar.

## 3. Criterios de éxito del piloto (evalúan el protocolo, no el problema ni el producto)

Revisar, entrevista por entrevista y luego en conjunto:

- ¿Las preguntas se entendieron sin necesitar reformulación repetida? ¿Cuáles sí la necesitaron?
- ¿Se obtuvo al menos un episodio concreto y fechado (no solo generalidades tipo "es difícil") en cada entrevista? Si no, ¿en qué pregunta se quedó la conversación en lo genérico?
- ¿Alguna pregunta empujó al entrevistado a "opinar sobre una idea" en vez de "contar su experiencia" (señal de que sonó a venta pese a las reglas duras del protocolo)?
- ¿Las preguntas 🔎 de refutación (considerar no intentarlo, conocer un caso fácil, alternativas gratuitas suficientes) se sintieron naturales o forzadas/incómodas en el flujo de la conversación?
- ¿La duración real se acercó a los 30-40 minutos estimados, o se disparó/quedó corta? ¿En qué sección se fue el tiempo?
- **Solo para las entrevistas con Fase B:** ¿el entrevistado pudo navegar el prototipo sin ayuda excesiva del entrevistador? (Esto evalúa si el prototipo es utilizable para el propósito de observar reacción al problema/solución — no su estética, que el founder ya pidió explícitamente no priorizar.)

## 4. Qué hacer con el resultado del piloto

Al completar las 3-5 entrevistas piloto, antes de tocar el reclutamiento completo:

1. Revisar el protocolo pregunta por pregunta contra los criterios de la sección 3.
2. Decidir explícitamente, por pregunta: **mantener / reformular / eliminar / añadir**. Documentar como "Protocolo v2" (nueva versión de `18-discovery-protocolo-entrevistas.md`, con un changelog al inicio del archivo, igual que se versionaron los documentos de Sprint 1) — no editar el v1 silenciosamente sin dejar rastro de qué cambió y por qué.
3. Si el piloto reveló que el protocolo funciona razonablemente bien (mayoría de criterios de la sección 3 en verde), proceder al reclutamiento completo de `19-discovery-plan-reclutamiento.md` sin más demora.
4. Si el piloto reveló problemas serios (p. ej., ninguna entrevista produjo un episodio concreto, o la Fase B mostró que el prototipo es inutilizable sin ayuda constante), **no proceder al reclutamiento completo todavía** — corregir primero, y considerar un segundo mini-piloto de 2-3 personas más antes de comprometer el reclutamiento de 10-15.
5. Reportar el aprendizaje piloto (cualitativo, sin pretensión de N) como una sección separada y claramente etiquetada dentro de `23-informe-customer-discovery.md`, nunca mezclada con la sección de resultados del estudio principal cuando esta última exista.

## 5. Logística específica del piloto

- Reclutamiento: contactos directos del founder (sin necesidad del screener ni los canales de `19-discovery-plan-reclutamiento.md` — es una muestra de conveniencia, y así debe quedar registrado).
- Para la Fase B se necesita el prototipo de Sprint 1 corriendo y accesible (`npm run migrate && npm run seed && npm run start`, o una instancia desplegada) — confirmar que funciona *antes* de la llamada, no improvisar en vivo.
- Grabación/notas: misma disciplina que el estudio principal (`20-discovery-metricas-e-instrumentos.md`), usando el tracker específico de piloto (`discovery-templates/tracker-piloto.csv`).
