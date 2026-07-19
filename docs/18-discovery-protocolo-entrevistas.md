# Customer Discovery Sprint — Protocolo de entrevistas (v1 — Fase A: el problema)

> Objetivo del sprint completo (recordatorio, para que cada pregunta de este protocolo se lea con ese propósito): **no confirmar que a la gente le gusta Medical Pathway — determinar si el problema que creemos resolver es lo bastante importante como para que alguien cambie su comportamiento por él.** Metodología base: *The Mom Test* (Rob Fitzpatrick) — preguntar por comportamiento pasado concreto, nunca por opiniones sobre el futuro o sobre nuestra idea.
>
> **Este documento es la Fase A únicamente (el problema, sin mostrar producto).** Antes de aplicarlo a la muestra completa de 10-15, se ejecuta primero sobre una muestra piloto de 3-5 contactos cercanos, específicamente para poner a prueba este protocolo (no el problema ni el producto) — ver `24-discovery-piloto-metodologia.md`. Tras el piloto, este documento puede revisarse a v2 con un changelog explícito de qué cambió y por qué. La Fase B (mostrar el prototipo y observar), aplicable solo a parte de la muestra piloto y luego opcionalmente al estudio principal, vive en un documento separado (`25-discovery-guion-observacion-mvp.md`) — nunca se ejecuta antes de cerrar esta Fase A completa.

## Reglas duras (para quien conduzca la entrevista)

1. **Nunca describir el producto antes del cierre.** Si el entrevistado pregunta "¿y ustedes qué están construyendo?", responder "te cuento al final, primero quiero entender tu situación" — describir el producto antes contamina todas las respuestas siguientes (la gente empieza a responder para complacer, no para informar).
2. **Nunca preguntar sobre el futuro o hipótesis.** Prohibido: "¿Te gustaría una plataforma que...?", "¿Pagarías por...?", "¿Usarías...?". Permitido: "¿Qué hiciste la última vez que...?", "¿Cuánto pagaste por...?", "¿A quién le preguntaste?".
3. **Perseguir specificidad.** Si la respuesta es genérica ("es difícil", "hay mucha desinformación"), repreguntar hasta obtener un episodio concreto: "¿Puedes contarme la última vez que te pasó eso? ¿Qué día fue, más o menos? ¿Qué hiciste inmediatamente después?".
4. **El silencio es una herramienta.** Tras una pregunta abierta, esperar sin rellenar el silencio — la primera respuesta suele ser la más honesta.
5. **Buscar activamente la refutación.** Al menos 3 preguntas de este protocolo (marcadas 🔎) existen específicamente para intentar romper la hipótesis del founder, no para confirmarla. No se pueden omitir.

## Estructura (30–40 minutos)

### 1. Apertura (2 min)
> "Gracias por tu tiempo. Estamos investigando cómo los médicos y estudiantes de medicina de Latinoamérica piensan y viven su carrera profesional, especialmente la posibilidad de ejercer en otro país. No te voy a vender nada ni pedirte que evalúes una idea — quiero entender tu experiencia real, con toda honestidad, incluso si es aburrida o si nunca llegaste a hacer nada al respecto. ¿Puedo tomar notas (o grabar, con tu permiso) para no perder detalles?"

### 2. Contexto (3–5 min)
- ¿En qué año estás de la carrera / en qué año te graduaste? ¿De qué universidad y país?
- ¿Cuál es tu especialidad o área de interés?
- ¿Dónde vives y ejerces (o estudias) hoy?

### 3. Biografía del problema — núcleo de la entrevista (15–20 min)

- "Cuéntame de la última vez que consideraste **seriamente** (no de pasada) ejercer o especializarte en otro país. ¿Qué estaba pasando en tu vida en ese momento?" *(ancla a un episodio real, con fecha aproximada)*
- "¿Qué fue lo primero que hiciste después de esa decisión? Camina paso a paso — ¿a quién le preguntaste, qué buscaste, en qué orden?"
- "¿Cuánto tiempo dirías que le has dedicado a esto hasta hoy? ¿Y dinero — has pagado por algo relacionado (curso, traducción, gestor, asesoría, examen)? ¿Cuánto, exactamente?" *(comportamiento medible, no intención)*
- "¿Cuál fue el momento más frustrante o confuso de todo el proceso? Cuéntame esa situación específica."
- "Cuando te sentiste así, ¿qué hiciste? ¿A quién recurriste? ¿Te sirvió?"
- "¿Has usado o visto algún grupo de Facebook/Telegram, foro, o academia relacionada con esto? ¿Qué opinas de la información que circula ahí — alguna vez te encontraste con algo que resultó falso, engañoso, o una estafa?"
- 🔎 "¿Has considerado seriamente simplemente quedarte en tu país y no intentarlo? ¿Qué te haría decidir eso? ¿Qué tan cerca has estado de decidir eso?" *(busca si el "no intentarlo" es una alternativa real y aceptable — si lo es para mucha gente, el problema pesa menos de lo asumido)*
- 🔎 "¿Conoces a alguien que lo haya logrado sin mucha dificultad? ¿Cómo lo hizo? ¿Qué fue distinto en su caso?" *(busca casos donde el problema NO fue grave — importante no descartarlos ni interrumpir al entrevistado)*
- 🔎 "Si tuvieras que resolver esto usando solo lo que ya existe gratis hoy (grupos de Facebook, foros, amigos que ya lo hicieron), ¿qué tan bien te serviría? ¿Qué le faltaría?" *(mide si las alternativas actuales, aunque imperfectas, ya son "suficientemente buenas" — la barra real a superar, no una versión ideal inexistente)*
- "En una escala del 1 al 10, ¿qué tan urgente es para ti resolver esto en los próximos 12 meses? ¿Por qué ese número y no uno más alto/bajo?" *(pedir siempre el porqué, nunca solo el número)*

### 4. Cierre con compromiso (5 min)

- "¿Estarías dispuesto a probar algo que estamos construyendo más adelante y darnos tu opinión honesta, incluso si es negativa?" *(pedir un compromiso real — un email, no un "sí" educado)*
- "¿Conoces a 1 o 2 personas más en una situación parecida con quienes podríamos hablar?" *(motor de reclutamiento por referidos — ver `19-discovery-plan-reclutamiento.md`)*
- Solo si el entrevistado lo pide explícitamente, o al final: describir brevemente qué es Medical Pathway, aclarando que la conversación de hoy no fue para evaluarlo.

## Qué NO preguntar (lista de errores comunes a evitar)

| Pregunta prohibida | Por qué | Alternativa correcta |
|---|---|---|
| "¿Usarías una app que te dijera cuánto tarda tu homologación?" | Hipotética — la gente dice que sí por cortesía | "¿Cómo supiste/averiguaste cuánto suele tardar? ¿Confiaste en esa fuente?" |
| "¿Pagarías por acompañamiento personalizado?" | Intención declarada ≠ comportamiento real | "¿Has pagado ya por algo así? ¿Cuánto?" |
| "¿Qué te parece esta idea?" | Pide opinión sobre el producto, no sobre el problema | No preguntar — mantener el foco en su experiencia, no en nuestra idea |
| "¿Crees que hay mucha desinformación en este tema?" | Pregunta de opinión general, fácil de responder con generalidades | "Cuéntame de una vez que la información que encontraste resultó ser falsa o te confundió" |

## Registro de la entrevista

Cada entrevista se documenta con la plantilla de `20-discovery-metricas-e-instrumentos.md` inmediatamente después (máximo 1 hora después) — no esperar a tener las 10-15 completas para empezar a tomar notas estructuradas.
