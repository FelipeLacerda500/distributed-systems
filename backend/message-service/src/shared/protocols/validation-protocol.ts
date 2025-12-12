/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IValidation<T = any> {
  validate(input: unknown): T;
}
