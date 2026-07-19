# ADR-018: JWT de acceso + refresh opaco hasheado + Argon2id para contraseñas

## Estado
Aceptada

## Contexto
`08-auth-model.md` definía el modelo a nivel conceptual (access token corto, refresh token revocable, Cuenta separada de Perfil). Sprint 0 requiere fijar las librerías y algoritmos concretos, que son costosos de cambiar una vez que existen usuarios reales con sesiones activas.

## Decisión
- Contraseñas: `argon2id` (vía la librería `argon2`), no bcrypt — Argon2id es el ganador de la Password Hashing Competition y resiste mejor ataques de hardware dedicado (GPU/ASIC).
- Access token: JWT firmado (`@nestjs/jwt` + `passport-jwt`), secreto simétrico en esta etapa (rotación a claves asimétricas si en el futuro un servicio externo necesita verificar tokens sin compartir el secreto).
- Refresh token: valor opaco aleatorio (`nanoid`), nunca un JWT — se almacena **hasheado** (SHA-256) en `identidad.sesion`, nunca en texto plano, permitiendo revocación individual sin necesidad de listas de revocación de JWT.

## Alternativas consideradas
- **bcrypt para contraseñas:** rechazado — Argon2id ofrece mejores garantías contra ataques de hardware especializado con parámetros de coste modernos.
- **Refresh token también como JWT:** rechazado — un JWT no se puede revocar individualmente sin mantener una lista de revocación (que anula la ventaja de no tener estado); un token opaco respaldado por una tabla de sesiones da revocación trivial y es el patrón estándar para refresh tokens de larga duración.
- **Claves asimétricas (RS256) desde el día uno:** no elegido para el MVP — añade complejidad de gestión de claves sin un consumidor externo real todavía que necesite verificar tokens sin el secreto compartido; se revisita si aparece esa necesidad.

## Consecuencias
- Se gana: revocación de sesión individual sin listas de revocación, contraseñas con hashing resistente al estado del arte.
- Se sacrifica: el secreto JWT compartido (HS256) es un punto único que, de filtrarse, compromete la emisión de tokens — mitigado por gestión de secretos (ver ADR-019) y por la corta vida del access token (15 min).
- Revisar si se introduce un consumidor externo de tokens (p. ej. un servicio de terceros que deba verificar JWT sin conocer el secreto) — en ese caso, migrar a RS256/claves asimétricas.
