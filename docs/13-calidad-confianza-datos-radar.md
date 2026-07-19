# Calidad y confianza de los datos del Radar de Espera

> El Radar de Espera vale exactamente lo que valga la credibilidad de sus datos. Este documento detalla el sistema de validación, reputación, detección de anomalías, prevención de manipulación y verificación progresiva que sostiene esa credibilidad. Ver `decisions/ADR-013`.

## 1. Verificación progresiva (peso de entrada)

Cada `RegistroDeExpediente` hereda inicialmente una `ConfianzaDelDato` influida por el `NivelDeVerificacion` del perfil que lo reporta:

| Nivel de verificación del perfil | Peso inicial del reporte |
|---|---|
| Ninguno | 0.3 (cuenta, pero pesa poco) |
| CorreoProfesionalVerificado | 0.6 |
| TituloVerificado | 1.0 |

Esto no bloquea la participación de usuarios no verificados (sería elitista y reduciría el volumen que el Radar necesita) — simplemente hace que sus reportes influyan menos en el resultado agregado hasta que se verifiquen, incentivando la verificación progresiva de forma natural.

## 2. Consistencia a lo largo del tiempo (reputación acumulada)

Un usuario que crea un registro y **lo actualiza cuando su situación cambia realmente** (p. ej. reporta la fecha de resolución cuando ocurre, en vez de crear el registro y abandonarlo) acumula una reputación de reportante confiable, que incrementa el peso de sus futuros reportes. Se modela como un multiplicador simple sobre `ConfianzaDelDato`, no como un sistema de puntos gamificado — el objetivo es la señal de calidad, no la gamificación por sí misma.

## 3. Detección de anomalías

Reglas automáticas que marcan un registro como `marcado_anomalo` (excluido de las cohortes públicas hasta revisión) sin necesariamente notificar al usuario de forma acusatoria:

- **Imposibilidad lógica:** `fecha_resolucion` anterior a la ventana de envío, o posterior a la fecha actual.
- **Duplicación:** el mismo perfil con múltiples registros idénticos (ya prevenido por la invariante de unicidad, pero se audita igualmente por si se intenta sortear con cuentas distintas desde el mismo dispositivo/IP).
- **Outlier estadístico:** un tiempo reportado que se desvía más de N desviaciones estándar de la distribución actual de su cohorte — **se marca para revisión, no se elimina automáticamente**, porque un caso atípico legítimo (p. ej. un expediente realmente atascado 5 años, como documenta la investigación) es exactamente el tipo de información valiosa que el producto no debería censurar solo por ser inusual. La revisión la hace un `moderador` humano.
- **Ráfaga sospechosa:** múltiples registros nuevos con patrones casi idénticos en una ventana corta de tiempo (posible ataque coordinado para sesgar una cohorte) — dispara una alerta a `admin`, no un bloqueo automático inmediato (para evitar falsos positivos que dañen a usuarios legítimos).

## 4. Prevención de manipulación

- Un registro activo por perfil + destino + ruta (invariante de agregado, ya en el modelo de dominio).
- Límite de tasa de creación de cuentas nuevas por IP/dispositivo (protección básica anti-bot, capa de infraestructura, no de dominio).
- El umbral de k-anonimato (ADR-008) es, en sí mismo, una defensa contra manipulación dirigida: un atacante necesitaría crear muchos registros falsos y consistentes entre sí para mover una cohorte ya establecida, lo cual es progresivamente más difícil cuanto mayor es el volumen legítimo acumulado — el propio efecto de red del Radar es su mejor defensa a largo plazo.

## 5. Transparencia de la confianza hacia el usuario final

Ninguna estimación se muestra sin indicar cuán sólida es. La respuesta de `GET /radar-espera/mi-cohorte` (ver `07-api-contracts.md`) siempre incluye `nivel_confianza_estimacion` (`"alta" | "media" | "preliminar"`), calculado a partir de `n_registros` y la proporción de registros con `confianza_dato` alta dentro de esa cohorte. Un usuario nunca ve un número sin saber si está basado en 3 reportes de baja confianza o en 80 reportes verificados.

## 6. Auditoría editorial periódica

El equipo de producto revisa periódicamente (recomendado: mensual en los primeros meses, trimestral después) las cohortes con comportamiento estadístico inusual — el mismo tipo de revisión que un equipo de fraude aplicaría a transacciones atípicas, adaptado a datos de expedientes. Esto es trabajo humano deliberado, no automatizable de forma responsable en esta etapa (coherente con ADR-005: no automatizar decisiones de alto riesgo sin supervisión humana).

## 7. Qué NO se hace en el MVP (y por qué)

- **No se pondera con un modelo de machine learning entrenado para detectar fraude** — las reglas de anomalía son explícitas y auditables, coherente con la decisión general de no usar IA de caja negra en ninguna parte del producto en esta etapa (ADR-002, ADR-005).
- **No se expone el `ConfianzaDelDato` individual de otros usuarios** — es un dato interno del sistema, nunca una calificación pública tipo "reputación" visible entre usuarios (evitaría estigmatizar a alguien cuyo reporte fue, legítimamente, un caso atípico).
