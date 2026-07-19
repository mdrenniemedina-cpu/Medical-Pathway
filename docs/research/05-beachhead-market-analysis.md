# Análisis de beachhead market

> Basado en `01-04` (investigación de campo). Framework: beachhead market de Geoffrey Moore (*Crossing the Chasm*) — no se trata de "a qué país lanzamos", sino de en qué segmento concreto podemos convertirnos en el punto de referencia dominante y confiable más rápido, para expandirnos desde ahí.

## Instrucción del founder

"Analiza cuál debería ser el mejor mercado inicial... No asumas que la mejor estrategia es lanzar para un único país." Se interpreta esta instrucción en dos ejes, porque "mercado" es ambiguo entre país de origen (de dónde vienen los usuarios) y país destino (a dónde quieren ir):

- **Eje de profundidad (destino):** ¿en qué país destino invertimos primero en contenido profundo, verificado y herramientas de seguimiento?
- **Eje de adquisición (origen):** ¿en qué países LatAm concentramos primero la adquisición de usuarios?

La recomendación de este documento es **NO** restringir el producto a un único destino ni a un único origen desde el punto de vista de acceso (cualquier médico hispanohablante de LatAm puede entrar y ver información de los 9 destinos desde el día uno), pero **SÍ** concentrar la inversión de profundidad/calidad en un destino y la inversión de marketing en 2 países de origen. Ir "ancho y superficial" en todo a la vez recrearía exactamente el problema que identificamos como el dolor #1: información fragmentada y poco confiable.

## Comparación de destinos (resumen de evidencia)

| Destino | Tamaño demanda LatAm actual | Barrera idioma | Complejidad regulatoria | Tiempo/coste típico | Competencia existente | Tendencia |
|---|---|---|---|---|---|---|
| **España** | Muy alta y creciendo — 53.742/85.564 homologaciones son LatAm; Colombia es la mayor nacionalidad extranjera en MIR (1.185/4.111, 30%) | Ninguna (español nativo) | Media (proceso nacional único, pero backlog burocrático) | 9–24 meses, ~166,50€ + colegiación | Fragmentada, sin líder claro, mucha desinformación/estafas | Fuerte alza (homologaciones 8.865→30.303 en un año) |
| Alemania | Baja penetración LatAm hoy (ningún país LatAm en el top de origen de médicos extranjeros) | Alta (B2 general + C1 médico) | Alta (16 estados, sin proceso unificado) | 1–2 años, coste fragmentado (miles de €) | AMBOSS domina prep clínica, bien financiado | Alza, pero mercado "verde" para LatAm — oportunidad de expansión, no de MVP |
| EE.UU. | Establecida pero saturada; match rate IMG con patrocinio cae a 54,4% | Alta (inglés médico + OET) | Alta (7 años de ventana, 3 años residencia) | 2,5–4 años solo pre-residencia; ~8-9 años total; 8.000–25.000+ USD | Muy competida, ya hay academias LatAm en español (Mi-Step, Doctor en USA, Dr. Vinti) | Estable/saturada |
| Canadá | Media, fragmentada por 13 provincias | Alta (inglés/francés) | Alta (variación provincial) | 4–8 años, 15.000–30.000+ CAD | Poca competencia específica LatAm | Alza moderada |
| Reino Unido | Media, ruta PLAB relativamente accesible | Alta (inglés) | Media | 12–24 meses, £3.200–7.000+ | Sin curso oficial, 13 cursos privados no acreditados | **Riesgo regulatorio nuevo:** ley 2026 despriorizada a IMG |
| Australia | Alta demanda estructural (32% de la fuerza médica es IMG) | Alta (inglés) | Media-alta (tasa de aprobación clínico solo 21-24%) | A$8.000-12.000+ | Academically (competidor real, multi-destino) | Alza pero sin evidencia LatAm específica |
| Nueva Zelanda | Pequeña, cuello de botella de cupos de examen (sin convocatorias 2026 restantes) | Alta (inglés) | Media | NZD 5.531+ (probablemente subestimado) | Baja | Mercado demasiado pequeño/frágil para beachhead |
| Suiza | Casi nula para LatAm (43% médicos extranjeros pero casi todos vecinos UE) | Muy alta (C1 en alemán/francés/italiano según cantón) | Muy alta (26 cantones + posible examen federal) | Coste total incierto, alto | Baja | El más difícil de los 9 para LatAm — cola larga, no beachhead |
| Brasil | Media pero LatAm es prioridad #3 en Mais Médicos (tras brasileños) | Alta (portugués, sin certificado, se evalúa en el propio examen) | Alta (tasa de aprobación 10-15%) | 12-18 meses, visado no convertible a residencia permanente | Baja competencia digital, pero cursos con muchas quejas (Reclame Aqui) | Estructuralmente limitado para LatAm |

## Recomendación: España como beachhead de profundidad

**Por qué España y no otro destino:**
1. **Sin barrera de idioma.** Elimina de raíz la variable más cara de construir en producto (seguimiento de aprendizaje de idioma, certificación, etc.) y la que más tiempo/dinero cuesta al usuario en cualquier otro destino. Esto simplifica radicalmente el MVP.
2. **Mayor volumen y crecimiento demostrado.** 30.303 homologaciones en 2025 (vs. 8.865 en 2024) y Colombia como mayor nacionalidad extranjera en el MIR — es el destino con la señal de demanda más fuerte y verificable de los 9.
3. **El dolor es más agudo aquí, no menos.** Estafas de citas falsas, acusaciones de manipulación de cifras del Ministerio, expedientes atascados desde 2019-2021, médicos cualificados trabajando de repartidores. Un producto centrado en confianza y transparencia tiene el mayor "quantum of pain" que resolver precisamente en España — coincide con el problema que identificamos como el real (ver `06-product-strategy-cuestionamiento.md`).
4. **Sin competidor dominante.** A diferencia de Alemania (AMBOSS) o EE.UU. (varias academias ya establecidas en español), España no tiene un jugador claro que resolvería el problema de confianza/orientación — el hueco competitivo es real y confirmado por la investigación.
5. **Ruta de valor incremental clara.** La homologación por sí sola ya permite ejercer en el sector privado sin esperar al MIR — significa que un usuario puede alcanzar un hito de valor real (primer trabajo) en 9-24 meses sin necesitar aprobar un examen competitivo, algo que no ocurre en EE.UU./Canadá/Alemania (donde el examen es la puerta de entrada obligatoria antes de cualquier ingreso). Esto es clave para retención temprana: el usuario ve progreso tangible rápido.

**Qué NO implica esta recomendación:** el producto no se cierra a otros destinos. Desde el día uno existe una vista general (comparación ligera, ver MVP) de los 9 países para cualquier usuario — simplemente la profundidad (rastreador de pasos, gestor documental, comunidad verificada, alianzas de reclutamiento) se construye primero para España y se expande después.

**Segundo destino candidato para expansión (Fase 2, no MVP):** Alemania — mercado grande, en alza, con escasez estructural severa, pero **infra-penetrado por LatAm hoy** (ningún país LatAm en el top de origen de médicos extranjeros). Esto es una oportunidad de "terreno verde": si Medical Pathway construye credibilidad en España primero, puede posicionarse como el actor que abre el corredor LatAm→Alemania antes de que lo haga un competidor genérico. Requiere, eso sí, resolver el problema de idioma (B2/C1 alemán) como parte del roadmap de producto — mucho más caro de construir bien que el caso España.

## Recomendación: Colombia y Venezuela como beachhead de adquisición

- **Colombia:** único dato concreto y verificado de qué país LatAm domina la demanda hacia un destino específico (30% de candidatos extranjeros al MIR 2025, la mayor nacionalidad). Además, Colombia tiene un volumen alto de nuevos graduados (6.300+/año), lo que da una base amplia de usuarios potenciales tanto estudiantes como médicos ya graduados.
- **Venezuela:** la fuga de médicos más documentada y masiva de la región (24.000+ emigrados), con una diáspora ya dispersa y motivada — alta urgencia, alta disposición a buscar información confiable, y probablemente el segmento con mayor dolor emocional/financiero acumulado (coincide con el JTBD de confianza, no solo de comparación).
- El resto de países hispanohablantes de LatAm no quedan excluidos — el contenido está en español y sirve a cualquier origen sin coste marginal relevante — pero el gasto de adquisición (comunidad, alianzas con facultades, marketing) se concentra primero en estos dos mercados por tener la señal de demanda más fuerte y verificable.

## Riesgo a vigilar

Si en 6-12 meses la evidencia muestra que el volumen real de usuarios activos proviene mayoritariamente de otro país de origen (p. ej. México, por cercanía/afinidad con EE.UU.) o hacia otro destino, esta recomendación debe revisarse — está basada en la mejor evidencia pública disponible en julio 2026, no en datos propios de producto (que aún no existen). Se recomienda instrumentar analítica desde el día uno para validar o refutar esta hipótesis con datos reales de uso (ver `04-architecture.md`, sección de métricas).
