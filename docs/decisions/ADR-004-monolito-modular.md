# ADR-004: Monolito modular en lugar de microservicios para el MVP

## Estado
Aceptada

## Contexto
El equipo es pequeño y el objetivo en esta etapa (pre-PMF) es velocidad de iteración y validación de hipótesis de producto, no escala masiva. Microservicios añaden complejidad operativa (despliegue, observabilidad distribuida, comunicación entre servicios) que no se justifica todavía.

## Decisión
Construir el backend como un monolito modular (NestJS/Node.js + TypeScript) con límites de dominio claros (perfiles, contenido/CMS, rastreador de rutas, gestor documental, comunidad, directorio/referidos, notificaciones, analítica) desde el día uno, de forma que cualquier módulo pueda extraerse a un servicio independiente en el futuro si el volumen o el equipo lo justifican.

## Alternativas consideradas
- **Microservicios desde el inicio:** rechazado — coste operativo y de coordinación desproporcionado para el tamaño del equipo y la etapa del producto.
- **Monolito sin límites de módulo claros:** rechazado — dificultaría una futura extracción de servicios y generaría acoplamiento no intencional entre dominios (p. ej. el gestor documental no debería depender del módulo de comunidad).

## Consecuencias
- Se gana: velocidad de desarrollo, despliegue simple, menor coste operativo.
- Se sacrifica: escalabilidad independiente por módulo (aceptable en esta etapa).
- Revisar si un módulo concreto (p. ej. gestor documental, por requisitos de cifrado/cumplimiento) necesita aislarse antes que el resto por razones de seguridad o carga.
