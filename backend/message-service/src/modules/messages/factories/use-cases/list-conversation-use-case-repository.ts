import { PrismaMessageRepository } from '../../repositories';
import { ListConversationUseCase } from '../../use-cases';

export function listConversationUseCaseFactory() {
  const messageRepository = new PrismaMessageRepository();

  const useCase = new ListConversationUseCase(messageRepository);

  return useCase;
}
