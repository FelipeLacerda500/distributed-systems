import { z } from 'zod';

export const authenticateUserBodySchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type AuthenticateUserBody = z.infer<typeof authenticateUserBodySchema>;
