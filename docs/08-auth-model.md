# Modelo de autenticación y autorización

## Por qué Cuenta y Perfil Internacional son agregados separados

Ver `decisions/ADR-011`. En resumen: una `Cuenta` es "cómo entro" (credenciales, sesión); un `PerfilInternacional` es "quién soy profesionalmente". Separarlos permite, sin rediseño futuro: cambiar de proveedor de autenticación sin tocar el dominio profesional; and (más importante a mediano plazo) dar soporte a que una misma persona tenga necesidades relacionadas pero distintas (p. ej., un mentor que también es usuario en su propio proceso) sin forzar el modelo de perfil a cargar con conceptos de sesión/credenciales.

## Autenticación

- Email + contraseña (hash con Argon2id) como método base; SSO (Google) opcional desde el MVP para reducir fricción de registro.
- **Access token:** JWT de vida corta (15 min), firmado, contiene `cuenta_id`, `rol`, `perfil_id` (si existe).
- **Refresh token:** opaco, almacenado hasheado en `identidad.sesion`, vida larga (30 días), entregado en cookie `httpOnly` + `Secure` + `SameSite=Strict` (no en `localStorage`, para mitigar XSS).
- Revocación: `POST /identidad/logout` marca la sesión como `revocada`; todas las sesiones de una cuenta pueden revocarse si se detecta actividad sospechosa (relevante para la prevención de manipulación del Radar de Espera — ver `13-calidad-confianza-datos-radar.md`).

## Autorización (RBAC + reglas por contexto)

| Rol | Puede |
|---|---|
| `usuario` | CRUD sobre su propio Perfil, su propia RutaPersonalizada, sus propios RegistroDeExpediente; lectura de contenido publicado; crear hilos/respuestas si `nivel_verificacion >= correo_verificado` |
| `mentor` | Todo lo de `usuario` + insignia `es_mentor_verificado` en respuestas de comunidad (otorgado manualmente por `admin`, no autoasignable) |
| `moderador` | Todo lo de `usuario` + moderar hilos/respuestas, resolver reportes de estafa, revisar verificaciones de perfil pendientes |
| `editor_contenido` | CRUD sobre `catalogo.*` (Destino, RutaHomologacion, EtapaRuta) — **ningún otro rol puede escribir en el catálogo**, ni siquiera `admin` directamente (fuerza el flujo editorial de ADR-005) |
| `admin` | Gestión de cuentas, roles, configuración de `descubrimiento.regla_compatibilidad`, acceso a paneles de anomalías del Radar |

**Importante:** el nivel de verificación del perfil (`ninguno/correo_verificado/titulo_verificado`) es **ortogonal al rol**. Un `usuario` con `titulo_verificado` no gana permisos adicionales de escritura — su verificación afecta el peso de sus datos en el Radar y su elegibilidad para publicar en comunidad, no el modelo RBAC.

## Control de acceso a nivel de fila (Row-Level Security)

Además de la autorización a nivel de aplicación, se activa RLS de Postgres en las tablas más sensibles como segunda capa de defensa (defensa en profundidad):

```sql
ALTER TABLE radar_espera.registro_expediente ENABLE ROW LEVEL SECURITY;
CREATE POLICY propio_registro ON radar_espera.registro_expediente
  USING (perfil_id = current_setting('app.current_perfil_id')::uuid);

ALTER TABLE ruta_medico.documento_asociado ENABLE ROW LEVEL SECURITY;
-- política análoga vía join a ruta_personalizada.perfil_id
```

Esto significa que, incluso si un bug de aplicación olvidara filtrar por `perfil_id` en una consulta, la base de datos rechazaría el acceso — relevante precisamente porque `registro_expediente` y `documento_asociado` contienen los datos más sensibles del sistema (expedientes individuales, documentos de identidad).

## Verificación progresiva del perfil

- **Ninguno → CorreoProfesionalVerificado:** confirmación de email institucional/profesional (no gmail genérico) o verificación manual ligera.
- **CorreoProfesionalVerificado → TituloVerificado:** carga de título/diploma, revisado por un `moderador` humano (no automatizado en el MVP — mismo principio que ADR-005 de no automatizar sin supervisión donde el coste de un error es alto).
- El nivel de verificación solo sube; nunca baja automáticamente, pero un `moderador` puede revertirlo manualmente si se detecta fraude (auditable, con motivo registrado).

## Privacidad y cumplimiento

- Exportación y borrado de datos personales (derecho GDPR de acceso/portabilidad/olvido) implementado como un flujo propio en Identidad y Acceso que orquesta el borrado en cascada across todos los schemas donde el `perfil_id`/`cuenta_id` aparece — necesita un catálogo explícito de "dónde vive el dato personal de este usuario" (mantenido junto al modelo de dominio, no descubierto ad-hoc).
- Los tokens de acceso nunca incluyen datos sensibles del perfil (solo `cuenta_id`, `rol`, `perfil_id`) — cualquier dato sensible se consulta bajo demanda con las políticas RLS activas.
