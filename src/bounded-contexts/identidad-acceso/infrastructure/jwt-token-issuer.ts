import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { TokenIssuerPort, TokenPair } from '../application/token-issuer.port';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Access token: JWT corto, sin estado. Refresh token: opaco, hasheado en
 * `identidad.sesion` (nunca en texto plano en la base de datos), revocable
 * individualmente. Ver `docs/08-auth-model.md`.
 */
@Injectable()
export class JwtTokenIssuer implements TokenIssuerPort {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @Inject(PG_POOL) private readonly pool: Pool,
  ) {}

  async emitirParaCuenta(cuentaId: string, rol: string): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync(
      { sub: cuentaId, rol },
      { secret: this.config.get<string>('JWT_ACCESS_SECRET'), expiresIn: this.config.get<string>('JWT_ACCESS_TTL') },
    );
    const refreshToken = nanoid(48);
    const ttlDays = this.config.get<number>('JWT_REFRESH_TTL_DAYS') ?? 30;
    const expiraEn = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    await this.pool.query(
      `INSERT INTO identidad.sesion (id, cuenta_id, refresh_token_hash, expira_en) VALUES ($1, $2, $3, $4)`,
      [nanoid(), cuentaId, hashToken(refreshToken), expiraEn],
    );
    return { accessToken, refreshToken };
  }

  async refrescar(refreshToken: string): Promise<{ accessToken: string }> {
    const { rows } = await this.pool.query<{ cuenta_id: string; rol: string }>(
      `SELECT s.cuenta_id, c.rol FROM identidad.sesion s
       JOIN identidad.cuenta c ON c.id = s.cuenta_id
       WHERE s.refresh_token_hash = $1 AND s.revocada = false AND s.expira_en > now()`,
      [hashToken(refreshToken)],
    );
    if (!rows[0]) {
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
    const accessToken = await this.jwt.signAsync(
      { sub: rows[0].cuenta_id, rol: rows[0].rol },
      { secret: this.config.get<string>('JWT_ACCESS_SECRET'), expiresIn: this.config.get<string>('JWT_ACCESS_TTL') },
    );
    return { accessToken };
  }

  async revocar(refreshToken: string): Promise<void> {
    await this.pool.query(`UPDATE identidad.sesion SET revocada = true WHERE refresh_token_hash = $1`, [
      hashToken(refreshToken),
    ]);
  }
}
