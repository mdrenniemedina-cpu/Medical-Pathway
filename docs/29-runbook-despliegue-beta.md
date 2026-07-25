# Runbook — Despliegue de la Beta Cerrada (Vercel + Render)

> Ejecuta ADR-024. Este documento debe bastar por sí solo para que cualquier desarrollador reconstruya toda la infraestructura desde cero — cuenta nueva, servicios nuevos, sin depender de ninguna configuración que exista solo dentro de una cuenta ya creada. Todo lo que no está en el repo (secretos, IDs de servicio) se documenta aquí **por nombre**, nunca por valor. Ámbito estrictamente limitado al despliegue — sin cambios de funcionalidad ni de arquitectura más allá de lo indispensable (ver §2).

**Arquitectura aprobada y confirmada (2026-07-19):** frontend estático en Vercel (Hobby, $0) + API NestJS y PostgreSQL en Render (Starter + Starter, ~$13/mes), región US East (Ohio, o Virginia si Ohio no tiene disponibilidad en el momento de crear los recursos — ambas deben coincidir entre sí).

---

## 0. Commit desplegado

- **Rama:** `claude/startup-from-scratch-abn8o3`
- **Commit verificado:** `8c53404` — pasó lint, `tsc --noEmit`, build, `test:all` (16/16) y smoke test Playwright (13/13) en local (ver §5). Si la rama recibe commits nuevos antes de desplegar, repetir §5 contra el HEAD real y actualizar este hash.

## 1. Requisito previo

Una cuenta de GitHub con acceso al repositorio `mdrenniemedina-cpu/medical-pathway` (la misma que ya usas). Tanto Render como Vercel piden autorizar su GitHub App sobre este repo — es una autorización de **lectura de código + webhook de push**, no de escritura ni de administración del repo.

## 2. Cambios de código ya hechos para este despliegue (en el repo, ya validados — nada de esto lo tienes que tocar)

| Cambio | Archivo | Por qué |
|---|---|---|
| CORS restringido por variable de entorno (`CORS_ALLOWED_ORIGINS`, coma-separado; default `http://localhost:3000` si no se define) | `src/main.ts` | La beta cerrada exige permitir solo el dominio de Vercel y los orígenes locales de desarrollo, nunca "todos". |
| `window.__API_BASE__` con fallback a `/api/v1` relativo | `public/app.js` | El mismo `app.js` funciona igual en local (mismo origen) y en Vercel (origen distinto al de la API en Render). |
| Generador de `public/config.js` a partir de `API_BASE_URL` | `scripts/generate-frontend-config.js` | Vercel lo ejecuta como Build Command — así la URL del API no queda hardcodeada en el repo. `public/config.js` está en `.gitignore` (se regenera en cada build). |
| Aviso de beta cerrada (banner) | `public/app.js` (`renderAvisoBeta`), `public/styles.css` (`.aviso-beta`) | Beta/orientativo/fuentes verificables/no subir datos sensibles, visible en toda la app. |
| `noindex, nofollow` + `public/robots.txt` (`Disallow: /`) | los 6 `.html` de `public/` | La beta no debe indexarse en buscadores. |
| `scripts/smoke-browser-manual.js` acepta `BASE_URL` | — | Permite correr el mismo smoke test contra `localhost` o la URL pública real. |

---

## 3. FASE 1 — Render: crear cuenta y la base de datos PostgreSQL

**Qué vamos a hacer:** crear la cuenta, autorizar GitHub, y crear la base de datos. La API todavía no existe — eso es la Fase 2.

1. Ve a **https://dashboard.render.com/register**.
2. Elige **"Sign up with GitHub"** (recomendado — evita gestionar otra contraseña, y es lo que Render necesita de todos modos para leer el repo). Si prefieres email/contraseña, puedes, pero tendrás que autorizar GitHub igual en el paso 6.
3. GitHub te pedirá autorizar la app "Render". Acepta.
4. En el dashboard de Render, si es tu primera vez, puede aparecer un asistente de bienvenida — puedes cerrarlo/omitirlo (`Skip` o la `X`), no es necesario para lo que sigue.
5. Click en **"New +"** (botón azul, arriba a la izquierda o en la barra superior) → selecciona **"Postgres"**.
6. Si es la primera vez que conectas GitHub desde este flujo, Render te redirige a GitHub para elegir qué repos puede ver. Elige **"Only select repositories"** (no "All repositories" — es el default más seguro) y marca `mdrenniemedina-cpu/medical-pathway`. Click **"Install"** (o "Save").
7. De vuelta en Render, formulario de creación de la base de datos:
   - **Name:** escribe `medical-pathway-db` (o el nombre que prefieras — es solo una etiqueta, no afecta nada técnico, puedes cambiarlo después).
   - **Database** y **User:** **déjalos en blanco** — Render genera nombres automáticamente. No se pueden cambiar después de crear la base, pero tampoco importa cuáles sean: nuestra app se conecta vía `DATABASE_URL` completa, nunca referencia el nombre de la base directamente.
   - **Region:** selecciona **Ohio (US East)**. Si no aparece disponible, usa **Virginia (US East)** — cualquiera de las dos sirve, pero **anota cuál elegiste**, porque el Web Service de la Fase 2 debe usar exactamente la misma.
   - **PostgreSQL Version:** si aparece la opción, selecciona **16** (es la versión contra la que probamos las migraciones en local). Si el mínimo disponible es más nuevo (17+), no debería haber problema — usamos SQL estándar sin extensiones específicas de versión, pero prioriza 16 si está disponible.
   - **Instance Type / Plan:** selecciona **Starter** (~$6/mes). **No selecciones Free** (expira a los 30 días y se borra — ver justificación en §4 más abajo).
   - **No toques** ninguna opción avanzada de "High Availability" ni "Read Replicas" — no aplican a una beta de 5-10 usuarios y solo añaden costo.
8. Click **"Create Database"**.
9. Render te pedirá el método de pago si es la primera vez que seleccionas un plan pago — **este es el punto donde se introducen datos de pago reales**. Confírmalo tú directamente; yo no tengo acceso a esa pantalla.
10. Espera a que el estado pase de "Creating" a **"Available"** (1-2 minutos).
11. Entra a la base de datos creada → pestaña **"Connect"** o **"Info"** → copia el valor de **"Internal Database URL"** (no la "External" — la interna es más rápida y no sale a internet, y es la que usará el Web Service porque va a vivir en la misma región). **Guarda ese valor tú, en un lugar seguro — no me lo pegues a mí en el chat**, lo necesitarás en la Fase 2.

**Cuando termines este paso, avísame y seguimos con la Fase 2 (crear el Web Service de la API).**

---

## 4. Justificación de cada decisión de Render (ya confirmada por el founder — se deja documentada para trazabilidad)

**Región — Ohio o Virginia (US East), la misma para Postgres y Web Service.**
Render no tiene región en Sudamérica; entre las disponibles, US East tiene menor latencia hacia LatAm que Frankfurt/Singapur. El precio no cambia por región. Regla dura: ambos servicios deben compartir región, o Render fuerza usar la Database URL pública en vez de la interna.

**Postgres Starter, no Free.**
El free tier expira a los 30 días y se borra. El piloto + estudio principal puede superar ese plazo — perder la base de datos a mitad de las entrevistas cuesta mucho más que $6/mes. Volumen de datos de 5-10 usuarios es trivial; Starter sobra.

**Web Service Starter, no Free.**
El free tier de Render se "duerme" tras inactividad (cold start de decenas de segundos). En una entrevista supervisada en vivo esto se ve como "la app no funciona" en el peor momento. Starter (512MB, CPU compartida) es más que suficiente para uso no simultáneo de 5-10 personas.

**Costo total: ~$13/mes** (Postgres Starter ~$6 + Web Service Starter ~$7). Vercel Hobby: $0.

---

## 5. FASE 2 — Render: crear el Web Service (la API)

1. En el dashboard de Render, click **"New +"** → **"Web Service"**.
2. Elige el repo `mdrenniemedina-cpu/medical-pathway` de la lista (ya debería aparecer, autorizado en la Fase 1) → **"Connect"**.
3. Formulario de configuración:
   - **Name:** `medical-pathway-api` (o el que prefieras — formará parte de la URL pública: `https://<name>.onrender.com`).
   - **Region:** **la misma que elegiste para Postgres** (Ohio o Virginia) — obligatorio, no opcional.
   - **Branch:** `claude/startup-from-scratch-abn8o3`.
   - **Root Directory:** **déjalo en blanco** (el `package.json` está en la raíz del repo).
   - **Language:** Render puede autodetectar **"Docker"** porque el repo tiene un `Dockerfile` — **cámbialo a "Node"**. No usar Docker aquí: la etapa final del `Dockerfile` corre `npm install --omit=dev`, y `ts-node`/`typescript` (necesarios para el Pre-Deploy Command) son `devDependencies` — quedarían excluidos de esa imagen y las migraciones fallarían. El Dockerfile no se toca (sigue sirviendo para build/CI local); simplemente no se usa para este Web Service.
   - **Build Command:** `npm ci --include=dev && npm run build`
     **Importante — no uses `npm ci && npm run build` a secas (error real encontrado en el primer intento de despliegue):** con la variable `NODE_ENV=production` ya configurada (ver más abajo), `npm ci` por defecto instala solo dependencias de producción y omite `typescript`/`ts-node`/`tsc-alias` — el build falla con errores `TS5090`/`TS5102`/`TS5108` porque, al no encontrar `tsc` localmente, se resuelve una versión de TypeScript mucho más nueva que ya no acepta las opciones del `tsconfig` del proyecto. `--include=dev` fuerza la instalación completa sin importar `NODE_ENV`.
   - **Start Command:** `npm run start`
   - **Instance Type / Plan:** **Starter** (~$7/mes). No Free.
4. Click en **"Advanced"** para desplegar las opciones avanzadas (todavía no hagas click en crear el servicio):
   - **Pre-Deploy Command:** `npm run migrate && npm run seed`
     *(corre las migraciones SQL y carga el catálogo de referencia España/Alemania antes de que el tráfico llegue a la nueva versión — ambos comandos son seguros de re-ejecutar en cada deploy, ver §7).*
   - **Health Check Path:** `/api/v1/health`
     *(así Render usa nuestro propio endpoint de salud para saber si la instancia está viva, no solo si el puerto responde).*
   - **Auto-Deploy:** déjalo en **"Yes"** (default) — así, si en el futuro hace falta un fix, un `git push` a esta rama despliega solo.
   - **Environment Variables** — click "Add Environment Variable" por cada una (nombre a la izquierda, valor a la derecha; **los valores los defines tú, nunca me los compartas en el chat**):

     | Nombre (Key) | Valor a poner |
     |---|---|
     | `DATABASE_URL` | el "Internal Database URL" que copiaste en la Fase 1 |
     | `DATABASE_SSL` | `true` |
     | `JWT_ACCESS_SECRET` | un secreto nuevo y aleatorio (por ejemplo, generado con `openssl rand -hex 32` en tu propia terminal) — **nunca reuses** el `change-me-in-local-dev-only` de tu `.env` local |
     | `JWT_ACCESS_TTL` | `15m` |
     | `JWT_REFRESH_TTL_DAYS` | `30` |
     | `CORS_ALLOWED_ORIGINS` | de momento, `http://localhost:3000` (lo actualizamos con la URL real de Vercel en la Fase 4 — no te bloquees aquí) |
     | `NODE_ENV` | `production` |
     | `RADAR_K_ANONIMATO_UMBRAL` | `5` |
     | `LOG_LEVEL` | `info` |
     | `ADMIN_PANEL_USER` | usuario elegido por ti para el panel privado de "Comparte tu historia" (`/admin-historias.html`) |
     | `ADMIN_PANEL_PASSWORD` | contraseña fuerte, distinta de cualquier otra usada en el proyecto — sin ambas variables, el panel queda inaccesible (fail-closed), nunca abierto |
     | `ACADEMIA_TOKEN_SECRET` | secreto propio para el módulo privado de Academia (ver `docs/34-academia-privada-operacion.md`) — otro `openssl rand -hex 32`, distinto de los anteriores |
     | `ACADEMIA_ARCHIVOS_DIR` | ruta de un disco persistente de Render (ver `docs/34`) — sin disco persistente, los videos/PDF se pierden en cada redeploy |

     **No agregues `PORT`** — Render la inyecta automáticamente y `main.ts` ya la lee.
5. Click **"Create Web Service"**.
6. Render pedirá confirmar el plan de pago si no lo hizo ya en la Fase 1 (mismo método de pago, o uno nuevo si usas cuentas separadas) — **confírmalo tú directamente**.
7. Espera el primer build+deploy (varios minutos: instala dependencias, compila TypeScript, corre el Pre-Deploy Command, arranca el servidor). Sigue el log en pantalla — busca una línea similar a `Nest application successfully started` cerca del final, sin errores rojos antes.
8. Cuando el estado pase a **"Live"**, copia la URL pública que Render te muestra (arriba del todo, algo como `https://medical-pathway-api.onrender.com`).
9. Verifica tú mismo en el navegador: entra a `https://<tu-servicio>.onrender.com/api/v1/health` — debe mostrar `{"status":"ok","database":"ok"}`.

**Cuando tengas esa URL y el health check en verde, pásamela (la URL, no ninguna variable de entorno) y seguimos con la Fase 3 (Vercel).**

---

## 6. FASE 3 — Vercel: crear cuenta y el proyecto del frontend

1. Ve a **https://vercel.com/signup**.
2. Elige **"Continue with GitHub"** y autoriza. Si Vercel pregunta qué repos puede ver, elige **"Only select repositories"** y marca `mdrenniemedina-cpu/medical-pathway` (mismo criterio que con Render).
3. En el dashboard, click **"Add New..."** → **"Project"**.
4. Busca y selecciona `mdrenniemedina-cpu/medical-pathway` → **"Import"**.
5. Pantalla "Configure Project":
   - **Framework Preset:** cámbialo a **"Other"** (no dejes que autodetecte otra cosa).
   - **Root Directory:** **déjalo en el valor por defecto** (`./`, la raíz del repo). *(Nota: una versión anterior de este runbook sugería poner `public` aquí — es incorrecto y se corrige ahora: si pones Root Directory=`public`, el Build Command no podría ver `scripts/generate-frontend-config.js`, que vive fuera de esa carpeta. Con Root Directory en la raíz, todo funciona sin rutas relativas confusas.)*
   - Click en **"Build and Output Settings"** para expandirlo:
     - **Build Command:** activa el override (toggle) y escribe `node scripts/generate-frontend-config.js`
     - **Output Directory:** activa el override y escribe `public`
     - **Install Command:** puedes dejarlo por defecto, o (opcional, más rápido) activarlo y poner `echo "sin dependencias de frontend"` — el script del build usa solo el módulo `fs` incluido en Node, no necesita `npm install`.
   - **Environment Variables:** agrega una:
     - **Name:** `API_BASE_URL`
     - **Value:** la URL de Render de la Fase 2 + `/api/v1`, por ejemplo `https://medical-pathway-api.onrender.com/api/v1` — **exactamente esa, sin barra final extra**.
6. Click **"Deploy"**. Es gratuito en el plan Hobby — no debería pedir método de pago, pero si te lo pide en algún momento, detente y avísame antes de introducir una tarjeta.
7. Espera el deploy (menos de un minuto, es solo un build script + archivos estáticos). Cuando termine, Vercel muestra la URL pública (algo como `https://medical-pathway-xxxx.vercel.app`).
8. Verifica tú mismo: abre esa URL — debería verse la landing con el aviso de beta cerrada arriba.

**Cuando tengas esa URL, pásamela y seguimos con la Fase 4 (conectar los dos servicios).**

---

## 7. FASE 4 — Conectar Render y Vercel (CORS) + verificación conjunta

1. Vuelve al dashboard de Render → tu Web Service → pestaña **"Environment"**.
2. Edita `CORS_ALLOWED_ORIGINS` y cambia el valor a la URL real de Vercel de la Fase 3, por ejemplo:
   `https://medical-pathway-xxxx.vercel.app,http://localhost:3000`
   (coma-separado — así dejas también tu `localhost:3000` para seguir probando en local sin bloquear CORS).
3. Guarda — Render redeploya automáticamente con la nueva variable (no hace falta tocar código ni el Pre-Deploy Command otra vez).
4. Avísame cuando el redeploy termine ("Live" de nuevo).

**Corrección importante (descubierta durante el despliegue real):** el entorno donde corre esta sesión de IA tiene salida a internet restringida por una política de red — solo alcanza dominios específicos permitidos (npm, GitHub, Anthropic, etc.), no dominios arbitrarios como `*.onrender.com` o `*.vercel.app`. Verificado con dos herramientas distintas (curl directo y fetch web), ambas devuelven `403` de la política, no un error del despliegue. **Esto significa que las verificaciones automatizadas (curl al health check, smoke test de Playwright contra la URL pública) NO se pueden ejecutar desde esta sesión** — el checklist de la sección 8 se hace con el navegador del founder, guiado paso a paso, igual que el resto de este runbook. Si en el futuro esta sesión corre en un entorno con salida a internet sin restricciones, esas verificaciones sí podrían automatizarse.

## 8. Verificación conjunta (la hacemos juntos tras la Fase 4)

Checklist exacto que pediste, en orden:
- [ ] Conexión Vercel ↔ Render: `resultados.html` en la URL de Vercel calcula compatibilidad real (confirma que `API_BASE_URL`/CORS quedaron bien).
- [ ] Migraciones ejecutadas: `npm run migrate:status` (puedes correrlo desde el "Shell" del Web Service en Render) muestra todas aplicadas.
- [ ] Perfil Internacional se crea automáticamente tras el registro (mismo mecanismo de outbox que en local).
- [ ] Outbox funcionando: el paso anterior es la prueba directa — si el perfil aparece en segundos, el `OutboxDispatcherService` está corriendo en el contenedor persistente de Render.
- [ ] Health check: `https://<render>.onrender.com/api/v1/health` → `{"status":"ok"}`.
- [ ] Navegador móvil: abrir la URL de Vercel desde un teléfono real (además de la pasada en viewport móvil que ya corre el smoke test).
- [ ] HTTPS: ambas URLs deben cargar con candado, sin advertencias — por defecto en ambas plataformas.
- [ ] Sin errores CORS: consola del navegador limpia al usar la app desde la URL de Vercel.
- [ ] Recorrido completo desde la URL pública: landing → registro → perfil → compatibilidad → explicación → proyección → iniciar ruta — lo ejecuto yo con `BASE_URL=<vercel-url> node scripts/smoke-browser-manual.js`.

## 9. Migraciones y semilla — procedimiento controlado

- El Pre-Deploy Command (`npm run migrate && npm run seed`) es idempotente: `db/migrate.ts` lleva registro en `shared.schema_migrations`, y `db/seed/seed.ts` usa `ON CONFLICT (id) DO NOTHING`.
- **Verificado en el código:** el seed solo carga catálogo regulatorio (destinos España/Alemania, rutas, reglas) con fuente y fecha por campo — cero cuentas de prueba, cero datos personales.
- **Limitación conocida, no corregida aquí (fuera de alcance de "desplegar"):** las `fecha_verificacion` del seed están hardcodeadas como literal `'2026-07-19'` en el código, no derivadas de una revisión periódica real. Hoy coincide con la fecha real; no se actualiza sola con el tiempo.

## 10. Validación local previa (ya ejecutada antes de este runbook)

```
npm run lint          → limpio
npx tsc --noEmit       → limpio
npm run build          → limpio
npm run test:all       → 16/16 tests, 2 suites (unit + arquitectura)
node scripts/smoke-browser-manual.js  → 13/13 pasos OK contra localhost:3000
```

## 11. Rollback y restauración

### Render (API/DB) falla o rompe producción
1. Dashboard del Web Service → historial de deploys → **"Rollback to previous deploy"** (instantáneo).
2. Si el problema es de datos: Postgres Starter incluye backups automáticos diarios — restaurar desde el dashboard de la base, backup anterior al deploy problemático.
3. Si el Pre-Deploy Command falló antes de aplicar nada nuevo, no hay nada que revertir en la base.

### Vercel (frontend) falla o rompe
1. Cada deployment anterior tiene su propia URL inmutable — usar **"Promote to Production"** sobre el último bueno.

### Apagar/eliminar todo
1. Vercel: Project Settings → Delete Project (sin costo pendiente, Hobby).
2. Render: eliminar Web Service y Postgres desde sus dashboards → Settings → Delete. Verificar que no quede ningún recurso activo (evita seguir generando el cargo mensual).
3. No hay backups ni réplicas fuera de Render/Vercel que limpiar aparte.

## 12. Reconstrucción completa desde cero — checklist de auto-suficiencia

Todo lo que un desarrollador nuevo necesita, sin acceso a ninguna cuenta existente:
- El código de este runbook (§3, §5, §6, §7) más el repo en el commit `8c53404` (o posterior) son **suficientes** para recrear Postgres, Web Service y proyecto Vercel desde cero.
- Los únicos valores que no viven en el repo son los de la tabla de variables de entorno (§5, paso 4) — todos están documentados **por nombre**, y de dónde sale cada valor (Internal Database URL de Postgres, un secreto generado localmente, la URL del otro servicio) — nunca un valor fijo que solo exista dentro de una cuenta concreta.
- Ninguna configuración manual "solo en el dashboard" queda sin documentar aquí: región, planes, build/start/pre-deploy commands, health check path, y las 9 variables de entorno del Web Service, más las 3 configuraciones de build de Vercel (Framework, Build Command, Output Directory) y su única variable (`API_BASE_URL`).
