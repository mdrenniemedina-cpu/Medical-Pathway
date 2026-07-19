# ADR-022: El motor de "qué te falta" recalcula el motor de reglas real, no aproxima

## Estado
Aceptada

## Contexto
El founder pidió, para el Sprint 1, que el producto explique no solo la mejor ruta y por qué, sino también qué le falta al usuario para acceder a otras rutas y qué acciones concretas aumentarían sus oportunidades — manteniendo la misma exigencia de trazabilidad completa que ya rige el motor de compatibilidad (ADR-002: nunca IA de caja negra).

## Decisión
`analizarBrechas()` (bounded context Descubrimiento) no implementa una lógica separada de "qué mejora qué" — para cada razón negativa que el perfil del usuario puede cambiar (hoy: `barrera_idioma`), construye un perfil hipotético con ese atributo modificado (p. ej., el idioma requerido añadido a los idiomas dominados) y **re-ejecuta literalmente `calcularPuntuaciones()`** con ese perfil hipotético. El "impacto estimado en puntos" es la diferencia real entre ambos resultados del mismo motor determinista, no una aproximación ni una segunda fórmula que podría desincronizarse de la primera.

Solo los criterios que dependen de un atributo del **perfil** (no del destino) generan una acción recomendada — `demanda_laboral`, `tiempo_espera` y `complejidad_regulatoria` son estructurales del destino y se muestran como contexto explicativo, pero no como "acciones" (no tiene sentido sugerirle al usuario "haz que España sea más rápida").

## Alternativas consideradas
- **Una tabla separada de "reglas de mejora" mantenida en paralelo a `ReglaCompatibilidad`:** rechazada — dos fuentes de verdad para el mismo cálculo inevitablemente divergen con el tiempo; recalcular con el motor real garantiza que "qué te falta" siempre sea consistente con "por qué" (son la misma función).
- **Estimar el impacto con una heurística simple (p. ej. "+15 puntos por aprender un idioma", fijo):** rechazada — perdería precisión y, más importante, dejaría de ser 100% trazable a las reglas configuradas (`peso` de `ReglaCompatibilidad`); si el equipo de producto ajusta un peso, la heurística fija quedaría desactualizada silenciosamente.
- **Generar las acciones con un modelo de lenguaje (redacción más natural, quizás más criterios cubiertos):** rechazada en esta etapa por el mismo principio que ADR-002/ADR-005 — introduciría una superficie no auditable justo en la funcionalidad que existe para aumentar la confianza del usuario.

## Consecuencias
- Se gana: "qué te falta" es literalmente tan trazable y auditable como la recomendación misma — no hay riesgo de que las dos narrativas (compatibilidad y brecha) se contradigan.
- Se sacrifica (limitación reconocida): con el conjunto de reglas actual, solo se pueden sugerir acciones sobre idioma — ampliar a más criterios accionables (certificaciones, experiencia, publicaciones) requiere primero que esos atributos tengan una regla de compatibilidad real, no es una limitación de este motor sino del conjunto de reglas del Sprint 1.
- Revisar cuando se añadan más `ReglaCompatibilidad` sobre atributos del perfil — el motor de brechas debería generalizarse (hoy tiene una rama de código específica para idioma) en vez de añadir una rama por criterio nuevo, si el número de criterios accionables crece.
