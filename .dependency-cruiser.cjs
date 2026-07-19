/**
 * Prueba arquitectónica automatizada (ver decisions/ADR-016): impide que un
 * bounded context importe algo de otro que no sea su `public-api`, y que la
 * capa de dominio dependa de infraestructura/framework. Se ejecuta vía
 * `test/architecture/boundaries.spec.ts` (npm test) y en CI.
 */
module.exports = {
  forbidden: [
    {
      name: 'no-context-internals-cross-import',
      comment:
        'Un bounded context solo puede importar de OTRO contexto a través de su carpeta public-api. Ver ADR-010/ADR-016.',
      severity: 'error',
      from: {
        path: '^src/bounded-contexts/([^/]+)/',
        pathNot: '^src/bounded-contexts/([^/]+)/public-api/',
      },
      to: {
        path: '^src/bounded-contexts/([^/]+)/(domain|application|infrastructure)/',
        pathNot: '^src/bounded-contexts/$1/',
      },
    },
    {
      name: 'no-domain-depends-on-infrastructure',
      comment: 'El dominio de un contexto debe ser puro: no puede importar su propia carpeta infrastructure ni application.',
      severity: 'error',
      from: { path: '^src/bounded-contexts/([^/]+)/domain/' },
      to: { path: '^src/bounded-contexts/$1/(infrastructure|application)/' },
    },
    {
      name: 'no-domain-depends-on-framework',
      comment: 'El dominio no puede importar NestJS, pg, ni ningún paquete de infraestructura — debe ser TypeScript puro y testeable sin ellos.',
      severity: 'error',
      from: { path: '^src/bounded-contexts/([^/]+)/domain/' },
      to: { path: 'node_modules/(@nestjs|pg|argon2|passport|pino)' },
    },
    {
      name: 'no-shared-kernel-depends-on-contexts',
      comment: 'shared-kernel es la base de todos los contextos; no puede depender de ninguno de ellos (evita ciclos y acoplamiento invertido).',
      severity: 'error',
      from: { path: '^src/shared-kernel/' },
      to: { path: '^src/bounded-contexts/' },
    },
    {
      name: 'no-circular',
      comment: 'Nada de dependencias circulares entre módulos — dificultan razonar sobre límites de contexto.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'require', 'node', 'default'] },
  },
};
