import { z } from 'zod';

export const messageBodySchema = z.object({
  senderId: z.string({
    message: 'O userId da pessoa que enviou uma mensagem deve ser uma string.',
  }),
  receiverId: z.string({
    message: 'O userId da pessoa que recebeu uma mensagem deve ser uma string.',
  }),
  content: z.string({
    message: 'O conteúdo da mensagem deve ser uma string.',
  }),
  createdAt: z.coerce.date({
    message: 'A data de criação da mensagem deve ser uma data válida.',
  }),
});
