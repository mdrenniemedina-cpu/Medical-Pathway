/**
 * CSV mínimo, sin dependencias externas: escapa comillas/comas/saltos de
 * línea según RFC 4180, y antepone un BOM UTF-8 — sin el BOM, Excel
 * interpreta el archivo como Latin-1 por defecto y rompe tildes/ñ/caracteres
 * especiales (pedido explícito: "codificación UTF-8 para conservar
 * correctamente tildes, ñ y caracteres especiales").
 */
const BOM_UTF8 = '﻿';

function escaparCelda(valor: unknown): string {
  const texto = valor === null || valor === undefined ? '' : String(valor);
  if (/[",\n\r]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export function generarCsv(encabezados: string[], filas: unknown[][]): string {
  const lineas = [encabezados, ...filas].map((fila) => fila.map(escaparCelda).join(','));
  return BOM_UTF8 + lineas.join('\r\n') + '\r\n';
}
