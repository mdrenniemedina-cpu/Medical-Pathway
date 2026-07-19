# ADR-008: Datos agregados y anonimizados de tiempos de espera como activo defendible

## Estado
Aceptada

## Contexto
Tras identificar la espera de resolución como el momento de mayor dolor (ADR-007), se necesita un mecanismo de producto que lo resuelva de forma sostenible y defendible frente a copia por competidores. La investigación confirma que ninguna fuente oficial ni comunitaria existente agrega de forma sistemática y confiable los tiempos reales de resolución — la información hoy es anecdótica y dispersa en foros fragmentados.

## Decisión
Construir un mecanismo de reporte voluntario de metadatos no sensibles del expediente de cada usuario (fecha de envío, tipo de expediente/especialidad, comunidad autónoma, fecha y resultado de resolución si ya ocurrió), agregarlos de forma anónima, y publicar estimaciones (promedio, percentiles, proporción aún en espera) solo cuando el grupo agregado supera un umbral mínimo de registros (k-anonimato). Los registros individuales nunca se exponen a otros usuarios ni se muestran fuera de agregados.

## Alternativas consideradas
- **Depender solo de contenido editorial estático (plazos oficiales, noticias sobre el backlog):** rechazado — ya sabemos por la investigación que el plazo oficial no refleja la realidad, y el contenido estático no se actualiza con la velocidad suficiente ni tiene granularidad por comunidad autónoma/ventana de envío.
- **Exponer los reportes individuales sin agregación (estilo foro):** rechazado — es exactamente el modelo ya existente en Facebook/Telegram (fragmentado, no confiable, sin garantía de veracidad) y además expone datos personales sin necesidad.
- **Scraping o integración con sistemas oficiales del Ministerio:** rechazado en esta fase — no existe una API pública, y construir esto sería frágil y de alto riesgo legal/técnico; se reconsidera si en el futuro existe una vía oficial de datos.

## Consecuencias
- Se gana: un activo de datos propietario que ningún competidor puede replicar sin el mismo volumen de usuarios reportando activamente — un foso genuino basado en efecto de red, no en contenido estático.
- Se sacrifica: en los primeros meses, con poco volumen, las estimaciones pueden no ser lo bastante precisas o no superar el umbral de k-anonimato para muchos grupos — requiere gestionar expectativas del usuario mientras el dato madura (mostrar "aún no hay suficientes datos para tu grupo" en lugar de una cifra poco fiable).
- Revisar el umbral de k-anonimato y la granularidad de agrupación (por comunidad autónoma, por trimestre de envío, etc.) a medida que crece el volumen de datos — un umbral demasiado alto retrasa la utilidad percibida; uno demasiado bajo compromete la privacidad.
