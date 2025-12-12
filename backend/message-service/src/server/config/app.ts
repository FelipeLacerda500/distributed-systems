/*eslint-disable import/no-named-as-default*/

import fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';

import { appRoutes } from '../routes';
import { ResourceNotFoundError, ValidationError } from '@/shared/errors';

export const app = fastify();

app.register(cors);
app.register(websocket);
app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(400).send({
      message: error.message,
      params: error.getParams(),
    });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }
  console.log(error);
  return reply.status(500).send({ message: 'Internal server error.' });
});
