import { AtributoConFuente } from '@contexts/catalogo/domain/value-objects/atributo-con-fuente.vo';
import { RutaHomologacion } from '@contexts/catalogo/domain/ruta-homologacion.aggregate';
import { EtapaRuta } from '@contexts/catalogo/domain/etapa-ruta.entity';
import { DomainError } from '@shared-kernel/domain/domain-error';

/**
 * Invariante pedida explícitamente por el founder: "uso de datos del
 * catálogo sin fuente y fecha de verificación" debe ser imposible. Estos
 * tests importan directamente del `domain/` interno del contexto (no de su
 * public-api) porque son pruebas UNITARIAS de invariantes de dominio, no
 * pruebas de integración entre contextos — están exentas de la regla de
 * dependency-cruiser (que aplica a `src/`, no a `test/`).
 */
describe('Invariante: AtributoConFuente exige fuente y fecha de verificación', () => {
  it('lanza DomainError si falta la fuente', () => {
    expect(() => AtributoConFuente.crear(15, '', new Date('2026-01-01'))).toThrow(DomainError);
  });

  it('lanza DomainError si falta la fecha de verificación', () => {
    expect(() => AtributoConFuente.crear(15, 'https://sanidad.gob.es', undefined as unknown as Date)).toThrow(DomainError);
  });

  it('lanza DomainError si la fecha de verificación es futura', () => {
    const futura = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
    expect(() => AtributoConFuente.crear(15, 'https://sanidad.gob.es', futura)).toThrow(DomainError);
  });

  it('se construye correctamente con fuente y fecha válidas', () => {
    const atributo = AtributoConFuente.crear(15, 'https://sanidad.gob.es', new Date('2026-01-01'));
    expect(atributo.valor).toBe(15);
    expect(atributo.fuenteUrl).toBe('https://sanidad.gob.es');
  });
});

describe('Invariante: no se puede publicar una RutaHomologacion sin etapas', () => {
  it('lanza DomainError al publicar una ruta vacía', () => {
    const ruta = RutaHomologacion.crearBorrador('r1', 'destino-1', 'Ruta de prueba');
    expect(() => ruta.publicar()).toThrow(DomainError);
  });

  it('publica correctamente si tiene al menos una etapa con fuente', () => {
    const ruta = RutaHomologacion.crearBorrador('r1', 'destino-1', 'Ruta de prueba');
    ruta.agregarEtapa(
      EtapaRuta.crear({
        id: 'e1',
        orden: 1,
        nombre: 'Apostilla',
        descripcion: 'Apostilla del título',
        tipo: 'documental',
        duracionTipicaDias: AtributoConFuente.crear(30, 'https://fuente.test', new Date('2026-01-01')),
        esConfigurablePorPerfil: false,
      }),
    );
    expect(() => ruta.publicar()).not.toThrow();
    expect(ruta.publicada).toBe(true);
  });
});
