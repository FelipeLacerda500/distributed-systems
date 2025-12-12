// src/modules/messages/infra/websocket/WebSocketMessageEventPublisher.ts
import { IMessageEventPublisher } from '@/modules/messages/protocols/IMessageEventPublisher';
import { Message } from '@/modules/messages/entities';
import {
  ConnectionManager,
  connectionManager,
} from '@/infra/websocket/ConnectionManager';

export class WebSocketMessageEventPublisher implements IMessageEventPublisher {
  // se ninguém passar nada, usa o singleton connectionManager
  constructor(
    private readonly connections: ConnectionManager = connectionManager,
  ) {}

  public async notifyMessageCreated(message: Message): Promise<void> {
    const payload = JSON.stringify({
      type: 'MESSAGE_CREATED',
      data: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: message.createdAt,
      },
    });

    this.connections.broadcastToUser(message.receiverId, payload);
    this.connections.broadcastToUser(message.senderId, payload);
  }
}
