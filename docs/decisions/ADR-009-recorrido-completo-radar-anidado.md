# ADR-009: El producto es el recorrido completo (5 etapas); el Radar de Espera se anida en la etapa de acompañamiento, no la reemplaza

## Estado
Aceptada — corrige el alcance de ADR-007 tras retroalimentación del founder.

## Contexto

ADR-007 concentró el MVP en un solo momento (la espera de resolución de homologación), tratando el descubrimiento/comparación de país como una tabla estática de entrada sin inversión de producto. El founder objetó: la visión no es un punto de dolor aislado, es la plataforma completa que acompaña a un médico desde "¿a dónde puedo ir?" hasta "¿qué sigue ahora?", con el Radar de Espera como una funcionalidad diferenciadora dentro de esa plataforma, no como el producto entero.

Al analizar esta objeción con honestidad, se identifican **dos razones tácticas concretas** (no solo de fidelidad a la visión original) por las que la objeción es correcta y ADR-007 tenía una debilidad real:

1. **Problema de embudo de adquisición.** Un usuario que ya decidió España y ya envió su solicitud de homologación es un segmento estrecho y tardío del embudo — para llegar a él, primero tiene que haber resuelto por su cuenta (sin ayuda del producto) las preguntas de descubrimiento y comparación, probablemente con la misma información fragmentada y poco confiable que el producto busca reemplazar. Un MVP que solo sirve a ese segmento no tiene un motor de adquisición propio de alcance amplio — depende de que el usuario llegue "ya resuelto" desde otro lado. El descubrimiento/comparación personalizado sí es una entrada de embudo genuina (mayor volumen e intención de búsqueda, contenido compartible, apela a estudiantes y médicos en etapas tempranas de decisión).
2. **Problema de arranque en frío de los propios datos del Radar de Espera.** El Radar de Espera necesita volumen de `SubmissionRecord` para ser útil (ver ADR-008). Ese volumen se consigue más rápido captando usuarios desde una etapa temprana del recorrido (descubrimiento) y acompañándolos hasta que llegan a la fase de espera, que esperando a que usuarios ya en fase de espera encuentren el producto por su cuenta. Es decir: **construir el recorrido completo no diluye el Radar de Espera — acelera las condiciones para que funcione.**

## Decisión

El producto se arquitectura como un recorrido de 5 etapas, cada una respondiendo una pregunta distinta del usuario:

1. **Descubrimiento** — "¿A dónde puedo ir?" — motor de coincidencia personalizado y transparente (no IA de caja negra) sobre los 9 destinos, según el perfil del usuario.
2. **Comparación personalizada** — "¿Cuál me conviene más entre mis opciones?" — comparación en profundidad del shortlist resultante de la etapa 1, con explicación de cada recomendación.
3. **Plan paso a paso** — "¿Qué tengo que hacer, y en qué orden?" — roadmap del destino elegido.
4. **Acompañamiento** — "¿Cómo llevo esto sin perderme ni ser estafado?" — comunidad, checklist, documentos, alertas, a lo largo de todo el plan.
5. **Radar de Espera** — "¿Cuánto voy a esperar, realmente?" — anidado dentro de la etapa 4, como funcionalidad diferenciadora específica del paso de homologación (y, en el futuro, de cualquier otro paso de espera de cualquier destino — ver arquitectura).

Se mantiene la disciplina de profundidad asimétrica por destino (ADR-001, ADR-005): España recibe contenido profundo en las etapas 3-5 (plan y acompañamiento reales, Radar de Espera activo); los otros 8 destinos reciben profundidad de "radar" (ya investigada y con fuente) en las etapas 1-2, y un plan genérico/ligero en la etapa 3, sin inversión de ingeniería adicional en esta fase.

## Alternativas consideradas

- **Mantener el MVP radar-only de ADR-007:** rechazado — la debilidad de embudo de adquisición y de arranque en frío de datos, expuestas arriba, son razones tácticas suficientes por sí solas, independientemente de la preferencia del founder por la visión original.
- **Construir profundidad completa (plan + acompañamiento + Radar de Espera equivalente) para los 9 destinos desde el MVP:** rechazado — recrearía el problema de información superficial que el producto busca resolver, y multiplicaría por 9 el esfuerzo editorial/de ingeniería sin evidencia de que el mercado lo justifique todavía (ver `research/05-beachhead-market-analysis.md`).

## Consecuencias

- Se gana: alineación con la visión original del founder, un motor de adquisición propio de alcance amplio, y una vía más rápida hacia el volumen de datos que el Radar de Espera necesita para ser útil.
- Se sacrifica: el MVP vuelve a tener más superficie de construcción que la versión radar-only — se mitiga con la profundidad asimétrica (España profundo, resto ligero reutilizando contenido ya investigado) y con una secuencia de construcción explícita (ver `03-mvp-definition.md` v3).
- Revisar si, una vez construido, el motor de descubrimiento/comparación no logra generar el volumen de adquisición esperado — en ese caso, reconsiderar si vale la pena mantenerlo con la misma prioridad frente a canales de adquisición más directos (comunidad, SEO de contenido editorial).
