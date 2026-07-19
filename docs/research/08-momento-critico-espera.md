# El momento de mayor dolor e incertidumbre: la espera de resolución

> Responde al punto 2 de la validación estratégica del founder: identificar el momento del recorrido del médico con mayor dolor/incertidumbre, para que sea el centro del MVP.

## Método

Se revisaron los 9 destinos investigados (`research/01-03`) y el panorama competitivo (`research/04`) buscando, para cada fase del recorrido de un médico internacional, tres señales: (a) duración de la incertidumbre, (b) evidencia de daño real (financiero, emocional, de oportunidad), y (c) si ya existe un actor del mercado atendiendo esa fase.

## Fases del recorrido y su nivel de dolor

| Fase | Duración típica | Evidencia de dolor | ¿Ya atendida por el mercado? |
|---|---|---|---|
| 1. Decidir si emigrar y a dónde | Semanas | Alta carga emocional pero es una decisión puntual, no sostenida | Parcialmente (contenido/blogs, foros genéricos) |
| 2. Preparar y enviar documentos (apostilla, traducción, solicitud) | Semanas a pocos meses | Tedioso pero mecánico y predecible | Gestores/traductores ya existen como servicio |
| **3. Esperar la resolución de la solicitud (homologación/equivalencia)** | **9-24 meses, hasta 5 años en casos atascados** | **La más alta de todo el recorrido — ver evidencia abajo** | **No. Ningún competidor identificado la atiende.** |
| 4. Preparar y presentar el examen (MIR, Kenntnisprüfung, Revalida, USMLE, NAC, PLAB, AMC, NZREX) | Días a semanas de examen, meses de preparación | Alta pero acotada en el tiempo, con contenido de estudio bien definido | **Sí, mercado maduro** (AMBOSS, Kaplan, Boards and Beyond, Mi-Step, Doctor en USA, Dr. Vinti) |
| 5. Buscar empleo/plaza | Semanas a meses | Moderada, con más información disponible (bolsas de empleo, reclutadores) | Parcialmente (agencias de reclutamiento) |
| 6. Trámites de visado/residencia | Paralelo a otras fases | Bureaucrática, con riesgo de estafa, pero generalmente hay asesoría migratoria especializada disponible | Parcialmente |

## Por qué la Fase 3 es el momento crítico

La evidencia de la investigación converge de forma inusualmente consistente en esta fase específica (caso España, el más documentado):

- **Duración extrema y variable sin explicación:** plazo legal 3-6 meses, real 9-24 meses, y **casos concretos represados desde 2019-2021** (hasta 5 años). El usuario no tiene forma de saber en cuál de estos escenarios está su propio expediente.
- **Opacidad informativa activa, no solo ausencia de información:** asociaciones de médicos LatAm acusan al Ministerio de "inflar" cifras de expedientes resueltos mientras casos antiguos siguen sin resolverse — es decir, ni siquiera las fuentes oficiales son confiables en este punto.
- **Es exactamente donde ocurren las estafas documentadas:** venta de citas falsas por WhatsApp/Telegram (hasta 200€) explota precisamente la ansiedad de "¿cuándo me van a resolver esto?" — el fraude ataca el vacío de información, no otra fase del proceso.
- **Daño real y medible:** médicos ya cualificados trabajando de repartidores mientras esperan — years-long de subempleo, no solo incomodidad temporal.
- **Nadie lo atiende.** Los competidores identificados se concentran en preparación de examen (fase 4, ya madura y competida) o en comparación de destinos (fase 1). La fase de espera post-solicitud está completamente descubierta — es el único hueco genuinamente "océano azul" de todo el recorrido.
- **Es earlier-funnel que donde compiten hoy las academias:** un usuario en la Fase 3 de España ni siquiera ha llegado todavía a considerar el MIR — significa que el producto puede capturar y retener al usuario *antes* de que entre en el terreno ya disputado de la preparación de examen.

## La implicación para el MVP

El problema no es solo "el proceso tarda mucho" — es que **el médico no tiene ninguna fuente confiable que le diga qué tan normal es su espera, ni ninguna forma de protegerse de quienes explotan esa incertidumbre**. Esto convierte el problema en algo que un producto de datos + comunidad puede resolver de forma única: agregar de forma anónima los tiempos de espera reales que reporta la propia comunidad de usuarios para dar, por primera vez en este espacio, una estimación basada en evidencia real en lugar de en el plazo legal (que sabemos que no se cumple) o en el rumor de foros fragmentados.

Este es un activo de datos que **nadie más tiene** y que **crece con cada usuario nuevo** (efecto de red genuino: más usuarios → estimaciones más precisas → más valor → más usuarios) — a diferencia de un comparador de países (información estática, replicable por cualquiera) o un simple checklist (utilidad pero sin foso defendible).

Ver `03-mvp-definition.md` (v2) para el rediseño del MVP alrededor de este hallazgo, y `decisions/ADR-007` y `decisions/ADR-008`.
