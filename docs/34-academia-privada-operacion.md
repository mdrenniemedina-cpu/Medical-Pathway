# Academia Privada — operación (MVP de un solo curso)

> Módulo privado, aislado del resto de Medical Pathway (ver bounded context `src/bounded-contexts/academia-privada/`), para validar una futura funcionalidad de formación. No aparece en la navegación pública. Ruta: `/academia/reporte-caso.html`.

## Cómo dar acceso a una estudiante (sin SQL — formulario móvil)

1. La persona debe **registrarse primero** en Medical Pathway (email/contraseña, como cualquier usuario).
2. Abre `/academia/admin-acceso.html` desde cualquier navegador (celular o computadora) e ingresa las mismas credenciales del panel de "Comparte tu historia" (`ADMIN_PANEL_USER`/`ADMIN_PANEL_PASSWORD`).
3. Escribe el email con el que la persona se registró, opcionalmente una fecha de expiración, y pulsa **Conceder acceso**. No necesitas conocer ni buscar su `cuenta_id` — el sistema lo resuelve internamente a partir del email.
4. Para revocar o pausar el acceso, escribe el mismo email y pulsa **Revocar acceso**.

Esto llama a `POST /api/v1/academia/admin/acceso` (protegido con `AdminBasicAuthGuard`, mismo mecanismo que `/admin/historias`), con cuerpo `{ email, habilitado?, fechaExpiracion? }`. Devuelve `404` si el email no corresponde a ninguna cuenta registrada.

## Alternativa: directamente en la base de datos (si prefieres SQL)

1. Consulta su `cuenta_id`:
   ```sql
   SELECT id, email FROM identidad.cuenta WHERE email = 'ejemplo@correo.com';
   ```
2. Concede acceso (sin fecha de expiración):
   ```sql
   INSERT INTO academia_privada.acceso_curso (id, cuenta_id, curso_id, habilitado, fecha_expiracion)
   VALUES (gen_random_uuid()::text, '<cuenta_id>', 'reporte-caso', true, NULL);
   ```
   O con expiración (ej. acceso válido 60 días):
   ```sql
   INSERT INTO academia_privada.acceso_curso (id, cuenta_id, curso_id, habilitado, fecha_expiracion)
   VALUES (gen_random_uuid()::text, '<cuenta_id>', 'reporte-caso', true, now() + interval '60 days');
   ```

## Cómo revocar o pausar el acceso (SQL)

```sql
UPDATE academia_privada.acceso_curso SET habilitado = false WHERE cuenta_id = '<cuenta_id>';
```
Para reactivar: `UPDATE academia_privada.acceso_curso SET habilitado = true WHERE cuenta_id = '<cuenta_id>';`

## Cómo subir/reemplazar los archivos (3 videos + PDF)

Protegido con las mismas credenciales del panel de "Comparte tu historia" (`ADMIN_PANEL_USER`/`ADMIN_PANEL_PASSWORD`):

```
curl -u <usuario>:<contraseña> -F "archivo=@video-1.mp4" https://medical-pathway.onrender.com/api/v1/academia/admin/archivos/video-1
curl -u <usuario>:<contraseña> -F "archivo=@video-2.mp4" https://medical-pathway.onrender.com/api/v1/academia/admin/archivos/video-2
curl -u <usuario>:<contraseña> -F "archivo=@video-3.mp4" https://medical-pathway.onrender.com/api/v1/academia/admin/archivos/video-3
curl -u <usuario>:<contraseña> -F "archivo=@guia-care.pdf" https://medical-pathway.onrender.com/api/v1/academia/admin/archivos/guia-care
```

**Importante — durabilidad en Render:** los archivos se guardan en `ACADEMIA_ARCHIVOS_DIR`, una carpeta del propio servidor. Los Web Services de Render por defecto tienen **filesystem efímero** — se borra en cada redeploy. Para que los archivos sobrevivan a un redeploy, `ACADEMIA_ARCHIVOS_DIR` debe apuntar a un **disco persistente** de Render (Settings → Disks → Add Disk, ~1 GB alcanza para este MVP; tiene un costo pequeño adicional — confirmar contigo antes de agregarlo, mismo criterio que con cualquier otro recurso de pago). Sin disco persistente, hay que volver a subir los 4 archivos después de cada deploy — aceptable mientras el módulo no cambie de código con frecuencia.

## Ver qué videos ha visto una estudiante (auditoría básica)

```sql
SELECT recurso, visto_en FROM academia_privada.recurso_visto WHERE cuenta_id = '<cuenta_id>' ORDER BY visto_en;
```

## Variables de entorno requeridas (además de las ya existentes)

- `ACADEMIA_TOKEN_SECRET` — secreto propio para firmar las URLs de reproducción (nunca reusar `JWT_ACCESS_SECRET`; generar con `openssl rand -hex 32`).
- `ACADEMIA_ARCHIVOS_DIR` — ruta del directorio de archivos (ver nota de disco persistente arriba).

## Decisión de arquitectura: sin proveedor de almacenamiento externo

El founder pidió evaluar Supabase Storage; se optó por servir los archivos desde el propio backend (sin cuenta nueva, sin dependencia externa) dado que es un MVP de una sola estudiante. Si esto crece a una Academy real con muchos cursos/videos, esta decisión debería revisarse — el módulo quedó deliberadamente aislado (bounded context propio, sin acoplarse a otros contextos) para que sea reemplazable sin tocar el resto del producto.
