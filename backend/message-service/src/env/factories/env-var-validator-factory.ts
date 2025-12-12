import { ZodEnvVarValidator } from '../validators';

export function envVarValidatorFactory() {
  return new ZodEnvVarValidator();
}
