# ADR-021: Analítica de producto como infraestructura transversal, no como bounded context

## Estado
Aceptada

## Contexto
El Sprint 1 requiere instrumentar todo el recorrido con eventos analíticos (`cuestionario_iniciado`, `destino_explorado`, etc.) para poner a prueba las hipótesis de `docs/16-hipotesis-sprint-1.md`. Existía la tentación de modelar esto como un bounded context más ("Analítica"), siguiendo el patrón de los 9 contextos de `05-domain-model-ddd.md`.

## Decisión
La analítica de producto se implementa como infraestructura transversal (`src/infrastructure/analytics/`), no como un bounded context: no tiene agregados, no tiene invariantes de negocio, no toma decisiones — solo registra que algo ocurrió. Se distingue explícitamente de dos mecanismos ya existentes con los que podría confundirse:
- **`shared.outbox_event`** (ADR-015): eventos de **dominio**, con significado de negocio, consumidos por otros bounded contexts para reaccionar (p. ej. crear una Ruta Personalizada).
- **`notificaciones.alerta`**: alertas **personalizadas para el usuario final**, derivadas de eventos de dominio cruzados con sus preferencias.
- **`analitica.evento_producto`** (nuevo): telemetría **para el equipo de producto**, sin ningún efecto en el comportamiento del sistema.

Un `DominioAAnaliticaSubscriber` traduce automáticamente eventos de dominio reales (`DescubrimientoCompletado`, `DestinoSeleccionado`, `EntroAEtapaDeEspera`) a analítica — estas señales son "verdad de servidor" y no dependen de que el frontend dispare una llamada. Los eventos de pura interacción de UI (abandono de cuestionario, exploración de una tarjeta) sí requieren una llamada explícita del frontend (`POST /analitica/eventos`), porque no corresponden a ningún cambio de estado del backend.

## Alternativas consideradas
- **Modelar Analítica como un bounded context (contexto genérico, como Notificaciones):** rechazado — forzar un "agregado" o "invariante" sobre un evento de telemetría (p. ej. "un `EventoProducto`") sería una abstracción vacía sin regla de negocio real detrás, precisamente el riesgo que el founder advirtió explícitamente ("nueve schemas... no deben convertirse en miniaplicaciones llenas de abstracciones vacías") — y aquí ni siquiera aporta un décimo contexto con valor, solo ceremonia.
- **Registrar analítica directamente en la tabla de outbox:** rechazado — mezclaría dos propósitos distintos (propagar cambios de estado entre contextos vs. medir comportamiento de usuario) en la misma tabla, dificultando limpiar/archivar analítica sin arriesgar el mecanismo de entrega de eventos de dominio.

## Consecuencias
- Se gana: separación clara de responsabilidades; los eventos de dominio automáticos son más confiables que la telemetría de frontend (no dependen de que el usuario no cierre la pestaña antes de que se envíe la llamada, salvo que se use `keepalive`, que sí se usa).
- Se sacrifica: dos mecanismos de "eventos" en el sistema (`EventBusPort` de dominio y la tabla de analítica) que un desarrollador nuevo debe aprender a distinguir — mitigado con esta documentación explícita.
- Revisar si el volumen de analítica justifica moverla a una herramienta dedicada (p. ej. un data warehouse o un producto de analítica de terceros) en vez de una tabla propia — hoy el volumen no lo justifica.
