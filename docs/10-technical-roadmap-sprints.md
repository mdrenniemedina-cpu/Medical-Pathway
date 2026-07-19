# Roadmap técnico por sprints (6 meses, sprints de 2 semanas)

> Secuencia derivada de `03-mvp-definition.md` (v3): columna vertebral primero (para tener motor de adquisición propio), Radar de Espera después (para que tenga usuarios a quienes atender apenas se construye). Cada bloque indica objetivo, alcance y criterio de salida.

## Sprint 0 (preparación, 1-2 semanas)
- Repositorio, CI/CD, entorno de contenedores (Docker), esqueleto del monolito modular con los 9 schemas de `06-database-schema.md` creados vacíos.
- Contexto **Identidad y Acceso** completo (registro, login, JWT, refresh, RLS base).
- **Criterio de salida:** un usuario puede registrarse e iniciar sesión; pipeline de CI corre tests y despliega a un entorno de staging.

## Sprints 1-2 — Perfil Internacional + Catálogo
- Contexto **Perfil Internacional** completo: onboarding, todos los Value Objects, eventos `PerfilCreado`/`PerfilActualizado`.
- Contexto **Catálogo de Destinos y Rutas**: panel de administración interno para el equipo editorial; carga de los 9 destinos y sus atributos (reutilizando `research/01-04`, con `fuente_url`/`fecha_verificacion` reales); `RutaHomologacion` profunda para España (a partir de `research/01`), plantillas resumen para los otros 8.
- **Criterio de salida:** un usuario completa su Perfil Internacional; el catálogo de 9 destinos es consultable con datos reales y fuentes.

## Sprints 3-4 — Descubrimiento y Compatibilidad
- Motor de reglas (`ReglaDeCompatibilidad`), cálculo de `ResultadoDeDescubrimiento` con `PuntuacionDestino` + `Razon` (invariante: nunca sin explicación).
- UI de resultados con el formato "España — Compatibilidad 91%" + razones, tal como lo especificó el founder.
- **Criterio de salida:** un usuario con perfil completo recibe un shortlist explicado de destinos y puede seleccionar uno (evento `DestinoSeleccionado`).

## Sprints 5-6 — Ruta del Médico
- Instanciación personalizada de `RutaPersonalizada` al reaccionar a `DestinoSeleccionado` (incluye lógica de adaptación: omitir/opcionalizar etapas según perfil).
- Seguimiento de `EtapaPersonalizada` (estados, prerequisitos), `DocumentoAsociado` mínimo.
- **Criterio de salida:** un usuario que eligió España tiene un plan personalizado con pasos reales, puede marcar progreso, y al llegar al paso de homologación se dispara `EntroAEtapaDeEspera`.

## Sprints 7-8 — Acompañamiento genérico (Comunidad, Notificaciones, Oportunidades mínimo)
- Contexto **Comunidad**: hilos/respuestas segmentados, moderación, reporte de estafas.
- Contexto **Notificaciones**: preferencias, consumo de eventos de otros contextos, alertas personalizadas.
- Contexto **Oportunidades**: directorio mínimo anti-estafa (sin monetización todavía).
- **Criterio de salida:** un usuario puede pedir ayuda a la comunidad, recibe alertas relevantes a su propio perfil/ruta, y ve advertencias anti-estafa contextuales.

## Sprints 9-10 — Radar de Espera (núcleo diferenciador)
- Contexto **Radar de Espera**: `RegistroDeExpediente`, Anti-Corruption Layer que traduce `EntroAEtapaDeEspera` a un registro propio, job de recálculo de `CohorteDeComparacion` (vista materializada con umbral de k-anonimato).
- UI de "mi cohorte": distribución de percentiles, proporción resuelta, posición aproximada — no un contador simple.
- **Criterio de salida:** un usuario en fase de espera reporta su expediente y, si su cohorte supera el umbral, ve una estimación basada en evidencia real, con nivel de confianza indicado.

## Sprint 11 — Calidad y confianza de datos
- `ConfianzaDelDato`, reglas de detección de anomalías, verificación progresiva conectada al peso de los reportes.
- Paneles de revisión para `admin`/`moderador` sobre registros marcados como anómalos.
- **Criterio de salida:** el sistema pondera y filtra automáticamente reportes de baja confianza antes de que afecten las cohortes públicas (ver `13-calidad-confianza-datos-radar.md`).

## Sprint 12 — Endurecimiento, analítica de embudo, mecanismos de retención, lanzamiento
- Instrumentación de eventos de producto en todo el embudo (perfil → descubrimiento → destino elegido → plan → radar).
- Mecanismos de retención concretos (ver `14-estrategia-retencion-engagement.md`): reciprocidad de datos, alertas basadas en cambios reales, timeline narrativo.
- Endurecimiento de seguridad (RLS, rate limiting, revisión de disclaimers legales), pruebas de carga sobre la vista materializada de cohortes.
- **Criterio de salida:** el producto está listo para usuarios reales, con métricas de embudo completo visibles para el equipo desde el día 1 de lanzamiento.

## Nota sobre paralelización

Con un equipo de más de una persona, Catálogo (sprint 1-2) y las reglas de Descubrimiento (sprint 3-4) pueden solaparse parcialmente, ya que Descubrimiento puede desarrollarse contra datos de catálogo de prueba antes de que el contenido real de los 9 destinos esté cargado. Comunidad/Notificaciones (sprints 7-8) son las más paralelizables con Radar de Espera (sprints 9-10) si el equipo lo permite, ya que dependen de eventos ya definidos (`EstafaReportada`, etc.) y no bloquean al Radar.
