# Product Iteration V2 — De "¿qué país es mejor?" a "¿cuál es mi mejor siguiente paso?"

> **Estado: documento de planificación. Nada de esto está implementado.** Por instrucción explícita del founder, esta iteración se detiene aquí hasta recibir aprobación fase por fase. Complementa (no reemplaza) `docs/30-propuesta-rediseno-onboarding-resultados.md` — este documento es la versión ejecutable, con auditoría de código real, archivos concretos a tocar, y plan de fases.

---

## 1. Problemas detectados en la experiencia actual (auditoría real del código, no supuestos)

Verificado leyendo el código en vivo (`src/bounded-contexts/*/domain`, `public/*.html`), no descrito de memoria:

1. **El onboarding empieza exactamente por lo que el nuevo enfoque prohíbe.** `public/onboarding.html` paso 1 pregunta primero *Universidad*, *País de graduación* y *Tipo de título* (`onboarding.html:16-26`) — es lo primero que ve el usuario tras registrarse. No existe ningún campo de "etapa actual" ni "objetivo principal" ni "preocupación principal" en el dominio (`PerfilInternacionalProps`, `perfil-internacional.aggregate.ts:14-22`) ni en la UI.
2. **El porcentaje es el protagonista visual del resultado.** `public/resultados.html` renderiza cada tarjeta con `pct-grande` (el número, en grande) como elemento central (`resultados.html` `renderPuntuacion`) — no existe ninguna clasificación verbal ni antes ni después del número.
3. **No existe el concepto de "información insuficiente".** `Destino` (`destino.aggregate.ts`) exige todos sus atributos como `AtributoConFuente` obligatorios — no hay forma hoy de representar un país con datos parciales sin inventar una fuente falsa. El motor (`motor-compatibilidad.service.ts:38-108`) siempre devuelve un porcentaje para cada destino que exista en el catálogo; no hay ninguna rama de "no calcular".
4. **El motor de compatibilidad opera sobre "Destino" (país), no sobre "Ruta" (carrera dentro de un país).** `DestinoParaComparar` (`motor-compatibilidad.service.ts:16-24`) mezcla atributos de país (idioma, demanda) con atributos que en realidad pertenecen a una ruta profesional específica (tiempo típico, complejidad regulatoria) — hoy un país = una sola "ruta implícita". El agregado `RutaHomologacion` ya existe separado de `Destino` (`ruta-homologacion.aggregate.ts`) y ya soporta múltiples rutas por `destinoId` a nivel de dato, **pero el motor de puntuación nunca las usa** — calcula compatibilidad por país, no por ruta.
5. **El análisis de brechas solo sabe sugerir una cosa: idioma.** Documentado honestamente en el propio código (`analizador-brechas.service.ts:20-27`): *"el único criterio que el usuario puede cambiar activamente es el idioma... esto limita hoy el motor de brechas a sugerencias de idioma"*. No hay forma hoy de sugerir "termina tu servicio social" o "ahorra X" como "mejor siguiente paso" porque esos criterios no existen en `CRITERIOS_ACCIONABLES_POR_PERFIL` (`motor-compatibilidad.service.ts:27`).
6. **No se captura presupuesto ni tiempo disponible en la UI**, aunque el dominio ya tiene un VO `SituacionEconomica` sin usar en el onboarding actual (`perfil-internacional.aggregate.ts:114-116`, campo opcional nunca poblado por `onboarding.html`).
7. **La línea de tiempo (`proyeccion.html`) no tiene costo por etapa, ni documentos requeridos, ni estado del usuario.** `EtapaRuta` (`etapa-ruta.entity.ts`) tiene `duracionTipicaDias` (con fuente), `tipo`, `esConfigurablePorPerfil`, `prerequisitoEtapaId` — soporta ya "obligatorio/opcional" (vía el flag `esOpcional` calculado en `proyeccion-view.ts`) y dependencias (`prerequisitoEtapaId`), pero **no tiene costo estimado por etapa** ni "documentos requeridos" ni ningún concepto de progreso del usuario (pendiente/en proceso/completado) — eso pertenece al bounded context **Ruta del Médico**, hoy solo parcialmente implementado (un único evento `EntroAEtapaDeEspera`).
8. **Solo hay 2 destinos reales cargados** (España, Alemania — `db/seed/seed.ts`), ambos con datos completos. No hay ningún ejemplo hoy de un país con datos incompletos, así que el estado "Información insuficiente" nunca se ha probado ni siquiera manualmente.
9. **El lenguaje técnico que el founder quiere eliminar no aparece en la UI actual** (no se usa "score", "IA" ni "caja negra" en las pantallas) — este punto del brief es más una regla preventiva a futuro que una corrección de algo roto hoy.
10. **El progreso del onboarding usa una barra `<progress>` genérica** (`onboarding.html:12`, `value="1" max="3"`) basada en pasos del formulario, no en requisitos cumplidos — consistente con lo que el brief pide evitar ("no usar una barra de progreso arbitraria").

## 2. Elementos que deben conservarse (ya funcionan y están validados)

- El **motor de reglas determinista y auditable** (`ReglaCompatibilidad` + `calcularPuntuaciones`) — base sólida, no se reescribe, se **extiende**.
- El **patrón de `AtributoConFuente`** (todo dato con fuente + fecha de verificación) — es exactamente la disciplina que el brief pide mantener ("no inventar datos", "fuentes oficiales").
- El **motor de brechas re-ejecutando el mismo motor con un perfil hipotético** (`analizador-brechas.service.ts`) — el patrón es correcto, solo hay que ampliar qué criterios puede probar.
- El **Perfil Internacional como concepto central único**, poblado por eventos, sin segundas copias — se extiende con nuevos campos, no se reemplaza.
- La **separación `RutaHomologacion` / `Destino`** ya existe a nivel de agregados — es la base para "Rutas, no solo países" (punto 6 del brief); lo que falta es que el motor de compatibilidad la use.
- El **flujo Landing → Registro → Perfil → Compatibilidad → Explicación → Iniciar Ruta** y su instrumentación de analítica (Sprint 1) — se mantiene como esqueleto, cambia el contenido de cada pantalla, no el recorrido.
- La **línea de tiempo con `esOpcional`, `prerequisitoEtapaId` y fuente por etapa** — se extiende, no se rehace.
- El **sistema de diseño actual** (`public/styles.css`) y el aviso de beta — se mantienen y refinan (jerarquía, espaciado), sin degradados/ilustraciones/banderas per la regla explícita del brief.

## 3. Elementos que deben modificarse

Ver detalle fase por fase en la sección 8. Resumen:
- Onboarding: reordenar preguntas, agregar etapa/objetivo/preocupación antes de los datos técnicos.
- Presentación del resultado: clasificación verbal antes del porcentaje.
- Explicación: agregar cumplidos/pendientes/barreras/qué-cambiaría, y "Tu mejor siguiente paso".
- Modelo de datos: `Destino` necesita poder representar "insuficiente"; el motor necesita operar sobre `Ruta` en vez de (o además de) `Destino`.
- Analizador de brechas: ampliar criterios accionables más allá de idioma.
- Línea de tiempo: agregar costo por etapa y estado del usuario (requiere Ruta del Médico).

## 4. Flujo propuesto de usuario

```
Landing → Registro
  → Onboarding (NUEVO ORDEN):
      1. ¿Dónde te encuentras en tu camino? (etapa profesional)
      2. ¿Qué te gustaría lograr? (objetivo)
      3. ¿Qué te preocupa más? (preocupación — nueva señal cualitativa)
      4. Formación académica (universidad/país/año — como hoy, pero después, no primero)
      5. Idiomas
      6. Presupuesto disponible (nuevo)
      7. Tiempo disponible (nuevo — hoy existe "urgencia" pero no es lo mismo)
  → Resultado (por RUTA, no por país):
      Clasificación verbal + % secundario trazable
  → Explicación:
      Por qué esta posición / cumplidos / pendientes / barreras / qué cambiaría
  → Tu mejor siguiente paso (NUEVO, sección propia):
      Una acción prioritaria, por qué, qué desbloquea, cuánto cambia, cuándo
  → Línea de tiempo mejorada (costo, documentos, dependencias, estado)
  → (Fase 6, no antes) Comparador de hasta 3 rutas
```

## 5. Cambios de contenido

- Reemplazar "score"/porcentaje-como-titular por las 6 etiquetas verbales del brief (`Encaja muy bien` → `Información insuficiente`).
- Reescribir cada `explicacionLegible` de `Razon` para que se pueda componer en la frase-resumen tipo "España aparece como tu mejor opción actual porque..." (hoy son fragmentos tipo lista, no una narrativa).
- Vocabulario: auditar todo `public/*.html` y `docs/*` de cara al usuario para confirmar que no aparecen las palabras prohibidas (no aparecen hoy, pero se añade como regla de revisión, no solo de redacción).

## 6. Cambios de modelo de datos (impacto real, no cosmético)

| Cambio | Agregado/VO afectado | Tipo de cambio |
|---|---|---|
| Nuevo campo `etapaActual` (enum: estudiante, interno, servicio social, médico general, residente, especialista, investigador, otro) | `PerfilInternacional` | Nuevo VO + campo en `PerfilInternacionalProps` |
| Nuevo campo `objetivoPrincipal` (enum ampliado — hoy `ObjetivosProfesionales` solo tiene urgencia/tolerancia/prioridad, no "qué quiere lograr") | `PerfilInternacional` | Extender `ObjetivosProfesionales` VO o crear uno nuevo |
| Nuevo campo `preocupacionPrincipal` | `PerfilInternacional` | Nuevo VO |
| Poblar `SituacionEconomica` desde el onboarding (ya existe el VO, no se usa) | `PerfilInternacional` | Solo UI + use-case, el dominio ya lo soporta |
| Nuevo campo `tiempoDisponible` | `PerfilInternacional` | Nuevo VO (distinto de `urgencia`, que es percepción, no disponibilidad real) |
| Estado de datos por destino/ruta: `completo` \| `insuficiente` | `Destino` y/o `RutaHomologacion` | Requiere hacer campos de `AtributoConFuente` opcionales o añadir un estado explícito — **cambio de invariante**, requiere migración reversible |
| `RutaProfesional` como concepto explícito (ejercicio general, especialidad, investigación, maestría...) separado de `RutaHomologacion` (que hoy es solo "homologación") | Catálogo | Nuevo agregado o generalización de `RutaHomologacion` a `Ruta` con un campo `tipoRuta` |
| Costo estimado por etapa | `EtapaRuta` | Nuevo `AtributoConFuente<{valor, moneda}>`, igual patrón que `costeTipico` de `Destino` |
| Documentos requeridos por etapa | `EtapaRuta` | Nuevo campo `documentosRequeridos: string[]` |
| Estado del usuario por etapa (pendiente/en proceso/completado) | **Ruta del Médico** (no Catálogo) | Bounded context hoy parcial — este es el trabajo más grande del plan, ver riesgos |

**Todas las migraciones deben ser reversibles y no deben borrar los 2 destinos/rutas actuales** (regla explícita del founder) — se implementan como columnas nuevas nullable + backfill, nunca como `DROP`.

## 7. Cambios necesarios en el motor de compatibilidad

1. **Cambiar la unidad de análisis de `Destino` a `Ruta`.** `DestinoParaComparar` debe convertirse en (o coexistir con) `RutaParaComparar`, que incluya `destinoId`, `tipoRuta`, y los atributos que hoy están en `Destino` pero en realidad varían por ruta (tiempo típico, complejidad). Esto es un cambio de firma en `calcularPuntuaciones` — **no rompe las reglas existentes** (siguen siendo pares atributoPerfil/atributoDestino con peso), pero sí el traductor ACL (`catalogo-acl.ts`) que arma `DestinoParaComparar` hoy.
2. **Rama de "información insuficiente".** Antes de calcular, verificar si la ruta tiene todos los atributos críticos con fuente; si no, devolver una `PuntuacionDestino` (o su sucesor `PuntuacionRuta`) marcada explícitamente como sin-porcentaje, en vez de forzar un cálculo con datos faltantes.
3. **Capa de clasificación verbal**, pura y separada del cálculo numérico: una función `clasificar(porcentaje, tieneInsuficiencia): Clasificacion` que mapea a las 6 etiquetas — no toca `calcularPuntuaciones`, se agrega encima.
4. **Ampliar `CRITERIOS_ACCIONABLES_POR_PERFIL`** más allá de `barrera_idioma` — cada criterio nuevo (experiencia clínica, ahorro, apostilla) necesita su propia rama en `calcularPuntuaciones` (hoy el cálculo por criterio está hardcodeado en la función, no es 100% data-driven) **y** su rama correspondiente en `analizarBrechas` para poder re-simular el perfil hipotético.
5. **"Tu mejor siguiente paso"** = tomar la salida ya ordenada de `analizarBrechas` (ya ordena por `impactoEstimadoPuntos` descendente) y exponer solo el primer elemento con una presentación dedicada — cambio de UI/vista, no de motor, una vez que el punto 4 exista.

## 8. Plan de implementación por fases (orden del founder, con tareas concretas)

### Fase 1 — Onboarding reordenado (motor actual intacto)
- [ ] Nuevo VO `EtapaProfesional` + campo en `PerfilInternacional` + migración nullable + endpoint `PUT /perfil/me/etapa-profesional`.
- [ ] Nuevo VO/extensión para `objetivoPrincipal` + endpoint equivalente.
- [ ] Nuevo VO `PreocupacionPrincipal` (puramente informativo/analítico al inicio — no alimenta el motor todavía) + endpoint.
- [ ] Reordenar `public/onboarding.html`: 3 pantallas nuevas primero, luego formación/idiomas/objetivos como hoy.
- [ ] Eventos analíticos nuevos: `etapa_profesional_seleccionada`, `objetivo_principal_seleccionado`, `preocupacion_principal_seleccionada` (dato valioso para las entrevistas, ver `docs/product-learning-journal.md`).
- **Archivos:** `src/bounded-contexts/perfil-internacional/domain/value-objects/*.vo.ts` (nuevos), `perfil-internacional.aggregate.ts`, `perfil.repository.port.ts` + su implementación SQL, controller de Perfil, `db/migrations/00XX-*.sql`, `public/onboarding.html`.
- **Criterio de aceptación:** un usuario nuevo completa el onboarding en el nuevo orden; el motor de compatibilidad sigue devolviendo exactamente los mismos porcentajes que antes para el mismo perfil (los 3 campos nuevos todavía no alimentan `calcularPuntuaciones`); `test:all` sigue en verde; smoke test actualizado al nuevo orden de pantallas.

### Fase 2 — Presentación del resultado y "mejor siguiente paso" (con los criterios actuales, solo idioma)
- [ ] Función pura `clasificar()` (nueva, en `descubrimiento/domain/servicios/`), con sus propias pruebas unitarias (umbrales exactos a definir con el founder antes de codificar).
- [ ] `resultados.html`: clasificación verbal como titular, porcentaje como dato secundario.
- [ ] `explicacion.html`: sección "Tu mejor siguiente paso" mostrando el primer elemento de `analizarBrechas` con la presentación pedida (por qué prioritario, qué desbloquea, cuánto cambia, cuándo).
- [ ] Reescribir plantillas de `explicacionLegible` para permitir la frase-resumen narrativa.
- **Archivos:** nuevo `clasificacion.service.ts`, `resultado-view.ts` (agregar campo `clasificacion`), `resultados.html`, `explicacion.html`.
- **Criterio de aceptación:** cada destino muestra una de las 6 etiquetas antes del %; "Tu mejor siguiente paso" no aparece si `analizarBrechas` no devuelve ninguna acción (nunca inventar una); pruebas unitarias de `clasificar()` cubren los 6 casos incluyendo el límite "información insuficiente".

### Fase 3 — Separar países y rutas profesionales
- [ ] Generalizar `RutaHomologacion` a un concepto `Ruta` con `tipoRuta` (ejercicio general, especialidad, investigación, maestría, doctorado, trabajo no clínico, salud pública) — **decisión de diseño a validar con el founder antes de codificar:** ¿se renombra el agregado existente o se crea uno nuevo en paralelo? Recomendación: renombrar con migración de datos, no duplicar concepto.
- [ ] `RutaParaComparar` reemplaza (o extiende) `DestinoParaComparar` en el motor — cambio de firma controlado, con pruebas de regresión que confirmen que España/Alemania siguen puntuando igual bajo el modelo nuevo.
- [ ] Estado explícito de "datos insuficientes" a nivel de `Ruta` — campo `estadoDatos: 'completo' | 'insuficiente'`, nunca inferido.
- **Archivos:** `catalogo/domain/ruta-homologacion.aggregate.ts` (o su sucesor), `catalogo-acl.ts`, `motor-compatibilidad.service.ts`, migraciones SQL reversibles, seed actualizado (sin inventar datos de las rutas nuevas — quedan como "insuficiente" hasta tener fuente real).
- **Criterio de aceptación:** España y Alemania producen las mismas puntuaciones que antes de la migración (prueba de regresión obligatoria); ningún país/ruta nuevo muestra porcentaje sin fuente.

### Fase 4 — Preparar carga de más países (sin publicar datos no verificados)
- [ ] Crear registros `Destino`/`Ruta` en estado `insuficiente` para Reino Unido, Chile, México, Portugal, Irlanda, Australia, Nueva Zelanda, Canadá, EAU, Arabia Saudita — **sin ningún atributo numérico inventado**, solo el registro con el estado "en proceso de verificación".
- [ ] UI: `resultados.html` muestra esas rutas con el mensaje de insuficiencia, nunca con porcentaje.
- **Criterio de aceptación:** ningún dato regulatorio de estos 10 países aparece en el código o el seed sin una fuente real citada — si no hay fuente real todavía, el campo no existe, solo el estado "insuficiente".

### Fase 5 — Perfil Internacional enriquecido + línea de tiempo mejorada
- [ ] Vista de "Perfil Internacional" (nueva pantalla) mostrando etapa/objetivo/idiomas/experiencia/presupuesto/tiempo/requisitos cumplidos-pendientes/rutas desbloqueadas.
- [ ] Progreso basado en requisitos concretos completados, no en una barra arbitraria.
- [ ] `EtapaRuta`: agregar costo estimado (`AtributoConFuente`) y documentos requeridos.
- [ ] Estado del usuario por etapa (pendiente/en proceso/completado) — **este ítem depende de expandir el bounded context Ruta del Médico**, hoy solo parcial (ver riesgos, sección 9).
- **Criterio de aceptación:** ningún paso de la línea de tiempo se muestra sin fuente y fecha de verificación (regla ya existente, se preserva); el estado por etapa persiste entre sesiones del mismo usuario.

### Fase 6 — Comparador de hasta 3 rutas
- [ ] Solo después de que el modelo de Ruta (Fase 3) y el estado de datos (Fase 4) estén asentados con datos reales de al menos 3-4 rutas completas.
- **Criterio de aceptación explícito del founder ya cumplido por diseño:** no se implementa esta vista hasta que el modelo de datos esté listo — este plan lo respeta poniéndola al final.

## 9. Riesgos de introducir cambios sin suficientes datos

1. **El riesgo más grande no es técnico, es de secuencia:** ya existe una decisión activa y sin ejecutar de suspender desarrollo de producto hasta tener evidencia real de entrevistas (`docs/product-learning-journal.md`, Entrada 0 — cero entrevistas reales a la fecha). Construir las Fases 1-6 sin esa evidencia corre el riesgo exacto que el propio founder identificó semanas atrás: enamorarse de una solución sin validar que el problema reformulado ("¿cuál es mi mejor siguiente paso?") resuena más que el actual ("¿qué país es mejor?") con médicos reales.
2. **Fase 3 (separar país/ruta) es un cambio de modelo de datos con riesgo de regresión silenciosa** — si la migración de `Destino`→`Ruta` no se valida con pruebas de regresión exactas contra España/Alemania, se puede cambiar sutilmente el porcentaje que ya vimos funcionando en la Beta desplegada sin que nadie lo note.
3. **Fase 4 tiene el riesgo más alto de violar la regla de honestidad del propio founder** ("no inventes requisitos reales") si alguien, bajo presión de tiempo, completa un campo con una estimación "razonable" en vez de dejarlo como insuficiente — este riesgo requiere disciplina de proceso, no solo de código (recomendación: un lint/test automatizado que falle el build si un `Destino`/`Ruta` tiene un atributo sin `fuenteUrl` real, no un placeholder).
4. **Fase 5 (estado de usuario por etapa) es la de mayor esfuerzo oculto** — expandir Ruta del Médico de "parcial" a soportar seguimiento de estado por etapa es, en la práctica, terminar un bounded context que hoy es un esqueleto, no una extensión menor.
5. **El motor de brechas ampliado (más allá de idioma) puede generar acciones que suenen a garantía** si el texto no se revisa con la misma disciplina de "nunca prometer resultados" — cada nueva acción sugerida debe pasar por la misma regla de lenguaje del punto 10 del brief.
6. **Congelar el alcance de la Beta actual mientras se planifica esto es correcto**, pero implica que las entrevistas ya agendadas (si las hay) se harán contra la versión "país como protagonista" — el founder debe decidir si eso es aceptable o si prefiere esperar a la Fase 1-2 antes de la primera entrevista real.

## 10. Lista de archivos que cambiarán (por fase, acumulativo)

- **Fase 1:** `perfil-internacional/domain/value-objects/*.vo.ts` (3 nuevos), `perfil-internacional.aggregate.ts`, `perfil.repository.port.ts` + infra SQL, `identidad`/`perfil` controller, `db/migrations/`, `public/onboarding.html`, `test/architecture/invariantes.*`.
- **Fase 2:** `descubrimiento/domain/servicios/clasificacion.service.ts` (nuevo), `resultado-view.ts`, `public/resultados.html`, `public/explicacion.html`, pruebas nuevas.
- **Fase 3:** `catalogo/domain/ruta-homologacion.aggregate.ts` (o renombrado), `catalogo/domain/destino.aggregate.ts`, `descubrimiento/application/ports/destinos-para-comparar.port.ts`, `motor-compatibilidad.service.ts`, `analizador-brechas.service.ts`, ACL de catálogo, migraciones, seed.
- **Fase 4:** `db/seed/seed.ts`, sin cambios de dominio nuevos más allá de Fase 3.
- **Fase 5:** nueva pantalla de Perfil Internacional, `etapa-ruta.entity.ts` (costo + documentos), bounded context `ruta-medico` (expansión real).
- **Fase 6:** nueva pantalla comparador, sin cambios de motor.

## 11. Recomendación sobre qué fase ejecutar primero

**Fase 1**, con una condición previa que no es de código: antes de tocar `onboarding.html`, decidir junto con el founder si la primera entrevista real de descubrimiento se hace contra la Beta actual (protagonismo del país) o se espera a tener Fase 1-2 desplegadas. Fase 1 es de bajo riesgo técnico (no toca el motor, no toca datos existentes, es aditiva y reversible) y es la que más directamente prueba la hipótesis central del pivote de enfoque ("etapa profesional" y "objetivo" como primeras preguntas) sin comprometer nada de lo que ya funciona y está validado en producción.

**No recomiendo** empezar por ninguna fase posterior a la 2 sin datos reales de al menos la fase piloto de entrevistas — Fases 3-6 son inversión de arquitectura de datos que debe estar informada por lo que los médicos reales digan sobre países vs. rutas, no solo por el diseño de este documento.
