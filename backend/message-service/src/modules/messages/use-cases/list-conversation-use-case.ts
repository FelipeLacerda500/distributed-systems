import { ListConversationDTO } from '../dtos';
import { Message } from '../entities';
import { IMessageUseCase, IMessageRepository } from '../protocols';

type UseCaseResponse = {
  items: Message[];
};

export class ListConversationUseCase
  implements IMessageUseCase<UseCaseResponse>
{
  constructor(private readonly messageRepository: IMessageRepository) {}

  public async execute(data: ListConversationDTO): Promise<UseCaseResponse> {
    const { items } = await this.messageRepository.listConversations(data);

    return { items };
  }
}
