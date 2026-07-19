# Si mañana esto se lo mostráramos a un inversionista de Y Combinator

> Pedido explícito: ser extremadamente crítico. Esta respuesta no es una lista de fortalezas para presentar — es un diagnóstico honesto de qué transmitiría potencial real hoy, y qué expondría, bajo cualquier pregunta de seguimiento mínimamente incisiva, que todavía no lo hay.

## La verdad incómoda primero

**Si mañana se demuestra literalmente el flujo del MVP Beta (Landing → Registro → Perfil → Compatibilidad → Explicación → Iniciar Ruta) sin más contexto, se ve exactamente como lo que un socio de YC más teme financiar: una página bien hecha que te dice tu compatibilidad con un país.** No porque el producto sea débil, sino porque la decisión correcta de esconder el Radar de Espera y los "fake doors" del flujo visible (`26-mvp-beta-auditoria.md`) — necesaria para que las entrevistas de descubrimiento no se contaminen con funcionalidades sin terminar — **también esconde, de un inversionista, la única pieza que distingue esto de un sitio de contenido bien curado.**

Esta es una tensión real, no un detalle: **la misma decisión de producto (ocultar lo inacabado) que protege la credibilidad frente a un médico real, oculta el activo defendible frente a un inversionista.** La solución no es mostrar el Radar a los médicos — es tener listas dos superficies distintas para dos audiencias distintas (ver sección 4).

## Qué SÍ transmitiría potencial de empresa tecnológica global, si se explica bien (no solo se muestra)

1. **El activo de datos que compone con el uso — el Radar de Espera.** No como funcionalidad terminada (no lo está — cero registros reales hoy), sino como la explicación de *por qué* el producto se vuelve más difícil de copiar cuantos más usuarios tiene, algo que ningún competidor de contenido estático puede replicar sin el mismo volumen. Esto se muestra con un mockup conceptual explícitamente etiquetado como ilustrativo, no con datos reales inventados.
2. **La arquitectura de dominio ya diseñada para escalar a cualquier país/profesión sin reescribir el núcleo** (ADR-012) — la prueba de que España no es una limitación sino una elección deliberada de beachhead (matriz de decisión ponderada, ADR-001), y que el mismo modelo sirve para Alemania, Canadá, u otra profesión regulada sin rediseño. Un inversionista de YC reconoce la diferencia entre "hicimos un sitio para España" y "diseñamos una plataforma y empezamos por España".
3. **El motor de explicación 100% trazable** (no un LLM aplicado a lo bruto) — en un momento donde "usamos IA" es casi un cliché sospechoso en cualquier pitch, mostrar deliberadamente que el sistema es determinista, auditable y sin caja negra es, contraintuitivamente, una señal de madurez técnica y de entendimiento profundo del dominio de confianza en el que se opera.
4. **La disciplina metodológica del Customer Discovery Sprint** (protocolo pre-registrado, criterios de decisión definidos antes de ver datos, búsqueda activa de evidencia refutante, separación piloto/estudio principal) — es una señal de calidad de founder poco común en etapa pre-semilla, y los inversionistas de YC la valoran más que una demo pulida sin sustancia detrás.
5. **Los datos de mercado ya reales** (no inventados): un colectivo organizado de ~30.000 médicos con expedientes de homologación atascados en España, esperas de hasta 6 años, evidencia de estafas con montos concretos — esto es TAM y urgencia con evidencia pública verificable, no una proyección optimista de founder.

## Qué expondría inmediatamente, bajo la primera pregunta de seguimiento, que todavía no hay nada

Un socio de YC hace una pregunta, no una revisión de arquitectura: **"¿con cuántos usuarios reales han hablado, y qué aprendieron?"** Hoy la respuesta honesta es: **cero entrevistas completadas** — el kit de descubrimiento está listo, la fase piloto de 3-5 contactos está decidida pero no ejecutada. Esto no es necesariamente descalificante en etapa pre-semilla (YC financia equipos sin tracción constantemente), **pero solo si se presenta con la misma honestidad rigurosa de este documento** — "no tenemos usuarios todavía, y así es exactamente como vamos a conseguir la primera evidencia, con este protocolo" es una respuesta que un socio de YC respeta. Presentar el producto como si ya estuviera validado, cuando no lo está, es la forma más rápida de perder credibilidad frente a alguien entrenado para detectar exactamente eso.

Otros huecos que una diligencia mínima expondría hoy:
- **Cero ingresos y cero hipótesis de monetización probada** — el modelo de referidos vetados (ADR-003) sigue siendo una idea, no algo con un solo euro real detrás.
- **Un solo destino con profundidad real** (España) — la extensibilidad es arquitectónica, no demostrada con un segundo país funcionando.
- **El "moat" de datos no existe todavía en términos de datos** — existe en términos de diseño (ADR-008, ADR-013). Un inversionista sofisticado distingue perfectamente entre "diseñamos para tener un foso" y "tenemos un foso" — no confundir ambas cosas en la conversación es más valioso que intentar que suenen igual.

## 4. La recomendación concreta

Mantener **dos superficies distintas, nunca mezcladas:**
1. **La beta para médicos reales** (este documento y `26`/`27`): sin Radar de Espera visible, sin fake doors, enfocada 100% en generar evidencia limpia sobre el problema y la propuesta central.
2. **Un material de founder/inversionista aparte** (no construido todavía — próximo paso natural si hay una conversación de este tipo en el horizonte cercano): que sí muestre explícitamente la visión del Radar de Espera como activo de red, la arquitectura multi-país, y el estado real y sin adornos del descubrimiento de usuarios — incluyendo los ceros, no ocultándolos.

La pregunta que el founder debe hacerse antes de cualquier conversación con inversionistas, con la misma honestidad de todo este proyecto: **¿ya tenemos evidencia real de usuarios para esa conversación, o estaríamos vendiendo la arquitectura de un foso en lugar del foso mismo?** Con el estado actual, sería lo segundo — y está bien, siempre que se sepa y se diga así.
