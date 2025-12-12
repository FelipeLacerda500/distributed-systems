import { ZodError } from 'zod';
import { ValidationProtocol } from '@/shared/protocols';
import { ValidationError } from '@/shared/errors';
import { zodErrorToParamErrors } from '@/shared/helpers';
import { AuthenticateUserBody, authenticateUserBodySchema } from '../schemas';

export type AuthenticateUserInput = AuthenticateUserBody;

export class ZodAuthenticateUserValidator
  implements ValidationProtocol<unknown, AuthenticateUserInput>
{
  validateOrThrow(data: unknown): AuthenticateUserInput {
    try {
      return authenticateUserBodySchema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        const paramErrors = zodErrorToParamErrors(err);
        throw new ValidationError(paramErrors, 'Invalid credentials');
      }

      throw err;
    }
  }
}
