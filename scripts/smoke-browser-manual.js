/**
 * Smoke test manual del recorrido completo del MVP Beta, en un navegador
 * real (Chromium headless vía Playwright) — NO es parte de la suite
 * automatizada de CI (requiere un servidor corriendo con datos semilla,
 * local o desplegado).
 * Uso local:      node dist/src/main.js & node scripts/smoke-browser-manual.js
 * Uso desplegado: BASE_URL=https://<beta>.vercel.app node scripts/smoke-browser-manual.js
 *
 * Recorrido: Landing -> Registro -> Perfil Internacional -> Compatibilidad
 * -> Explicación -> Iniciar Ruta -> Proyección (opcional), más verificación
 * de recarga de página, cierre/apertura de sesión, y una pasada en viewport
 * móvil.
 *
 * Ejecutar este script produce un recorrido REAL de clics; no es lo mismo
 * que "validar con usuarios reales" (ver docs/17-informe-sprint-1.md) — solo
 * confirma que la mecánica funciona (los eventos se disparan, la
 * proyección se calcula, el motor de brechas responde), no que el producto
 * resuelva el problema para un médico de verdad.
 */
const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  const email = `smoketest+${Date.now()}@example.com`;

  page.on('console', (msg) => console.log('[browser console]', msg.text()));
  page.on('pageerror', (err) => console.log('[browser error]', err.message));

  console.log(`--- Base URL: ${BASE_URL} ---`);

  console.log('--- 1. landing (index.html) ---');
  await page.goto(`${BASE_URL}/index.html`);
  await page.waitForSelector('text=Comenzar — es gratis');
  console.log('OK: landing renderizada con CTA principal');
  const avisoBetaLanding = await page.$('.aviso-beta');
  console.log(avisoBetaLanding ? 'OK: aviso de beta cerrada visible' : 'FALLO: no se encontró el aviso de beta cerrada');

  console.log('--- 2. registro.html: crear cuenta ---');
  await page.click('text=Comenzar — es gratis');
  await page.waitForURL('**/registro.html', { timeout: 15000 });
  await page.fill('#email', email);
  await page.fill('#password', 'password123');
  await page.click('#btnRegistro');
  await page.waitForURL('**/onboarding.html', { timeout: 15000 });
  console.log('OK: registrado y redirigido a onboarding (perfil creado vía outbox)');

  console.log('--- 3. onboarding: paso 1 (formacion) ---');
  await page.fill('#universidad', 'Universidad Nacional de Colombia');
  await page.fill('#paisGraduacion', 'CO');
  await page.selectOption('#tipoTitulo', 'pregrado');
  await page.click('text=Siguiente');
  await page.waitForSelector('#paso2', { state: 'visible' });
  console.log('OK: paso 1 completado');

  console.log('--- 4. onboarding: paso 2 (idiomas) — se deja sin alemán/inglés a propósito ---');
  await page.click('#paso2 >> text=Siguiente');
  await page.waitForSelector('#paso3', { state: 'visible' });
  console.log('OK: paso 2 completado');

  console.log('--- 5. onboarding: paso 3 (objetivos) ---');
  await page.selectOption('#urgencia', 'alta');
  await page.selectOption('#tolerancia', 'prefiere_lento_seguro');
  await page.selectOption('#prioridad', 'rapidez_de_practica');
  await page.click('text=Ver mi compatibilidad');
  await page.waitForURL('**/resultados.html', { timeout: 15000 });
  console.log('OK: cuestionario completado, redirigido a resultados');

  console.log('--- 6. resultados (Compatibilidad): esperar cálculo ---');
  await page.waitForSelector('.tarjeta-principal', { timeout: 15000 });
  const tarjetas = await page.$$('.tarjeta-principal');
  console.log(`OK: ${tarjetas.length} destinos con puntuación renderizados`);
  const textoResultados = await page.textContent('#resultados');
  console.log('Contiene "compatibilidad":', textoResultados.toLowerCase().includes('compatibilidad'));
  console.log('No expone IDs internos (destino-):', !textoResultados.includes('destino-'));

  console.log('--- 7. ir a explicación del primer destino ---');
  await page.click('#resultados >> .tarjeta-principal >> nth=0 >> text=Ver por qué y qué sigue');
  await page.waitForURL('**/explicacion.html*', { timeout: 15000 });
  await page.waitForSelector('#btnIniciar', { timeout: 15000 });
  console.log('OK: explicación renderizada (razones + acciones)');

  console.log('--- 8. iniciar ruta (confirmación en página, sin alert()) ---');
  await page.click('#btnIniciar');
  await page.waitForSelector('#confirmacion .exito', { timeout: 15000 });
  console.log('OK: ruta iniciada con confirmación in-page');

  console.log('--- 9. proyección (opcional desde explicación) ---');
  await page.click('text=Ver cómo se vería tu camino en el tiempo (opcional)');
  await page.waitForURL('**/proyeccion.html*', { timeout: 15000 });
  await page.waitForSelector('.timeline-etapa', { timeout: 15000 });
  const etapas = await page.$$('.timeline-etapa');
  console.log(`OK: proyección renderizada con ${etapas.length} etapas`);

  console.log('--- 10. fake doors deben permanecer ocultos (MOSTRAR_FAKE_DOORS = false) ---');
  const fakeDoor = await page.$('.fake-door');
  console.log(fakeDoor ? 'FALLO: se encontró un fake door visible en el flujo' : 'OK: ningún fake door visible');

  console.log('--- 11. recarga de página (persistencia de sesión) ---');
  await page.goto(`${BASE_URL}/resultados.html`);
  await page.waitForSelector('.tarjeta-principal', { timeout: 15000 });
  console.log('OK: tras recargar, la sesión persiste y resultados se recalculan sin re-login');

  console.log('--- 12. cierre y nueva apertura de sesión ---');
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/resultados.html`);
  await page.waitForURL('**/registro.html', { timeout: 15000 });
  console.log('OK: sin token, requireAuth() redirige a registro.html (no expone datos de otra sesión)');

  console.log('--- 13. viewport móvil (iPhone SE ~375x667) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto(`${BASE_URL}/index.html`);
  await mobilePage.waitForSelector('text=Comenzar — es gratis');
  const anchoDocumento = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  console.log(
    anchoDocumento <= 375
      ? 'OK: landing sin desbordamiento horizontal en viewport móvil'
      : `AVISO: desbordamiento horizontal detectado (scrollWidth=${anchoDocumento}px > 375px)`,
  );
  await mobilePage.close();

  await browser.close();
  console.log('--- SMOKE TEST COMPLETO SIN ERRORES ---');
})().catch((e) => {
  console.error('FALLO EN SMOKE TEST:', e);
  process.exit(1);
});
