import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CUENTA_REPOSITORY } from '../domain/cuenta.repository.port';
import { CuentaRepositoryPg } from './cuenta.repository.pg';
import { PASSWORD_HASHER } from '../application/password-hasher.port';
import { Argon2PasswordHasher } from './argon2-password-hasher';
import { TOKEN_ISSUER } from '../application/token-issuer.port';
import { JwtTokenIssuer } from './jwt-token-issuer';
import { RegistrarCuentaUseCase } from '../application/registrar-cuenta.use-case';
import { IniciarSesionUseCase } from '../application/iniciar-sesion.use-case';
import { BuscarCuentaIdPorEmailUseCase } from '../application/buscar-cuenta-id-por-email.use-case';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    { provide: CUENTA_REPOSITORY, useClass: CuentaRepositoryPg },
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
    RegistrarCuentaUseCase,
    IniciarSesionUseCase,
    BuscarCuentaIdPorEmailUseCase,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, BuscarCuentaIdPorEmailUseCase],
})
export class IdentidadAccesoModule {}
