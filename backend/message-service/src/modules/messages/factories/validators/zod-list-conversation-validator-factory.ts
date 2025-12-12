import { ZodListConversationValidator } from '../../validators';

export function zodListConversationValidatorFactory() {
  return new ZodListConversationValidator();
}
