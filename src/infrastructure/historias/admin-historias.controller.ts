import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AdminBasicAuthGuard } from '@infrastructure/admin/admin-basic-auth.guard';
import { FiltrosHistorias, HistoriaMedicoRepository, HistoriaMedicoRow } from './historia-medico.repository';
import {
  ETIQUETA_CONSIDERA_PAGAR,
  ETIQUETA_ETAPA_FORMACION,
  ETIQUETA_PRECIO_JUSTO,
  ETIQUETA_SERIO_INTERES,
  etiqueta,
} from './historias.labels';
import { generarCsv } from './csv.util';

function leerFiltros(query: Record<string, unknown>): FiltrosHistorias {
  return {
    etapaFormacion: typeof query.etapa === 'string' ? query.etapa : undefined,
    serioInteres: typeof query.interes === 'string' ? query.interes : undefined,
    paisesInteres: typeof query.pais === 'string' ? query.pais : undefined,
    consideraPagar: typeof query.pagar === 'string' ? query.pagar : undefined,
    buscar: typeof query.buscar === 'string' ? query.buscar : undefined,
  };
}

/**
 * Panel privado de administración de "Comparte tu historia" — protegido por
 * `AdminBasicAuthGuard` (HTTP Basic Auth vía variables de entorno, ver ese
 * archivo). No indexado, no enlazado desde ninguna página pública
 * (`public/admin-historias.html`).
 */
@Controller('admin/historias')
@UseGuards(AdminBasicAuthGuard)
export class AdminHistoriasController {
  constructor(private readonly historias: HistoriaMedicoRepository) {}

  @Get()
  async listar(@Query() query: Record<string, unknown>): Promise<{
    total: number;
    resultados: number;
    respuestas: Array<Record<string, unknown>>;
  }> {
    const filtros = leerFiltros(query);
    const [total, filas] = await Promise.all([this.historias.contarTotal(), this.historias.listar(filtros)]);
    return {
      total,
      resultados: filas.length,
      respuestas: filas.map((fila) => this.aVistaLegible(fila)),
    };
  }

  @Get('exportar.csv')
  async exportarCsv(@Query() query: Record<string, unknown>, @Res() res: Response): Promise<void> {
    const filtros = leerFiltros(query);
    const filas = await this.historias.listar(filtros);

    const encabezados = [
      'ID anónimo',
      'Fecha y hora de envío',
      'Etapa profesional',
      '¿Imaginó ejercer en otro país?',
      'Nivel de interés',
      'Países de interés',
      'Barrera principal',
      'Mayor incertidumbre',
      'Frustración al buscar información',
      'Qué esperaría de una plataforma',
      'Disposición a pagar',
      'Precio considerado justo',
    ];

    const filasCsv = filas.map((fila) => [
      fila.id,
      fila.creado_en.toISOString(),
      etiqueta(ETIQUETA_ETAPA_FORMACION, fila.etapa_formacion),
      fila.ha_imaginado_ejercer_otro_pais ? 'Sí' : 'No',
      etiqueta(ETIQUETA_SERIO_INTERES, fila.serio_interes),
      fila.paises_interes ?? '',
      fila.que_te_ha_frenado ?? '',
      fila.incertidumbre ?? '',
      fila.frustracion_busqueda ?? '',
      fila.que_haria_valer_la_pena ?? '',
      etiqueta(ETIQUETA_CONSIDERA_PAGAR, fila.consideraria_pagar),
      etiqueta(ETIQUETA_PRECIO_JUSTO, fila.precio_justo),
    ]);

    const csv = generarCsv(encabezados, filasCsv);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="comparte-tu-historia-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  }

  private aVistaLegible(fila: HistoriaMedicoRow): Record<string, unknown> {
    return {
      id: fila.id,
      creadoEn: fila.creado_en.toISOString(),
      etapaFormacion: etiqueta(ETIQUETA_ETAPA_FORMACION, fila.etapa_formacion),
      haImaginadoEjercerOtroPais: fila.ha_imaginado_ejercer_otro_pais,
      serioInteres: etiqueta(ETIQUETA_SERIO_INTERES, fila.serio_interes),
      paisesInteres: fila.paises_interes,
      queTeHaFrenado: fila.que_te_ha_frenado,
      incertidumbre: fila.incertidumbre,
      frustracionBusqueda: fila.frustracion_busqueda,
      queHariaValerLaPena: fila.que_haria_valer_la_pena,
      consideraPagar: etiqueta(ETIQUETA_CONSIDERA_PAGAR, fila.consideraria_pagar),
      precioJusto: etiqueta(ETIQUETA_PRECIO_JUSTO, fila.precio_justo),
      completado: fila.completado,
    };
  }
}
