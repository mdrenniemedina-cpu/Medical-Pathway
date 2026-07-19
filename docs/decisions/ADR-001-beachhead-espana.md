# ADR-001: España como destino beachhead (profundidad de producto)

## Estado
Aceptada — confirmada con matriz de decisión ponderada (`research/07-matriz-beachhead-espana-alemania.md`, España 4.4/5 vs. Alemania 2.4/5).

## Contexto
El founder no quería asumir un único país destino sin evidencia. La investigación de campo (`research/01-04`) muestra que España es el destino con mayor volumen y crecimiento de homologaciones LatAm (30.303 en 2025 vs. 8.865 en 2024), sin barrera de idioma para hispanohablantes, sin competidor dominante, y con el patrón de estafas/desinformación más documentado de los 9 destinos — es decir, el lugar donde un producto de confianza + navegación tiene el mayor "quantum of pain" que resolver y el menor coste de construcción (no hay que modelar aprendizaje de idioma).

## Decisión
Construir profundidad de producto (rastreador de pasos, checklist, gestor documental, comunidad, directorio de proveedores) primero y solo para España. El resto de destinos (Alemania, EE.UU., Canadá, Reino Unido, Australia, Nueva Zelanda, Suiza, Brasil) permanecen visibles desde el día uno en un "radar" comparativo general, sin profundidad de seguimiento.

## Alternativas consideradas
- **Ir amplio en los 9 destinos desde el MVP:** rechazado — recrearía el problema de información superficial/poco confiable que el producto busca resolver, y dispersaría el esfuerzo editorial (que es humano y caro de mantener actualizado).
- **Alemania como beachhead:** rechazado para el MVP por la barrera de idioma (B2/C1 alemán) y por existir ya un competidor fuerte y bien financiado (AMBOSS) en preparación clínica; queda documentado como segundo destino candidato para expansión (ver `research/05-beachhead-market-analysis.md`).
- **EE.UU. como beachhead:** rechazado por mercado saturado (ya existen academias LatAm en español establecidas), timeline extremo (8-9 años totales) y tasa de match decreciente para quienes requieren patrocinio de visado.

## Consecuencias
- Se gana: velocidad de construcción, foco editorial, y alineación directa con el problema de confianza identificado como núcleo real.
- Se sacrifica: usuarios interesados solo en otros destinos reciben menos valor profundo en el MVP (mitigado por el radar general).
- Revisar esta decisión si los datos de uso reales (ver métricas en `03-mvp-definition.md`) muestran que la mayoría de usuarios activos buscan otro destino distinto a España.
