import { createMessageUseCaseFactory } from '../factories/use-cases';
import { zodCreateMessageValidatorFactory } from '../factories/validators';
import { ApiReply, ApiRequest } from '@/server/@types';
import { ValidationError } from '@/shared/errors';

type createMessageRequest = {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
};

export async function createMessageController(
  request: ApiRequest & { body: createMessageRequest },
  reply: ApiReply,
) {
  const { senderId, receiverId, content, createdAt } = request.body;

  if (
    !senderId ||
    !receiverId ||
    !content ||
    !createdAt ||
    Object.keys(request.body).length !== 4
  ) {
    throw new ValidationError();
  }

  const createMessageValidator = zodCreateMessageValidatorFactory();

  createMessageValidator.validate(request.body);

  const createMessageUseCase = createMessageUseCaseFactory();

  const message = await createMessageUseCase.execute({
    senderId,
    receiverId,
    content,
    createdAt,
  });

  return reply.status(201).send({
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    createdAt: message.createdAt,
  });
}
