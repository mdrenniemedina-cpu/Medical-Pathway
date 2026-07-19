# Sprint 0 — Entregables

> Esqueleto técnico del monolito modular, construido y **validado realmente** (build, lint, migraciones contra Postgres, arranque de la aplicación, y una petición HTTP end-to-end que ejercita Perfil Internacional → Descubrimiento con datos reales de España/Alemania) — no es solo código escrito, es código que corre. Ver `05-domain-model-ddd.md` para el diseño de dominio que este esqueleto implementa.

## 1. Árbol final del repositorio

```
Medical-Pathway/
├── .github/workflows/ci.yml
├── .dependency-cruiser.cjs        # reglas de límites de contexto (ADR-016)
├── .eslintrc.cjs
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── jest.config.js                  # unit + invariantes de dominio
├── package.json
├── tsconfig.json / tsconfig.build.json
├── db/
│   ├── migrate.ts                  # runner de migraciones (ADR-017)
│   ├── migrations/0001..0010_*.sql # un archivo por schema, numerados
│   └── seed/seed.ts                # España profundo + Alemania ligero, con fuente real
├── src/
│   ├── main.ts / app.module.ts     # composition root
│   ├── config/                     # validación fail-fast de entorno (ADR-019)
│   ├── shared-kernel/
│   │   ├── domain/                 # Entity, AggregateRoot, ValueObject, DomainEvent, DomainError
│   │   └── application/            # EventBusPort
│   ├── infrastructure/
│   │   ├── persistence/            # Pool, transacción + outbox
│   │   ├── events/                 # bus in-process + dispatcher de outbox (ADR-015)
│   │   └── observability/          # logger, correlation-id, health, exception filter
│   └── bounded-contexts/
│       ├── identidad-acceso/       # Cuenta, JWT (dominio completo)
│       ├── perfil-internacional/   # PerfilInternacional (dominio completo)
│       ├── catalogo/               # Destino, RutaHomologacion (dominio completo)
│       ├── descubrimiento/         # motor de compatibilidad (dominio completo)
│       ├── ruta-medico/            # RutaPersonalizada (dominio parcial, ver §9)
│       ├── radar-espera/           # RegistroExpediente + cohortes (dominio completo)
│       ├── comunidad/              # esqueleto deliberado
│       ├── oportunidades/          # esqueleto deliberado
│       └── notificaciones/         # esqueleto + suscriptor conformista de ejemplo
│           └── (cada contexto: domain/ · application/ · infrastructure/ · public-api/)
└── test/
    ├── jest.setup.ts
    └── architecture/
        ├── boundaries.spec.ts               # dependency-cruiser vía CLI
        ├── jest.arch.config.js
        ├── invariantes.catalogo.spec.ts
        ├── invariantes.descubrimiento.spec.ts
        └── invariantes.radar-k-anonimato.spec.ts   # integración real contra Postgres
```

## 2. Diagrama de módulos y dependencias permitidas

```
Identidad y Acceso ─────────────────────────────────────────┐
        │ (Customer)                                         │
        ▼                                                     │
Perfil Internacional ──(OHS: PerfilSnapshotQueryService)──┐   │
        │                                                  │   │
        ▼                                                  ▼   ▼
Catálogo ──(OHS: CatalogoQueryService)──▶ Descubrimiento ──(evt: DestinoSeleccionado)──▶ Ruta del Médico
        ▲                                                                                    │
        └────────────────────(OHS, consumido también por Ruta del Médico)────────────────────┘
                                                                                               │
                                                                              (evt: EntroAEtapaDeEspera,
                                                                               vía ACL)
                                                                                               ▼
                                                                                      Radar de Espera

Notificaciones ◀─── (conformista: se suscribe a eventos de Perfil, Catálogo, ... — no expone nada)
Comunidad, Oportunidades ── esqueleto, sin dependencias salientes todavía
```

**Regla verificada automáticamente (no solo dibujada):** ningún módulo importa `domain/`, `application/` ni `infrastructure/` de otro contexto — todo pasa por `public-api/`. `test/architecture/boundaries.spec.ts` lo confirma ejecutando dependency-cruiser sobre el código real; se validó deliberadamente introduciendo una violación de prueba (import directo a `identidad-acceso/domain` desde otro contexto) y confirmando que la regla la detecta antes de revertirla.

## 3. Esquema inicial de persistencia

9 schemas de Postgres (uno por bounded context) + `shared` (outbox, migraciones). Ver `db/migrations/0001..0010_*.sql` para el DDL completo. Diferencias deliberadas respecto al diseño original de `06-database-schema.md`, encontradas al implementar (documentadas, no silenciosas):

| Cambio | Razón |
|---|---|
| IDs `TEXT` (nanoid) en vez de `UUID` | Los agregados generan su propio ID (`nanoid()`) en la capa de aplicación, no la base de datos — evita una dependencia de `pgcrypto` por fila y mantiene el ID disponible antes del `INSERT` (necesario para escribir el outbox en la misma transacción). |
| `resultado_descubrimiento.destino_seleccionado_id` añadida | Necesaria para persistir `ResultadoDescubrimiento.seleccionarDestino()`, no estaba en el diseño original. |
| `ruta_medico.etapa_personalizada.nombre` añadida | Evita un JOIN obligatorio al catálogo solo para mostrar el nombre de la etapa en la vista del usuario. |
| `radar_espera.registro_expediente.confirmado_por_usuario` añadida | Soporta el mecanismo de reciprocidad de datos (ADR-014): el ACL de Ruta del Médico pre-rellena un borrador, pero solo cuenta para cohortes tras confirmación explícita del usuario. |
| Índice único de `cohorte_comparacion` sin `coalesce()` | `REFRESH MATERIALIZED VIEW CONCURRENTLY` exige un índice único sin expresiones — se descubrió al ejecutar la migración contra Postgres real (16), no solo al diseñarla. |

Vista materializada `radar_espera.cohorte_comparacion`: agrega por destino+ruta+región+ventana de envío, con `HAVING count(*) >= 5` (umbral de k-anonimato) y percentiles p25/p50/p75/p90 — validado insertando datos reales y confirmando que una cohorte con 3 registros no se publica y con 5 sí (ver `invariantes.radar-k-anonimato.spec.ts`).

## 4. ADRs creados en este sprint

| ADR | Decisión |
|---|---|
| ADR-015 | Outbox transaccional + bus de eventos in-process (no un broker distribuido) |
| ADR-016 | dependency-cruiser como prueba arquitectónica automatizada de límites de contexto |
| ADR-017 | Migraciones SQL crudas y versionadas, sin ORM |
| ADR-018 | JWT + Argon2id + refresh opaco hasheado para autenticación |
| ADR-019 | Validación fail-fast de configuración + secretos fuera del repositorio |
| ADR-020 | RLS diseñado pero activación diferida — conflicto detectado y documentado (ver §9) |

## 5. Pipeline de CI/CD

`.github/workflows/ci.yml`: levanta un contenedor de servicio Postgres 16, y ejecuta en orden `npm ci` → `lint` → `typecheck` → `build` → `migrate` (valida que las migraciones versionadas apliquen limpias contra una base nueva) → `seed` → `test` (unitarios + invariantes) → `test:arch` (límites de contexto). Un PR que rompa cualquiera de estas capas falla el build.

## 6. Pruebas arquitectónicas — qué bloquean, verificado realmente

| Prohibición pedida por el founder | Mecanismo | Verificado |
|---|---|---|
| Dependencias directas indebidas entre bounded contexts | `.dependency-cruiser.cjs` regla `no-context-internals-cross-import`, ejecutada en `boundaries.spec.ts` | Sí — probado con una violación deliberada, detectada y luego revertida |
| Acceso de un contexto a las tablas internas de otro | Mismo mecanismo (no se puede leer una tabla de otro contexto sin importar su repositorio, que ya está bloqueado) + ningún FK cruza schemas | Sí, por construcción |
| Uso de datos del catálogo sin fuente y fecha de verificación | `AtributoConFuente.crear()` lanza `DomainError` si faltan — `invariantes.catalogo.spec.ts` | Sí, test unitario en verde |
| Creación de compatibilidades sin razones explicativas | `PuntuacionDestino.crear()` lanza `DomainError` si `razones.length === 0` — `invariantes.descubrimiento.spec.ts` | Sí, test unitario en verde |
| Publicación de cohortes que no cumplan el umbral de k-anonimato | `HAVING count(*) >= 5` en la vista materializada + segunda verificación en `CohorteRepositoryPg` — `invariantes.radar-k-anonimato.spec.ts` | Sí, test de integración real contra Postgres en verde |

## 7. Instrucciones de ejecución local

```bash
cp .env.example .env                 # ajustar si hace falta
docker compose up -d postgres        # o un Postgres 16 local propio
npm install
npm run migrate                      # aplica las migraciones versionadas
npm run seed                         # carga España (profundo) + Alemania (ligero)
npm run build && npm start           # o: npm run start:dev

# validación
curl http://localhost:3000/health
npm test                             # unitarios + invariantes de dominio
npm run test:arch                    # límites de bounded context
```

## 8. Radar de Espera — mecanismos conservados desde el inicio (verificado en código)

| Mecanismo pedido | Dónde vive |
|---|---|
| Verificación progresiva | `calcularConfianzaInicial()` — peso 0.3/0.6/1.0 según `NivelVerificacion` |
| Niveles explícitos de confianza | `ConfianzaDato` (VO, 0..1) + `nivelConfianzaEstimacion` (alta/media/preliminar) en la respuesta de cohorte |
| Reputación del aportante | Bono acumulado por reportes consistentes previos, acotado a +0.2, en `calcularConfianzaInicial()` |
| Detección de anomalías | `detectarOutlierEstadistico()` / `detectarDuplicadoExacto()` — marcan, nunca eliminan |
| Conservación de casos atípicos legítimos | Un registro `marcado_anomalo` se excluye de agregados públicos pero **no se borra** — queda para revisión humana |
| Reciprocidad de datos | `ConsultarMiCohorteUseCase` exige `confirmadoPorUsuario` propio antes de devolver detalle de cohorte |
| Privacidad por diseño | `VentanaEnvio` (trimestre, no fecha exacta) + umbral de k-anonimato + `registro_expediente` nunca expuesto individualmente fuera de su dueño |

## 9. Conflicto detectado y documentado durante el sprint (instrucción explícita del founder)

**RLS de `08-auth-model.md` no se activa todavía.** Al implementar se detectó que activar `ENABLE ROW LEVEL SECURITY` sin un mecanismo de `SET LOCAL app.current_perfil_id` por request (que requiere checkout de cliente dedicado, no el `Pool` compartido actual) rompería las propias lecturas del backend. Se decidió, según la instrucción de detenerse ante un conflicto: **no activar RLS con una implementación rota o con un bypass amplio que daría falsa sensación de seguridad**, documentar el conflicto (`decisions/ADR-020`) y dejarlo como acción de seguimiento explícita para el inicio de Sprint 1, antes de manejar datos de usuarios reales.

## 10. Riesgos y deuda técnica deliberadamente aceptada

- **RLS diferido** (ver §9 y ADR-020) — la única defensa actual contra un bug de aplicación que olvide filtrar por `perfilId` es la disciplina en los use-cases.
- **Republicación de una nueva versión de `RutaHomologacion` no des-publica automáticamente la anterior** — el índice único `idx_una_ruta_publicada_por_destino` lo impediría; el flujo de "despublicar antes de publicar la siguiente versión" no está implementado (no es necesario con una sola versión seed).
- **La personalización real de `RutaPersonalizada` (omitir/opcionalizar etapas según el perfil, p. ej. MIR opcional) no está implementada todavía** — `CrearRutaPersonalizadaUseCase` instancia todas las etapas como obligatorias; el punto de extensión (`esConfigurablePorPerfil`) ya viaja en el modelo, listo para implementarse.
- **El motor de compatibilidad usa una fórmula de puntuación simple y calibrada a mano**, no validada con usuarios reales — es intencional (Sprint 0 prueba la arquitectura, no ajusta el producto), pero debe recalibrarse con datos de uso reales.
- **Sin réplica de lectura ni extracción de servicios** — aceptado por diseño (ADR-004/ADR-010), Radar de Espera es el primer candidato si el volumen lo exige.
- **Comunidad, Oportunidades y Notificaciones son esqueletos** — mapeados en el dominio y con schema de base de datos, sin lógica de aplicación todavía (alcance deliberado, no deuda oculta).

## 11. Propuesta de vertical slice para Sprint 1

Confirmado con el founder: **crear Perfil Internacional → ejecutar recomendación explicable → mostrar destinos priorizados con razones**. Gran parte de este flujo **ya existe y fue probado end-to-end** durante este Sprint 0 (registro → auto-creación de perfil vía evento → agregar formación → `POST /descubrimiento/calcular` → respuesta con `porcentajeCompatibilidad` + `razones` reales para España/Alemania). Lo que falta para que sea el vertical slice completo y demostrable de Sprint 1:

1. **Frontend mínimo** (una pantalla de onboarding + una de resultados) — no existe todavía, Sprint 0 fue backend puro.
2. **Onboarding completo del perfil** (idiomas, presupuesto, objetivos — los endpoints ya existen, falta el flujo guiado de UI).
3. **Instrumentación de eventos analíticos** pedida explícitamente:
   - `cuestionario_iniciado` / `cuestionario_completado` / `cuestionario_abandonado_en_pregunta` — se instrumentan en el frontend (no existen como eventos de dominio porque no son decisiones de negocio, son telemetría de producto; se registran en un servicio de analítica de terceros o en una tabla `notificaciones`/`analytics` simple, a decidir en Sprint 1).
   - `recomendacion_generada` → puede derivarse directamente del evento de dominio ya existente `descubrimiento.DescubrimientoCompletado`.
   - `destino_explorado` → nuevo evento de interacción de UI (clic en un destino del resultado), no de dominio.
   - `ruta_iniciada` → puede derivarse de `descubrimiento.DestinoSeleccionado` (ya dispara la creación de la Ruta Personalizada).
4. **Ajuste fino del motor de compatibilidad** con más reglas/criterios (publicaciones, años de experiencia — el perfil ya los captura parcialmente) antes de mostrarlo a usuarios reales.

El **núcleo transaccional de este vertical slice ya está construido y probado**, no es trabajo nuevo de Sprint 1 — Sprint 1 es, en gran medida, construir la interfaz sobre una API que ya funciona.
