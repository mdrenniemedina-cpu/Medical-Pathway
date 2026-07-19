# ADR-007: El núcleo del MVP es la espera de resolución de la homologación, no el roadmap completo

## Estado
Aceptada

## Contexto
El founder pidió identificar el momento de mayor dolor/incertidumbre de todo el recorrido del médico y rediseñar el MVP alrededor de él, incluso si eso implicaba cambiar la arquitectura ya propuesta. El análisis (`research/08-momento-critico-espera.md`) muestra que la fase de espera post-solicitud de homologación en España concentra la mayor duración de incertidumbre (9-24 meses, hasta 5 años en casos atascados), la evidencia de daño real más fuerte (médicos cualificados subempleados durante años), el patrón de estafas más documentado (explota directamente esa incertidumbre), y es la única fase de todo el recorrido que ningún competidor identificado atiende — a diferencia de la preparación de examen (fase madura y competida) o la comparación de países (commodity informativo).

## Decisión
El MVP deja de tratar radar, roadmap, gestor documental, comunidad y directorio como pilares de peso similar (como en la v1). El núcleo pasa a ser el "Radar de Espera": un rastreador comunitario y anonimizado del tiempo real de resolución de expedientes de homologación. Los demás módulos (checklist pre-envío, alertas anti-estafa, comunidad segmentada, contenido editorial de contexto) existen para sostener y alimentar ese núcleo, no como productos independientes de igual peso.

## Alternativas consideradas
- **Mantener el MVP v1 (roadmap+checklist+documentos+comunidad+directorio con peso similar):** rechazado — diluye el esfuerzo de un equipo pequeño en 6 meses across cinco frentes, en lugar de concentrar todo el esfuerzo en el único punto con evidencia de mayor dolor y sin competencia.
- **Centrar el MVP en la preparación de examen (MIR):** rechazado — es exactamente el terreno donde ya operan competidores maduros (AMBOSS en Alemania, Mi-Step/Doctor en USA/Dr. Vinti en el corredor EE.UU.); menor oportunidad de diferenciación.
- **Centrar el MVP en el comparador de países:** rechazado explícitamente por el founder y por evidencia propia (ADR-002) — no genera retención recurrente.

## Consecuencias
- Se gana: foco máximo con recursos limitados, alineación directa con el momento de mayor dolor evidenciado, y un activo de datos (tiempos agregados) que crece con cada usuario — un foso genuino.
- Se sacrifica: cobertura de las fases posteriores del recorrido (examen, colegiación, empleo) en el MVP — quedan como contenido de referencia, no como producto activo, hasta Fase 2.
- Revisar si el volumen de usuarios en fase de espera resulta insuficiente para generar agregados útiles en un plazo razonable — en ese caso, reconsiderar si el "efecto de red" de datos es alcanzable con los recursos del MVP.
