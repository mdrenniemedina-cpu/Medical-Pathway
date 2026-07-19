import { Module } from '@nestjs/common';
import { OportunidadesController } from './oportunidades.controller';

@Module({ controllers: [OportunidadesController] })
export class OportunidadesModule {}
