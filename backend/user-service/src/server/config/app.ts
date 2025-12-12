/* eslint-disable import/no-named-as-default */

import fastify from 'fastify';
import cors from '@fastify/cors';

import { appRoutes } from '../routes';
import { ResourceNotFoundError, ValidationError } from '@/shared/errors';

export const app = fastify();

app.register(cors);
app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(400).send({
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  console.error(error);

  return reply.status(500).send({
    message: 'Internal server error.',
  });
});
