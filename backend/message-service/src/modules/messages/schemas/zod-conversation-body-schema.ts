import { z } from 'zod';

export const conversationBodySchema = z.object({
  userId: z.string({
    message: 'O userId do usuário deve ser uma string.',
  }),
});
