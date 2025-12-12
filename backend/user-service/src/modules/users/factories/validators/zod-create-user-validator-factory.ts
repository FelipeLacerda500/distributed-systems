import { ZodCreateUserValidator } from '../../validators';

export function makeCreateUserValidator() {
  return new ZodCreateUserValidator();
}
