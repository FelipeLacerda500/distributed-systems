import { IMessageRepository, IMessageUseCase } from '../protocols';
import { AddMessageDTO } from '../dtos';
import { Message } from '../entities';
import { IMessageEventPublisher } from '../protocols/IMessageEventPublisher';

export class CreateMessageUseCase implements IMessageUseCase<Message> {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly eventPublisher: IMessageEventPublisher,
  ) {}

  public async execute(data: AddMessageDTO): Promise<Message> {
    const senderId = data.senderId;
    const receiverId = data.receiverId;
    const content = data.content;
    const createdAt = data.createdAt;

    const message = await this.messageRepository.create({
      senderId,
      receiverId,
      content,
      createdAt,
    });

    await this.eventPublisher.notifyMessageCreated(message);

    return message;
  }
}
