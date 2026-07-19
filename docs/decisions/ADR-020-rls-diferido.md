# ADR-020: Row-Level Security diseñado en Sprint 0, activación diferida a cuando exista contexto transaccional por request

## Estado
Aceptada — conflicto detectado y documentado durante Sprint 0, según instrucción explícita del founder de detenerse antes de implementar una solución rota o engañosa.

## Contexto
`08-auth-model.md` diseña políticas RLS sobre `radar_espera.registro_expediente` y `ruta_medico.documento_asociado` que dependen de `current_setting('app.current_perfil_id')`. Al implementar el esqueleto del Sprint 0 se detectó que el backend usa un `Pool` de conexiones compartido (`PG_POOL`) y ejecuta la mayoría de lecturas con `pool.query(...)` fuera de una transacción explícita — no existe todavía un mecanismo que establezca `app.current_perfil_id` por request. Activar `ENABLE ROW LEVEL SECURITY` con las políticas ya escritas, sin ese mecanismo, haría que **todas** las consultas (incluidas las del propio backend actuando en nombre del usuario correcto) devuelvan cero filas — una regresión funcional completa, no una mejora de seguridad.

## Decisión
Se documenta el diseño de RLS como objetivo (ver `08-auth-model.md`), pero **no se ejecuta `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`** en las migraciones del Sprint 0. La activación queda planificada para el sprint en que se introduzca `withUserContext(perfilId, work)`: un helper que hace checkout de un cliente dedicado del pool, ejecuta `SET LOCAL app.current_perfil_id = $1` y corre `work` dentro de esa misma transacción — recién entonces las políticas RLS pueden activarse de forma segura y verificable.

## Alternativas consideradas
- **Activar RLS ahora con una política que además permita bypass a un rol de aplicación:** rechazado para el Sprint 0 — introduce un rol de bypass amplio (`BYPASSRLS` o política `USING (true) OR ...`) que en la práctica anula la protección hasta que se implemente el contexto por request, dando una falsa sensación de seguridad ("la tabla tiene RLS") sin protección real.
- **Implementar `withUserContext` ahora mismo, dentro del Sprint 0:** considerado, pero se decidió no expandir el alcance del Sprint 0 más allá de lo ya extenso, dado que la protección equivalente en esta etapa (control de acceso a nivel de aplicación en cada use-case, que ya filtra por `perfilId` del JWT) cubre el mismo riesgo mientras no hay RLS. Se prioriza para el inicio del Sprint 1 dado que Radar de Espera es el contexto con los datos más sensibles.

## Consecuencias
- Se gana: no se introduce una funcionalidad de seguridad que aparenta proteger pero en realidad no protege (o que rompe el sistema) — se prefiere ser explícito sobre la brecha temporal.
- Se sacrifica: durante el Sprint 0 (y hasta que se implemente `withUserContext`), la única defensa contra un bug de aplicación que olvide filtrar por `perfilId` es la disciplina de código en los use-cases — no hay segunda capa de defensa en la base de datos todavía.
- **Acción de seguimiento obligatoria:** implementar `withUserContext` y activar RLS sobre `radar_espera.registro_expediente` y `ruta_medico.documento_asociado` antes de manejar datos de usuarios reales en un entorno no controlado — no debe posponerse indefinidamente, dado que son las dos tablas con datos más sensibles del sistema.
