// src/routes/index.ts (ou equivalente)
import { FastifyInstance } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

import {
  createMessageController,
  listConversationController,
} from '@/modules/messages/controllers';

import { connectionManager } from '@/infra/websocket/ConnectionManager';
import { ensureAuthenticated } from '../middlewares';

export async function appRoutes(app: FastifyInstance) {
  app.get('/ws', { websocket: true }, (socket: WebSocket, request) => {
    console.log('WS HANDLER ENTROU, query =', request.query);

    const { userId } = request.query as { userId?: string };

    if (!userId) {
      console.log('FECHANDO WS: userId AUSENTE');
      socket.close(1008, 'userId query param is required');
      return;
    }

    console.log('WS CONECTADO COM userId =', userId);

    connectionManager.add(userId, socket);

    socket.on('close', () => {
      console.log('WS CLOSE para userId =', userId);
      connectionManager.remove(userId, socket);
    });

    socket.on('message', (msg) => {
      console.log(`WS MESSAGE de ${userId}:`, msg.toString());
    });
  });

  app.post(
    '/messages',
    { preHandler: ensureAuthenticated },
    createMessageController,
  );
  app.get(
    '/messages',
    { preHandler: ensureAuthenticated },
    listConversationController,
  );
}
