import { PrismaUserRepository } from '../../repositories';
import { AuthenticateUserUseCase } from '../../use-cases';

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  return new AuthenticateUserUseCase(userRepository);
}
