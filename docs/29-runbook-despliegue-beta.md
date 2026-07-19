# Runbook — Despliegue de la Beta Cerrada (Vercel + Render)

> Ejecuta ADR-024. Este documento es el procedimiento operativo paso a paso: qué crear, qué variables configurar, cómo verificar, y cómo revertir si algo falla. Ámbito estrictamente limitado al despliegue — ningún cambio de funcionalidad ni de arquitectura más allá de lo indispensable para que el split frontend/backend funcione (ver "Cambios de código realizados" abajo).

## 0. Commit desplegado

- **Rama:** `claude/startup-from-scratch-abn8o3`
- **Commit verificado y listo para desplegar:** `8c53404` — pasó lint, `tsc --noEmit`, build, `test:all` (16/16) y smoke test Playwright (13/13) en local. Si la rama recibe commits nuevos antes de ejecutar el deploy, repetir la validación de la sección 5 contra el HEAD real y actualizar este hash antes de desplegar.

## 1. Cambios de código realizados para este despliegue (ya en el repo, ya validados)

| Cambio | Archivo | Por qué |
|---|---|---|
| CORS restringido por variable de entorno (`CORS_ALLOWED_ORIGINS`, coma-separado; default `http://localhost:3000` si no se define) | `src/main.ts` | Antes `app.enableCors()` sin restricción — la beta cerrada exige permitir solo el dominio de Vercel y los orígenes locales de desarrollo. |
| `window.__API_BASE__` con fallback a `/api/v1` relativo | `public/app.js` | Permite que el mismo `app.js` funcione igual en local (mismo origen) y en Vercel (origen distinto al de la API en Render). |
| Generador de `public/config.js` a partir de `API_BASE_URL` | `scripts/generate-frontend-config.js` (nuevo) | Vercel lo ejecuta como Build Command — es la "variable de entorno para la URL del API" pedida, sin hardcodear nada en el repo. `public/config.js` está en `.gitignore`. |
| Aviso de beta cerrada (banner) | `public/app.js` (`renderAvisoBeta`), `public/styles.css` (`.aviso-beta`) | Requisito explícito: beta/orientativo/fuentes verificables/no subir datos sensibles, visible en toda la app. |
| `noindex, nofollow` en cada página + `public/robots.txt` (`Disallow: /`) | los 6 `.html` de `public/` | Beta cerrada: no debe indexarse en buscadores. |
| `scripts/smoke-browser-manual.js` acepta `BASE_URL` | — | Permite correr el mismo smoke test contra `localhost` o contra la URL pública desplegada. |

Todos estos cambios pasaron `lint`, `tsc --noEmit`, `build`, `test`, `test:arch` y el smoke test de Playwright en local antes de proceder (ver sección 5).

## 2. Punto de parada — decisiones que requieren al founder

**No se ha creado ninguna cuenta ni se ha confirmado ningún recurso de pago.** Los siguientes pasos requieren tu acción directa:

### 2.1 Render (genera cargo — ~$13/mes, ver ADR-024 §costos)
1. Crear cuenta en Render (o autorizar acceso a GitHub si se usa login con GitHub — Render pedirá autorización para leer el repo `mdrenniemedina-cpu/medical-pathway`).
2. Crear una base **PostgreSQL** — plan **Starter** (~$6/mes; el free tier expira en 30 días, no sirve para una beta que pueda extenderse). Copiar la **Internal Database URL**.
3. Crear un **Web Service** desde el repo, rama `claude/startup-from-scratch-abn8o3`:
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start`
   - **Pre-Deploy Command:** `npm run migrate && npm run seed`
   - Plan Starter (~$7/mes)
4. Variables de entorno del Web Service (nombres — valores nunca se documentan aquí):
   - `DATABASE_URL`, `DATABASE_SSL=true`, `JWT_ACCESS_SECRET` (generar uno nuevo, nunca reusar el de `.env` local), `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL_DAYS`, `CORS_ALLOWED_ORIGINS` (URL de Vercel del paso 2.2, una vez exista — puede completarse después y redeployar), `NODE_ENV=production`, `RADAR_K_ANONIMATO_UMBRAL`, `LOG_LEVEL=info`.

### 2.1.bis Justificación de cada decisión de Render (pedida explícitamente antes de confirmar cualquier plan de pago)

**Región — recomendación: Ohio (US East) o Virginia, la misma para Postgres y Web Service.**
- Render no tiene región en Sudamérica; entre las disponibles (Oregon, Ohio, Virginia, Frankfurt, Singapur), Ohio/Virginia (costa este de EE.UU.) tienen menor latencia de red hacia Latinoamérica que Frankfurt o Singapur — relevante porque las entrevistas son sesiones en vivo con el founder observando la pantalla del participante, no tráfico batch.
- El precio de Render **no varía por región** para el mismo tipo de instancia — esta decisión es puramente de latencia, no de costo.
- **Regla dura, no opcional:** Postgres y Web Service deben quedar en la **misma región** — si no, Render obliga a usar la External Database URL (sale a internet público) en vez de la Internal Database URL (red privada interna, más rápida y sin exponer la base a internet). Elegir regiones distintas sería un error de configuración, no una alternativa válida.

**Plan de Postgres — recomendación: Starter (~$6/mes), no el free tier.**
- El free tier de Render Postgres expira a los 30 días (con 14 días de gracia) y luego se **borra**. El piloto (3-5 entrevistas) más el estudio principal (10-15) pueden fácilmente superar 30 días de calendario — perder la base de datos a mitad del estudio sería mucho más costoso que $6/mes.
- Para 5-10 usuarios de beta, el volumen de datos es trivial (decenas de filas de cuentas/perfiles/resultados + el catálogo semilla) — Starter (el nivel pago más bajo) sobra por un margen enorme. No hay ninguna razón de rendimiento para pagar un nivel superior en esta fase.
- **Alternativa más barata real:** ninguna, dado el requisito de "no perder datos a mitad del estudio". El free tier sería la opción de $0 pero con ese riesgo concreto — se descarta.

**Plan de Web Service — recomendación: Starter (~$7/mes), no el free tier.**
- Render sí ofrece un Web Service gratuito, pero **se "duerme" tras un período de inactividad** y tarda decenas de segundos en despertar (cold start) con la primera petición. En una entrevista supervisada en vivo, eso se vería como "la aplicación no funciona" en el peor momento posible — justo cuando el médico está mirando la pantalla. Este es el motivo concreto (no genérico) para pagar Starter en lugar de usar el free tier.
- Starter (512 MB RAM, CPU compartida) es más que suficiente para 5-10 usuarios con uso supervisado, no simultáneo masivo — no hay necesidad de un plan superior ni de autoescalado en esta fase.
- **Alternativa más barata real:** el free tier ahorraría ~$7/mes, pero reintroduce el riesgo de cold-start justo durante las entrevistas — se descarta por el objetivo explícito de esta beta (evidencia limpia, sin fricción técnica que contamine la percepción del producto).

**Costo total confirmado con estas decisiones: ~$13/mes** (Postgres Starter ~$6 + Web Service Starter ~$7), sin Vercel (Hobby, $0 para este alcance).

**DETENTE AQUÍ y confirma conmigo la región y los dos planes (Postgres Starter, Web Service Starter) antes de crear la cuenta de Render o seleccionar cualquier plan con costo.**

### 2.2 Vercel (gratuito para este alcance — Hobby)
1. Crear cuenta en Vercel (o autorizar acceso a GitHub, mismo repo).
2. Nuevo proyecto, **Root Directory = `public`**, framework preset "Other".
3. Build Command: `node ../scripts/generate-frontend-config.js` (ajustar la ruta relativa según cómo Vercel resuelva el working directory con Root Directory=`public`; alternativa más robusta: quitar Root Directory, dejarlo en la raíz del repo, y usar Output Directory=`public` con Build Command `node scripts/generate-frontend-config.js`).
4. Variable de entorno: `API_BASE_URL` = URL del Web Service de Render del paso 2.1 + `/api/v1` (p. ej. `https://medical-pathway-api.onrender.com/api/v1`).
5. **No genera cargo en Hobby** — aun así, confirmar antes de crear la cuenta si prefieres usar una cuenta de GitHub/email específica para el proyecto.

**DETENTE AQUÍ y confirma conmigo antes de crear la cuenta de Vercel o autorizar acceso a GitHub, aunque no tenga costo.**

## 3. Orden de ejecución recomendado

1. Render Postgres → 2. Render Web Service (con `CORS_ALLOWED_ORIGINS` apuntando temporalmente a `http://localhost:3000` si Vercel aún no existe) → 3. Verificar `/api/v1/health` en la URL de Render → 4. Vercel con `API_BASE_URL` apuntando a la URL real de Render → 5. Volver a Render y actualizar `CORS_ALLOWED_ORIGINS` con la URL real de Vercel → 6. Redeploy del Web Service → 7. Smoke test contra la URL de Vercel.

## 4. Migraciones y semilla — procedimiento controlado

- El **Pre-Deploy Command** de Render (`npm run migrate && npm run seed`) es idempotente: `db/migrate.ts` lleva un registro en `shared.schema_migrations` (no reaplica lo ya aplicado) y `db/seed/seed.ts` usa `ON CONFLICT (id) DO NOTHING` (no duplica filas).
- **Verificado en el código:** el seed solo carga catálogo regulatorio de referencia (destinos España/Alemania, rutas de homologación, reglas de compatibilidad) con fuente y fecha por campo — **cero cuentas de prueba, cero datos personales.**
- **Limitación conocida a documentar, no a corregir en este despliegue** (fuera de alcance): las fechas de verificación de fuente en el seed (`fecha_verificacion`) están hardcodeadas como literal `'2026-07-19'` en `db/seed/seed.ts`, no derivadas de una revisión real fecha-a-fecha de cada URL. Hoy coincide con la fecha real, pero no se actualiza sola — con el tiempo, el badge "Fuente verificada 2026-07-19" dejará de ser una fecha de verificación genuina si nadie revisita las fuentes. No se corrige aquí porque implica decidir un proceso de revisión periódica de fuentes, ajeno al alcance de "desplegar".

## 5. Validación local previa (ejecutada antes de este runbook)

```
npm run lint        → limpio
npx tsc --noEmit     → limpio
npm run build        → limpio
npm run test:all     → 16/16 tests, 2 suites (unit + arquitectura)
node scripts/smoke-browser-manual.js  → 13/13 pasos OK contra localhost:3000
```

## 6. Rollback y restauración

### Si el despliegue de Render falla o rompe producción
1. Render conserva el historial de deploys — usar **"Rollback to previous deploy"** en el dashboard del Web Service (instantáneo, sin rehacer build).
2. Si el problema es de datos (una migración rompió algo): Render Postgres Starter incluye backups automáticos diarios — restaurar desde el backup anterior al deploy problemático vía el dashboard de la base de datos.
3. Si ninguna migración nueva se aplicó todavía (falla antes del Pre-Deploy Command), no hay nada que revertir en la base — solo repetir el deploy tras corregir el problema.

### Si el despliegue de Vercel falla o rompe el frontend
1. Vercel mantiene cada deployment anterior con su propia URL inmutable — usar **"Promote to Production"** sobre el último deployment bueno (instantáneo).

### Apagar/eliminar todo (fin de la beta cerrada o de este runbook)
1. Vercel: eliminar el proyecto desde Project Settings → Delete Project. Sin costo pendiente (Hobby).
2. Render: eliminar el Web Service y la base Postgres desde sus respectivos dashboards → Settings → Delete. **Verificar que no queden recursos activos** para no seguir generando el cargo mensual.
3. Ningún dato queda fuera de Render/Vercel — no hay backups externos ni réplicas en otro proveedor que limpiar.

## 7. Qué falta verificar una vez existan las URLs reales

Esta sección se completa **después** de que el founder cree las cuentas y yo pueda alcanzar las URLs públicas:
- [ ] `curl` al health check de Render desde este entorno.
- [ ] Smoke test de Playwright con `BASE_URL=<url-de-vercel>`.
- [ ] Confirmar que `CORS_ALLOWED_ORIGINS` en Render quedó con la URL exacta de Vercel (no `*`).
- [ ] Confirmar HTTPS activo en ambos dominios (por defecto en ambas plataformas, verificar igual).
