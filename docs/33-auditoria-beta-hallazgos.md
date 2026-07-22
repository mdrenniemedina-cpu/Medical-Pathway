# Auditoría funcional de la Beta Cerrada — Hallazgos

> Documento vivo. Cada hallazgo se registra con fecha y se clasifica:
> - 🔴 **Bug de Beta** — corregir ahora, bloquea o rompe el recorrido actual.
> - 🟡 **Mejora para V2** — se documenta, no se construye hasta tener evidencia de usuarios reales.
> - 🟢 **Idea futura** — backlog, sin compromiso de fecha.
>
> Alcance funcional de la Beta congelado (instrucción del founder, 2026-07-20): ningún hallazgo 🟡/🟢 se implementa ahora, sin importar cuán buena sea la idea.

## Cómo se usa este documento

Cada fila: qué se probó, qué se esperaba, qué pasó realmente, clasificación, y (si es 🔴) el estado de la corrección.

## Áreas de la auditoría (checklist de cobertura)

- [ ] Recorrido completo: landing → registro → perfil → compatibilidad → explicación → iniciar ruta → proyección
- [ ] Consistencia de la información (nombres de destino, porcentajes, fuentes, fechas)
- [ ] Recarga de página / persistencia de sesión
- [ ] Cierre y apertura de sesión
- [ ] Errores de red / estados de carga
- [ ] Navegador móvil real
- [ ] HTTPS sin advertencias
- [ ] CORS sin errores en consola
- [ ] Ausencia de IDs internos visibles
- [ ] Fake doors ocultos (Comunidad/Radar)
- [ ] Outbox funcionando (perfil se crea automáticamente tras registro)
- [ ] Rendimiento percibido (tiempos de carga/cálculo)
- [ ] Accesibilidad básica (contraste, tamaños táctiles en móvil, navegación por teclado)

## Registro de hallazgos

| # | Fecha | Área | Qué se esperaba | Qué pasó | Clasificación | Estado |
|---|---|---|---|---|---|---|
| — | — | — | — | (sin hallazgos todavía) | — | — |
