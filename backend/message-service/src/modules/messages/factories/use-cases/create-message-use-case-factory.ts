import { WebSocketMessageEventPublisher } from '@/infra/websocket/WebSocketMessageEventPublisher';
import { PrismaMessageRepository } from '../../repositories';
import { CreateMessageUseCase } from '../../use-cases';
import { connectionManager } from '@/server/routes';

export function createMessageUseCaseFactory() {
  const messageRepository = new PrismaMessageRepository();
  const publisher = new WebSocketMessageEventPublisher(connectionManager);

  const useCase = new CreateMessageUseCase(messageRepository, publisher);

  return useCase;
}
