# ADR-005: Contenido de rutas gestionado editorialmente, no scrapeado ni generado por IA sin supervisión

## Estado
Aceptada

## Contexto
Los procesos de homologación/migración documentados cambian con frecuencia (la investigación de julio 2026 ya marca varios datos como "verificar antes de publicar"). Dar información incorrecta sobre un proceso migratorio/médico tiene consecuencias reales (pérdida de tiempo, dinero, oportunidades) para el usuario, y expone a Medical Pathway a riesgo legal y reputacional si se presenta como asesoría fiable sin serlo.

## Decisión
Todo el contenido de rutas y pasos se edita y versiona por un equipo editorial humano a través de un panel de administración interno. Cada dato/paso lleva fuente (URL) y fecha de última verificación visible al usuario. No se usa scraping automático de sitios gubernamentales ni generación de contenido por IA sin revisión humana en el MVP.

## Alternativas consideradas
- **Scraping automático de fuentes oficiales:** rechazado para el MVP — fragilidad técnica (los sitios cambian de estructura), y riesgo de publicar información desactualizada o mal interpretada sin revisión humana.
- **Generación de contenido por IA sin supervisión:** rechazado — reproduce el problema central que el producto busca resolver (información que "suena autorizada" pero no está verificada).
- **CMS headless de terceros genérico:** considerado pero no elegido para el MVP porque no modela de fábrica los campos necesarios (fuente, fecha de verificación, disclaimer) sin configuración adicional significativa; se reconsidera si el equipo editorial crece.

## Consecuencias
- Se gana: mayor confiabilidad percibida y real del contenido — coincide directamente con el problema de mayor dolor identificado en la investigación.
- Se sacrifica: velocidad de escalado de contenido a nuevos destinos (limitada por capacidad editorial humana, no por tecnología).
- Revisar si el volumen de contenido a mantener crece más rápido que la capacidad editorial — en ese punto, evaluar herramientas de asistencia (no de generación autónoma) para el equipo editorial.
