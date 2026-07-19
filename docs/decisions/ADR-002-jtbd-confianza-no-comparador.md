# ADR-002: El producto núcleo es confianza + navegación paso a paso, no comparación de países

## Estado
Aceptada — confirmada por el founder. Refinada por ADR-007: el núcleo no es un roadmap/comunidad genérico, sino específicamente el momento de espera post-solicitud.

## Contexto
El founder pidió explícitamente cuestionar si "comparar países" es el problema principal. La investigación de mercado y competencia muestra un patrón consistente en los 9 destinos: estafas activas (citas falsas, preguntas de examen robadas, cursos predatorios), comunidades fragmentadas sin hub confiable, y acusaciones de manipulación de datos oficiales. El problema recurrente y de mayor duración para el usuario no es decidir un país (una decisión que se resuelve en pocas sesiones), sino saber en quién confiar y qué hacer a continuación durante un proceso de 1 a 4+ años.

## Decisión
El producto núcleo de Medical Pathway es: (1) una base de conocimiento verificada con fuente y fecha por dato, (2) un rastreador de proceso paso a paso personalizado, (3) una comunidad verificada, y (4) un directorio curado de proveedores. La comparación de países ("radar") se mantiene como función de entrada/adquisición (SEO, primera impresión), no como el producto principal.

## Alternativas consideradas
- **Comparador de países como producto núcleo (propuesta original del founder):** rechazado — no genera retención recurrente (se usa una vez) y no ataca el problema de mayor dolor evidenciado (confianza/estafas), que es el que sostiene un modelo de suscripción a largo plazo.
- **Motor de recomendación con IA desde el MVP:** rechazado para esta fase — sin suficiente contenido verificado por destino todavía, automatizar recomendaciones a escala sería repetir el problema de desinformación con una capa de autoridad falsa (una IA que "suena segura" pero no tiene base sólida).

## Consecuencias
- Se gana: alineación del producto con el problema de mayor recurrencia/dolor, mejor ajuste con un modelo de suscripción (retención a lo largo de meses/años).
- Se sacrifica: mayor complejidad inicial de construcción (comunidad moderada, gestor documental, directorio vetado) frente a un comparador simple.
- Revisar si la métrica de retención del MVP (uso recurrente del checklist/roadmap, no solo visitas al radar) resulta baja — en ese caso, reconsiderar el peso relativo del comparador.
