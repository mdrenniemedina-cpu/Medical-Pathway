export const ROLES = ['usuario', 'mentor', 'moderador', 'editor_contenido', 'admin'] as const;
export type Rol = (typeof ROLES)[number];

export function esRolValido(valor: string): valor is Rol {
  return (ROLES as readonly string[]).includes(valor);
}
