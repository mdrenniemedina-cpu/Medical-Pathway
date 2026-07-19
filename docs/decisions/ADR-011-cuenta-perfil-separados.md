# ADR-011: Cuenta (identidad de acceso) y Perfil Internacional como agregados separados

## Estado
Aceptada

## Contexto
El founder pidió que "Perfil Internacional" sea un concepto central de la plataforma, completado una vez, del cual toda recomendación y notificación se deriva. Es tentador modelar esto como parte del mismo agregado que las credenciales de login (un solo "Usuario" con email/password y todos sus datos profesionales juntos), pero esto mezcla dos preocupaciones con ciclos de cambio y propósitos distintos: "cómo entro al sistema" vs. "quién soy profesionalmente".

## Decisión
`Cuenta` (contexto Identidad y Acceso: email, password/SSO, rol, sesiones) y `PerfilInternacional` (contexto Perfil Internacional: formación, idiomas, presupuesto, objetivos) son agregados distintos, vinculados por `cuenta_id`, cada uno en su propio bounded context.

## Alternativas consideradas
- **Un solo agregado "Usuario" con todo junto:** rechazado — acoplaría el ciclo de vida de las credenciales (que puede cambiar por razones de seguridad, proveedor de SSO, etc.) con el ciclo de vida del perfil profesional (que cambia por razones de carrera). También dificultaría un escenario futuro razonable: que una cuenta tenga más de un perfil asociado (p. ej., un mentor que gestiona su propio proceso además de ayudar a otros), sin tener que rediseñar el agregado de identidad.

## Consecuencias
- Se gana: separación de responsabilidades clara, facilidad para cambiar el proveedor de autenticación sin tocar el dominio profesional, y flexibilidad futura sin sobre-ingeniería actual (no se construye soporte multi-perfil ahora, solo se evita bloquearlo).
- Se sacrifica: una referencia adicional (`cuenta_id` en `PerfilInternacional`) y una consulta extra en algunos flujos — coste marginal, aceptado.
- Revisar si en el futuro se decide soportar múltiples perfiles por cuenta — el modelo ya lo permite sin cambios estructurales.
