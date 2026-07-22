# Propuesta — Perfil Lingüístico Internacional (NO implementada)

> **Estado: propuesta congelada**, por la misma razón que `docs/30` y `PRODUCT_ITERATION_V2.md`: el alcance de la Beta Cerrada está congelado hasta terminar su despliegue/verificación y tener evidencia real de entrevistas (ver `docs/product-learning-journal.md`). Documentada tal como la envió el founder, con auditoría del código real, para que sirva de insumo cuando corresponda decidir el Sprint siguiente.

## Qué existe hoy (verificado en el código, no supuesto)

- `CompetenciaIdiomatica` (`src/bounded-contexts/perfil-internacional/domain/value-objects/competencia-idiomatica.vo.ts`) es un VO minimalista: `{ idioma: string, nivel: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2'|'nativo' }`. Sin certificación, sin puntaje, sin fechas.
- **Dato importante que corrige un supuesto del brief:** el agregado `PerfilInternacional` **ya soporta múltiples idiomas** — `agregarIdioma()` (`perfil-internacional.aggregate.ts:55-59`) empuja a un array `idiomas: CompetenciaIdiomatica[]`, reemplazando por idioma repetido. La limitación de "un solo idioma" que describe el brief es **de la interfaz** (`public/onboarding.html`, paso 2: un único `<select>` de idioma + un único `<select>` de nivel, sin bucle de "agregar otro"), no del dominio. Esto abarata la Fase de UI — no hace falta cambiar el agregado para permitir varios idiomas, ya lo permite.
- Lo que sí falta por completo en el dominio: certificación (tipo, sub-campos según examen, puntaje, fechas de emisión/vencimiento).
- El motor de compatibilidad hoy solo consume `idiomasDominados: Array<{idioma, nivel}>` (`motor-compatibilidad.service.ts:12-14`, interfaz `PerfilParaComparar`) — no tiene ningún concepto de certificación ni de vencimiento.

## Objetivo de la propuesta

Convertir la sección de idiomas en un **Perfil Lingüístico Internacional**: múltiples idiomas, cada uno con nivel MCER, certificación oficial opcional con sub-campos dinámicos según el examen, puntaje, fechas — dejando el modelo listo para que un motor de compatibilidad lingüística automático (no implementado todavía) compare esto contra los requisitos de cada destino/ruta.

## 1. Cambio de modelo de datos propuesto

Extender `CompetenciaIdiomatica` (o crear un VO nuevo `CompetenciaIdiomaticaConCertificacion` que lo reemplace) para incluir un sub-objeto opcional de certificación:

```ts
interface CertificacionIdiomaProps {
  tipo: string; // 'IELTS_ACADEMIC' | 'IELTS_GENERAL' | 'OET' | 'TOEFL_IBT' | 'DUOLINGO' | 'CAMBRIDGE' |
                // 'GOETHE' | 'TESTDAF' | 'TELC' | 'DSH' | 'OESD' | 'DELF' | 'DALF' | 'TCF' | 'TEF_CANADA' |
                // 'DELE' | 'SIELE' | 'CELPE_BRAS' | 'JLPT' | 'TOPIK' | 'HSK' | 'otro'
  // Campos según examen — ver sección 3. Todos opcionales salvo los que aplican al tipo elegido.
  puntajeTotal?: number;
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
  nivelCertificado?: string; // para certificaciones que otorgan nivel MCER directo (Goethe, telc, ÖSD)
  fechaEmision: string; // ISO date
  fechaVencimiento?: string; // ISO date — algunas certificaciones no vencen (Goethe)
  tipoOtro?: string; // cuando tipo = 'otro'
}

interface CompetenciaIdiomaticaProps {
  idioma: string;
  idiomaOtro?: string; // cuando idioma no está en la lista cerrada
  nivel: NivelIdioma; // MCER, autopercibido — se mantiene aunque haya certificación
  certificacion?: CertificacionIdiomaProps;
}
```

**Por qué un sub-objeto opcional y no una tabla separada desde el inicio:** el perfil lingüístico vive dentro del agregado `PerfilInternacional` (invariante ya establecida: "concepto central, una sola copia, todo lo demás se deriva vía eventos") — no se justifica un agregado nuevo para esto todavía. Si en el futuro se necesita historial de certificados vencidos/renovados (punto 9 del brief), ahí sí se separaría a una entidad `CertificacionIdioma` con su propio ciclo de vida — la propuesta ya lo anticipa pero no lo construye ahora (evitar sobre-ingeniería sin necesidad probada).

**Migración:** columna JSONB nueva (o extensión de la existente que serializa `idiomas`) en la tabla de persistencia de `perfil-internacional` — aditiva, nullable, no destructiva. Los perfiles ya creados con solo `{idioma, nivel}` siguen siendo válidos (certificación queda `undefined`).

## 2. Diseño de UI propuesto (tal como lo especificó el founder)

- Cada idioma como tarjeta independiente dentro de `.tarjeta` (reutilizando el sistema de diseño actual — **sin tocar colores/tipografía/espaciados**, como pidió explícitamente).
- Botón "➕ Agregar otro idioma" al final de la lista.
- Selector de idioma con búsqueda (lista cerrada + "Otro" con campo de texto) — hoy es un `<select>` simple sin búsqueda; esto es un componente nuevo (o una librería ligera de "combobox" — a evaluar sin añadir dependencias pesadas, consistente con "sin framework" del resto del frontend).
- Nivel MCER con enlace "¿No conoces tu nivel?" que despliega un acordeón inline (sin navegar a otra página) con las 6 descripciones — componente nuevo pero trivial (mismo patrón que `<details>` ya usado en versiones anteriores del frontend).
- Selector de certificación opcional (lista cerrada + "Otro").
- **Campos dinámicos por certificación** — requiere una tabla de configuración explícita, ej.:

  | Certificación | Campos que se muestran |
  |---|---|
  | IELTS Academic/General | Puntaje total, Listening, Reading, Writing, Speaking, Fecha, Vencimiento |
  | OET | Listening, Reading, Writing, Speaking, Calificación, Fecha, Vencimiento |
  | Goethe / telc / ÖSD | Nivel certificado, Fecha, (sin vencimiento) |
  | Duolingo | Puntaje, Fecha, Vencimiento |
  | Otras (TOEFL, Cambridge, TestDaF, DSH, DELF/DALF/TCF/TEF Canada, DELE/SIELE, CELPE-Bras, JLPT, TOPIK, HSK) | A definir campo por campo con el founder antes de codificar — el brief da el patrón completo solo para 4 certificaciones como ejemplo |

  Esta tabla debe vivir como **dato de configuración del frontend** (no hardcodeada dispersa en el HTML), para poder agregar certificaciones nuevas sin tocar lógica.
- Aviso informativo bajo la certificación, texto exacto del brief: *"Cada país, universidad, consejo médico u organismo regulador tiene requisitos lingüísticos distintos. Medical Pathway utilizará esta información para calcular automáticamente tu compatibilidad con cada destino."*

## 3. Preparar la lógica futura (NO implementarla — según instrucción explícita del founder)

El brief pide dejar el modelo listo para que, más adelante, el motor pueda responder cosas como "Alemania: requiere B2-C1 alemán, el usuario tiene A2 → compatibilidad parcial → siguiente paso: obtener Goethe B1 y luego B2". Esto requiere, cuando se decida construirlo (no ahora):
- Que `Destino`/`Ruta` (ver `PRODUCT_ITERATION_V2.md` sección 6-7) tenga un campo de **requisito lingüístico estructurado** (hoy es `idiomaRequerido: string | null` + `nivelIdiomaRequerido: string | null` — un único idioma/nivel por destino, no una lista de exámenes aceptados como "IELTS Academic u OET").
- Que el motor de compatibilidad pueda comparar `certificacion.tipo` + `certificacion.nivelCertificado`/puntajes contra el requisito del destino, no solo `idioma`+`nivel` MCER autopercibido como hoy.
- Que el analizador de brechas pueda sugerir "obtener certificación X nivel Y" como acción — extensión natural de `CRITERIOS_ACCIONABLES_POR_PERFIL` ya identificada en `PRODUCT_ITERATION_V2.md` sección 7.4.

Esto se documenta aquí como dependencia cruzada con `PRODUCT_ITERATION_V2.md` — ambas propuestas convergen en el mismo punto del motor (Fase 3 de ese documento).

## 4. Escalabilidad (punto 9 del brief) — cómo el diseño de datos ya lo anticipa

El sub-objeto `certificacion` opcional dentro de `CompetenciaIdiomaticaProps` permite, sin rediseñar la base de datos de nuevo:
- **Historial de certificados**: hoy `agregarIdioma` reemplaza por idioma — si se necesita historial, cambiar a un array de certificaciones por idioma en vez de una sola, dato aditivo.
- **Certificados vencidos/próximos a vencer**: se calcula en el momento de lectura comparando `fechaVencimiento` contra la fecha actual — no requiere campo nuevo, es lógica de presentación.
- **Validación documental / carga de PDF**: requeriría un campo `documentoUrl` o similar + almacenamiento de archivos (fuera del alcance de este VO, es una pieza de infraestructura nueva — S3-compatible o similar).
- **Recordatorios de vencimiento**: pertenece al bounded context Notificaciones (hoy solo un esqueleto) — consumiría el evento de `PerfilActualizado` o uno nuevo específico, no requiere cambiar este modelo.

## Riesgos específicos de esta propuesta

1. **Mismo riesgo de secuencia que las propuestas anteriores**: es una funcionalidad construida antes de tener evidencia de que "certificaciones oficiales con campos dinámicos" es lo que los médicos reales necesitan en el onboarding, o si genera fricción/abandono (el propio Sprint 1 ya identificó H1 — fricción de onboarding — como hipótesis a vigilar, `docs/16-hipotesis-sprint-1.md`).
2. **20+ certificaciones con campos distintos es una superficie de mantenimiento considerable** para una sección que hoy tiene cero evidencia de uso real — construirla completa de una vez, antes de saber cuántas certificaciones distintas aparecen realmente en las primeras entrevistas/registros, arriesga tiempo de desarrollo en combinaciones que quizás nunca se usan.
3. **El selector de idioma con búsqueda** es el único elemento de UI que no tiene un patrón ya existente en el frontend actual (todo lo demás son `<select>`/`<input>` estándar) — es la pieza con más riesgo de introducir una dependencia nueva o una implementación custom no trivial.

## Recomendación

Igual que `PRODUCT_ITERATION_V2.md`: no construir todavía. Si el pivote de enfoque de ese documento (Fase 1-2) avanza, esta propuesta encaja de forma natural como parte de una fase posterior de esa misma iteración (extiende el Perfil Internacional, no lo contradice) — se recomienda decidir ambas juntas, no en paralelo por separado, para no fragmentar el trabajo de `Perfil Internacional` en dos iniciativas independientes.
