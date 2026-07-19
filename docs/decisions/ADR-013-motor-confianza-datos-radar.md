# ADR-013: Motor de confianza de datos ponderado, no conteo simple, para el Radar de Espera

## Estado
Aceptada

## Contexto
El founder identificó que el Radar de Espera será uno de los activos más valiosos del producto, y que su valor depende completamente de la credibilidad de los datos que recopila — pidiendo explícitamente mecanismos de validación, reputación, detección de anomalías, prevención de manipulación y verificación progresiva. Tratar todos los reportes por igual (conteo simple) expondría el activo central del producto a manipulación con relativamente poco esfuerzo (un actor con incentivo — una agencia, un competidor — podría crear varios reportes falsos).

## Decisión
Cada `RegistroDeExpediente` lleva un `ConfianzaDelDato` calculado a partir de la verificación del perfil, su consistencia histórica y señales de anomalía; los agregados de cohorte se calculan excluyendo registros marcados como anómalos y (evolución post-MVP) ponderando por esta confianza en vez de contar cada reporte por igual. Ver el detalle completo del sistema en `13-calidad-confianza-datos-radar.md`.

## Alternativas consideradas
- **Conteo simple sin ponderación (todos los reportes valen igual):** rechazado — es la opción más simple de construir pero la más vulnerable a manipulación, precisamente sobre el activo que el founder identificó como el más valioso a proteger.
- **Verificación obligatoria antes de poder reportar (bloquear en vez de ponderar):** rechazado — reduciría el volumen de reportes (el recurso más escaso y valioso del Radar en sus primeros meses) de forma desproporcionada; ponderar en vez de bloquear permite capturar señal de usuarios no verificados sin que domine el resultado agregado.
- **Detección de fraude vía modelo de machine learning entrenado:** rechazada en esta etapa — mismo principio que ADR-005/ADR-002: no introducir automatización de caja negra en decisiones de alto impacto sin suficiente historial de datos verificados para entrenarla responsablemente; las reglas de anomalía son explícitas y auditables.

## Consecuencias
- Se gana: un activo de datos resistente a manipulación básica desde el primer día, con reglas explicables y auditables.
- Se sacrifica: complejidad adicional en el cálculo de agregados (ponderación en vez de promedio/conteo simple) y necesidad de trabajo editorial/de moderación humana continuo para revisar anomalías marcadas.
- Revisar el umbral y las reglas de anomalía a medida que crece el volumen real de datos — reglas calibradas para bajo volumen inicial pueden necesitar ajuste cuando el Radar madure.
