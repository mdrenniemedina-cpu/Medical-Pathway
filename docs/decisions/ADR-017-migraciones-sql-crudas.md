# ADR-017: Migraciones SQL crudas y versionadas, sin ORM de por medio

## Estado
Aceptada

## Contexto
El esquema (`06-database-schema.md`) requiere control fino sobre schemas de Postgres por bounded context, índices únicos parciales (p. ej. "una ruta activa por perfil+destino"), una vista materializada con `percentile_cont` y `HAVING` para el umbral de k-anonimato, y (en un sprint posterior) políticas RLS — funcionalidad que la mayoría de ORMs modelan de forma incómoda o no soportan directamente en su DSL de migraciones.

## Decisión
Las migraciones son archivos `.sql` numerados (`db/migrations/000N_*.sql`), aplicados por un runner propio y mínimo (`db/migrate.ts`) que registra el estado en `shared.schema_migrations`. No se usa TypeORM/Prisma/Knex para generar o gestionar el esquema — los repositorios de cada contexto (p. ej. `PerfilRepositoryPg`) escriben SQL explícito contra ese esquema.

## Alternativas consideradas
- **TypeORM con migraciones autogeneradas:** rechazado — la autogeneración de migraciones desde entidades decoradas no modela bien schemas múltiples, índices parciales condicionales, ni vistas materializadas; y acoplaría las entidades de dominio (que deben permanecer puras, sin decoradores de infraestructura) a un ORM.
- **Prisma:** rechazado por la misma razón — su `schema.prisma` es un DSL adicional a mantener en paralelo con el modelo de dominio real, y su soporte de RLS/vistas materializadas es limitado.
- **Query builder (Knex) sin migraciones crudas:** considerado, pero no aporta suficiente valor sobre SQL directo dado que ya se necesita control total sobre el DDL; se prefiere SQL explícito y auditable línea por línea.

## Consecuencias
- Se gana: control total sobre el DDL (schemas, índices parciales, vistas materializadas, futuras políticas RLS) sin pelear contra las abstracciones de un ORM.
- Se sacrifica: no hay generación automática de tipos TypeScript desde el esquema (los repositorios definen sus propias interfaces `Row` manualmente) — coste aceptado dado el tamaño actual del equipo.
- Revisar si el volumen de tablas/migraciones crece lo suficiente para justificar herramientas de gestión más sofisticadas (aún manteniendo SQL crudo, p. ej. `node-pg-migrate` en lugar del runner propio).
