import { execFileSync } from 'node:child_process';
import * as path from 'node:path';

/**
 * Ejecuta dependency-cruiser (como proceso CLI, no vía su API programática —
 * dependency-cruiser v16 es un paquete ESM-only y este proyecto compila a
 * CommonJS; invocarlo como subproceso evita el conflicto de interop sin
 * degradar la prueba) sobre `src/` con las reglas de `.dependency-cruiser.cjs`
 * (ver decisions/ADR-016) y falla el test si cualquier import viola un
 * límite de bounded context. Este archivo es el que el founder pidió
 * explícitamente: "pruebas arquitectónicas automatizadas que impidan
 * dependencias directas indebidas entre bounded contexts [y] acceso de un
 * contexto a las tablas internas de otro" (el segundo punto se cubre porque
 * no hay forma de leer el repositorio/entidades de otro contexto sin
 * importarlo, y eso ya está prohibido por estas reglas).
 */
describe('Límites de bounded context (dependency-cruiser)', () => {
  it('no debe haber violaciones de las reglas de arquitectura', () => {
    const root = path.resolve(__dirname, '../..');
    const depcruiseBin = path.join(root, 'node_modules', '.bin', 'depcruise');

    let stdout = '';
    let exitCode = 0;
    try {
      stdout = execFileSync(
        depcruiseBin,
        ['--config', '.dependency-cruiser.cjs', '--output-type', 'json', 'src'],
        { cwd: root, encoding: 'utf-8' },
      );
    } catch (error) {
      // depcruise sale con código != 0 cuando hay violaciones — el JSON sigue en stdout.
      const execError = error as { stdout?: string; status?: number };
      stdout = execError.stdout ?? '';
      exitCode = execError.status ?? 1;
    }

    const result = JSON.parse(stdout) as {
      summary: { violations: Array<{ from: string; to: string; rule: { name: string; severity: string } }> };
    };
    const violaciones = result.summary.violations.filter((v) => v.rule.severity === 'error');

    if (violaciones.length > 0 || exitCode !== 0) {
      const detalle = violaciones.map((v) => `  [${v.rule.name}] ${v.from} -> ${v.to}`).join('\n');
      throw new Error(`Se encontraron ${violaciones.length} violaciones de límites de contexto:\n${detalle}`);
    }

    expect(violaciones).toHaveLength(0);
  }, 60_000);
});
