import { ZodError } from 'zod';
import { ValidationProtocol } from '@/shared/protocols';
import { ValidationError } from '@/shared/errors';
import { zodErrorToParamErrors } from '@/shared/helpers';
import { CreateUserBody, createUserBodySchema } from '../schemas';

export type CreateUserInput = CreateUserBody;

export class ZodCreateUserValidator
  implements ValidationProtocol<unknown, CreateUserInput>
{
  validateOrThrow(data: unknown): CreateUserInput {
    try {
      return createUserBodySchema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        const paramErrors = zodErrorToParamErrors(err);
        throw new ValidationError(paramErrors, 'Invalid request body');
      }

      throw err;
    }
  }
}
