import { z } from 'zod';

export const envVarSchema = z.object({
  NODE_ENV: z
    .enum(['dev', 'test', 'production'], {
      message:
        'It must be a valid environment. Expected: "dev", "test", "production".',
    })
    .default('dev'),
  PORT: z.coerce
    .number({ message: 'It must be a valid value for PORT.' })
    .default(3333),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('120m'),
});
