/** Etiquetas legibles para el panel de administración y la exportación CSV — únicas, no duplicadas entre ambos. */
export const ETIQUETA_ETAPA_FORMACION: Record<string, string> = {
  estudiante: 'Estudiante',
  internado: 'Internado',
  servicio_social: 'Servicio Social',
  medico_general: 'Médico General',
  residente: 'Residente',
  especialista: 'Especialista',
};

export const ETIQUETA_SERIO_INTERES: Record<string, string> = {
  idea: 'Solo ha sido una idea',
  lo_he_pensado_varias_veces: 'Lo he pensado varias veces',
  investigando_opciones: 'Estoy investigando opciones',
  decidido: 'Ya decidí que quiero hacerlo',
  ya_inicie_proceso: 'Ya inicié el proceso',
};

export const ETIQUETA_CONSIDERA_PAGAR: Record<string, string> = {
  si: 'Sí',
  tal_vez: 'Tal vez',
  no: 'No',
};

export const ETIQUETA_PRECIO_JUSTO: Record<string, string> = {
  menos_5: 'Menos de USD 5',
  '5_10': 'USD 5–10',
  '10_20': 'USD 10–20',
  '20_30': 'USD 20–30',
  '30_50': 'USD 30–50',
  mas_50: 'Más de USD 50',
};

export function etiqueta(mapa: Record<string, string>, valor: string | null): string {
  if (!valor) return '';
  return mapa[valor] ?? valor;
}
