import { ApiReply, ApiRequest } from '@/server/@types';
import { makeCreateUserUseCase } from '../factories/use-cases';
import { makeCreateUserValidator } from '../factories/validators';

export class CreateUserController {
  async handle(request: ApiRequest, reply: ApiReply): Promise<Response> {
    const validator = makeCreateUserValidator();
    const { name, email, password } = validator.validateOrThrow(request.body);

    const useCase = makeCreateUserUseCase();
    const user = await useCase.execute({ name, email, password });

    return reply.status(201).send({
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  }
}
