// src/server/routes/index.ts
import { FastifyInstance } from 'fastify';

import {
  makeCreateUserController,
  makeAuthenticateUserController,
} from '@/modules/users/controllers';

export async function appRoutes(app: FastifyInstance) {
  const createUserController = makeCreateUserController();
  const authenticateUserController = makeAuthenticateUserController();

  app.post('/users', async (request, reply) => {
    return createUserController.handle(request, reply);
  });

  app.post('/sessions', async (request, reply) => {
    return authenticateUserController.handle(request, reply);
  });
}
