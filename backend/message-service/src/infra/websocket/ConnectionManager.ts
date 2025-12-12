// src/infra/websocket/ConnectionManager.ts
import type { WebSocket } from '@fastify/websocket';

export type UserId = string;

export class ConnectionManager {
  private readonly connections = new Map<UserId, Set<WebSocket>>();

  public add(userId: UserId, socket: WebSocket | undefined): void {
    if (!socket) {
      console.log('[add] socket undefined, NÃO adicionando para', userId);
      return;
    }

    let set = this.connections.get(userId);

    if (!set) {
      set = new Set();
      this.connections.set(userId, set);
    }

    set.add(socket);
  }

  public remove(userId: UserId, socket: WebSocket | undefined): void {
    const set = this.connections.get(userId);
    if (!set || !socket) return;

    set.delete(socket);

    if (set.size === 0) {
      this.connections.delete(userId);
    }
  }

  public broadcastToUser(userId: UserId, payload: string): void {
    const set = this.connections.get(userId);
    if (!set) {
      console.log('[broadcastToUser] nenhum socket para', userId);
      return;
    }

    console.log(
      '[broadcastToUser] userId =',
      userId,
      'connections =',
      set.size,
    );

    for (const socket of set) {
      try {
        socket.send(payload);
      } catch (error) {
        console.log('[broadcastToUser] erro ao enviar para', userId, error);
      }
    }
  }
}

export const connectionManager = new ConnectionManager();
