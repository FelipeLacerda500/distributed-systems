import { EnvVars, envVarSchema } from '../schemas';

export class ZodEnvVarValidator {
  validate(env: NodeJS.ProcessEnv): EnvVars {
    const parsed = envVarSchema.safeParse(env);

    if (!parsed.success) {
      console.error(
        'Invalid environment variables',
        parsed.error.flatten().fieldErrors,
      );
      throw new Error('Invalid environment variables');
    }

    return parsed.data;
  }
}
