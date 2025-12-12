import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../protocols';
import { ParamErrors } from '@/shared/protocols';
import { ValidationError } from '@/shared/errors';
import { AuthenticateUserResponseDTO, UserDTO } from '../dtos';
import { makeEnv } from '@/env/factories';

interface AuthenticateUserUseCaseInput {
  email: string;
  password: string;
}

const env = makeEnv();

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseInput): Promise<AuthenticateUserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    const errors: ParamErrors = {
      email: ['Credenciais inválidas'],
      password: ['Credenciais inválidas'],
    };

    if (!user) {
      throw new ValidationError(errors, 'Invalid credentials');
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new ValidationError(errors, 'Invalid credentials');
    }

    const token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const userDTO: UserDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      token,
      user: userDTO,
    };
  }
}
