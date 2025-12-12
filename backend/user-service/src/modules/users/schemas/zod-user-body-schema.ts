import { z } from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
