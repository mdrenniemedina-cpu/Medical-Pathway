/**
 * Smoke test manual del recorrido completo del Sprint 1, en un navegador
 * real (Chromium headless vía Playwright) — NO es parte de la suite
 * automatizada de CI (requiere un servidor corriendo con datos semilla).
 * Uso: node dist/src/main.js & node scripts/smoke-browser-manual.js
 *
 * Ejecutar este script produce un recorrido REAL de clics; no es lo mismo
 * que "validar con usuarios reales" (ver docs/17-informe-sprint-1.md) — solo
 * confirma que la mecánica funciona (los eventos se disparan, la
 * proyección se calcula, el motor de brechas responde), no que el producto
 * resuelva el problema para un médico de verdad.
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  const email = `smoketest+${Date.now()}@example.com`;

  page.on('console', (msg) => console.log('[browser console]', msg.text()));
  page.on('pageerror', (err) => console.log('[browser error]', err.message));

  console.log('--- 1. index.html: registro ---');
  await page.goto('http://localhost:3000/index.html');
  await page.fill('#email', email);
  await page.fill('#password', 'password123');
  await page.click('#btnRegistro');
  await page.waitForURL('**/onboarding.html', { timeout: 15000 });
  console.log('OK: registrado y redirigido a onboarding');

  console.log('--- 2. onboarding: paso 1 (formacion) ---');
  await page.fill('#universidad', 'Universidad Nacional de Colombia');
  await page.fill('#paisGraduacion', 'CO');
  await page.selectOption('#tipoTitulo', 'pregrado');
  await page.click('text=Siguiente');
  await page.waitForSelector('#paso2', { state: 'visible' });
  console.log('OK: paso 1 completado');

  console.log('--- 3. onboarding: paso 2 (idiomas) — se deja sin alemán/inglés a propósito ---');
  await page.click('#paso2 >> text=Siguiente');
  await page.waitForSelector('#paso3', { state: 'visible' });
  console.log('OK: paso 2 completado');

  console.log('--- 4. onboarding: paso 3 (objetivos) ---');
  await page.selectOption('#urgencia', 'alta');
  await page.selectOption('#tolerancia', 'prefiere_lento_seguro');
  await page.selectOption('#prioridad', 'rapidez_de_practica');
  await page.click('text=Ver mi recomendación');
  await page.waitForURL('**/resultados.html', { timeout: 15000 });
  console.log('OK: cuestionario completado, redirigido a resultados');

  console.log('--- 5. resultados: esperar cálculo ---');
  await page.waitForSelector('.card', { timeout: 15000 });
  const tarjetas = await page.$$('.card');
  console.log(`OK: ${tarjetas.length} destinos con puntuación renderizados`);
  const textoResultados = await page.textContent('#resultados');
  console.log('Contiene "Compatibilidad":', textoResultados.includes('Compatibilidad'));

  console.log('--- 6. expandir razones y acciones del primer destino ---');
  await page.click('.card >> nth=0 >> summary >> nth=0');
  await page.click('.card >> nth=0 >> summary >> nth=1');
  await page.waitForTimeout(300);

  console.log('--- 7. ver mi futuro ---');
  await page.click('.card >> nth=0 >> text=Ver mi futuro en este destino');
  await page.waitForURL('**/proyeccion.html*', { timeout: 15000 });
  await page.waitForSelector('.timeline-etapa', { timeout: 15000 });
  const etapas = await page.$$('.timeline-etapa');
  console.log(`OK: proyección renderizada con ${etapas.length} etapas`);

  console.log('--- 8. fake doors ---');
  const botonComunidad = await page.$('text=Quiero contactar a un médico que ya lo logró');
  if (botonComunidad) {
    await botonComunidad.click();
    console.log('OK: clic en fake door de comunidad');
  }
  const botonRadar = await page.$('text=Quiero saber cuánto están tardando otros médicos como yo (Radar de Espera)');
  if (botonRadar) {
    await botonRadar.click();
    console.log('OK: clic en fake door de radar de espera');
  } else {
    console.log('AVISO: no se encontró CTA de radar — puede que este destino no tenga etapa de espera visible');
  }

  console.log('--- 9. volver e iniciar ruta ---');
  await page.goto('http://localhost:3000/resultados.html');
  await page.waitForSelector('.card', { timeout: 15000 });
  page.once('dialog', (d) => d.accept());
  await page.click('.card >> nth=0 >> text=Iniciar esta ruta');
  await page.waitForTimeout(500);
  console.log('OK: click en iniciar ruta enviado');

  await browser.close();
  console.log('--- SMOKE TEST COMPLETO SIN ERRORES ---');
})().catch((e) => {
  console.error('FALLO EN SMOKE TEST:', e);
  process.exit(1);
});
