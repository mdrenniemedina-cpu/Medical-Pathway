# Definición del MVP

> Depende de las decisiones propuestas en `research/06-product-strategy-cuestionamiento.md` y `research/05-beachhead-market-analysis.md`. Si el founder cambia alguna de esas decisiones, este documento debe revisarse antes de construir nada.

## Objetivo del MVP

Validar que médicos y estudiantes de medicina hispanohablantes de LatAm (i) confían en Medical Pathway más que en la información fragmentada actual (foros, Facebook, Telegram, academias), y (ii) permanecen en la plataforma a lo largo de su proceso real de homologación (no solo una visita puntual de comparación). El MVP no busca todavía maximizar ingresos — busca probar retención y confianza, que son los activos que sostienen todo el modelo posterior.

## Usuario objetivo del MVP

Médico graduado o estudiante avanzado, hispanohablante, de cualquier país de LatAm (sin restricción de acceso), con foco de adquisición inicial en Colombia y Venezuela, interesado en homologar/ejercer en España (contenido profundo) o en explorar otros 8 destinos (contenido general).

## Qué SÍ incluye el MVP

1. **Onboarding de perfil.** País de origen, situación (estudiante/graduado/especialista), especialidad, años de experiencia, destino(s) de interés, presupuesto aproximado, idiomas que domina, urgencia del plan. Sirve para personalizar el roadmap y para instrumentar analítica de validación de la hipótesis de beachhead (ver `04-architecture.md`).
2. **Radar de destinos (vista general, los 9 países).** Comparación ligera y con fuente citada: tiempo típico, coste aproximado, barrera de idioma, nivel de demanda/escasez, dificultad relativa. Función de entrada/SEO, no el producto núcleo. Cada dato muestra "última verificación: [fecha]" — nunca se presenta como garantía.
3. **Ruta profunda para España.** Roadmap paso a paso con estado (apostilla → traducción jurada → solicitud de homologación → colegiación → [opcional] MIR), checklist accionable, gestor documental básico (subida y control de vencimiento de documentos clave), FAQ curada que responde directamente a los patrones de estafa identificados (p. ej. "no existen citas de pago; así es como se agenda realmente").
4. **Comunidad verificada (mínima viable).** Foro/Q&A restringido a perfiles con verificación ligera (correo profesional o carga de título), moderado activamente. Un número reducido de mentores ("ya lo logré") responde preguntas — se prioriza calidad/confianza sobre volumen desde el día uno.
5. **Directorio curado de proveedores.** Academias de preparación, traductores jurados, gestores de apostilla y agencias de reclutamiento éticas — evaluados editorialmente antes de aparecer. Es simultáneamente una defensa contra estafas y la primera fuente de ingresos (comisión por referido cualificado).
6. **Freemium básico.** Gratis: radar de destinos + roadmap de España en modo lectura + acceso a la comunidad. Premium: checklist interactivo con seguimiento de estado, gestor documental completo, alertas de cambios regulatorios, acceso prioritario a mentores.

## Qué NO incluye el MVP (explícitamente fuera de alcance, y por qué)

- **Motor de recomendación con IA ("ruta especializada por IA").** Previsto para Fase 2 por el founder; construirlo antes de tener suficiente contenido verificado por destino sería dar recomendaciones automatizadas sin base sólida — riesgo de mala orientación a escala. Se documenta como decisión, no como olvido.
- **Profundidad de contenido (rastreador/checklist/documentos) para los otros 8 destinos.** Se mantiene solo la vista general (radar) hasta validar el modelo en España. Evita repetir el problema de "información superficial y poco confiable" que el producto busca resolver.
- **Alianzas institucionales (universidades, hospitales, sociedades científicas).** Fase 3 original del founder — no es necesaria para validar el MVP y tiene ciclos de venta largos que no encajan con la velocidad de un MVP.
- **App móvil nativa.** Web responsive es suficiente para validar; nativo se evalúa después de PMF.
- **Multi-tier de precios.** Un solo nivel premium; más tiers añaden complejidad de decisión sin datos de disposición a pagar todavía.
- **Cualquier funcionalidad que implique asesoría legal o migratoria vinculante.** Todo el contenido es informativo, con fuente y fecha, nunca asesoría personalizada de un profesional acreditado dentro del producto — mitigación de riesgo legal (ver `research/06-product-strategy-cuestionamiento.md`, sección 3).

## Métricas de éxito del MVP

- **Confianza/calidad:** % de usuarios que completan el onboarding; NPS o encuesta de confianza directa ("¿confías más en esta información que en lo que encontrabas antes?"); número de estafas o proveedores fraudulentos reportados y bloqueados por la comunidad/moderación.
- **Retención (la métrica clave que refuta o confirma el cuestionamiento del founder):** % de usuarios que vuelven a usar el checklist/roadmap en semanas posteriores a la primera visita (si esto es bajo, la hipótesis de "comparar países es el producto núcleo" gana fuerza de nuevo y debe revisarse esta estrategia).
- **Conversión freemium → premium.**
- **Ingreso por referidos vetados** (valida la propuesta de adelantar monetización antes de fase 3).
- **Validación de beachhead de origen:** distribución real de país de origen de los usuarios activos, para confirmar o refutar la apuesta por Colombia/Venezuela.

## Criterio de salida del MVP (cuándo pasar a Fase 2)

Cuando exista evidencia de retención real a lo largo de varias semanas/meses del proceso (no solo visitas de comparación puntuales) Y al menos una señal de disposición a pagar (conversión premium o ingreso por referidos) — recién entonces se justifica invertir en IA de rutas personalizadas y expansión de profundidad a un segundo destino (Alemania, según `research/05-beachhead-market-analysis.md`).
