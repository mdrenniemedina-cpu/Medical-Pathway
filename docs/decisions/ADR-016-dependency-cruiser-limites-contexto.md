# ADR-016: dependency-cruiser como prueba arquitectónica automatizada de límites de contexto

## Estado
Aceptada

## Contexto
El founder exigió pruebas arquitectónicas automatizadas que impidan dependencias directas indebidas entre bounded contexts y el acceso de un contexto a las tablas internas de otro — sin esto, la disciplina de `public-api`/ACL documentada en `05-domain-model-ddd.md` depende solo de la disciplina humana en cada PR, lo cual no escala ni es verificable en CI.

## Decisión
Se usa `dependency-cruiser` para analizar el grafo real de imports de TypeScript (no solo convención) y bloquear: (a) cualquier import desde `bounded-contexts/X` hacia `bounded-contexts/Y/domain`, `.../application` o `.../infrastructure` que no pase por `.../public-api`; (b) cualquier import del `domain/` de un contexto hacia `@nestjs/*`, `pg`, o cualquier carpeta `infrastructure/` (el dominio debe ser puro); (c) dependencias circulares entre `public-api` de distintos contextos. La configuración vive en `.dependency-cruiser.cjs` y se ejecuta como test (`test/architecture/boundaries.spec.ts`) dentro de `npm test` y en CI — un PR que viole un límite de contexto falla el build, no depende de que un revisor humano lo note.

## Alternativas consideradas
- **Solo convención + revisión de código:** rechazado — no escala, y el founder pidió explícitamente que esto sea una prueba automatizada, no una política.
- **ESLint `no-restricted-imports` como único mecanismo:** insuficiente por sí solo — esa regla matchea patrones de string en la ruta del import tal como se escribió en el código fuente, no la ruta de archivo resuelta; con imports relativos (`../../otro-contexto/domain/x`) puede no dispararse de forma confiable. Se mantiene como una capa adicional barata (feedback inmediato en el editor) pero dependency-cruiser es la fuente de verdad porque resuelve rutas de archivo reales.
- **Un linter de arquitectura propio (script custom):** rechazado — dependency-cruiser ya resuelve esto de forma madura y mantenida; construir uno propio sería reinventar la rueda sin necesidad.

## Consecuencias
- Se gana: los límites de contexto documentados en `05-domain-model-ddd.md` son verificables automáticamente, no solo aspiracionales.
- Se sacrifica: una dependencia de desarrollo adicional y una configuración que debe mantenerse al añadir nuevos contextos o módulos de infraestructura compartida.
- Revisar la configuración cada vez que se añada un nuevo bounded context o un nuevo módulo `shared-kernel`/`infrastructure` transversal.
