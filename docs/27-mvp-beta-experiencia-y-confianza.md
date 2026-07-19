# MVP Beta: flujo, interfaz de confianza y recorrido emocional

## 1. El flujo simplificado (6 pantallas, todo lo demás oculto)

```
Landing → Registro → Perfil Internacional → Compatibilidad → Explicación → Iniciar Ruta
```

| Pantalla | Pregunta que responde al usuario | Una sola acción principal |
|---|---|---|
| **Landing** | "¿Qué es esto y por qué debería confiar?" | Comenzar |
| **Registro** | "¿Cómo empiezo?" | Crear cuenta |
| **Perfil Internacional** | "¿Qué necesitan saber de mí?" | Completar 3 pasos |
| **Compatibilidad** | "¿Cuál es mi mejor opción?" | Ver por qué (del destino principal) |
| **Explicación** | "¿Por qué, y qué me falta?" | Iniciar esta ruta |
| **Iniciar Ruta** | "¿Y ahora qué?" | (confirmación + siguiente paso) |

La proyección de futuro y cualquier otra funcionalidad existente (fake doors, etc.) quedan **fuera** de este camino — accesibles como enlaces opcionales desde Explicación, nunca como pasos obligatorios. Esto no es pobreza de producto: es disciplina para que la entrevista de descubrimiento observe reacciones al problema y a la propuesta central, no a funcionalidades secundarias sin terminar (ver `26-mvp-beta-auditoria.md`).

## 2. Principios de una interfaz que inspire confianza (no un comparador superficial)

El usuario está evaluando si confiar una decisión de carrera a un producto que no conoce. Cinco principios, cada uno con su traducción concreta a la interfaz:

| Principio | Qué NO es | Cómo se traduce en la pantalla |
|---|---|---|
| **Credibilidad** | Un logo bonito y ya | Cada afirmación de hecho (tiempo, coste, demanda) lleva su fuente y fecha de verificación **visible sin tener que buscarla** — un badge pequeño pero real ("Fuente verificada · 19 jul 2026"), no un enlace gris escondido al final. |
| **Transparencia** | Un % sin explicación | El % de compatibilidad **nunca aparece solo** — siempre acompañado de al menos su razón principal en la misma vista, y con acceso directo a la explicación completa. |
| **Evidencia** | Afirmaciones genéricas ("España tiene alta demanda") | Cifras y contexto reales de la investigación (p. ej., "escasez estructural reconocida por el Ministerio de Sanidad") — el lenguaje debe sonar a periodismo de datos, no a marketing. |
| **Acompañamiento** | Un resultado y silencio | Todo resultado negativo o de bajo puntaje incluye la pregunta natural siguiente ya respondida: "esto es lo que te falta, y esto es lo que puedes hacer" — nunca dejar al usuario con un número y sin salida. |
| **Claridad** | Múltiples acciones compitiendo por atención | Una sola acción primaria por pantalla, visualmente inconfundible (color, tamaño, posición); todo lo demás es secundario o un enlace de texto. |

### Qué evitar explícitamente para no parecer un comparador

- Nunca mostrar los 9 destinos en una tabla plana desde el primer momento — el orden debe ser: tu mejor opción primero, explicada, con las alternativas disponibles pero claramente secundarias.
- Nunca usar lenguaje de "vs." o "compara" en el copy — el lenguaje debe ser en primera persona sobre el usuario ("tu compatibilidad", "tu camino"), no sobre los países.
- Nunca presentar el % como un ranking de entretenimiento (estilo quiz de redes sociales) — la tipografía y el tono deben sentirse más cerca de un informe médico o financiero serio que de un test de personalidad.

### Sistema visual (implementado en `public/styles.css`)

- Paleta restringida: un azul-verde oscuro (confianza, medicina, profesionalismo) como color primario, grises neutros para texto/fondo, y un solo color de acento (ámbar) reservado exclusivamente para las "acciones recomendadas" (para que ese momento del producto —la parte más orientada a la acción— se distinga visualmente del resto).
- Tipografía del sistema (rápida, ya legible en cualquier dispositivo) con jerarquía clara de tamaños — no se necesita una fuente custom para transmitir seriedad, se necesita **consistencia**.
- Un badge reutilizable de "fuente verificada" en cualquier lugar donde se muestre un dato con `fuenteUrl`/`fechaVerificacion` — el mismo componente en toda la aplicación, para que el usuario aprenda a reconocerlo y confiar en él.
- Botón primario único por pantalla (color sólido, alto contraste); todo lo demás en estilo secundario (borde) o enlace de texto.
- Estados de carga con una animación simple (spinner) y copy que reduce ansiedad ("Estamos calculando tu compatibilidad con base en fuentes verificadas…" en vez de "Calculando…" a secas).

## 3. El recorrido emocional

> De **"no tengo idea de qué hacer con mi carrera"** a **"ahora tengo un camino claro"** — cómo debe sentirse el usuario en cada pantalla, no solo qué debe ver.

### Landing — "Esto podría ser para mí"
Debe sentir alivio de reconocimiento ("por fin algo que entiende mi situación específica, no un blog genérico de migración") y curiosidad, no presión de venta. El copy debe nombrar el dolor real que la investigación ya documentó (la espera, la desinformación, las estafas) para que el usuario piense "hablan de lo que a mí me pasa", sin todavía pedirle nada.

### Registro — "Esto es serio, pero no es una barrera"
Debe sentir que registrarse es el precio razonable de obtener algo específico para él, no un muro burocrático más (que es exactamente la fatiga que ya trae de otros procesos). Fricción mínima, ningún campo innecesario.

### Perfil Internacional — "Por fin alguien me pregunta lo que importa"
Cada pregunta del onboarding debe sentirse relevante y con propósito visible ("te preguntamos esto porque...") — no un formulario burocrático más parecido a los que ya lo frustran en su proceso real. La sensación buscada: estar siendo *entendido*, no *procesado*.

### Compatibilidad — "Alguien ya hizo el análisis por mí"
El momento de mayor expectativa emocional de todo el recorrido. Debe sentir que el número no salió de la nada — que hay trabajo real detrás. Ansiedad reducida por un estado de carga que explica qué está pasando, y alivio/interés al ver el resultado con su razón principal ya visible, sin tener que buscarla.

### Explicación — "Esto tiene sentido, y no me ocultan nada"
Aquí se juega la confianza real. El usuario debe sentir que puede **auditar** la recomendación, no que debe creerla por fe. Si su compatibilidad es baja en algún destino, debe sentir que el producto está de su lado ("esto es lo que te falta, esto es lo que puedes hacer"), no que lo está descalificando y dejando ahí.

### Iniciar Ruta — "Ahora tengo un camino claro"
El clímax emocional pedido explícitamente por el founder. No puede terminar en un `alert()` del navegador — debe sentir un cambio de estado real y visible: de "explorando" a "en camino". La confirmación debe nombrar el primer paso concreto siguiente (no un genérico "gracias"), para que la sensación sea de dirección, no de trámite completado.

## 4. Resumen para quien lea rápido

Si una sola frase debe guiar cada decisión de diseño de esta beta: **el usuario nunca debe sentir que está usando una demo — debe sentir que está usando la primera versión seria de algo que va a acompañarlo por años.**
