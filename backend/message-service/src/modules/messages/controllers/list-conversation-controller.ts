import { ValidationError } from '@/shared/errors';
import { listConversationUseCaseFactory } from '../factories/use-cases';
import { zodListConversationValidatorFactory } from '../factories/validators';
import { ApiReply, ApiRequest } from '@/server/@types';

type listConversationRequest = {
  userId: string;
};

export async function listConversationController(
  request: ApiRequest & { query: listConversationRequest },
  reply: ApiReply,
) {
  const { userId } = request.query;

  if (!userId || Object.keys(request.query).length !== 1) {
    throw new ValidationError();
  }

  const listConversationValidator = zodListConversationValidatorFactory();

  listConversationValidator.validate(request.query);

  const listConversationUseCase = listConversationUseCaseFactory();

  const conversation = await listConversationUseCase.execute({
    userId,
  });

  return reply.status(200).send(conversation);
}
