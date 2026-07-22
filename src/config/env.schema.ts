import { z } from 'zod';

/**
 * Validación de variables de entorno al arranque (fail-fast). Si falta una
 * variable requerida o tiene un formato inválido, el proceso no arranca —
 * preferible a fallar de forma confusa más tarde en producción. Ver ADR-019
 * (gestión de secretos): en local se leen de `.env` (nunca commiteado); en
 * entornos desplegados se inyectan por el gestor de secretos de la
 * plataforma, pero pasan por esta misma validación.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida'),
  DATABASE_SSL: z.string().default('false'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET debe tener al menos 16 caracteres'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().default(30),
  RADAR_K_ANONIMATO_UMBRAL: z.coerce.number().min(1).default(5),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  // Panel privado de "Comparte tu historia" (ver AdminBasicAuthGuard) — sin
  // definir ambas, el panel queda inaccesible (fail-closed), nunca abierto.
  ADMIN_PANEL_USER: z.string().optional(),
  ADMIN_PANEL_PASSWORD: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Configuración de entorno inválida: ${parsed.error.toString()}`);
  }
  return parsed.data;
}
