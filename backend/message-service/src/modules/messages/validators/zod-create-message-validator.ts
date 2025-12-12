import { IValidation } from '@/shared/protocols';
import { formatZodErrors } from '@/shared/helpers';
import { messageBodySchema } from '../schemas';
import { ValidationError } from '@/shared/errors';

type ValidatorResponse = {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
};

export class ZodCreateMessageValidator
  implements IValidation<ValidatorResponse>
{
  validate(input: unknown): ValidatorResponse {
    const parsedMessageData = messageBodySchema.safeParse(input);

    if (!parsedMessageData.success) {
      throw new ValidationError(null, {
        ...formatZodErrors(parsedMessageData.error.issues),
      });
    }

    const { senderId, receiverId, content, createdAt } = parsedMessageData.data;

    return { senderId, receiverId, content, createdAt };
  }
}
