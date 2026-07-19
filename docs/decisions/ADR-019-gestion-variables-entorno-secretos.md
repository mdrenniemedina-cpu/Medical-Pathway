# ADR-019: Validación fail-fast de configuración + secretos fuera del repositorio

## Estado
Aceptada

## Contexto
El founder pidió gestión segura de variables de entorno y secretos como parte del núcleo del Sprint 0. Un fallo de configuración silencioso (p. ej. arrancar sin `JWT_ACCESS_SECRET`) es peor descubrirlo en producción que al arrancar el proceso.

## Decisión
Toda variable de entorno se valida al arranque con un esquema `zod` (`src/config/env.schema.ts`) vía `ConfigModule.forRoot({ validate })` — si falta una variable requerida o tiene un formato inválido, el proceso **no arranca**. `.env` (con valores reales) está en `.gitignore` y nunca se commitea; `.env.example` documenta las claves esperadas con valores de ejemplo no sensibles. En entornos desplegados, las variables se inyectan por el gestor de secretos de la plataforma de hosting (no por archivo `.env`), pero pasan por la misma validación al arrancar.

## Alternativas consideradas
- **Sin validación, leer `process.env` directamente donde se necesite:** rechazado — los fallos de configuración se manifestarían como errores confusos en tiempo de ejecución (p. ej. un `undefined` pasado a una librería) en lugar de un fallo claro al arrancar.
- **Herramienta de gestión de secretos dedicada (Vault, AWS Secrets Manager) desde el Sprint 0:** no elegido todavía — sobre-ingeniería para la etapa actual sin un proveedor de hosting decidido; el diseño (validación + `.env` fuera del repo) es compatible con adoptar cualquier gestor de secretos real en el momento del despliegue, sin cambiar el código de la aplicación (solo cómo se inyectan las variables).

## Consecuencias
- Se gana: fallos de configuración detectados inmediatamente al arrancar, con mensaje claro; ningún secreto real en el control de versiones.
- Se sacrifica: no hay rotación automática de secretos ni auditoría de acceso a secretos en esta etapa — aceptable sin un entorno de producción real todavía.
- Revisar al elegir la plataforma de despliegue definitiva: confirmar que su mecanismo de inyección de variables es compatible con la validación al arranque (debería serlo, ya que solo depende de `process.env`).
