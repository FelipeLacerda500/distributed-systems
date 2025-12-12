import { CreateUserController } from './create-user-controller';
import { AuthenticateUserController } from './authenticate-user-controller';

export function makeCreateUserController() {
  return new CreateUserController();
}

export function makeAuthenticateUserController() {
  return new AuthenticateUserController();
}
