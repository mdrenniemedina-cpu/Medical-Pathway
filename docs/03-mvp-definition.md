# Definición del MVP (v2)

> **Changelog:** v1 definía un MVP con cinco pilares de peso similar (radar, roadmap completo, gestor documental, comunidad, directorio). v2 lo reemplaza: tras identificar el momento de mayor dolor del recorrido (`research/08-momento-critico-espera.md`), el MVP se concentra en un solo núcleo — la espera de resolución de la homologación en España — y todo lo demás pasa a ser secundario o se difiere. Ver `decisions/ADR-007`.

## Objetivo del MVP

Convertirse en la fuente más confiable de información sobre **cuánto tiempo real está tardando la homologación** para médicos LatAm en España, y en el lugar donde un médico en espera encuentra apoyo verificado en lugar de estafas — validando que este es el problema con mayor dolor real y mayor potencial de retención de todo el recorrido (hipótesis de `research/08`).

## El núcleo del MVP: el "Radar de Espera"

Un rastreador comunitario y anonimizado del tiempo real de resolución de expedientes de homologación, que responde a la pregunta que hoy nadie responde con evidencia: **"¿cuánto voy a esperar yo, realmente?"**

### Cómo funciona
1. El usuario registra los metadatos no sensibles de su expediente: fecha de envío, tipo de título/especialidad, comunidad autónoma (si aplica a colegiación), y si ya recibió resolución, la fecha y el resultado.
2. La plataforma agrega estos datos de forma anónima (con umbrales mínimos de agrupación para evitar identificar a un usuario individual — ver `decisions/ADR-008`) y muestra estimaciones basadas en evidencia real: "los expedientes enviados en tu misma ventana de tiempo han tardado, en promedio, X meses; el Y% sigue esperando".
3. Cuantos más usuarios reportan, más preciso es el dato — es el único activo de este tipo en el espacio (efecto de red genuino, no replicable por un competidor que solo agrega contenido estático).

### Módulos que rodean y sirven al núcleo (no son productos independientes de igual peso)

1. **Checklist de preparación pre-envío.** Reduce el riesgo de "subsanación" (corrección que reinicia el reloj de espera) — ataca la causa evitable de esperas más largas, no solo la sintomatología.
2. **Alertas anti-estafa contextuales.** Se activan específicamente durante la fase de espera (cuando el usuario es más vulnerable), con ejemplos reales documentados ("no existen citas pagadas por WhatsApp; así se agenda realmente").
3. **Comunidad segmentada por ventana de envío.** Usuarios que enviaron su solicitud en fechas similares se agrupan — apoyo entre pares con contexto compartido real, verificación ligera de perfil (correo profesional o título cargado), moderación activa.
4. **Contenido editorial de contexto.** Explicación versionada y con fuente de por qué ocurren los retrasos (backlog ministerial, acusaciones de manipulación de cifras) — para que el usuario entienda "esto es normal" vs. "esto no lo es", sin que la plataforma dé asesoría legal vinculante.
5. **Radar de destinos (los 9 países).** Se mantiene como puerta de entrada/SEO — una tabla informativa estática con fuente y fecha, sin inversión de ingeniería adicional en el MVP.

## Qué se DEQUITA respecto al MVP v1 (y por qué)

- **Gestor documental completo (subida, cifrado, vencimientos de múltiples tipos de documento):** se reduce al mínimo necesario para la checklist de preparación pre-envío. Un gestor documental completo es valioso pero no es lo que resuelve el momento de mayor dolor — se difiere a Fase 2.
- **Directorio extenso de proveedores como pilar de monetización temprana:** se mantiene solo en su función de defensa anti-estafa (advertencias contextuales), no como catálogo amplio con múltiples categorías — evita diluir el foco de ingeniería en el MVP. La monetización por referidos (ADR-003) se retoma en Fase 2, una vez validado el núcleo.
- **Roadmap paso a paso de todo el recorrido (incluyendo MIR, colegiación, ejercicio pleno):** existe como contenido informativo de referencia, pero la inversión de producto/ingeniería se concentra en la fase de espera, que es anterior y más dolorosa que las fases posteriores.
- **Motor de IA de recomendación:** sigue fuera de alcance (igual que en v1) — sin cambios.
- **Profundidad en otros destinos, alianzas institucionales, app nativa, multi-tier de precios:** sin cambios respecto a v1 — siguen fuera de alcance.

## Usuario objetivo

Sin cambios respecto a v1: médico graduado o estudiante avanzado, hispanohablante, de cualquier país de LatAm, con foco de adquisición en Colombia y Venezuela (ver `research/05-beachhead-market-analysis.md`). El punto de entrada específico ahora es más preciso: **médicos que ya enviaron o están a punto de enviar su solicitud de homologación en España** — el momento exacto en que el "Radar de Espera" empieza a aportar valor.

## Métricas de éxito (actualizadas)

- **Volumen y calidad de datos agregados:** número de expedientes reportados con fecha de resolución (esto valida si el "Radar de Espera" puede llegar a ser preciso/útil).
- **Retención durante la espera:** frecuencia con la que un usuario vuelve a consultar su estimación o participa en la comunidad de su ventana de envío mientras espera (la métrica que confirma que este es, en efecto, el momento de mayor enganche).
- **Reducción de subsanaciones:** proporción de usuarios que usan la checklist pre-envío y no reciben corrección de su expediente (si es medible vía autoreporte).
- **Estafas evitadas/reportadas:** interacciones con las alertas anti-estafa y reportes de intentos de fraude detectados por la comunidad.
- **Confianza percibida:** encuesta directa comparando la confianza en Medical Pathway vs. fuentes previas (foros, oficinas, agencias).

Se elimina de las métricas principales, por ahora, la conversión freemium→premium y el ingreso por referidos — son relevantes pero secundarios hasta validar que el núcleo (Radar de Espera) genera retención real. Ver criterio de salida más abajo.

## Criterio de salida del MVP (cuándo pasar a Fase 2)

Cuando exista evidencia de que (a) el volumen de datos agregados es suficiente para dar estimaciones creíbles (umbral mínimo por comunidad autónoma/ventana de tiempo), y (b) los usuarios vuelven de forma recurrente durante su periodo de espera (no solo consultan una vez) — recién entonces se justifica invertir en gestor documental completo, directorio de monetización, y expansión de profundidad a otras fases del recorrido o a un segundo destino (Alemania).
