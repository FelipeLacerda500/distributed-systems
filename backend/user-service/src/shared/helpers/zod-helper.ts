import { ZodError } from 'zod';
import { ParamErrors } from '@/shared/protocols';

export function zodErrorToParamErrors(error: ZodError): ParamErrors {
  const result: ParamErrors = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!result[path]) {
      result[path] = [];
    }
    result[path].push(issue.message);
  }

  return result;
}
