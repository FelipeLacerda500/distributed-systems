import type { ZodIssue } from 'zod';
import { IParamErrors } from '@/shared/protocols';

export function formatZodErrors(zodErrors: ZodIssue[]): IParamErrors {
  const errors: IParamErrors = {};

  zodErrors.forEach((error) => {
    errors[`${error.path ? error.path : error.code}`] = error.message;
  });

  return errors;
}
