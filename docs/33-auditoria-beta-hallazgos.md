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
| 1 | 2026-07-20 | Onboarding paso 1 (móvil real, iPhone Safari) | Registro → perfil creado automáticamente (outbox) → onboarding se ve bien en móvil | Todo correcto: aviso de beta legible, formulario responsive, botón táctil, sesión autenticada llegó a onboarding sin fricción | — (verificación exitosa, sin defecto) | Confirmado OK |
| 2 | 2026-07-20 | Onboarding paso 1 — campo "País donde te graduaste" | Un usuario real sabe qué escribir | Pide código ISO de 2 letras (ej. "CO") en un `<input>` de texto libre — un usuario sin ese conocimiento previo puede no saber el código o escribirlo mal (minúsculas, nombre completo, error de tipeo) sin validación ni autocompletado | 🟡 Mejora para V2 | Documentado — candidato a selector de país por nombre en vez de código libre |
| 3 | 2026-07-20 | Onboarding pasos 2/3 y Explicación (iPhone Safari real, capturas con scroll) | El aviso de beta (`.aviso-beta`) debe permanecer legible en cualquier posición de scroll | El texto del aviso queda parcialmente tapado por la barra de estado de iOS (hora/batería) — el elemento no reserva espacio para el área segura superior (`safe-area-inset-top`) ni tiene z-index/posición que lo aleje de la barra de Safari en su estado colapsado | 🟡 Mejora para V2 | Documentado — candidato: `padding-top: env(safe-area-inset-top)` en `.aviso-beta`. No bloquea ningún flujo (el contenido funcional debajo se ve y usa bien) |
| 4 | 2026-07-20 | Recorrido completo registro→onboarding(3 pasos)→compatibilidad→explicación (iPhone Safari real) | Sin IDs internos, razones correctas, sin alert(), header contextual correcto por pantalla | Todo correcto: España 75%/Alemania 9% con desglose exacto (+30/+10/-5 = 75, consistente con el motor), "no hay acción identificada" correcto para España (sin idioma requerido), headers "Editar mi perfil"/"Volver a mi compatibilidad" contextuales correctos | — (verificación exitosa, sin defecto) | Confirmado OK |
