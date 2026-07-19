# Informe del Customer Discovery Sprint

> Responde a lo pedido: protocolo, plan de reclutamiento, métricas, instrumentos, criterios de interpretación y metodología de decisión — **diseñados y listos para ejecutar**. Lo que este informe NO contiene, y por qué, se explica en la sección 0.

## 0. Qué se ejecutó realmente y qué no — honestidad antes que nada

**No se realizó ninguna entrevista 1:1 con un médico o estudiante real.** Como IA operando en esta sesión, no tengo ningún canal para contactar, reclutar o conversar con personas reales fuera de este entorno — no tengo acceso a redes sociales, WhatsApp, email saliente a terceros, ni una base de usuarios existente. Fabricar 10-15 "entrevistas" con citas inventadas de médicos ficticios habría sido presentar evidencia falsa como si fuera real, exactamente lo opuesto de lo que pediste ("encontrar evidencia que pueda refutar nuestras hipótesis" solo tiene sentido si la evidencia es real).

**Lo que sí se hizo, y es genuino:**
1. Diseñar el sprint completo: protocolo de entrevistas (`18-discovery-protocolo-entrevistas.md`), plan de reclutamiento (`19-discovery-plan-reclutamiento.md`), métricas e instrumentos (`20-discovery-metricas-e-instrumentos.md`), criterios de interpretación y marco de decisión pre-registrado (`21-discovery-criterios-decision.md`), y plantillas listas para usar (`discovery-templates/`).
2. Una investigación real de **evidencia secundaria pública** (`22-discovery-evidencia-secundaria.md`) — periodismo verificable, un colectivo de afectados con cifras propias, casos con nombre y apellido, montos de estafas documentados. Esto es evidencia real, con URLs verificables, no inventada — pero es evidencia indirecta y no controlada, no un sustituto de la entrevista 1:1 estructurada.

## 1. Lo que la evidencia secundaria sí sugiere (con las salvedades del documento 22)

- **Corrobora, con más fuerza que la investigación de mercado original**, que la espera de homologación en España es un punto de dolor real y agudo: existe un colectivo organizado ("Homologación Justa Ya") con ~30.000 expedientes atascados documentados y esperas de 3,5 a 6 años frente a un límite legal de 6 meses. Un colectivo de presión organizado es una señal fuerte que no teníamos antes.
- Confirma gasto de dinero real y significativo (hasta 4.000 €/año en academias; hasta 200 € en estafas de citas ilegales) — evidencia de comportamiento, no de opinión.
- **No pudo encontrar el contrapeso** (personas para quienes esto no fue grave) — y esto es, en sí mismo, el hallazgo metodológico más importante: puede ser que ese contrapeso no exista en volumen relevante, o puede ser que simplemente no genera cobertura periodística. **Las entrevistas 1:1 son la única forma de saber cuál de las dos es cierta**, porque están diseñadas explícitamente (preguntas 🔎 del protocolo) para buscar ese contrapeso que el periodismo no puede ofrecer.

## 2. Lo que sigue sin poder afirmarse (y no debe afirmarse) hasta tener entrevistas reales

- Qué proporción de médicos/estudiantes LatAm vive esto como un problema urgente vs. una molestia menor.
- Si el dolor se concentra realmente en la espera de homologación o en otra fase (la evidencia secundaria sugiere que sí, pero con sesgo periodístico reconocido).
- Si existe interés espontáneo real en comunidad o en datos compartidos (H5, la pregunta estratégica del founder) — esto depende enteramente de conversación 1:1, ninguna fuente pública lo puede responder.
- Cualquier número que sugiera "el X% de los médicos..." — no existe una muestra todavía.

## 3. Recomendación concreta para el Sprint 2 — basada exclusivamente en lo que hoy es evidencia real

Dado que la única evidencia real disponible (secundaria) apunta a que el problema en la fase de espera es agudo, pero no puede decirnos nada sobre la propuesta de valor específica del producto (motor de descubrimiento vs. comunidad vs. datos) ni sobre la proporción del segmento que lo vive así, la recomendación con la evidencia de **hoy** es:

**No iniciar desarrollo de nueva funcionalidad de Sprint 2 hasta completar al menos las primeras 5-6 entrevistas reales** (no es necesario esperar las 15 completas para tener señal direccional útil, siguiendo la práctica estándar de discovery de revisar evidencia de forma incremental). Esto es coherente con tu instrucción de que la prioridad dejó de ser la ingeniería.

## 4. Decisión tomada: piloto de 3-5 contactos cercanos antes del estudio principal

El founder decidió empezar con **3-5 entrevistas piloto de su red cercana**, con dos objetivos que este informe distingue explícitamente de la validación de producto:

1. **Validar el protocolo mismo** (no el problema, no el producto) — identificar preguntas confusas, sesgos del entrevistador, y confirmar que el instrumento extrae información útil, antes de invertir en el reclutamiento completo de 10-15 con cuotas de diversidad.
2. **Separar dos preguntas que no deben mezclarse**: las primeras 2-3 entrevistas piloto son *solo problema* (Fase A, sin mostrar el producto); el resto de la muestra piloto añade una *Fase B* donde sí se muestra el prototipo real de Sprint 1 y se observa la interacción (think-aloud), siempre después de cerrar la Fase A. Ver la metodología completa en `24-discovery-piloto-metodologia.md` y el instrumento de observación en `25-discovery-guion-observacion-mvp.md`.

**La evidencia de este piloto se mantiene explícitamente separada de la evidencia del estudio principal** (tracker propio, `discovery-templates/tracker-piloto.csv`, con columna `tipo_evidencia = piloto`) y no cuenta hacia los umbrales de decisión de `21-discovery-criterios-decision.md` — esos umbrales siguen reservados para el estudio principal de 10-15 con cuotas de diversidad.

## 5. Qué sigue — y qué necesito de ti

1. Agenda y conduce las 3-5 entrevistas piloto siguiendo `18-discovery-protocolo-entrevistas.md` (Fase A) y, para la segunda mitad de la muestra, `25-discovery-guion-observacion-mvp.md` (Fase B) — para esta última necesitas el prototipo corriendo (`npm run migrate && npm run seed && npm run start`, o una instancia desplegada).
2. Compárteme las notas/grabaciones de cada entrevista piloto a medida que las completes (no hace falta esperar a las 5) — puedo ayudarte a sintetizarlas contra los criterios de éxito del protocolo (`24-discovery-piloto-metodologia.md` §3) y a decidir si el protocolo pasa a v2 antes del estudio principal.
3. Una vez cerrado el piloto y revisado el protocolo, retomamos el reclutamiento completo de `19-discovery-plan-reclutamiento.md` (hoy en pausa deliberada).

Sigo sin poder ejecutar directamente ninguna de estas conversaciones — mi función a partir de aquí es preparar cada instrumento, y sintetizar lo que tú recojas, contra los criterios ya pre-registrados.
