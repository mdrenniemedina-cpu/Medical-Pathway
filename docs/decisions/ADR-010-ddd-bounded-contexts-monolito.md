# ADR-010: Bounded contexts DDD como límites de módulo dentro del monolito

## Estado
Aceptada

## Contexto
El founder pidió aplicar Domain-Driven Design antes de diseñar base de datos o endpoints, para que la estructura técnica represente el problema del negocio y no las pantallas del MVP. Esto llevó a identificar 9 bounded contexts (`05-domain-model-ddd.md`). Existe el riesgo de interpretar "9 contextos" como "9 microservicios", lo cual contradeciría ADR-004 (monolito modular) sin justificación adicional de escala.

## Decisión
Los 9 bounded contexts se implementan como módulos dentro del mismo monolito modular, cada uno con su propio schema de Postgres (namespacing lógico) y su propio lenguaje de dominio. La comunicación entre contextos ocurre exclusivamente vía interfaces publicadas (Open Host Service) y eventos de dominio in-process — nunca por acceso directo a las tablas de otro schema. Esto preserva rigor de DDD estratégico (límites de modelo claros) sin pagar el coste operativo de microservicios que ADR-004 ya identificó como prematuro para el tamaño del equipo.

## Alternativas consideradas
- **Un microservicio por bounded context:** rechazado — mismo argumento de ADR-004 (coste operativo desproporcionado para un equipo pequeño en etapa pre-PMF); DDD estratégico no requiere despliegues independientes para tener límites de modelo limpios.
- **Un solo schema de base de datos sin separación por contexto:** rechazado — perdería la disciplina de límites que hace posible, más adelante, extraer un contexto (probablemente Radar de Espera, ver `11-riesgos-tecnicos-mitigacion.md`) sin una reescritura mayor.

## Consecuencias
- Se gana: rigor de dominio sin coste operativo de microservicios; extracción futura de un contexto a servicio independiente es un cambio de despliegue, no de modelo.
- Se sacrifica: alguna duplicación deliberada de referencias (p. ej. `destino_id` repetido en varios schemas sin FK cruzada) a cambio de desacoplamiento real.
- Revisar si el volumen de algún contexto (más probablemente Radar de Espera, por su perfil de cómputo distinto) justifica su extracción a un servicio independiente.
