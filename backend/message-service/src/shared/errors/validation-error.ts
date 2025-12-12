import { IParamErrors } from '../protocols';

export class ValidationError extends Error {
  constructor(
    message?: string,
    private readonly params?: IParamErrors,
  ) {
    super(message || 'Os dados fornecidos são inválidos.');
  }

  public getParams(): IParamErrors {
    return this.params;
  }
}
