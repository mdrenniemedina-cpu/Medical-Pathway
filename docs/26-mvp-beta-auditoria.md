# Auditoría crítica del MVP para pruebas con usuarios reales

> El objetivo dejó de ser "demostrar que la mecánica funciona" (Sprint 0-1) y pasó a ser "generar evidencia de alta calidad con 5-10 médicos reales". Eso cambia el estándar: un prototipo que un ingeniero lee con indulgencia ("ya sé que esto es un placeholder") es exactamente lo que un médico real, evaluando si confiar su carrera a esto, no puede leer con la misma indulgencia. Esta auditoría es deliberadamente dura, con hallazgos citados contra el código real, no impresiones generales.

## 1. ¿Qué necesita tener obligatoriamente la web para que un médico la use solo, sin mi ayuda?

Lista mínima, en orden de bloqueo (si falta cualquiera de estos, un usuario real se queda atascado o se va):

1. **Una entrada que no sea un formulario de login desnudo.** Hoy `index.html` es directamente "email/password" — un médico que llega por primera vez no tiene ni idea de qué es esto ni por qué debería registrarse. Falta una landing real antes del registro (ver §3).
2. **Copy en primera persona, sin jerga de producto.** Hoy el onboarding pregunta literalmente "tipoTitulo" en la cabeza del desarrollador, aunque el label mostrado ("Tipo de título") ya está bien — el riesgo está en otros lados (ver #5).
3. **Manejo de errores que no rompa la sesión.** Hoy, si `/perfil/me` falla más de 10 intentos tras el registro (`esperarPerfil`), el usuario ve un mensaje técnico ("Tu perfil está tardando en crearse...") sin ningún botón de acción clara ni reintento — un usuario real no sabe si debe recargar, esperar, o escribir al soporte.
4. **Nunca mostrar un identificador interno.** Hallazgo concreto y crítico: en `resultados.html` línea 39, el título de cada tarjeta es `${p.destinoId} — Compatibilidad ${p.porcentajeCompatibilidad}%` — esto renderiza literalmente **"destino-espana — Compatibilidad 75%"** en pantalla. Ningún médico real debe ver un slug de base de datos. Esto rompe credibilidad instantáneamente (parece software a medio construir, no un producto).
5. **Nunca usar `alert()` del navegador.** Hallazgo concreto: `resultados.html` líneas 80 y 82 usan `alert('Ruta iniciada. En un sprint futuro esto llevará a tu plan personalizado paso a paso.')` y `alert('No se pudo iniciar la ruta: ' + e.message)`. Un cuadro de diálogo nativo del navegador, con la frase "en un sprint futuro" **visible al usuario**, es quizás el hallazgo más grave de toda esta auditoría — literalmente le decimos al usuario que estamos improvisando.
6. **Confirmación real de que "Iniciar Ruta" significa algo.** Hoy no lleva a ningún lado — el usuario hace clic, ve una alerta de navegador, y queda exactamente donde estaba. Para una prueba con usuarios reales, este es el momento culminante del recorrido (la decisión) y no puede terminar en la nada.
7. **Un estado de carga que no parezca congelado.** Hoy "Calculando tu compatibilidad…" es texto plano sin animación — en una llamada de red lenta (probable en Latinoamérica, según la propia investigación de mercado sobre brechas de conectividad), un usuario no sabe si algo está pasando o si se colgó.

## 2. Qué partes parecen "herramienta para desarrolladores" y deben convertirse en experiencia profesional

| Elemento actual | Por qué se siente a herramienta de desarrollador | Qué debe pasar a ser |
|---|---|---|
| `destinoId` visible en tarjetas de resultado | Expone un identificador técnico interno | Nombre real del destino (ya existe en el catálogo — falta conectarlo, ver auditoría técnica más abajo) |
| `alert()` de JavaScript | Es literalmente el mecanismo de depuración más básico del navegador | Un estado de confirmación diseñado, dentro de la propia página |
| Razones/acciones dentro de un `<details>` (acordeón HTML nativo) | Funciona, pero es el widget más genérico posible — no comunica "esto es la pieza más importante del producto" | Una pantalla propia y prominente ("Explicación") con jerarquía visual clara |
| Botones sin distinción visual (todos iguales: "Ver mi futuro", "Iniciar esta ruta", los `<summary>`) | No hay jerarquía entre la acción principal (decidir un destino) y las secundarias (explorar) | Un botón primario claro por pantalla, el resto como enlaces o botones secundarios |
| Mensajes de error como texto rojo plano | Comunica "algo se rompió", no "esto es normal, aquí está la salida" | Estados de error diseñados con una acción de recuperación clara |
| Los "fake doors" de Comunidad/Radar con el texto literal "todavía no existe esta funcionalidad" | Le dice al usuario, en un momento de máxima atención (justo cuando piensa comprometerse), que el producto está incompleto | Ver recomendación explícita en la sección 5 (ocultar del flujo principal para esta beta) |
| Formularios sin validación visual (el usuario no sabe si escribió bien el país de 2 letras) | Se siente como un formulario de administración interna | Validación en línea con mensajes claros |

## 3. Auditoría completa — conservar / eliminar / simplificar / esconder / mejorar

### Conservar (ya funciona y es un activo real, no tocar la lógica)
- El **motor de compatibilidad explicable** (cada % con razones trazables) — es el diferenciador real del producto, no cambiar la lógica, solo la presentación.
- El **motor de brechas** ("qué te falta / qué acciones aumentarían tus oportunidades") — mismo caso: lógica sólida (ADR-022), presentación a mejorar.
- El **onboarding en 3 pasos** — la estructura (formación → idiomas → objetivos) es correcta y ya está instrumentada; solo necesita pulido visual, no rediseño estructural.
- La **instrumentación analítica** completa (eventos de dominio + frontend) — no tocar, seguirá corriendo debajo de la nueva interfaz sin cambios.
- Los **datos con fuente y fecha de verificación** en cada dato del catálogo — es el activo de confianza central; en la nueva interfaz debe volverse **más visible**, no solo mantenerse.

### Eliminar (para esta beta con usuarios reales)
- Todo `alert()` del navegador — sin excepción.
- La visualización de `destinoId` en cualquier lugar de la interfaz.
- El botón "Iniciar esta ruta" duplicado en cada tarjeta de resultado antes de que el usuario haya visto la explicación completa — decidir sin ver el "por qué" contradice el propio propósito del producto (ver §4, "nunca parecer un comparador superficial").

### Simplificar
- La página de resultados: hoy cada tarjeta repite tres bloques de interacción (razones, acciones, futuro) más dos botones — demasiadas decisiones simultáneas para un primer vistazo. Debe simplificarse a: nombre del destino + % + un resumen de una línea de la razón principal + un solo botón ("Ver por qué") que lleva a la pantalla de Explicación.
- El flujo completo: de las 5 pantallas actuales (login, onboarding, resultados, proyección con fake doors, y nada después) a las 6 pantallas pedidas explícitamente (Landing, Registro, Perfil, Compatibilidad, Explicación, Iniciar Ruta) — con la proyección como paso **opcional**, no obligatorio.

### Esconder temporalmente (no eliminar del código, solo del flujo visible en esta beta)
- Los **"fake doors" de Comunidad y Radar de Espera**. Fueron diseñados deliberadamente (ADR-023) para medir demanda comparativa — decisión correcta para instrumentación silenciosa, pero **mostrarle a un médico real, durante una entrevista de descubrimiento, un botón que confiesa "esto todavía no existe" es exactamente el tipo de señal que rompe la credibilidad que esta beta necesita transmitir**. La señal de interés en comunidad/datos puede seguir obteniéndose **verbalmente** durante la entrevista (el protocolo de discovery ya lo cubre) sin exponer al producto a ese riesgo. Se mantiene el código, se retira del flujo visible.
- La página de **proyección de futuro** dejar de ser un paso obligatorio del embudo — pasa a ser un enlace opcional ("¿Quieres ver cómo se vería tu camino en el tiempo?") accesible desde la pantalla de Explicación, no una pantalla forzada.
- Los esqueletos de **Comunidad y Oportunidades** (backend) — sin interfaz todavía, correcto mantenerlos sin exponer nada en el frontend.

### Mejorar antes de mostrar a usuarios reales (la lista de ejecución de este documento)
1. La API debe devolver el **nombre real** del destino, no solo su ID (fix de backend, no solo de frontend — ver ADR de esta iteración).
2. Crear la **Landing** (hoy no existe: se entra directo a un formulario de login).
3. Crear la pantalla de **Explicación** como página propia (hoy es un acordeón dentro de resultados).
4. Rediseñar el **sistema visual** completo: tipografía, color, espaciado, jerarquía de botones, estados de carga/error, y — el elemento más importante para la confianza — hacer que la fuente y fecha de verificación de cada dato sea visualmente prominente, no un texto pequeño gris casi invisible.
5. Reemplazar `alert()` por una **confirmación real** de "Iniciar Ruta" con una siguiente acción clara.
6. Quitar los fake doors del flujo visible (dejar el código y la instrumentación intactos).

Ver `27-mvp-beta-experiencia-y-confianza.md` para el diseño de la solución a cada punto de esta lista, y `28-respuesta-inversionista-yc.md` para la reflexión estratégica final.
