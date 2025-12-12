import { ZodCreateMessageValidator } from '../../validators';

export function zodCreateMessageValidatorFactory() {
  return new ZodCreateMessageValidator();
}
