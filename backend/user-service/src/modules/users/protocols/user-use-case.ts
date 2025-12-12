import { UserDTO, AuthenticateUserResponseDTO } from '../dtos';

export interface CreateUserUseCaseProtocol {
  execute(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserDTO>;
}

export interface AuthenticateUserUseCaseProtocol {
  execute(input: {
    email: string;
    password: string;
  }): Promise<AuthenticateUserResponseDTO>;
}
