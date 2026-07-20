# Propuesta de rediseño — Onboarding y Resultados (NO implementada, insumo para después de la evidencia)

> **Estado: propuesta congelada, pendiente de contraste con entrevistas reales.** Recibida del founder el 2026-07-20, mientras el despliegue de la Beta Cerrada estaba en curso. Por instrucción explícita, el alcance de la Beta actual queda congelado — este documento **no se implementa ahora**. Es el insumo de diseño que se contrasta contra la evidencia del Customer Discovery Sprint (piloto + estudio principal) antes de decidir qué construir en la siguiente iteración. Ver `docs/product-learning-journal.md` para el proceso de decisión basado en evidencia.

## Brief original del founder (verbatim, resumido en su estructura)

**Objetivo del producto:** ayudar a profesionales de la salud a descubrir la ruta internacional más compatible con su perfil y comprender, de forma clara y honesta, los pasos necesarios — sin formulario largo ni sobrecarga de información, una pregunta a la vez.

**Principios del producto** (explícitos, no negociables en cualquier implementación futura):
- No vende procesos migratorios, no promete homologaciones, empleo ni visas, no genera falsas expectativas.
- Toda recomendación basada en información verificable.
- Prioridad: decisiones informadas, no conversión.

**Landing propuesta:**
- Título: "Tu camino médico comienza aquí."
- Subtítulo: "Descubre qué países ofrecen las mejores oportunidades para tu perfil y recibe una guía personalizada para construir tu carrera internacional."
- CTA: "Descubrir mi ruta"
- Texto secundario: "Basado en información oficial y actualizado periódicamente."

**Flujo de onboarding propuesto (una pregunta por pantalla):**
1. ¿Dónde te encuentras en tu camino? — Estudiante de Medicina / Internado rotatorio / Servicio social / Médico general / Médico residente / Médico especialista / Investigador / Otro profesional de la salud.
2. ¿Cuál es tu objetivo principal? — Ejercer en otro país / Residencia / Validar especialidad / Maestría / Doctorado / Investigación / Explorar opciones.
3. ¿Qué es lo que más te preocupa actualmente? — No sé por dónde empezar / No sé qué país elegir / Costo / Idioma / No entiendo requisitos / No sé cuánto tiempo tomará / Otro.
4. ¿Cuánto tiempo estás dispuesto a invertir? — <1 año / 1-2 años / 3-5 años / el que sea necesario.
5. Presupuesto disponible (rango aproximado, selector).
6. Idiomas (uno o varios, con nivel de dominio cada uno).
7. Formación académica — país de graduación, universidad, año de graduación.
8. Experiencia profesional — clínica, servicio social, residencia, especialidad, investigación, docencia (solo lo necesario para orientar la recomendación).

**Resultado propuesto, más rico que el actual:**
- Rutas internacionales más compatibles.
- Explicación clara de por qué se recomiendan.
- Requisitos ya cumplidos vs. pendientes (distinción explícita — el motor actual no separa esto hoy, solo da razones positivas/negativas).
- Principales barreras identificadas.
- Próximo paso recomendado.
- Estimación de tiempo y costo cuando existan datos.
- Enlaces a fuentes oficiales.

**Plan de acción propuesto:** hoja de ruta por etapas (inmediatas → largo plazo), cada tarea con qué/por qué/cuándo — más elaborado que la proyección de línea de tiempo actual (que no distingue "tareas" con justificación individual).

**Principios de diseño y tono:** claridad sobre cantidad, navegación intuitiva, lenguaje sencillo sin tecnicismos, responsive, consistencia visual, diseñado para usuarios que pueden sentirse abrumados; tono de confianza/cercanía/transparencia, nunca lenguaje de garantía de resultados.

## Cómo se compara con lo que ya existe y está técnicamente validado

| Aspecto | MVP Beta actual (desplegado) | Propuesta de rediseño |
|---|---|---|
| Perfil | 3 pasos (formación, idiomas, objetivos) | 8 preguntas/grupos, una pregunta por pantalla — más granular, potencialmente más largo de completar |
| Segmentación de "dónde estás en tu camino" | No existe — el modelo actual no distingue estudiante/residente/especialista como entrada explícita | Nueva dimensión de perfil, no modelada hoy en el dominio (`Perfil Internacional` no tiene este campo) |
| "Qué te preocupa" / motivación explícita | No existe como pregunta directa — se infiere indirectamente de urgencia/tolerancia | Nueva pregunta, con valor cualitativo alto para las entrevistas |
| Presupuesto disponible | No se captura hoy | Nuevo campo — el motor de compatibilidad no lo usa actualmente en sus reglas |
| Resultado: cumplidos vs. pendientes | El motor de brechas actual da razones (+/-) y acciones recomendadas, pero no una lista explícita "ya cumples esto / te falta esto" separada | Requiere extender `AnalizadorDeBrechas` con una categorización nueva |
| Plan de acción con qué/por qué/cuándo | La proyección actual (`proyeccion.html`) da etapas con meses estimados y fuente, pero no una justificación individual por tarea | Extensión razonable del modelo de `Ruta`/`Etapa` existente en Catálogo |

**Lectura honesta:** ninguno de estos cambios rompe la arquitectura de dominio (DDD, bounded contexts) diseñada desde Sprint 0 — son extensiones dentro de `Perfil Internacional`, `Descubrimiento y Compatibilidad`, y `Catálogo` compatibles con ADR-004/ADR-012. El costo real no es arquitectónico, es de **validación**: construir 8 preguntas nuevas y una página de resultados más rica antes de saber, con evidencia real, si los médicos abandonan un cuestionario más largo, si "presupuesto disponible" es una pregunta que genera fricción o desconfianza, o si la distinción "cumplido/pendiente" cambia el comportamiento más que el formato actual — exactamente el tipo de pregunta que el Customer Discovery Sprint (`docs/18-25`) fue diseñado para responder, y que todavía no tiene ni una entrevista real ejecutada (ver `docs/product-learning-journal.md`, Entrada 0).

## Qué pasa después

1. Se termina y valida la Beta Cerrada actual (este runbook, `docs/29`).
2. Se ejecutan las entrevistas reales (piloto 3-5, luego estudio principal 10-15) usando el producto ya desplegado.
3. Cada hallazgo de esas entrevistas se coteja contra esta propuesta específicamente: ¿la fricción real está en el onboarding actual de 3 pasos? ¿los médicos piden más granularidad como la de este brief, o piden menos preguntas? ¿"presupuesto disponible" aparece como una pregunta que los usuarios reales necesitan, o como una que genera desconfianza?
4. Solo con esa evidencia se decide qué partes de esta propuesta se implementan, se descartan, o se modifican — nunca antes.
