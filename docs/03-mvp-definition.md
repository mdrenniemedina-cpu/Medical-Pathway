# Definición del MVP (v3)

> **Changelog:** v1 trataba radar/roadmap/documentos/comunidad/directorio como pilares de peso similar. v2 concentró todo en el Radar de Espera, tratando descubrimiento/comparación como una tabla estática de entrada. v3 corrige esto: el founder señaló que la visión del producto es el recorrido completo ("¿a dónde puedo ir?" → "¿qué sigue ahora?"), y que el Radar de Espera debe ser una funcionalidad diferenciadora anidada, no el producto entero. Analizado con honestidad, esta corrección resuelve además una debilidad real de v2 que no era solo de visión: un MVP que solo sirve al usuario que ya decidió y ya envió su solicitud no tiene motor de adquisición propio, y el propio Radar de Espera necesita volumen de usuarios que solo un embudo más amplio (descubrimiento) puede darle rápido. Ver `decisions/ADR-009`.

## Objetivo del MVP

Validar el recorrido completo — descubrir, comparar, planificar y acompañar — para un médico hispanohablante de LatAm, con España como destino de profundidad real y el Radar de Espera como la funcionalidad diferenciadora dentro de la fase de homologación. El MVP debe demostrar tanto que el producto es capaz de guiar una decisión de país con confianza (visión original) como que retiene al usuario durante el proceso más largo y doloroso del recorrido (Radar de Espera).

## Las 5 etapas del MVP

### 1. Descubrimiento — "¿A dónde puedo ir?"
Cuestionario de perfil (especialidad, años de experiencia, idiomas, presupuesto, urgencia, tolerancia a examen competitivo vs. ruta más lenta, prioridad entre ingreso a largo plazo y rapidez) que alimenta un motor de coincidencia **transparente y basado en reglas** (no IA de caja negra — ver `04-architecture.md`) sobre los 9 destinos ya investigados. El resultado es un shortlist explicado ("te recomendamos X porque...").

### 2. Comparación personalizada — "¿Cuál me conviene más entre mis opciones?"
Vista en profundidad del shortlist resultante de la etapa 1, con los datos ya investigados (tiempo, coste, idioma, demanda, dificultad) y la razón de cada recomendación — no una tabla genérica de 9 filas, sino una comparación filtrada y explicada según el perfil del usuario.

### 3. Plan paso a paso — "¿Qué tengo que hacer, y en qué orden?"
Roadmap del destino elegido. **España:** profundo, con checklist accionable (apostilla → traducción jurada → solicitud de homologación → colegiación → [MIR opcional]). **Los otros 8 destinos:** roadmap a nivel de resumen, construido directamente a partir del contenido ya investigado en `research/01-03` (sin necesidad de investigación adicional, solo de estructuración), sin checklist accionable todavía.

### 4. Acompañamiento — "¿Cómo llevo esto sin perderme ni ser estafado?"
Comunidad verificada (segmentada por destino elegido), checklist de progreso, gestor documental mínimo, alertas anti-estafa contextuales, contenido editorial de contexto. Profundidad completa para España; alcance genérico para el resto.

### 5. Radar de Espera *(anidado dentro de la etapa 4, solo para España)* — "¿Cuánto voy a esperar, realmente?"
El rastreador comunitario y anonimizado de tiempos reales de resolución de homologación (ver `decisions/ADR-007` y `ADR-008`), que aparece específicamente cuando el usuario llega al paso de homologación de su plan. Sigue siendo la funcionalidad de mayor inversión de ingeniería y el activo de datos que constituye el foso defendible del producto — pero ahora está correctamente anidada dentro del recorrido, no reemplazándolo.

## Por qué esta secuencia (y no construir todo a la vez sin orden)

1. **Meses 1-3 — la columna vertebral (etapas 1-4):** motor de descubrimiento, comparación, roadmap (profundo en España, ligero en el resto) y acompañamiento básico. Esto es lo que da al producto un motor de adquisición propio de alcance amplio (cualquier médico LatAm en fase de decisión, no solo los que ya enviaron su solicitud) y empieza a canalizar usuarios hacia España.
2. **Meses 3-6 — el diferenciador (etapa 5):** Radar de Espera, construido sobre la base de usuarios que la columna vertebral ya empezó a captar y a mover hacia el paso de homologación. Esta secuencia le da al Radar de Espera la mejor oportunidad de acumular volumen de datos rápido, en lugar de depender de que usuarios ya en fase de espera encuentren el producto por su cuenta.

Esta secuencia también es la razón concreta por la que la ampliación de alcance (recorrido completo, no solo Radar de Espera) es defendible dentro de un horizonte de recursos limitados: la columna vertebral reutiliza casi enteramente contenido y datos que ya existen (el dataset del radar de 9 destinos y el contenido de `research/01-03`), y el motor de descubrimiento es una función de reglas de puntuación, no un sistema nuevo de aprendizaje automático — la inversión de ingeniería genuinamente nueva sigue siendo, casi en su totalidad, el Radar de Espera.

## Qué SÍ incluye el MVP (resumen)

- Perfil de usuario enriquecido para el motor de descubrimiento.
- Descubrimiento y comparación personalizada sobre los 9 destinos.
- Roadmap: profundo con checklist para España; resumen para los otros 8.
- Acompañamiento: comunidad verificada, checklist, gestor documental mínimo, alertas anti-estafa — profundidad completa en España.
- Radar de Espera, anidado en el paso de homologación de España.
- Freemium básico: gratis = descubrimiento + comparación + roadmap en modo lectura + comunidad; premium = checklist interactivo, gestor documental completo, Radar de Espera con detalle completo, alertas prioritarias.

## Qué NO incluye el MVP (y por qué)

- **Motor de IA de recomendación (aprendizaje automático, no reglas):** sigue fuera de alcance — el motor de descubrimiento usa reglas de puntuación transparentes y explicables, no un modelo entrenado (ver `04-architecture.md`). Se reconsidera cuando exista suficiente dato verificado y de uso real para entrenar algo responsablemente.
- **Roadmap profundo + checklist accionable + Radar de Espera para los otros 8 destinos:** se difiere hasta validar retención y volumen de datos en España (criterio de salida).
- **Gestor documental completo y directorio extenso de monetización por referidos:** alcance mínimo en el MVP, se amplían en Fase 2 (ver `decisions/ADR-003`).
- **Alianzas institucionales, app nativa, multi-tier de precios:** sin cambios respecto a versiones anteriores — siguen fuera de alcance.
- **Cualquier funcionalidad que implique asesoría legal o migratoria vinculante:** el motor de descubrimiento y el contenido de rutas son informativos y explicables, nunca asesoría personalizada vinculante.

## Usuario objetivo

Sin cambios de fondo: médico graduado o estudiante avanzado, hispanohablante, de cualquier país de LatAm, con foco de adquisición en Colombia y Venezuela. A diferencia de v2, el punto de entrada vuelve a ser amplio (cualquier médico en fase de decisión, no solo quienes ya enviaron su solicitud en España) — el Radar de Espera es ahora el destino de un embudo, no la puerta de entrada.

## Métricas de éxito (actualizadas)

- **Embudo completo:** tasa de conversión entre cada etapa (perfil completado → descubrimiento visto → destino elegido → paso de plan iniciado → uso del Radar de Espera) — permite ver en qué etapa se pierden usuarios, no solo la retención de una etapa aislada.
- **Calidad percibida del descubrimiento:** ¿los usuarios confían en la recomendación? (encuesta directa, tasa de usuarios que exploran la explicación "por qué").
- **Retención durante la espera:** igual que en v2 — sigue siendo la señal clave de que el Radar de Espera cumple su función de diferenciador.
- **Volumen de datos agregados y reducción de subsanaciones:** igual que en v2.
- **Estafas evitadas/reportadas y confianza percibida general.**

## Criterio de salida del MVP (cuándo pasar a Fase 2)

Cuando exista evidencia de que (a) el embudo completo convierte razonablemente entre descubrimiento y elección de destino (valida la visión de "ayudar a decidir"), y (b) el volumen de datos del Radar de Espera es suficiente para dar estimaciones creíbles y genera retención recurrente durante la espera (valida el diferenciador) — recién entonces se justifica invertir en gestor documental completo, monetización por referidos a escala, profundidad en un segundo destino (Alemania) y roadmap accionable para el resto del catálogo.
