# ADR-006: Cifrado y control de acceso estricto para datos y documentos sensibles

## Estado
Aceptada

## Contexto
El gestor documental del MVP maneja pasaportes, títulos universitarios y datos profesionales de los usuarios. Los usuarios interactúan con autoridades españolas/UE (aplica GDPR) y provienen de países LatAm con normativas propias de protección de datos (p. ej. Ley 1581 de Colombia). Un incidente de seguridad con este tipo de datos tendría un impacto reputacional severo, especialmente para un producto cuyo diferenciador es la confianza.

## Decisión
Cifrado en tránsito (TLS) y en reposo (documentos en storage S3-compatible y campos sensibles en base de datos). Control de acceso por rol a nivel de módulo. Política de retención y borrado de documentos configurable por el usuario (derecho al olvido/portabilidad). Verificación de identidad profesional ligera en el MVP (correo profesional o carga de título revisada por moderador humano), sin sistema de KYC médico automatizado todavía.

## Alternativas consideradas
- **Verificación de identidad profesional automatizada (KYC médico) desde el MVP:** rechazado por complejidad/coste desproporcionado al tamaño actual de la comunidad; se reconsidera si la comunidad crece lo suficiente para que la verificación ligera deje de ser suficiente.
- **Sin cifrado de documentos en el MVP ("lo añadimos después"):** rechazado — el tipo de dato (documentos de identidad/título) no admite ese riesgo ni siquiera en una fase temprana.

## Consecuencias
- Se gana: cumplimiento razonable con GDPR/normativas LatAm desde el día uno, y coherencia con el diferenciador de confianza del producto.
- Se sacrifica: algo de velocidad de desarrollo inicial (cifrado y control de acceso no son gratis de implementar).
- Revisar si se expande a mercados con normativas de datos más estrictas o distintas (p. ej. si se lanza profundidad de producto en Alemania, revisar requisitos adicionales de GDPR específicos de salud).
