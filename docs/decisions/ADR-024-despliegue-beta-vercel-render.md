# ADR-024: Despliegue de la beta — frontend en Vercel, API + Postgres en Render (no Vercel Functions)

## Estado
Aceptada — análisis solicitado explícitamente por el founder antes de crear ninguna cuenta o incurrir en ningún gasto. Esta ADR documenta la decisión; la ejecución (crear cuentas, desplegar) requiere confirmación explícita adicional, que todavía no se ha dado.

## Contexto
El founder pidió evaluar dos opciones para dar a la beta una URL pública real, sin modificar la arquitectura actual, priorizando el menor riesgo y el menor número de cambios:

- **Opción A:** frontend estático (`public/`) en Vercel + API NestJS y Postgres en Render.
- **Opción B:** aplicación completa en Vercel, adaptando NestJS a Vercel Functions, con Postgres externo.

## Hallazgos técnicos concretos (verificados en el código, no supuestos)

1. **El outbox depende de un proceso persistente.** `OutboxDispatcherService` (`src/infrastructure/events/outbox-dispatcher.service.ts:28`) usa `@Interval(2000)` — sondea la tabla `shared.outbox_event` cada 2 segundos, dentro del mismo proceso Node de larga duración. Esto es lo que hace que, tras el registro, el Perfil Internacional se cree de forma asíncrona en pocos segundos (`esperarPerfil()` en `public/registro.html` reintenta hasta 10×400ms confiando en esa cadencia). Sin un proceso persistente, este mecanismo simplemente no corre.
2. **La vista de cohortes también depende de un intervalo persistente.** `CohorteRefreshService` (`src/bounded-contexts/radar-espera/infrastructure/cohorte-refresh.service.ts:20`) usa `@Interval(60_000)`. Menos crítico para la beta actual (Radar de Espera está oculto, `MOSTRAR_FAKE_DOORS = false`), pero es el mismo patrón.
3. **Vercel Functions no soporta `setInterval`/`@Interval` entre invocaciones.** Cada función es una invocación aislada y sin estado; no hay proceso en background entre requests. Verificado hoy (2026-07-19): en el plan Hobby, Vercel Cron solo permite cadencia **diaria** (expresiones con minutos/horas específicas fallan el deploy); el plan Pro habilita cadencia por minuto, nunca de 2 segundos ([Vercel Cron Jobs usage & pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)). Migrar el outbox a Vercel Cron implicaría, como mínimo, cambiar la garantía de "el perfil aparece en segundos" a "aparece en algún momento del minuto/día siguiente" — inaceptable para una entrevista en vivo con un médico real observando la pantalla.
4. **Duración máxima de función:** Hobby permite hasta 300s, Pro hasta 300s configurable a 800s ([Vercel Functions limits](https://vercel.com/docs/functions/limitations)) — no es el problema; el problema es la cadencia mínima del disparador, no la duración de la ejecución.
5. **Adoptar Opción B exige rediseñar el mecanismo de propagación de eventos entre contextos** (ADR-015) — de sondeo continuo a un disparador por cron con cadencia mucho más lenta, o a un mecanismo push (colas gestionadas, `LISTEN/NOTIFY` con un proceso aparte que igual necesitaría correr en algún sitio con estado persistente, es decir, ya no sería "todo en Vercel"). Esto es exactamente el tipo de cambio de arquitectura que el founder pidió explícitamente no hacer todavía.
6. **Render sí encaja sin cambios:** un Web Service de Render es un contenedor de larga duración — `@nestjs/schedule` funciona exactamente igual que en local/Docker, sin tocar una línea de `outbox-dispatcher.service.ts` ni `cohorte-refresh.service.ts`.
7. **Autenticación ya es "stateless-friendly":** el refresh token es opaco y se guarda hasheado en `identidad.sesion` (Postgres) — `src/bounded-contexts/identidad-acceso/infrastructure/jwt-token-issuer.ts:35`. El frontend usa `Authorization: Bearer` vía `localStorage` (`public/app.js`), **no cookies**. Esto elimina de raíz el problema típico de CORS+cookies (`SameSite`, `credentials: 'include'`) al separar frontend y backend en dominios distintos — no hace falta tocar el modelo de autenticación para ninguna de las dos opciones.
8. **CORS ya está habilitado** (`app.enableCors()` en `src/main.ts:14`), aunque hoy sin restricción de origen — hay que acotarlo al dominio real del frontend en Vercel, no añadirlo desde cero.
9. **Migraciones:** `db/migrate.ts` es un script `ts-node` idempotente (tabla `shared.schema_migrations`) diseñado para correr como comando puntual, no como endpoint — encaja de forma natural con el "Pre-Deploy Command" de Render (contenedor con filesystem y proceso persistente); no tiene un lugar natural en el modelo de Vercel Functions sin una pieza de CI aparte.
10. **Costos verificados hoy (2026-07-19), para una beta de 5-10 usuarios:** Render ya no ofrece Postgres gratuito permanente (la base gratuita expira a los 30 días); el plan de entrada de Postgres es ~$6/mes y el Web Service ~$7/mes ([Render pricing](https://render.com/pricing)). Vercel Hobby cubre el frontend estático sin costo. Opción A: ~$13/mes. Opción B añadiría, para igualar la cadencia actual del outbox, la necesidad de un plan Pro de Vercel (~$20/mes) *y* seguiría sin resolver limpiamente el disparador de 2 segundos.

## Decisión
**Opción A: frontend estático en Vercel, API NestJS + Postgres en Render.** Es la que además prefería el founder por defecto, y el análisis no encuentra ningún impedimento técnico que la contradiga — al contrario, es la única que no exige tocar el mecanismo de outbox/eventos que sostiene el flujo de registro→perfil en segundos.

## Pasos exactos (ninguno ejecutado todavía — requieren confirmación explícita antes de crear cuentas o incurrir en gasto)

### 1. Render — Postgres
1. Crear una base Postgres en Render (plan Starter, ~$6/mes; el free tier expira en 30 días y no sirve para una beta que pueda extenderse).
2. Copiar la **Internal Database URL** (más rápida y sin salir a internet si el Web Service vive en la misma región de Render).

### 2. Render — Web Service (API)
1. Nuevo Web Service apuntando al repo `mdrenniemedina-cpu/medical-pathway`, rama `claude/startup-from-scratch-abn8o3` (o la que esté activa al momento del deploy).
2. Build command: `npm ci && npm run build`
3. Start command: `npm run start` (ya definido en `package.json` como `node dist/src/main.js`)
4. **Pre-Deploy Command:** `npm run migrate && npm run seed` — el runner de migraciones es idempotente (`shared.schema_migrations`) y el seed solo carga catálogo de referencia (destinos, reglas de compatibilidad), no cuentas de prueba — seguro de re-ejecutar en cada deploy.
5. Variables de entorno en Render:
   - `DATABASE_URL` = Internal Database URL del paso 1
   - `DATABASE_SSL` = `true`
   - `JWT_ACCESS_SECRET` = secreto generado (nunca reusar el de `.env` local)
   - `JWT_ACCESS_TTL` = `15m` (o el valor actual de `.env`)
   - `JWT_REFRESH_TTL_DAYS` = `30`
   - `FRONTEND_ORIGIN` = URL del proyecto en Vercel (paso 3) — para CORS
   - `NODE_ENV` = `production`
   - `PORT` — Render la inyecta automáticamente; `main.ts` ya la lee vía `ConfigService`, no requiere cambio.

### 3. Cambio de código requerido — CORS (único cambio de backend)
`src/main.ts:14`, cambiar:
```ts
app.enableCors();
```
por:
```ts
app.enableCors({
  origin: config.get<string>('FRONTEND_ORIGIN'),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```
(mover la llamada después de `const config = app.get(ConfigService)`, o leer `process.env.FRONTEND_ORIGIN` directamente). No se necesita `credentials: true` — no hay cookies involucradas.

### 4. Vercel — frontend estático
1. **Corregido en el runbook (`docs/29-runbook-despliegue-beta.md` §6) tras verificar la documentación oficial de Vercel:** Root Directory debe quedar en la raíz del repo (default), **no** en `public` — con Root Directory=`public`, el Build Command no podría alcanzar `scripts/generate-frontend-config.js` (vive fuera de esa carpeta). La configuración correcta es Framework Preset "Other", Root Directory por defecto, Build Command `node scripts/generate-frontend-config.js`, Output Directory `public`. Ver el runbook para el paso a paso completo.
2. **Cambio de código requerido** — `public/app.js:7`, cambiar:
   ```js
   const API_BASE = '/api/v1';
   ```
   por la URL absoluta del Web Service de Render:
   ```js
   const API_BASE = 'https://<nombre-del-servicio>.onrender.com/api/v1';
   ```
   Es el único cambio de frontend necesario — todas las páginas usan rutas relativas (`/registro.html`, `/onboarding.html`, etc.) que Vercel sirve igual que hoy.
3. Sin variables de entorno necesarias en Vercel para este alcance (no hay build step que las consuma).

### 5. Verificación post-deploy
- Repetir el smoke test (`scripts/smoke-browser-manual.js`) apuntando `page.goto` a la URL de Vercel en lugar de `localhost:3000` — confirma que el flujo completo (registro→perfil asíncrono→compatibilidad→explicación→iniciar ruta) sigue funcionando con el outbox corriendo en Render y el frontend serví­do desde otro dominio.

## Alternativas consideradas
- **Opción B (todo en Vercel Functions):** rechazada para esta beta — exigiría desmontar el mecanismo de outbox de 2 segundos (pieza central de ADR-015) y sustituirlo por un disparador de cadencia mucho más lenta, un cambio de arquitectura que el founder pidió explícitamente no hacer todavía ("no modifiques todavía la arquitectura").
- **Mantener todo junto en un solo Web Service de Render (sin Vercel):** técnicamente más simple aún (cero cambios de CORS, cero URL absoluta en `app.js`), pero se descarta porque el founder ya expresó preferencia explícita por Vercel para el frontend, y no hay ningún impedimento técnico que la contradiga.

## Consecuencias
- Se gana: cero cambios de arquitectura de dominio o de mecanismo de eventos; solo dos cambios de código, ambos triviales y reversibles (CORS origin, URL absoluta del API).
- Se acepta: dos plataformas que gestionar en vez de una; ~$13/mes en vez de un posible tier gratuito de una sola plataforma.
- **Acción de seguimiento:** ninguna cuenta se crea ni se gasta nada hasta que el founder confirme explícitamente que quiere ejecutar estos pasos.

## Addendum (2026-07-19) — aprobado, en ejecución

El founder aprobó proceder. Dos refinamientos sobre el plan original de esta ADR, implementados en el código antes de desplegar (ver `docs/29-runbook-despliegue-beta.md` para el procedimiento completo):

1. **CORS:** en lugar de una única `FRONTEND_ORIGIN`, se implementó `CORS_ALLOWED_ORIGINS` (lista separada por comas) — el requisito explícito de la beta cerrada es permitir *el dominio de Vercel de la beta y los orígenes locales necesarios para desarrollo*, no solo uno. Sin la variable definida, el default es únicamente `http://localhost:3000` (nunca abierto).
2. **Alcance ampliado más allá de CORS/URL del API** (bloqueadores reales encontrados al preparar el despliegue, no exceso de alcance): aviso de beta cerrada en la UI, `noindex`/`robots.txt` para que la beta cerrada no se indexe, y parametrización del smoke test (`BASE_URL`) para poder validar contra la URL pública real — los tres eran requisitos explícitos del founder para este mismo despliegue, no funcionalidades nuevas.
