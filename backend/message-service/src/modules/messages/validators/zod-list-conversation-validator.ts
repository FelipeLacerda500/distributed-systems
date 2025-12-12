import { IValidation } from '@/shared/protocols';
import { formatZodErrors } from '@/shared/helpers';
import { conversationBodySchema } from '../schemas';
import { ValidationError } from '@/shared/errors';

type ValidatorResponse = {
  userId: string;
};

export class ZodListConversationValidator
  implements IValidation<ValidatorResponse>
{
  validate(input: unknown): ValidatorResponse {
    const parsedConversationData = conversationBodySchema.safeParse(input);

    if (!parsedConversationData.success) {
      throw new ValidationError(null, {
        ...formatZodErrors(parsedConversationData.error.issues),
      });
    }

    const { userId } = parsedConversationData.data;

    return { userId };
  }
}
