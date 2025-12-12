import { ApiReply, ApiRequest } from '@/server/@types';
import { makeAuthenticateUserUseCase } from '../factories/use-cases';
import { makeAuthenticateUserValidator } from '../factories/validators';

export class AuthenticateUserController {
  async handle(request: ApiRequest, reply: ApiReply): Promise<Response> {
    const validator = makeAuthenticateUserValidator();
    const { email, password } = validator.validateOrThrow(request.body);

    const useCase = makeAuthenticateUserUseCase();
    const result = await useCase.execute({ email, password });

    return reply.status(200).send({
      result: {
        token: result.token,
      },
      user: {
        name: result.user.name,
        email: result.user.email,
        createdAt: result.user.createdAt,
      },
    });
  }
}
