import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PERFIL_REPOSITORY, PerfilRepositoryPort } from '../domain/perfil.repository.port';
import { PerfilInternacional } from '../domain/perfil-internacional.aggregate';
import { FormacionAcademica } from '../domain/value-objects/formacion-academica.vo';
import { CompetenciaIdiomatica } from '../domain/value-objects/competencia-idiomatica.vo';
import { ObjetivosProfesionales } from '../domain/value-objects/objetivos-profesionales.vo';
import { PerfilSnapshot, toPerfilSnapshot } from './perfil-snapshot';

@Injectable()
export class GestionarPerfilUseCase {
  constructor(@Inject(PERFIL_REPOSITORY) private readonly perfiles: PerfilRepositoryPort) {}

  async crearParaCuenta(cuentaId: string): Promise<PerfilSnapshot> {
    const perfil = PerfilInternacional.crear(nanoid(), cuentaId);
    await this.perfiles.guardar(perfil);
    return toPerfilSnapshot(perfil);
  }

  async obtenerPorCuenta(cuentaId: string): Promise<PerfilSnapshot> {
    const perfil = await this.perfiles.buscarPorCuentaId(cuentaId);
    if (!perfil) throw new NotFoundException('Perfil no encontrado para esta cuenta.');
    return toPerfilSnapshot(perfil);
  }

  async agregarFormacionAcademica(
    cuentaId: string,
    datos: { universidad: string; paisGraduacion: string; tipoTitulo: 'pregrado' | 'especialidad' | 'subespecialidad'; especialidad?: string },
  ): Promise<PerfilSnapshot> {
    const perfil = await this.requerirPerfil(cuentaId);
    perfil.agregarFormacionAcademica(FormacionAcademica.crear(datos));
    await this.perfiles.guardar(perfil);
    return toPerfilSnapshot(perfil);
  }

  async agregarIdioma(cuentaId: string, idioma: string, nivel: string): Promise<PerfilSnapshot> {
    const perfil = await this.requerirPerfil(cuentaId);
    perfil.agregarIdioma(CompetenciaIdiomatica.crear(idioma, nivel));
    await this.perfiles.guardar(perfil);
    return toPerfilSnapshot(perfil);
  }

  async actualizarObjetivos(
    cuentaId: string,
    objetivos: { urgencia: 'alta' | 'media' | 'baja'; toleranciaExamenCompetitivo: 'prefiere_rapido_competitivo' | 'prefiere_lento_seguro'; prioridadIngresoVsRapidez: 'ingreso_largo_plazo' | 'rapidez_de_practica' },
  ): Promise<PerfilSnapshot> {
    const perfil = await this.requerirPerfil(cuentaId);
    perfil.actualizarObjetivosProfesionales(ObjetivosProfesionales.crear(objetivos));
    await this.perfiles.guardar(perfil);
    return toPerfilSnapshot(perfil);
  }

  private async requerirPerfil(cuentaId: string): Promise<PerfilInternacional> {
    const perfil = await this.perfiles.buscarPorCuentaId(cuentaId);
    if (!perfil) throw new NotFoundException('Perfil no encontrado para esta cuenta.');
    return perfil;
  }
}
