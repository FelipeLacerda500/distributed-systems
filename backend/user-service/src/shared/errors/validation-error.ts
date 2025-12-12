import { ParamErrors } from '@/shared/protocols';

export class ValidationError extends Error {
  public readonly errors: ParamErrors;

  constructor(errors: ParamErrors, user = 'Validation failed') {
    super(user);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
