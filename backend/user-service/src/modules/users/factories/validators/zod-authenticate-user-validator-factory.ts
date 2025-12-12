import { ZodAuthenticateUserValidator } from '../../validators';

export function makeAuthenticateUserValidator() {
  return new ZodAuthenticateUserValidator();
}
