/**
 * Frontend del MVP Beta — sin framework (HTML/CSS/JS plano + docs/27),
 * pero instrumentado igual que en el Sprint 1: cada paso del recorrido
 * dispara eventos analíticos reales (ver docs/16-hipotesis-sprint-1.md).
 */
const API_BASE = '/api/v1';

function getToken() {
  return localStorage.getItem('mp_access_token');
}
function setToken(token) {
  localStorage.setItem('mp_access_token', token);
}
function getPerfilId() {
  return localStorage.getItem('mp_perfil_id');
}
function setPerfilId(id) {
  localStorage.setItem('mp_perfil_id', id);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

/**
 * Registra un evento analítico. Solo acepta los eventos que el frontend
 * tiene permitido reportar (ver AnalyticsController) — `recomendacion_generada`
 * e `inicio_de_ruta` se derivan automáticamente de eventos de dominio reales
 * en el backend, nunca se disparan desde aquí.
 */
function track(tipoEvento, propiedades = {}) {
  const perfilId = getPerfilId();
  fetch(`${API_BASE}/analitica/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipoEvento, perfilId: perfilId || undefined, propiedades }),
    keepalive: true, // permite que la llamada sobreviva a un cambio de página (abandono)
  }).catch(() => {});
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/registro.html';
  }
}
