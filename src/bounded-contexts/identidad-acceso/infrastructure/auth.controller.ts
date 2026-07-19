import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { RegistrarCuentaUseCase } from '../application/registrar-cuenta.use-case';
import { IniciarSesionUseCase } from '../application/iniciar-sesion.use-case';
import { TokenPair } from '../application/token-issuer.port';

class RegistroDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@Controller('identidad')
export class AuthController {
  constructor(
    private readonly registrar: RegistrarCuentaUseCase,
    private readonly iniciarSesion: IniciarSesionUseCase,
  ) {}

  @Post('registro')
  async registro(@Body() dto: RegistroDto): Promise<TokenPair> {
    return this.registrar.ejecutar(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: RegistroDto): Promise<TokenPair> {
    return this.iniciarSesion.ejecutar(dto.email, dto.password);
  }
}
