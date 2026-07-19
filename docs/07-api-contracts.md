# Contratos de API

> La superficie de la API está organizada **por bounded context** (`05-domain-model-ddd.md`), no por pantalla del MVP — un mismo endpoint de Descubrimiento sirve tanto a la pantalla de resultados como a un futuro widget embebido, porque expone el dominio, no una vista específica.

## Convenciones generales

- REST sobre HTTPS, JSON. Prefijo `/api/v1/{contexto}/...`.
- Autenticación: header `Authorization: Bearer <access_token>` (JWT corto, ver `08-auth-model.md`).
- Errores: formato uniforme `{ "error": { "code": "STRING_CODE", "message": "...", "details": {...} } }`.
- Todo campo de hecho editorial (destino, ruta) se devuelve siempre junto con `fuente_url` y `fecha_verificacion` — nunca se omite en la respuesta, para que el frontend nunca pueda mostrar un dato sin su procedencia.

## Identidad y Acceso

```
POST   /api/v1/identidad/registro          { email, password } → 201 { cuenta_id, access_token, refresh_token }
POST   /api/v1/identidad/login             { email, password } → 200 { access_token, refresh_token }
POST   /api/v1/identidad/refresh           { refresh_token } → 200 { access_token }
POST   /api/v1/identidad/logout            → 204
```

## Perfil Internacional

```
GET    /api/v1/perfil/me                   → 200 PerfilInternacional completo
PUT    /api/v1/perfil/me                   { ...campos... } → 200 (dispara PerfilActualizado internamente)
POST   /api/v1/perfil/me/formacion         { universidad, pais_graduacion, ... } → 201
POST   /api/v1/perfil/me/idiomas           { idioma, nivel } → 201
POST   /api/v1/perfil/me/verificacion      { tipo: "correo_profesional" | "titulo", archivo? } → 202 (queda pendiente de revisión por moderador)
```

Ejemplo de respuesta `GET /perfil/me` (resumido):
```json
{
  "perfil_id": "uuid",
  "nivel_verificacion": "correo_verificado",
  "formacion_academica": [{ "universidad": "Universidad Nacional de Colombia", "pais_graduacion": "CO", "especialidad": "medicina_general" }],
  "idiomas": [{ "idioma": "es", "nivel": "nativo" }, { "idioma": "en", "nivel": "B1" }],
  "presupuesto_rango": "bajo",
  "urgencia": "alta",
  "tolerancia_examen_competitivo": "prefiere_lento_seguro"
}
```

## Descubrimiento y Compatibilidad

```
POST   /api/v1/descubrimiento/calcular     → 200 ResultadoDeDescubrimiento (usa el PerfilSnapshot actual, no requiere body)
GET    /api/v1/descubrimiento/resultados/{id} → 200 (recupera un resultado pasado, con las reglas_version usadas en su momento)
POST   /api/v1/descubrimiento/seleccionar-destino  { resultado_id, destino_id } → 201 (dispara DestinoSeleccionado → crea RutaPersonalizada)
```

Ejemplo de respuesta `POST /descubrimiento/calcular` (el contrato que hace literal el ejemplo del founder):
```json
{
  "resultado_id": "uuid",
  "generado_en": "2026-07-19T10:00:00Z",
  "puntuaciones": [
    {
      "destino_id": "uuid-espana",
      "nombre": "España",
      "porcentaje_compatibilidad": 91,
      "razones": [
        { "criterio": "barrera_idioma", "aporte_puntos": 30, "explicacion_legible": "Sin barrera de idioma: el español ya es tu lengua materna." },
        { "criterio": "reconocimiento_universidad", "aporte_puntos": 20, "explicacion_legible": "Tu universidad tiene homologaciones previas registradas en España." },
        { "criterio": "demanda_laboral", "aporte_puntos": 25, "explicacion_legible": "Alta demanda laboral: escasez estructural reconocida por el Ministerio de Sanidad." },
        { "criterio": "tiempo_espera", "aporte_puntos": -8, "explicacion_legible": "El tiempo promedio de espera de homologación es elevado (9-24 meses)." }
      ]
    },
    {
      "destino_id": "uuid-alemania",
      "nombre": "Alemania",
      "porcentaje_compatibilidad": 54,
      "razones": [
        { "criterio": "barrera_idioma", "aporte_puntos": -25, "explicacion_legible": "Requiere alemán B2 general + C1 médico; no tienes alemán registrado en tu perfil." },
        { "criterio": "demanda_laboral", "aporte_puntos": 30, "explicacion_legible": "Escasez estructural severa (Ärztemangel), alta demanda de médicos extranjeros." }
      ]
    }
  ]
}
```

## Ruta del Médico

```
GET    /api/v1/ruta-medico/mi-ruta                    → 200 RutaPersonalizada activa (o 404 si no ha elegido destino)
GET    /api/v1/ruta-medico/mi-ruta/etapas             → 200 lista de EtapaPersonalizada
PATCH  /api/v1/ruta-medico/etapas/{id}                { estado: "completada" } → 200 (valida prerequisitos, dispara EtapaCompletada / EntroAEtapaDeEspera)
POST   /api/v1/ruta-medico/etapas/{id}/documentos     multipart/form-data → 201 DocumentoAsociado
```

## Radar de Espera

```
POST   /api/v1/radar-espera/registros                 { destino_id, ruta_homologacion_id, region, ventana_envio } → 201 RegistroDeExpediente
PATCH  /api/v1/radar-espera/registros/mi-registro      { resultado, fecha_resolucion } → 200
GET    /api/v1/radar-espera/mi-cohorte                 → 200 CohorteDeComparacion + posición aproximada del usuario (requiere que el usuario tenga un registro propio — mecanismo de reciprocidad, ver `14-estrategia-retencion-engagement.md`)
```

Ejemplo de respuesta `GET /radar-espera/mi-cohorte` (responde exactamente lo que pidió el founder: distribución, no solo promedio):
```json
{
  "cohorte": { "destino": "España", "region": "Madrid", "ventana_envio": "2026-Q1" },
  "n_registros": 34,
  "nivel_confianza_estimacion": "alta",
  "distribucion_dias": { "p25": 270, "p50": 410, "p75": 560, "p90": 720 },
  "proporcion_resuelta": 0.41,
  "posicion_aproximada_usuario": "tu expediente lleva 380 días — estás en el percentil 45 de tu cohorte, dentro del rango esperado"
}
```
Si `n_registros < umbral_k_anonimato`: `{ "cohorte": {...}, "n_registros": 3, "disponible": false, "mensaje": "Aún no hay suficientes datos para tu grupo específico. Vuelve pronto." }` — nunca se devuelve una estimación por debajo del umbral, ni siquiera aproximada.

## Comunidad

```
GET    /api/v1/comunidad/hilos?destino_id=&ventana_envio=   → 200 lista paginada
POST   /api/v1/comunidad/hilos                              { titulo, cuerpo } → 201 (requiere nivel_verificacion >= correo_verificado)
POST   /api/v1/comunidad/hilos/{id}/respuestas              { cuerpo } → 201
POST   /api/v1/comunidad/hilos/{id}/reportar-estafa         → 202
```

## Oportunidades

```
GET    /api/v1/oportunidades/proveedores?destino_id=&categoria=   → 200 (solo estado_vetting != reportado_fraudulento por defecto)
GET    /api/v1/oportunidades/vacantes?destino_id=                 → 200
```

## Notificaciones

```
GET    /api/v1/notificaciones/preferencias    → 200
PUT    /api/v1/notificaciones/preferencias    { canal_email, canal_push, frecuencia_maxima } → 200
GET    /api/v1/notificaciones/mias            → 200 lista paginada de Alerta
```
