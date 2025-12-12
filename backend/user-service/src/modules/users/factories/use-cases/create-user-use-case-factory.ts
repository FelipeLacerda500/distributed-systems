import { PrismaUserRepository } from '../../repositories';
import { CreateUserUseCase } from '../../use-cases';

export function makeCreateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  return new CreateUserUseCase(userRepository);
}
