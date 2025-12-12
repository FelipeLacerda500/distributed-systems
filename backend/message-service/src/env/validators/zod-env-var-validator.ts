import { IValidation } from '@/shared/protocols';
import { formatZodErrors } from '@/shared/helpers';
import { envVarSchema } from '../schemas';
import { ValidationError } from '@/shared/errors';

type EnvVar = {
  NODE_ENV: string;
  PORT: string | number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | number;
};

export class ZodEnvVarValidator implements IValidation<EnvVar> {
  validate(input: EnvVar): EnvVar {
    const parsedEnvVar = envVarSchema.safeParse(input);

    if (!parsedEnvVar.success) {
      console.error('❌ Invalid environment variables.');

      throw new ValidationError('Invalid environment variables.', {
        ...formatZodErrors(parsedEnvVar.error.issues),
      });
    }

    const { NODE_ENV, PORT, JWT_SECRET, JWT_EXPIRES_IN } = parsedEnvVar.data;

    return { NODE_ENV, PORT, JWT_SECRET, JWT_EXPIRES_IN };
  }
}
