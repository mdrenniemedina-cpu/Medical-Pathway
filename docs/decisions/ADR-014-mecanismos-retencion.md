# ADR-014: Reciprocidad de datos y alertas basadas en eventos reales como mecanismos de retención, no gamificación genérica

## Estado
Aceptada

## Contexto
El founder pidió identificar explícitamente qué hará que un usuario vuelva a la plataforma durante un proceso que dura meses o años, más allá del uso puntual de un comparador o de consultas ocasionales a un roadmap. La respuesta debía ser coherente con el posicionamiento de confianza/claridad del producto (ver `decisions/ADR-002`), no una capa de gamificación superpuesta sin relación con el modelo de dominio.

## Decisión
Los mecanismos de retención se derivan directamente de invariantes y eventos ya definidos en el dominio (`05-domain-model-ddd.md`), no de mecánicas de juego añadidas aparte:
1. **Reciprocidad de datos:** el detalle completo de la cohorte del Radar de Espera solo se desbloquea si el usuario aportó su propio registro — alinea el incentivo individual con el activo de datos central del producto.
2. **Alertas basadas en eventos de dominio reales** (`CohorteRecalculada`, `RutaHomologacionActualizada`), nunca en calendario o recordatorios vacíos.
3. **Timeline narrativo** del recorrido completo del usuario.
4. **Reconocimiento en Comunidad** ligado a `ReputacionDeComunidad`, ya modelada en el dominio.

Ver `14-estrategia-retencion-engagement.md` para el detalle completo.

## Alternativas consideradas
- **Gamificación genérica (puntos, insignias, rachas sin relación con calidad de datos o progreso real):** rechazada — no encaja con una audiencia profesional médica ni con el posicionamiento de confianza del producto; el riesgo de que se perciba como manipulación barata es alto precisamente en un producto cuyo activo central es la confianza.
- **Notificaciones de alta frecuencia por defecto:** rechazada — el riesgo de spam percibido es directamente contrario a la construcción de confianza a largo plazo; se prefiere baja frecuencia con alta relevancia.

## Consecuencias
- Se gana: mecanismos de retención que refuerzan (en vez de competir con) el activo de datos y la confianza del producto.
- Se sacrifica: mecanismos de retención potencialmente más "pegajosos" a corto plazo (gamificación agresiva) a cambio de sostenibilidad de marca a largo plazo.
- Revisar si, una vez lanzado, la frecuencia de eventos reales (`CohorteRecalculada`, etc.) es suficiente para generar retención perceptible — si el volumen de datos tarda en madurar, la frecuencia de estas alertas será naturalmente baja al principio (riesgo ya identificado en `11-riesgos-tecnicos-mitigacion.md`, #1).
