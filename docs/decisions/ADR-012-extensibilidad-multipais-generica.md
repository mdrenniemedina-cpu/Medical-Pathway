# ADR-012: Extensibilidad multi-país mediante datos genéricos y contrato de eventos, no código específico por destino

## Estado
Aceptada

## Contexto
El founder exigió explícitamente que la arquitectura no esté centrada únicamente en España, aunque España sea el beachhead, y que la plataforma pueda crecer a múltiples países, rutas, especialidades e idiomas sin rediseños importantes. El riesgo concreto a evitar: que el Radar de Espera, el motor de Descubrimiento o el modelo de Ruta del Médico terminen con lógica hardcodeada específica de España que obligue a reescritura al añadir Alemania u otro destino.

## Decisión
Ningún contexto del dominio referencia a "España" en su modelo — todos los contextos (Catálogo, Descubrimiento, Ruta del Médico, Radar de Espera) son genéricos sobre `destino_id`, `ruta_homologacion_id` y `tipo de etapa`. La extensión a un nuevo destino o a una nueva etapa de espera (p. ej. el Kenntnisprüfung en Alemania) es una operación de **carga de datos/contenido editorial**, no de escritura de código nuevo — ver el detalle completo en `12-estrategia-escalamiento-multipais.md`. El punto de integración más sensible (Ruta del Médico → Radar de Espera) se diseñó explícitamente como un evento genérico (`EntroAEtapaDeEspera`) desacoplado de cualquier destino concreto.

## Alternativas consideradas
- **Construir el Radar de Espera específicamente para el flujo de homologación español y generalizarlo después:** rechazado — la experiencia de este mismo proyecto (tener que rediseñar el alcance dos veces ya en la capa de producto) es evidencia suficiente de que diseñar genérico desde el principio, cuando el coste marginal de hacerlo es bajo (como en este caso, ya que el modelo genérico no es más complejo que uno hardcodeado a España), es preferible a rehacer el trabajo después.

## Consecuencias
- Se gana: expansión a nuevos destinos, rutas, especialidades o idiomas sin tocar el núcleo del sistema — solo contenido y datos.
- Se sacrifica: una capa mínima de indirección (todo se modela en términos de IDs y tipos genéricos en vez de nombres propios) que podría sentirse marginalmente menos directa de leer en el código para alguien que solo piensa en "España" — coste aceptado y menor.
- Revisar si, al añadir el segundo destino real (previsiblemente Alemania, según `research/05-beachhead-market-analysis.md`), aparece algún caso que el modelo genérico no cubra — sería la primera señal real de que esta decisión necesita ajuste.
