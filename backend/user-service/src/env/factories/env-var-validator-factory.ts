import { ZodEnvVarValidator } from '../validators';
import type { EnvVars } from '../schemas';

let cachedEnv: EnvVars | null = null;

export function makeEnv(): EnvVars {
  if (cachedEnv) {
    return cachedEnv;
  }

  const validator = new ZodEnvVarValidator();
  cachedEnv = validator.validate(process.env);

  return cachedEnv;
}
