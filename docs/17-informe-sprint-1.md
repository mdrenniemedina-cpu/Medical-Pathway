# Informe de producto — Sprint 1

> Responde a lo pedido: hipótesis validadas, hipótesis rechazadas, aprendizajes obtenidos, decisiones a cambiar antes del Sprint 2, y la reflexión estratégica del founder sobre dónde está el valor real del producto.

## 0. Advertencia de honestidad — léase antes que el resto del informe

**Este sprint no ha sido usado por ningún médico o estudiante real.** Todo lo que sigue se basa en: (a) la construcción del software y su verificación técnica (build, tests, migraciones, y un recorrido completo simulado en un navegador real vía Playwright — `scripts/smoke-browser-manual.js`), y (b) el razonamiento de diseño que motivó cada decisión. **Ninguna hipótesis de `docs/16-hipotesis-sprint-1.md` puede declararse honestamente "validada" o "rechazada" con datos de comportamiento humano, porque no existen todavía.** Presentar lo contrario sería fabricar evidencia. Este informe distingue explícitamente:
- Lo que **sí verifiqué** (que el sistema funciona como fue diseñado — verificación de ingeniería).
- Lo que **queda pendiente de validar** con usuarios reales (las hipótesis de negocio en sí).
- Los **aprendizajes reales** que sí obtuve construyendo (limitaciones descubiertas, decisiones de diseño que resultaron más complejas o más simples de lo esperado).

## 1. Qué se construyó

- Motor de descubrimiento extendido con **análisis de brechas 100% trazable**: para cada destino no óptimo, el sistema re-ejecuta el mismo motor de reglas con un perfil hipotético y calcula el impacto exacto de una acción concreta (hoy: aprender el idioma requerido). Verificado en `test/architecture/invariantes.analizador-brechas.spec.ts` y end-to-end (Alemania: +40 puntos si el usuario aprende alemán B2/C1, pasando de 9% a 49% — cifra real calculada por el motor, no inventada para este informe).
- **Proyección de futuro**: la ruta de homologación de un destino se convierte en una línea de tiempo acumulada (meses estimados por etapa), con fuente y fecha de verificación visibles en cada tramo — construida sobre datos ya sembrados en Sprint 0, sin introducir ninguna cifra nueva sin respaldo.
- **Instrumentación analítica completa del recorrido**: 6 eventos de interacción de frontend + 3 eventos derivados automáticamente de eventos de dominio reales (más confiables que la telemetría de frontend). Ver §4 para el detalle de por qué se separaron.
- **Frontend mínimo funcional** (4 páginas HTML sin framework, sin diseño elaborado): registro/login, onboarding en 3 pasos, resultados con razones y acciones expandibles, y proyección con dos "fake doors".
- **Dos fake doors** (Comunidad y Radar de Espera) para medir demanda comparativa sin construir esas funcionalidades — la pieza que responde directamente a la advertencia estratégica del founder (ver §6).
- Un bug de Sprint 0 corregido en el proceso: `DescubrimientoCompletadoEvent` estaba modelado pero nunca se disparaba — se descubrió al instrumentar analítica automática desde eventos de dominio, y es en sí mismo un aprendizaje (ver §5).

## 2. Verificación de ingeniería realizada (no es validación de producto)

| Verificación | Resultado |
|---|---|
| Build, lint, typecheck | Limpio |
| Migraciones (11 archivos, incluyendo la nueva `analitica`) contra Postgres real, desde cero | Limpio |
| Suite de tests (invariantes + arquitectura) | 16 tests, todos en verde |
| Recorrido completo en navegador real (Chromium headless vía Playwright): registro → onboarding (3 pasos) → resultados → expandir razones → expandir acciones → ver proyección → ambos fake doors → volver → iniciar ruta | Completado sin errores, dos veces (antes y después de resetear la base de datos) |
| Eventos analíticos verificados directamente en base de datos tras el recorrido | Los 9 tipos de evento esperados aparecen, con el `origen` correcto (`frontend` vs `dominio`) |

Esto confirma que **la maquinaria para medir las hipótesis funciona**. No confirma ni refuta ninguna hipótesis sobre comportamiento humano.

## 3. Hipótesis: estado real (no fabricado)

| Hipótesis | Estado |
|---|---|
| H1 (finalización del cuestionario) | **No evaluable todavía** — instrumentada y verificada técnicamente; requiere usuarios reales |
| H2 (exploración de razones) | **No evaluable todavía** — ídem |
| H3 (acciones mueven a iniciar ruta) | **No evaluable todavía** — ídem |
| H4 (proyección motiva más que checklist) | **No evaluable todavía** — ídem |
| H5 (dónde está el valor real: motor vs. comunidad/datos) | **No evaluable todavía** — los fake doors están instrumentados y funcionan; no hay clics reales que comparar |

**Ninguna hipótesis fue "validada" ni "rechazada" en este sprint.** Quien lea este informe buscando esa sección no la encontrará porque no existe honestamente todavía — existe la capacidad de obtenerla.

## 4. Aprendizajes reales obtenidos construyendo (esto sí es genuino)

1. **Separar analítica de eventos de dominio fue más importante de lo previsto.** Al instrumentar `recomendacion_generada` como evento automático, descubrí que `DescubrimientoCompletadoEvent` nunca se disparaba desde Sprint 0 (estaba modelado pero no invocado) — un bug real que solo salió a la luz porque decidimos que la señal de servidor fuera la fuente de verdad en vez de confiar en que el frontend siempre reporte. Esto valida la decisión de diseño (ADR-021) más allá de la teoría: encontró un bug real el primer día que se usó.
2. **El motor de brechas es más limitado de lo que suena en la propuesta original.** Con las reglas actuales, solo puede sugerir acciones sobre idioma — el resto de criterios (demanda, tiempo, complejidad regulatoria) son estructurales del destino, no del perfil, y no generan una acción con sentido. Esto no es un defecto de implementación sino un límite real del conjunto de reglas de Sprint 0/1: **para que "qué acciones aumentan mis oportunidades" sea rico, hace falta más reglas accionables** (certificaciones, experiencia, publicaciones), no solo más lógica en el analizador.
3. **La proyección de futuro fue más barata de construir de lo esperado** porque reutilizó datos ya sembrados con fuente en Sprint 0 — ninguna estimación nueva sin respaldo. Esto confirma que invertir en `AtributoConFuente` desde el principio (ADR-005) paga dividendos en sprints posteriores.
4. **Los fake doors son baratos y ya generan una decisión de diseño real**: al escribir el copy ("todavía no existe esta funcionalidad, pero tu interés queda registrado"), me obligó a decidir *dónde* colocarlos para que sean comparables — el de Comunidad al final de la proyección completa, el de Radar específicamente en la etapa de espera (el momento de mayor dolor identificado en la investigación de mercado) — esto en sí mismo es una hipótesis de diseño (¿el momento correcto para pedir el dato es cuando el dolor es más agudo?) que también queda pendiente de validar.
5. **El wizard de onboarding en 3 pasos, aunque simple, ya reveló una decisión no trivial**: instrumentar el abandono por pregunta obliga a que cada paso sea una unidad atómica de guardado (cada paso llama a su propio endpoint), no un formulario que se envía al final — si el usuario abandona a mitad, ya se guardó lo que completó. Es una decisión de UX con consecuencia de datos (perfil parcial persistido), documentada aquí por primera vez.

## 5. Decisiones que deberían revisarse antes de Sprint 2

1. **No avanzar a construir Comunidad o Radar de Espera en profundidad hasta tener datos reales de los fake doors** — es la aplicación directa de la advertencia del founder; sería incoherente pedir que el Sprint 1 mida esto y luego ignorarlo en la priorización de Sprint 2.
2. **Ampliar el conjunto de `ReglaCompatibilidad` accionables** antes de invertir más en el frontend del motor de brechas — el aprendizaje #2 de arriba muestra que el cuello de botella no es la lógica del analizador sino el número de criterios que el usuario puede realmente cambiar.
3. **Definir el mecanismo real para reclutar usuarios de prueba** (5-10 médicos/estudiantes reales de Colombia/Venezuela, según el beachhead de origen ya decidido) antes de Sprint 2 — sin esto, Sprint 2 se enfrentaría al mismo problema que Sprint 1: construir más sin poder validar nada. Esta es, con evidencia, la decisión más urgente de las tres.
4. **Revisar RLS diferido (ADR-020 de Sprint 0)** — sigue pendiente y ahora hay más datos sensibles en juego (perfil con objetivos/idiomas, eventos de analítica con `perfilId`). No se abordó en este sprint por foco, pero el riesgo aumenta con cada sprint que pasa sin resolverlo.
5. **El endpoint `POST /analitica/eventos` no tiene autenticación obligatoria** (para poder capturar `cuestionario_iniciado` antes de que exista sesión, en un futuro sin registro previo) — hoy no es explotable de forma dañina (solo escribe eventos de analítica, no afecta el dominio), pero debe revisarse si se abre el producto a tráfico no autenticado a mayor escala (riesgo de spam de eventos).

## 6. La reflexión estratégica del founder — respuesta directa

**No me enamoré del motor de recomendación.** La evidencia concreta de esto en el propio código y diseño de este sprint:
- El motor de brechas, aunque técnicamente el más sofisticado de este sprint, se documentó explícitamente (ADR-022) con sus límites reconocidos, no como el corazón del producto.
- Se invirtió esfuerzo deliberado en instrumentar **comparativamente** el interés en Comunidad y Radar de Espera (ADR-023) usando la técnica más barata posible (fake doors) precisamente para no tener que "creer" dónde está el valor.
- La proyección de futuro (pieza pedida explícitamente por el founder, "ayudar a visualizar su futuro") se construyó reutilizando el activo de confianza (`AtributoConFuente`, fuente citada por etapa) en vez de depender del motor de compatibilidad — es una pieza de **confianza**, no de recomendación.

**Lo que este sprint no puede decirte todavía es dónde está realmente el valor** — eso requiere que las señales de `interes_comunidad_expresado`, `interes_radar_expresado`, `destino_explorado` y `acciones_recomendadas_vistas` se acumulen con usuarios reales. El sistema está listo para leer esa respuesta el día que existan. Mi única recomendación con la evidencia de hoy: **no se puede posponer más la pregunta de cómo conseguir usuarios de prueba reales** — es el verdadero bloqueador de Sprint 2, no una funcionalidad técnica pendiente.
