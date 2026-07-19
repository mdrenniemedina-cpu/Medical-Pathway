# Modelo de dominio (Domain-Driven Design)

> Este documento antecede al esquema de base de datos y a los contratos de API — ambos se derivan de aquí, no al revés. Aplica DDD estratégico (bounded contexts, context map, clasificación core/supporting/generic) y táctico (agregados, entidades, value objects, invariantes, eventos de dominio).
>
> **Nota importante sobre las 4 preguntas del founder:** las etapas "Descubrir / Planificar / Acompañar / Continuar" son el lenguaje **del usuario**, no la estructura **del dominio**. Un bounded context no es una pantalla. Se muestra explícitamente, para cada contexto, a qué pregunta(s) del usuario sirve — pero los límites de contexto están definidos por reglas de negocio y consistencia transaccional, no por las pantallas del MVP (instrucción explícita del founder).

## 1. Lenguaje ubicuo (términos clave)

| Término | Significado |
|---|---|
| Perfil Internacional | La identidad profesional completa de un médico/estudiante, capturada una sola vez, que alimenta todo el resto de la plataforma. |
| Destino | Un país donde el usuario podría ejercer (9 en el catálogo inicial). |
| Ruta de Homologación (plantilla) | La secuencia editorialmente verificada de pasos para ejercer en un Destino — pertenece al catálogo, no a un usuario. |
| Ruta Personalizada / Expediente | La instancia de esa plantilla activada y adaptada para un usuario concreto — sus pasos, su progreso, sus documentos. |
| Etapa de Espera | Un paso de una Ruta Personalizada cuya naturaleza es "esperar una resolución externa" (p. ej. homologación en España) — es donde se activa el Radar de Espera. |
| Cohorte | Un grupo de expedientes con atributos comparables (destino, tipo, ventana de envío, región), usado para dar contexto estadístico a un usuario individual. |
| Compatibilidad | El resultado explicado (no solo un número) de comparar un Perfil Internacional contra un Destino. |
| Confianza del Dato | Un puntaje que pondera cuánto debe pesar un reporte individual en los agregados del Radar, para prevenir manipulación. |

## 2. Bounded contexts y clasificación estratégica

| Contexto | Clasificación | Pregunta(s) del usuario a la(s) que sirve |
|---|---|---|
| **Perfil Internacional** | Core (shared kernel) | Base para todas — "quién soy" |
| **Catálogo de Destinos y Rutas** | Supporting (contenido editorial) | Base de "Descubrir" y "Planificar" |
| **Descubrimiento y Compatibilidad** | **Core** (diferenciador) | "¿Cuál es el mejor país para mí?" |
| **Ruta del Médico** (plan personalizado + expediente) | Core/Supporting | "¿Qué tengo que hacer ahora?" / "¿Voy bien?" |
| **Radar de Espera** | **Core** (el mayor diferenciador, foso de datos) | "¿Voy bien?" (anidado dentro de Ruta del Médico) |
| **Comunidad** | Supporting | "¿Qué sigue?" |
| **Oportunidades y Continuidad Profesional** | Supporting | "¿Qué sigue?" |
| **Notificaciones y Alertas** | Generic (cross-cutting) | Todas — entrega personalizada |
| **Identidad y Acceso** | Generic | Infraestructura (login, no es "quién soy" profesionalmente) |

**Todos viven dentro del mismo monolito modular** (ADR-004, reafirmado en ADR-010) — DDD estratégico no implica microservicios. Cada bounded context es un módulo de código con su propio esquema de base de datos (namespacing por schema de Postgres) y su propio lenguaje interno; la comunicación entre contextos ocurre vía interfaces publicadas y eventos de dominio in-process, nunca leyendo directamente las tablas de otro contexto.

## 3. Context map

```
Identidad y Acceso ──(Customer)──▶ Perfil Internacional
                                        │ (Open Host Service: PerfilSnapshot,
                                        │  evento PerfilActualizado)
                    ┌───────────────────┼────────────────────┬─────────────┐
                    ▼                   ▼                    ▼             ▼
            Descubrimiento      Ruta del Médico        Notificaciones   Comunidad
                    │                   │
   Catálogo ──(OHS)─┤                   │
   de Destinos      │                   │
   y Rutas          ▼                   │
            (evento DestinoSeleccionado)│
                    └──────────────────▶│
                                        │ (evento EntroAEtapaDeEspera,
                                        │  vía Anti-Corruption Layer)
                                        ▼
                                Radar de Espera
                                        │ (OHS: estimaciones de cohorte)
                    ┌───────────────────┴────────────────┐
                    ▼                                     ▼
            Ruta del Médico (mostrar estimación)   Notificaciones (alertar cambios)

Oportunidades y Continuidad Profesional ◀──(Customer de Perfil y Catálogo)
```

**Patrones de relación (DDD context mapping):**
- **Perfil Internacional → todos los consumidores:** Open Host Service + Published Language (`PerfilSnapshot`). Perfil Internacional no conoce a sus consumidores — solo publica eventos y un snapshot de solo lectura. Esto evita que un cambio en Descubrimiento o Comunidad obligue a tocar el contexto de Perfil.
- **Catálogo de Destinos y Rutas → Descubrimiento, Ruta del Médico:** Open Host Service. El catálogo es propiedad exclusiva del equipo editorial; los consumidores nunca escriben en él.
- **Descubrimiento → Ruta del Médico:** Customer-Supplier vía evento de dominio `DestinoSeleccionado`. Cuando el usuario elige un destino de su resultado de Descubrimiento, Ruta del Médico reacciona instanciando una Ruta Personalizada — no hay llamada síncrona ni acoplamiento de modelos.
- **Ruta del Médico → Radar de Espera:** el más importante de mantener desacoplado. Se usa una **Anti-Corruption Layer**: Radar de Espera no conoce la estructura completa de una Ruta Personalizada (sus etapas, documentos, notas) — solo consume un evento reducido y estable (`EntroAEtapaDeEspera` con destino, tipo de expediente, región, ventana de envío) y traduce eso a su propio modelo (`RegistroDeExpediente`). Esto es lo que permite, más adelante, activar el mismo Radar sobre la etapa de espera del Kenntnisprüfung en Alemania o la verificación de fuente en Canadá sin tocar el modelo interno del Radar — solo se necesita que Ruta del Médico emita el mismo evento genérico desde una etapa distinta.
- **Identidad y Acceso → Perfil Internacional:** Customer. Una Cuenta (login) y un Perfil Internacional (identidad profesional) son agregados deliberadamente separados — ver ADR-011.
- **Notificaciones:** Conformist puro — se suscribe a los eventos de todos los demás contextos y no impone su modelo a nadie; es infraestructura de entrega, no lógica de negocio.

## 4. Perfil Internacional (bounded context)

### Aggregate root: `PerfilInternacional`
- Identidad propia (`perfil_id`), referenciando `account_id` (no fusionado con la Cuenta — ver ADR-011).
- **Value Objects:**
  - `FormacionAcademica` — universidad, país de graduación, año, tipo de título, especialidad.
  - `CompetenciaIdiomatica` — idioma + nivel (lista, ya que un perfil tiene varias).
  - `SituacionEconomica` — rango de presupuesto disponible, moneda.
  - `SituacionFamiliar` — movilidad, dependientes, restricciones geográficas.
  - `ObjetivosProfesionales` — prioridad (ingreso a largo plazo vs. rapidez de práctica), tolerancia a examen competitivo vs. ruta más lenta y segura, urgencia/tiempo disponible.
  - `NivelDeVerificacion` — enum `Ninguno | CorreoProfesionalVerificado | TituloVerificado`.
- **Invariantes:**
  - Debe existir al menos una `FormacionAcademica` para que Descubrimiento pueda calcular compatibilidad.
  - `NivelDeVerificacion` solo puede subir, nunca bajar automáticamente.
  - Cualquier cambio dispara `PerfilActualizado` — es el gatillo para que Descubrimiento recalcule compatibilidad y Notificaciones reconfigure alertas.
- **Domain Events:** `PerfilCreado`, `PerfilActualizado`, `NivelDeVerificacionElevado`.

Este es el **concepto central** que pidió el founder: se completa una vez, y cada cambio se propaga por evento a los contextos que lo consumen — no hay una segunda copia del perfil en ningún otro contexto.

## 5. Catálogo de Destinos y Rutas (contenido editorial)

### Aggregate root: `Destino`
- **Value Object central: `AtributoConFuente<T>`** — envuelve cualquier dato de hecho (tiempo típico, coste, barrera de idioma, demanda, dificultad, complejidad regulatoria) con `{valor: T, fuente_url, fecha_verificacion}`. Es imposible construir un `Destino` con un atributo sin fuente — la transparencia queda forzada por el tipo, no por convención (refuerza ADR-005).

### Aggregate root: `RutaHomologacion` (plantilla, pertenece a un `Destino`)
- Contiene `EtapaRuta` (entidades dentro del agregado): nombre, tipo (`Documental | Examen | Espera | Registro`), duración típica (`AtributoConFuente`), prerequisitos (otras etapas), `es_configurable_por_perfil` (bool).
- **Invariante:** no se puede publicar una `RutaHomologacion` si alguna `EtapaRuta` carece de fuente. Solo el rol `editor_contenido` puede modificarla.
- **Domain Events:** `RutaHomologacionPublicada`, `RutaHomologacionActualizada` (dispara recálculo en Descubrimiento y una alerta personalizada — vía Notificaciones — a todo usuario con una Ruta Personalizada activa sobre esa plantilla).

## 6. Descubrimiento y Compatibilidad

### Aggregate root: `ResultadoDeDescubrimiento`
- Se genera al ejecutar el motor de matching para un `PerfilSnapshot` en un momento dado.
- Contiene una lista de `PuntuacionDestino` (Value Object): `{destino_id, porcentaje_compatibilidad, razones: [Razon]}`.
- **Value Object `Razon`:** `{criterio, aporte_a_la_puntuacion, explicacion_legible}` — p. ej. `{criterio: "barrera_idioma", aporte: +25, explicacion: "Sin barrera de idioma: español ya es tu lengua materna"}`.
- **Invariante clave (obliga la filosofía del founder):** `PuntuacionDestino` no puede construirse sin al menos una `Razon` — el constructor lo rechaza. **No existe, a nivel de tipo, la posibilidad de mostrar un porcentaje sin explicación.** Esto es la traducción literal a código de "no quiero vender un comparador, quiero vender claridad".

### Entidad de configuración (no propiedad del usuario): `ReglaDeCompatibilidad`
- Reglas de puntuación versionadas, editables por el equipo de producto: `{atributo_perfil, atributo_destino, funcion_de_ajuste, peso}`. No es un modelo entrenado — es explícitamente auditable.
- Ejemplo de regla: *si* `idioma_requerido(destino) ∉ idiomas_dominados(perfil)` *entonces* penalizar `-X` puntos, con `X` proporcional a la brecha de nivel (ver `04-architecture.md` para el detalle algorítmico).

- **Domain Events:** `DescubrimientoCompletado` (snapshot de puntuaciones, para poder explicar después "por qué te recomendamos esto en su momento" incluso si las reglas cambian), `DestinoSeleccionado` (gatillo de integración hacia Ruta del Médico).

## 7. Ruta del Médico (plan personalizado + expediente)

### Aggregate root: `RutaPersonalizada`
- Vinculada a `perfil_id` + `destino_id`. Solo puede existir una activa por combinación (invariante — evita duplicar planes).
- Contiene `EtapaPersonalizada` (entidades): copiadas y **adaptadas** desde `EtapaRuta` de la plantilla al instanciarse — no es un puntero a la plantilla, es una copia personalizada (responde directamente al pedido de "no quiero checklists genéricos, quiero un camino personalizado"). La adaptación real: se omiten u opcionalizan etapas según el perfil (p. ej., si el usuario indica que no busca plaza pública, la etapa MIR pasa de obligatoria a opcional).
- Cada `EtapaPersonalizada`: estado (`Pendiente | EnCurso | Completada | Omitida`), fechas, `DocumentoAsociado[]` (Value Object: tipo, fecha de carga, vencimiento, referencia cifrada — el "gestor documental" vive aquí, no es un contexto separado).
- **Invariante:** no se puede marcar `Completada` una etapa cuyo prerequisito no esté `Completada`.
- **Domain Events:** `EtapaIniciada`, `EtapaCompletada`, y el más importante: **`EntroAEtapaDeEspera`** — se dispara cuando una `EtapaPersonalizada` de tipo `Espera` pasa a `EnCurso`. Es el único punto de integración hacia Radar de Espera, y está diseñado para ser genérico (no dice "España", dice "esta etapa es de tipo espera, para este destino, con estos atributos") — es la base de la extensibilidad multi-país (ver `12-estrategia-escalamiento-multipais.md`).

## 8. Radar de Espera

### Aggregate root: `RegistroDeExpediente`
- Propiedad exclusiva de un usuario (puede editarlo/eliminarlo), pero su función es alimentar agregados — **nunca se expone individualmente a otros usuarios.**
- Value Objects: `VentanaDeEnvio` (mes/trimestre, deliberadamente sin fecha exacta, por privacidad y para poder agrupar cohortes), `TipoDeExpediente` (destino + ruta + región + especialidad), `ResultadoDeResolucion` (pendiente/aprobado/subsanación/rechazado + fecha si ocurrió).
- **Invariante:** un usuario solo puede tener un `RegistroDeExpediente` activo por combinación destino+ruta (previene inflar el volumen artificialmente).

### Aggregate root separado: `CohorteDeComparacion`
- **No es propiedad de ningún usuario** — se deriva/recalcula periódicamente agrupando `RegistroDeExpediente` por destino + tipo de expediente + ventana de envío + región.
- Contiene `DistribucionDeTiempos` (Value Object): percentiles p25/p50/p75/p90 — **no solo un promedio**, respondiendo directamente al pedido del founder — más `ProporcionResuelta` (% ya resuelto) y la capacidad de calcular, on-demand, en qué percentil cae el registro propio de un usuario dentro de su cohorte (`PosicionAproximada`).
- **Invariante crítica (k-anonimato):** una `CohorteDeComparacion` no se publica/expone si el número de registros subyacentes es menor al umbral configurado (ADR-008). Sin excepciones, sin importar quién la consulte.

### Value Object: `ConfianzaDelDato`
- Cada `RegistroDeExpediente` recibe un puntaje calculado a partir del nivel de verificación del perfil que lo reporta, su consistencia con reportes anteriores del mismo usuario, y señales de anomalía (ver `13-calidad-confianza-datos-radar.md`). Los agregados **ponderan** cada registro por su `ConfianzaDelDato` en vez de contar todos por igual — es el mecanismo central de prevención de manipulación.

- **Domain Events:** `RegistroDeExpedienteCreado`, `RegistroDeExpedienteActualizado`, `AnomaliaDetectada`, `CohorteRecalculada`.

## 9. Comunidad

### Aggregate root: `HiloDeComunidad` (con `RespuestaDeComunidad` como entidades internas)
- Segmentado automáticamente por destino elegido y, para España, por ventana de envío — usando `PerfilSnapshot`/`RutaPersonalizada` como referencia de solo lectura, sin acoplar modelos.
- **Value Object: `ReputacionDeComunidad`** — deliberadamente **distinto** de `ConfianzaDelDato` del Radar, aunque ambos son "reputación": uno mide calidad de aportes/mentoría en un foro, el otro mide veracidad de un dato de expediente. Modelarlos por separado evita acoplar dos contextos con propósitos distintos solo porque el concepto "reputación" suena similar (error común de DDD: forzar un concepto compartido donde el lenguaje ubicuo de cada contexto es en realidad distinto).
- **Domain Events:** `HiloCreado`, `EstafaReportada` (dispara Notificaciones y, potencialmente, una entrada en el directorio de Oportunidades marcada como fraudulenta).

## 10. Oportunidades y Continuidad Profesional

### Aggregates: `Oportunidad` (vacante/programa) y `Proveedor` (directorio vetted)
- `Proveedor` tiene `EstadoDeVetting` (`NoRevisado | Verificado | ReportadoFraudulento`).
- Sirve la etapa "Continuar" — en el MVP solo se construye el directorio anti-estafa mínimo, pero el modelo queda definido para no requerir rediseño cuando se invierta en monetización por referidos u oportunidades laborales (Fase 2).

## 11. Notificaciones y Alertas

### Aggregates: `PreferenciaDeNotificacion` (por perfil) y `Alerta` (instancia enviada)
- Contexto genérico, puramente conformista: se suscribe a eventos de todos los demás contextos (`PerfilActualizado`, `RutaHomologacionActualizada`, `CohorteRecalculada`, `EstafaReportada`, etc.) y decide, cruzando el evento con `PreferenciaDeNotificacion` y el `PerfilSnapshot`, si generar una `Alerta` personalizada. No contiene lógica de negocio de otros dominios — responde directamente al pedido de "las alertas regulatorias también deben ser personalizadas, no quiero que todos reciban las mismas notificaciones".

## 12. Identidad y Acceso

### Aggregate root: `Cuenta`
- Email/password o SSO, roles (`usuario | mentor | moderador | editor_contenido | admin`), sesiones.
- Deliberadamente separado de `PerfilInternacional` — ver ADR-011 para la justificación completa.

## 13. Resumen de invariantes que "fuerzan" la filosofía del producto a nivel de dominio

| Regla de negocio | Dónde vive | Qué principio del founder protege |
|---|---|---|
| `AtributoConFuente` no puede construirse sin `fuente_url` + `fecha_verificacion` | Catálogo de Destinos y Rutas | Transparencia, no desinformación |
| `PuntuacionDestino` no puede construirse sin al menos una `Razon` | Descubrimiento | "No quiero vender un comparador, quiero vender claridad" |
| `EtapaPersonalizada` se instancia adaptada al perfil, no como copia genérica de la plantilla | Ruta del Médico | "No quiero checklists genéricos, quiero un camino personalizado" |
| `CohorteDeComparacion` no se publica bajo el umbral de k-anonimato | Radar de Espera | Privacidad como condición de confianza del activo de datos |
| Los agregados del Radar ponderan por `ConfianzaDelDato`, no cuentan todo por igual | Radar de Espera | Credibilidad del dato frente a manipulación |
| `Alerta` se genera cruzando el evento con `PreferenciaDeNotificacion` + `PerfilSnapshot` | Notificaciones | Personalización real, no notificaciones masivas idénticas |

Ver `decisions/ADR-010` a `ADR-013` para el razonamiento detrás de las decisiones estructurales de este modelo.
