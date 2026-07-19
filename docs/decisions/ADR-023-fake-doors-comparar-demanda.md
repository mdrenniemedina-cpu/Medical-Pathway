# ADR-023: Fake doors para medir demanda comparativa de Comunidad y Radar de Espera antes de construirlos

## Estado
Aceptada

## Contexto
El founder cerró el encargo del Sprint 1 con una advertencia estratégica explícita: no enamorarse del motor de recomendación — el valor real del producto podría estar en la confianza, la comunidad, o el activo de datos del Radar de Espera, y el Sprint 1 debe diseñarse para descubrir dónde está el valor, no para asumirlo. Comunidad y Radar de Espera existen hoy solo como esqueletos (Sprint 0) — construirlos en profundidad antes de tener señal de demanda sería exactamente el error que el founder pidió evitar.

## Decisión
Se añaden dos "fake doors" (llamadas a la acción que capturan intención sin que la funcionalidad completa exista) en el frontend del Sprint 1: en la proyección de futuro, un CTA de Comunidad ("¿quieres hablar con alguien que ya vivió este proceso?") y, en la etapa de espera de esa misma proyección, un CTA de Radar de Espera ("quiero saber cuánto están tardando otros médicos como yo"). Cada clic se registra como evento de analítica (`interes_comunidad_expresado`, `interes_radar_expresado`) — comparable directamente, en volumen, con el engagement del motor de descubrimiento (`destino_explorado`, `acciones_recomendadas_vistas`). Ver H5 en `docs/16-hipotesis-sprint-1.md`.

## Alternativas consideradas
- **No instrumentar nada de esto en el Sprint 1 y decidir en Sprint 2 basándose en intuición:** rechazado — es exactamente lo que el founder pidió no hacer ("no te enamores del motor de recomendación... diseña el Sprint 1 para descubrir eso cuanto antes, en lugar de asumirlo").
- **Construir una versión mínima real de Comunidad y Radar de Espera en el Sprint 1 en vez de un fake door:** rechazado — contradice la instrucción explícita del founder de que el objetivo del Sprint 1 es "validar la propuesta de valor, no construir": una funcionalidad completa antes de saber si hay demanda es una inversión de ingeniería no justificada todavía.
- **Encuestas cualitativas en vez de fake doors:** no descartada, mencionada como complemento en `docs/17-informe-sprint-1.md` — pero un fake door mide *comportamiento real* (¿hace clic o no?), que es una señal más fuerte que una respuesta declarada en una encuesta.

## Consecuencias
- Se gana: una comparación de demanda entre los tres posibles centros de valor (motor de descubrimiento, comunidad, datos exclusivos) con costo de construcción mínimo — dos botones y dos eventos, no dos funcionalidades completas.
- Se sacrifica: los fake doors, por diseño, generan una pequeña decepción ("todavía no existe esta funcionalidad") — aceptable en un prototipo de validación explícitamente presentado como tal, inaceptable si se usara esta técnica en un producto ya lanzado a usuarios pagantes sin dejarlo claro.
- **Esto no reemplaza la necesidad de exponer el producto a usuarios reales** — ver la advertencia de honestidad en `docs/16-hipotesis-sprint-1.md`: sin usuarios reales, ni siquiera un fake door genera una señal interpretable todavía.
