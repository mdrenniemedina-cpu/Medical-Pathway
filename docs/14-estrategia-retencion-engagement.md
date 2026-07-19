# Estrategia de retención: ¿qué hará que un usuario vuelva mañana?

> Un proceso que dura meses o años no se sostiene con las visitas naturales de un comparador (una vez) o un roadmap (unas pocas veces). Este documento identifica, etapa por etapa, el mecanismo de retención específico — no gamificación genérica, sino valor continuo real ligado al modelo de dominio ya diseñado.

## Por qué el comparador y el roadmap, por sí solos, no retienen (y está bien que no lo hagan)

- **Descubrimiento** se consulta intensamente una vez (y ocasionalmente de nuevo si el perfil cambia de forma relevante) — es correcto que así sea, es una decisión, no un hábito. Su valor de retención es indirecto: si el perfil evoluciona (el usuario agrega un idioma, una publicación, cambia su presupuesto), **el resultado de compatibilidad cambia y el producto puede decírselo proactivamente** ("tu compatibilidad con Alemania subió a 62% porque agregaste tu nivel de alemán") — esto convierte al propio Perfil Internacional en un objeto vivo que vale la pena mantener actualizado, no un formulario de una sola vez.
- **Plan paso a paso** se consulta cada vez que se completa una etapa — frecuencia moderada, ligada a hitos reales, no diaria.
- **Radar de Espera** es, por diseño, el mecanismo de mayor frecuencia posible durante la fase más larga del recorrido — pero solo si se construyen los ganchos correctos alrededor de él (no basta con que exista, hay que darle razones activas para volver).

## Mecanismos concretos de retención

### 1. Reciprocidad de datos (el más importante, y coherente con el foso de datos)
El detalle completo de la vista de cohorte (`GET /radar-espera/mi-cohorte`) solo se desbloquea si el propio usuario ha aportado su `RegistroDeExpediente`. No es un muro de pago monetario — es un **muro de pago de datos**: "para ver cómo les va a otros como tú, cuéntanos cómo te va a ti primero". Esto alinea perfectamente el incentivo individual (obtener información valiosa) con el incentivo del producto (acumular el activo de datos que es el foso) y da una razón concreta y recurrente para volver a actualizar el propio registro.

### 2. Alertas basadas en cambios reales, no en calendario
Cuando la cohorte propia del usuario se recalcula con nueva información significativa ("tu cohorte tuvo 4 nuevas resoluciones esta semana; tu posición estimada pasó del percentil 40 al 52"), se dispara una notificación personalizada — solo ante cambios materiales, nunca como recordatorio vacío tipo "no olvides visitar la app". La disciplina de "solo notificar cuando hay señal real" protege la confianza a largo plazo (spam de notificaciones es exactamente lo que erosionaría la credibilidad que el producto busca construir).

### 3. Alertas regulatorias personalizadas
Cuando el contenido editorial de la `RutaHomologacion` de un destino se actualiza (`RutaHomologacionActualizada`), solo los usuarios con una `RutaPersonalizada` activa sobre esa ruta reciben la alerta — nunca una difusión masiva genérica. Es información que el usuario necesita para no perder tiempo/dinero en pasos desactualizados, lo cual es a la vez retención y la propuesta de valor central del producto.

### 4. Timeline narrativo del recorrido completo
Dado que el proceso dura meses o años, una vista de "línea de tiempo" que muestre hitos pasados (cuándo se descubrió el destino, cuándo se completó cada etapa) junto con la proyección futura (basada en la cohorte del Radar) le da al usuario una sensación de relación continua con el producto — una historia en progreso, no una herramienta aislada que se usa y se olvida.

### 5. Reconocimiento en Comunidad
Insignias de mentor verificado, reputación por respuestas útiles — motiva a quienes ya lograron su proceso a quedarse en la plataforma ayudando a otros en lugar de irse apenas alcanzan su objetivo (retención más allá del propio journey individual, relevante para la etapa "Continuar").

### 6. La etapa "Continuar" como extensión natural del ciclo de vida
El producto está diseñado para no terminar en la homologación: oportunidades laborales, alertas de siguiente especialización, continuidad profesional. Esto es, en sí mismo, una estrategia de retención a largo plazo — evita que el producto se perciba como una herramienta de un solo uso ("me ayudó a homologar, ya no lo necesito") y lo posiciona como acompañante de toda la carrera internacional, tal como es la visión original del founder.

## Qué se evita deliberadamente

- **Gamificación sin propósito** (puntos, insignias o rachas que no reflejen progreso real o calidad de datos) — no encaja con el posicionamiento de "confianza y claridad" que el producto busca; la comunidad médica es una audiencia profesional, no un juego casual.
- **Notificaciones de alta frecuencia sin señal real** — el riesgo de spam es directamente contrario al activo de confianza que sostiene todo el producto.
- **Retención basada en dependencia artificial** (p. ej. ocultar información básica detrás de fricciones innecesarias) — la reciprocidad de datos (mecanismo #1) es deliberadamente distinta de esto: pide un aporte genuino y proporcional (tu propio dato), no una fricción arbitraria.
