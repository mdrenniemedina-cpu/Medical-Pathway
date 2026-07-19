# Hipótesis del Sprint 1 (pre-registradas antes de construir)

> Se escribe **antes** de implementar, no después de observar resultados — para que el informe final (`docs/17-informe-sprint-1.md`) reporte contra un compromiso previo, no contra una narrativa ajustada a posteriori. Cada decisión de diseño de este sprint responde a una de estas hipótesis; donde no responde a ninguna, no se construye (disciplina explícita pedida por el founder).

## H1 — El cuestionario de perfil no pierde usuarios por fricción
**Hipótesis:** un cuestionario corto y con preguntas justificadas (perfil académico, idiomas, objetivos) tiene una tasa de finalización razonable; si hay abandono, se concentra en preguntas específicas identificables.
**Instrumentación:** `cuestionario_iniciado`, `cuestionario_completado`, `cuestionario_abandonado_en_pregunta` (con el nombre de la pregunta).
**Métrica de éxito:** tasa `completado/iniciado`; distribución de abandono por pregunta.
**Decisión de diseño que responde:** el onboarding se construye como un wizard paso a paso (no un formulario largo de una sola pantalla) específicamente para poder atribuir el abandono a una pregunta concreta.

## H2 — La explicación (no el puntaje) es lo que el usuario explora
**Hipótesis:** dado un resultado con % de compatibilidad, los usuarios interactúan con las razones/explicación, no solo miran el número.
**Instrumentación:** `recomendacion_generada` (automático, evento de dominio real), `destino_explorado` (clic para expandir razones de un destino específico).
**Métrica de éxito:** proporción de resultados donde ocurre al menos un `destino_explorado`; cuántos destinos se exploran en promedio (¿solo el top 1, o también alternativas?).
**Decisión de diseño que responde:** las razones no se muestran expandidas por defecto — el usuario debe interactuar para verlas, precisamente para poder medir si el interés es real o solo se mira el número grande.

## H3 — "Qué te falta" y "qué acciones" mueven a la acción más que el puntaje solo
**Hipótesis:** mostrar brechas concretas y accionables (no solo "no eres compatible") aumenta la probabilidad de iniciar una ruta, incluso hacia un destino con score inicial bajo.
**Instrumentación:** `acciones_recomendadas_vistas`, `inicio_de_ruta` (automático, evento de dominio real vía `DestinoSeleccionado`).
**Métrica de éxito:** tasa de `inicio_de_ruta` cuando hubo `acciones_recomendadas_vistas` previo, comparada con cuando no la hubo.
**Decisión de diseño que responde:** el motor de brechas es 100% trazable a las mismas reglas de compatibilidad (ver `decisions/ADR-022`) — si esto no moviera comportamiento, sabremos que el problema no es la falta de trazabilidad sino otra cosa (p. ej. que la acción sugerida es percibida como demasiado costosa: aprender un idioma).

## H4 — Visualizar el futuro (línea de tiempo) es más motivador que una lista de pasos
**Hipótesis:** proyectar el recorrido completo como una línea de tiempo con estimaciones (aunque sean del catálogo, no de cohortes reales todavía) ayuda al usuario a comprometerse más que un checklist plano.
**Instrumentación:** `proyeccion_visualizada`, cruzada después con `inicio_de_ruta`.
**Métrica de éxito:** tasa de `inicio_de_ruta` entre quienes vieron la proyección vs. quienes no.
**Decisión de diseño que responde:** la proyección se construye como una funcionalidad separada y opcional (no forzada en el flujo principal) específicamente para poder medir su efecto marginal por comparación.

## H5 (la más importante, pedida explícitamente por el founder) — ¿Dónde está realmente el valor?
**Hipótesis a poner a prueba, NO a asumir:** el motor de descubrimiento/explicación es el corazón del producto. **Hipótesis rivales, igualmente plausibles:** el valor real está en la confianza (contenido verificado + anti-estafa), en la comunidad (acompañamiento humano), o en el activo de datos exclusivo (Radar de Espera).

**Instrumentación (señales de demanda comparables, sin construir las tres funcionalidades completas):**
- `interes_comunidad_expresado` — clic en un "fake door": *"¿Quieres hablar con un médico que ya vivió este proceso?"*, mostrado en la pantalla de resultados/proyección.
- `interes_radar_expresado` — clic en un "fake door": *"Reporta tu expediente para desbloquear estimaciones reales de espera de otros médicos como tú"*, mostrado en la etapa de espera de la proyección.
- `destino_explorado` / `acciones_recomendadas_vistas` ya miden el interés en el motor de descubrimiento (H2/H3).

**Métrica de éxito de H5:** comparar el volumen relativo de `interes_comunidad_expresado` + `interes_radar_expresado` contra el engagement con el motor de descubrimiento — si el interés en comunidad/radar es proporcionalmente alto pese a que esas funcionalidades **no existen todavía** (son botones que solo capturan intención), es una señal temprana de que el founder tenía razón en no enamorarse del motor de recomendación.

**Decisión de diseño que responde:** los "fake doors" se construyen deliberadamente ANTES de construir Comunidad u Radar de Espera en profundidad — es más barato medir demanda con un botón que con una funcionalidad completa, y evita invertir en Sprint 2 basándose en una suposición en lugar de evidencia.

## Advertencia de honestidad, incluida aquí a propósito

Ninguna de estas hipótesis puede declararse "validada" o "rechazada" con datos reales todavía — este sprint **construye e instrumenta** la capacidad de medirlas; **no genera usuarios reales** que las pongan a prueba. El informe final (`docs/17-informe-sprint-1.md`) debe respetar esta distinción explícitamente y no debe presentar aprendizajes de construcción/ingeniería como si fueran validación de producto.
