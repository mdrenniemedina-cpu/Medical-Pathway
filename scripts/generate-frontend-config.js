/**
 * Genera public/config.js en build time a partir de la variable de entorno
 * API_BASE_URL (configurada como Build Command en Vercel, ver
 * docs/decisions/ADR-024-despliegue-beta-vercel-render.md). NUNCA se
 * commitea — public/config.js está en .gitignore. Si no se define
 * API_BASE_URL (desarrollo local, donde el frontend se sirve desde el
 * mismo origen que la API vía ServeStaticModule), se genera un archivo
 * vacío y app.js usa su fallback '/api/v1' relativo.
 */
const fs = require('fs');
const path = require('path');

const apiBaseUrl = process.env.API_BASE_URL ?? '';
const contenido = apiBaseUrl
  ? `window.__API_BASE__ = ${JSON.stringify(apiBaseUrl)};\n`
  : '// API_BASE_URL no definida — app.js usa su fallback relativo /api/v1\n';

fs.writeFileSync(path.join(__dirname, '..', 'public', 'config.js'), contenido);
console.log(`public/config.js generado (API_BASE_URL=${apiBaseUrl || '(vacío, fallback local)'})`);
