# Estrategia de escalamiento: de España al resto del catálogo, sin rediseñar el núcleo

> España es el beachhead (ADR-001), no un supuesto arquitectónico. Este documento explica por qué el modelo de `05-domain-model-ddd.md` ya soporta múltiples países, rutas, especialidades e idiomas sin cambios estructurales — solo con más contenido y más datos.

## 1. Múltiples destinos: ya es un dato, no código

`Destino` y `RutaHomologacion` son agregados genéricos del contexto Catálogo — España no está hardcodeada en ninguna entidad ni tabla. Añadir Alemania como segundo destino de profundidad significa: cargar un nuevo `Destino` con sus `AtributoConFuente`, y una nueva `RutaHomologacion` con sus `EtapaRuta` (a partir del contenido ya investigado en `research/01`) — cero cambios de esquema, cero migraciones estructurales. Lo único que cambia es el volumen de trabajo **editorial**, no de ingeniería.

## 2. El motor de Descubrimiento ya es multi-destino por diseño

`ReglaDeCompatibilidad` relaciona atributos de perfil con atributos de destino de forma genérica y basada en datos (no en código específico por país). Añadir Alemania al ranking de compatibilidad no requiere nuevas reglas de código — como mucho, nuevas filas en `descubrimiento.regla_compatibilidad` si algún atributo nuevo de Alemania (p. ej. nivel de alemán requerido) no existía todavía como dimensión.

## 3. El Radar de Espera ya es genérico sobre "cualquier etapa de tipo espera"

Esta es la decisión de diseño más importante para la escalabilidad (ver `decisions/ADR-012`): `RegistroDeExpediente` se crea a partir del evento `EntroAEtapaDeEspera`, que no menciona España en ningún campo — menciona `destino_id`, `ruta_homologacion_id`, `region`, `ventana_envio`. Activar el Radar sobre la espera de cita del Kenntnisprüfung en Alemania, o sobre la espera de verificación de fuente (3+ meses) en Canadá, requiere únicamente:
1. Marcar la `EtapaRuta` correspondiente como `tipo = 'espera'` en el catálogo de ese destino.
2. Ruta del Médico ya emite el evento genérico automáticamente para cualquier etapa de ese tipo — sin código nuevo.
3. El motor de agregación de cohortes ya agrupa por `destino_id` — Alemania simplemente aparece como un nuevo valor, no como una nueva tabla ni una nueva vista.

## 4. Multi-especialidad

`FormacionAcademica.especialidad` y `TipoDeExpediente.especialidad` ya existen como campos desde el MVP (aunque en el MVP no se usen para segmentar cohortes de forma fina, por volumen insuficiente) — cuando el volumen lo justifique, basta con incluir `especialidad` como dimensión adicional de agrupación en la vista materializada de cohortes, sin cambiar el modelo.

## 5. Multi-idioma (i18n)

`catalogo.destino.locale_default` y el diseño de `AtributoConFuente`/contenido de `EtapaRuta` están pensados desde el MVP para eventualmente llevar una clave de idioma (aunque en el MVP solo se puebla en español). Evitar hardcodear textos en español directamente en columnas sin estructura de localización desde el inicio es lo que evita una migración dolorosa cuando se atienda, por ejemplo, a médicos brasileños en portugués.

## 6. Multi-tipo de usuario (más allá de medicina)

Deliberadamente, ningún agregado se llama `PerfilMedico`, `RutaMedica` ni similar — se llaman `PerfilInternacional` y `RutaHomologacion` (genéricos a "profesional regulado migrando credenciales"). Esto no significa construir hoy soporte para enfermería, odontología u otras profesiones (sería violar YAGNI y diluir el foco del beachhead) — significa que, si en el futuro se decide expandir a otras profesiones reguladas, el modelo de dominio no necesita renombrarse ni reestructurarse, solo poblarse con un nuevo conjunto de destinos/rutas/reglas para ese perfil profesional.

## 7. Qué SÍ requeriría revisión al escalar (honestidad sobre los límites de esta previsión)

- **Volumen de la vista materializada de cohortes:** con 9 destinos y varias dimensiones de segmentación, el recálculo periódico podría crecer en coste computacional — mitigación ya prevista en `11-riesgos-tecnicos-mitigacion.md` (réplica de lectura, extracción a servicio independiente si hace falta).
- **Complejidad editorial:** más destinos profundos significa más contenido que mantener verificado y actualizado — es una restricción de capacidad del equipo editorial, no de arquitectura, y es precisamente la razón por la que la expansión de profundidad se secuencia (ADR-001, criterio de salida del MVP) en vez de intentarse toda a la vez.
- **Reglas de compatibilidad más sofisticadas:** a medida que se añaden destinos y dimensiones, el conjunto de `ReglaDeCompatibilidad` puede volverse difícil de razonar manualmente — si esto ocurre, la evolución natural es herramientas de simulación/testing sobre el propio motor de reglas (siguen siendo reglas explicables, no un salto a IA de caja negra).
