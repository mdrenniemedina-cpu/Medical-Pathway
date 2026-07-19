import { analizarBrechas } from '@contexts/descubrimiento/domain/servicios/analizador-brechas.service';
import { ReglaCompatibilidad } from '@contexts/descubrimiento/domain/regla-compatibilidad.entity';

/**
 * Invariante del Sprint 1 (ADR-022): el motor de brechas debe ser
 * exactamente tan trazable como el motor de compatibilidad — el impacto
 * reportado debe coincidir con la diferencia real entre ejecutar el motor
 * con el perfil actual y con el perfil hipotético, nunca una aproximación.
 */
describe('Invariante: el motor de brechas no sugiere acciones sobre atributos no accionables', () => {
  const reglas = [
    ReglaCompatibilidad.crear({ id: 'r1', atributoPerfil: 'idiomas_dominados', atributoDestino: 'idioma_requerido', peso: 1, version: 1, activa: true }),
  ];

  it('no sugiere ninguna acción para un destino sin barrera de idioma', () => {
    const destino = {
      destinoId: 'd1',
      nombre: 'España',
      idiomaRequerido: null,
      nivelIdiomaRequerido: null,
      nivelDemanda: 'alta' as const,
      tiempoTipicoMeses: 12,
      complejidadRegulatoria: 'media' as const,
    };
    const acciones = analizarBrechas({ idiomasDominados: [] }, destino, reglas);
    expect(acciones).toHaveLength(0);
  });

  it('sugiere aprender el idioma si el destino lo requiere y el usuario no lo tiene, con impacto positivo', () => {
    const destino = {
      destinoId: 'd2',
      nombre: 'Alemania',
      idiomaRequerido: 'aleman',
      nivelIdiomaRequerido: 'B2',
      nivelDemanda: 'alta' as const,
      tiempoTipicoMeses: 18,
      complejidadRegulatoria: 'alta' as const,
    };
    const acciones = analizarBrechas({ idiomasDominados: [] }, destino, reglas);
    expect(acciones).toHaveLength(1);
    expect(acciones[0].criterio).toBe('barrera_idioma');
    expect(acciones[0].descripcionAccion).toContain('aleman');
    expect(acciones[0].impactoEstimadoPuntos).toBeGreaterThan(0);
  });

  it('no sugiere aprender un idioma que el usuario ya domina', () => {
    const destino = {
      destinoId: 'd2',
      nombre: 'Alemania',
      idiomaRequerido: 'aleman',
      nivelIdiomaRequerido: 'B2',
      nivelDemanda: 'alta' as const,
      tiempoTipicoMeses: 18,
      complejidadRegulatoria: 'alta' as const,
    };
    const acciones = analizarBrechas({ idiomasDominados: [{ idioma: 'aleman', nivel: 'C1' }] }, destino, reglas);
    expect(acciones).toHaveLength(0);
  });
});
