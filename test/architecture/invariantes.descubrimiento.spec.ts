import { PuntuacionDestino } from '@contexts/descubrimiento/domain/value-objects/puntuacion-destino.vo';
import { Razon } from '@contexts/descubrimiento/domain/value-objects/razon.vo';
import { DomainError } from '@shared-kernel/domain/domain-error';

/**
 * Invariante pedida explícitamente por el founder: "creación de
 * compatibilidades sin razones explicativas" debe ser imposible — es la
 * traducción a código de "no quiero vender un comparador, quiero vender
 * claridad" (ver decisions/ADR-002).
 */
describe('Invariante: PuntuacionDestino exige al menos una razón', () => {
  it('lanza DomainError si se intenta crear sin razones', () => {
    expect(() => PuntuacionDestino.crear('destino-1', 91, [])).toThrow(DomainError);
  });

  it('lanza DomainError si el porcentaje está fuera de rango, incluso con razones', () => {
    const razon = Razon.crear('barrera_idioma', 30, 'Sin barrera de idioma.');
    expect(() => PuntuacionDestino.crear('destino-1', 150, [razon])).toThrow(DomainError);
    expect(() => PuntuacionDestino.crear('destino-1', -10, [razon])).toThrow(DomainError);
  });

  it('se construye correctamente con al menos una razón', () => {
    const razon = Razon.crear('barrera_idioma', 30, 'Sin barrera de idioma: el español ya es tu lengua materna.');
    const puntuacion = PuntuacionDestino.crear('destino-1', 91, [razon]);
    expect(puntuacion.porcentajeCompatibilidad).toBe(91);
    expect(puntuacion.razones).toHaveLength(1);
    expect(puntuacion.razones[0].explicacionLegible).toContain('Sin barrera de idioma');
  });
});

describe('Invariante: Razon exige una explicación legible', () => {
  it('lanza DomainError si la explicación está vacía', () => {
    expect(() => Razon.crear('barrera_idioma', 30, '')).toThrow(DomainError);
  });
});
