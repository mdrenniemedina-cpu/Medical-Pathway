import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import { Request } from 'express';

function comparacionSegura(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Protege el panel privado de "Comparte tu historia" con credenciales tipo
 * Basic Auth (usuario:password codificado en el header `Authorization`)
 * contra `ADMIN_PANEL_USER`/`ADMIN_PANEL_PASSWORD` (variables de entorno,
 * nunca en el repo). Deliberadamente NO reutiliza el sistema de Cuenta/JWT
 * de `identidad-acceso` — este panel es de un único operador (el founder),
 * no un rol dentro del modelo de usuarios del producto; añadir un rol
 * "admin" al agregado `Cuenta` para esto sería sobre-ingeniería para un
 * panel interno de una sola persona.
 *
 * IMPORTANTE — nunca responder con la cabecera `WWW-Authenticate: Basic`:
 * hacerlo dispara el diálogo NATIVO de usuario/contraseña del navegador en
 * cualquier `fetch()` que reciba un 401, incluso con un `Authorization`
 * propio ya enviado — el diálogo bloquea la promesa del fetch indefinidamente
 * (encontrado durante la validación de `public/admin-historias.html`, que
 * implementa su propio formulario de login y necesita manejar el 401 en
 * JavaScript, no delegarlo al navegador). Por eso el 401 se devuelve "pelado".
 *
 * Fail-closed explícito: si las variables no están configuradas, el panel
 * queda inaccesible (401), nunca abierto por defecto.
 */
@Injectable()
export class AdminBasicAuthGuard implements CanActivate {
  private readonly logger = new Logger(AdminBasicAuthGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const usuarioEsperado = this.config.get<string>('ADMIN_PANEL_USER');
    const passwordEsperada = this.config.get<string>('ADMIN_PANEL_PASSWORD');

    if (!usuarioEsperado || !passwordEsperada) {
      throw new UnauthorizedException('Panel de administración no configurado.');
    }

    const cabecera = request.headers.authorization;
    if (!cabecera?.startsWith('Basic ')) {
      throw new UnauthorizedException('Credenciales requeridas.');
    }

    const decodificado = Buffer.from(cabecera.slice('Basic '.length), 'base64').toString('utf8');
    const separador = decodificado.indexOf(':');
    const usuario = separador >= 0 ? decodificado.slice(0, separador) : '';
    const password = separador >= 0 ? decodificado.slice(separador + 1) : '';

    const usuarioCoincide = comparacionSegura(usuario, usuarioEsperado);
    const passwordCoincide = comparacionSegura(password, passwordEsperada);

    if (!usuarioCoincide || !passwordCoincide) {
      // Diagnóstico seguro: solo longitudes y coincidencia, NUNCA el contenido
      // recibido ni el esperado — así se puede detectar por ejemplo un
      // espacio/salto de línea de más al copiar la variable desde Render,
      // sin exponer ningún secreto en los logs.
      this.logger.warn(
        `Intento de login admin inválido — usuarioCoincide=${usuarioCoincide} (recibido=${usuario.length} esperado=${usuarioEsperado.length} chars) passwordCoincide=${passwordCoincide} (recibido=${password.length} esperado=${passwordEsperada.length} chars) separadorEncontrado=${separador >= 0}`,
      );
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return true;
  }
}
