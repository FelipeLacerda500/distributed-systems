import { hash } from 'bcryptjs';
import { UserRepository } from '../protocols';
import { ParamErrors } from '@/shared/protocols';
import { ValidationError } from '@/shared/errors';
import { UserDTO } from '../dtos';

interface CreateUserUseCaseInput {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseInput): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      const errors: ParamErrors = {
        email: ['E-mail já está em uso'],
      };

      throw new ValidationError(errors, 'User already exists');
    }

    const passwordHash = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
