import { Module } from '@nestjs/common';
import { ComunidadController } from './comunidad.controller';

@Module({ controllers: [ComunidadController] })
export class ComunidadModule {}
