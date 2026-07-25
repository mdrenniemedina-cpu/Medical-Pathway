import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { TokenReproduccionPort } from '../application/ports/token-reproduccion.port';

/**
 * "URL firmada" propia, sin depender de un proveedor externo (ver decisión
 * del founder: evitar Supabase para este MVP de un solo estudiante).
 * Formato: `<payload_base64url>.<firma_hex>` — payload = `cuentaId|recurso|expiraEnEpochMs`.
 * La firma es HMAC-SHA256 con `ACADEMIA_TOKEN_SECRET` — sin ese secreto no
 * se puede fabricar un token válido, y cualquier alteración del payload
 * invalida la firma. La expiración va DENTRO del payload firmado, así que
 * no se puede extender manipulando la URL.
 */
@Injectable()
export class AcademiaTokenService implements TokenReproduccionPort {
  constructor(private readonly config: ConfigService) {}

  private secreto(): string {
    const secreto = this.config.get<string>('ACADEMIA_TOKEN_SECRET');
    if (!secreto) {
      throw new Error('ACADEMIA_TOKEN_SECRET no configurado.');
    }
    return secreto;
  }

  firmar(params: { cuentaId: string; recurso: string; ttlSegundos: number }): string {
    const expiraEn = Date.now() + params.ttlSegundos * 1000;
    const payload = `${params.cuentaId}|${params.recurso}|${expiraEn}`;
    const payloadBase64 = Buffer.from(payload, 'utf8').toString('base64url');
    const firma = createHmac('sha256', this.secreto()).update(payloadBase64).digest('hex');
    return `${payloadBase64}.${firma}`;
  }

  verificar(token: string): { cuentaId: string; recurso: string } | null {
    const separador = token.indexOf('.');
    if (separador < 0) return null;
    const payloadBase64 = token.slice(0, separador);
    const firmaRecibida = token.slice(separador + 1);

    const firmaEsperada = createHmac('sha256', this.secreto()).update(payloadBase64).digest('hex');
    const bufRecibida = Buffer.from(firmaRecibida);
    const bufEsperada = Buffer.from(firmaEsperada);
    if (bufRecibida.length !== bufEsperada.length || !timingSafeEqual(bufRecibida, bufEsperada)) {
      return null;
    }

    const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const [cuentaId, recurso, expiraEnTexto] = payload.split('|');
    const expiraEn = Number(expiraEnTexto);
    if (!cuentaId || !recurso || !Number.isFinite(expiraEn) || expiraEn <= Date.now()) {
      return null; // expirado o payload corrupto — nunca reutilizable pasada la expiración
    }
    return { cuentaId, recurso };
  }
}
