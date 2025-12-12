// src/modules/messages/protocols/IMessageEventPublisher.ts
import { Message } from '../entities';

export interface IMessageEventPublisher {
  notifyMessageCreated(message: Message): Promise<void>;
}
