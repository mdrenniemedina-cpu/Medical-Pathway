import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';
import { PerfilRepositoryPort } from '../domain/perfil.repository.port';
import { PerfilInternacional, PerfilInternacionalProps } from '../domain/perfil-internacional.aggregate';
import { FormacionAcademica, TipoTitulo } from '../domain/value-objects/formacion-academica.vo';
import { CompetenciaIdiomatica } from '../domain/value-objects/competencia-idiomatica.vo';
import { SituacionEconomica } from '../domain/value-objects/situacion-economica.vo';
import { ObjetivosProfesionales } from '../domain/value-objects/objetivos-profesionales.vo';
import { validarNivelVerificacion } from '../domain/value-objects/nivel-verificacion.vo';

interface PerfilRow {
  id: string;
  cuenta_id: string;
  nivel_verificacion: string;
  presupuesto_rango: string | null;
  presupuesto_moneda: string | null;
  urgencia: string | null;
  tolerancia_examen_competitivo: string | null;
  prioridad_ingreso_vs_rapidez: string | null;
}
interface FormacionRow {
  universidad: string;
  pais_graduacion: string;
  tipo_titulo: TipoTitulo;
  especialidad: string | null;
}
interface IdiomaRow {
  idioma: string;
  nivel: string;
}

async function hidratar(client: Pool | PoolClient, row: PerfilRow): Promise<PerfilInternacional> {
  const [{ rows: formaciones }, { rows: idiomas }] = await Promise.all([
    client.query<FormacionRow>(
      'SELECT universidad, pais_graduacion, tipo_titulo, especialidad FROM perfil.formacion_academica WHERE perfil_id = $1',
      [row.id],
    ),
    client.query<IdiomaRow>('SELECT idioma, nivel FROM perfil.competencia_idiomatica WHERE perfil_id = $1', [row.id]),
  ]);

  const props: PerfilInternacionalProps = {
    id: row.id,
    cuentaId: row.cuenta_id,
    nivelVerificacion: validarNivelVerificacion(row.nivel_verificacion),
    formacionAcademica: formaciones.map((f) =>
      FormacionAcademica.crear({
        universidad: f.universidad,
        paisGraduacion: f.pais_graduacion,
        tipoTitulo: f.tipo_titulo,
        especialidad: f.especialidad ?? undefined,
      }),
    ),
    idiomas: idiomas.map((i) => CompetenciaIdiomatica.crear(i.idioma, i.nivel)),
    situacionEconomica: row.presupuesto_rango
      ? SituacionEconomica.crear({
          rangoPresupuesto: row.presupuesto_rango as 'bajo' | 'medio' | 'alto',
          moneda: row.presupuesto_moneda ?? 'USD',
        })
      : undefined,
    objetivosProfesionales: row.urgencia
      ? ObjetivosProfesionales.crear({
          urgencia: row.urgencia as 'alta' | 'media' | 'baja',
          toleranciaExamenCompetitivo: row.tolerancia_examen_competitivo as 'prefiere_rapido_competitivo' | 'prefiere_lento_seguro',
          prioridadIngresoVsRapidez: row.prioridad_ingreso_vs_rapidez as 'ingreso_largo_plazo' | 'rapidez_de_practica',
        })
      : undefined,
  };
  return PerfilInternacional.reconstituir(props);
}

@Injectable()
export class PerfilRepositoryPg implements PerfilRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(perfil: PerfilInternacional): Promise<void> {
    const events = perfil.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO perfil.perfil_internacional
           (id, cuenta_id, nivel_verificacion, presupuesto_rango, presupuesto_moneda, urgencia, tolerancia_examen_competitivo, prioridad_ingreso_vs_rapidez, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
         ON CONFLICT (id) DO UPDATE SET
           nivel_verificacion = EXCLUDED.nivel_verificacion,
           presupuesto_rango = EXCLUDED.presupuesto_rango,
           presupuesto_moneda = EXCLUDED.presupuesto_moneda,
           urgencia = EXCLUDED.urgencia,
           tolerancia_examen_competitivo = EXCLUDED.tolerancia_examen_competitivo,
           prioridad_ingreso_vs_rapidez = EXCLUDED.prioridad_ingreso_vs_rapidez,
           updated_at = now()`,
        [
          perfil.id,
          perfil.cuentaId,
          perfil.nivelVerificacion,
          perfil.situacionEconomica?.rangoPresupuesto ?? null,
          perfil.situacionEconomica?.moneda ?? null,
          perfil.objetivosProfesionales?.urgencia ?? null,
          perfil.objetivosProfesionales?.toleranciaExamenCompetitivo ?? null,
          perfil.objetivosProfesionales?.prioridadIngresoVsRapidez ?? null,
        ],
      );

      await client.query('DELETE FROM perfil.formacion_academica WHERE perfil_id = $1', [perfil.id]);
      for (const f of perfil.formacionAcademica) {
        await client.query(
          `INSERT INTO perfil.formacion_academica (id, perfil_id, universidad, pais_graduacion, tipo_titulo, especialidad)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [nanoid(), perfil.id, f.universidad, f.paisGraduacion, f.tipoTitulo, f.especialidad ?? null],
        );
      }

      await client.query('DELETE FROM perfil.competencia_idiomatica WHERE perfil_id = $1', [perfil.id]);
      for (const i of perfil.idiomas) {
        await client.query(
          `INSERT INTO perfil.competencia_idiomatica (id, perfil_id, idioma, nivel) VALUES ($1, $2, $3, $4)`,
          [nanoid(), perfil.id, i.idioma, i.nivel],
        );
      }

      return { result: undefined, events };
    });
  }

  async buscarPorId(id: string): Promise<PerfilInternacional | null> {
    const { rows } = await this.pool.query<PerfilRow>('SELECT * FROM perfil.perfil_internacional WHERE id = $1', [id]);
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }

  async buscarPorCuentaId(cuentaId: string): Promise<PerfilInternacional | null> {
    const { rows } = await this.pool.query<PerfilRow>(
      'SELECT * FROM perfil.perfil_internacional WHERE cuenta_id = $1',
      [cuentaId],
    );
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }
}
