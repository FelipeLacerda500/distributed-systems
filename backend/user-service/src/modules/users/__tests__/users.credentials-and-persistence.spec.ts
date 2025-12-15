import { prisma, resetDatabase } from '../../../../test/prisma-test-client';

import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository';
import { CreateUserUseCase } from '../use-cases/create-user-use-case';
import { AuthenticateUserUseCase } from '../use-cases/authenticate-user-use-case';

function getCallable(useCase: any) {
  if (typeof useCase?.execute === 'function')
    return useCase.execute.bind(useCase);
  if (typeof useCase?.handle === 'function')
    return useCase.handle.bind(useCase);
  throw new Error('Use-case sem método execute/handle.');
}

describe('Users Module - Unit (credenciais + persistência)', () => {
  let repo: any;
  let createUserUseCase: any;
  let authenticateUserUseCase: any;

  beforeAll(async () => {
    await prisma.$connect();

    repo = new (PrismaUserRepository as any)(prisma);
    createUserUseCase = new (CreateUserUseCase as any)(repo);
    authenticateUserUseCase = new (AuthenticateUserUseCase as any)(repo);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('deve criar usuário e persistir no banco', async () => {
    const callCreate = getCallable(createUserUseCase);

    const name = 'User Test';
    const email = 'user@test.com';
    const password = '123456';

    await callCreate({ name, email, password });

    const saved = await prisma.user.findFirst({
      where: { email },
    });

    expect(saved).not.toBeNull();
    expect((saved as any).id).toBeTruthy();

    if ((saved as any).createdAt) {
      expect((saved as any).createdAt).toBeInstanceOf(Date);
    }

    const savedAny = saved as any;
    if (typeof savedAny.password === 'string') {
      expect(savedAny.password).not.toBe(password);
    }
    if (typeof savedAny.passwordHash === 'string') {
      expect(savedAny.passwordHash).not.toBe(password);
    }
    if (typeof savedAny.hashedPassword === 'string') {
      expect(savedAny.hashedPassword).not.toBe(password);
    }
  });

  it('deve autenticar com credenciais válidas', async () => {
    const callCreate = getCallable(createUserUseCase);
    const callAuth = getCallable(authenticateUserUseCase);

    const name = 'Auth User';
    const email = 'auth@test.com';
    const password = '123456';

    await callCreate({ name, email, password });

    const result: any = await callAuth({ email, password });

    expect(result).toBeDefined();

    const token =
      result?.token ??
      result?.accessToken ??
      result?.jwt ??
      result?.data?.token;
    if (token !== undefined) {
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    }

    const user = result?.user ?? result?.data?.user;
    if (user !== undefined) {
      expect(user.email).toBe(email);
    }
  });

  it('não deve autenticar com senha inválida', async () => {
    const callCreate = getCallable(createUserUseCase);
    const callAuth = getCallable(authenticateUserUseCase);

    const email = 'wrongpass@test.com';
    const password = '123456';

    await callCreate({ name: 'X', email, password });

    await expect(
      callAuth({ email, password: 'senha-errada' }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('não deve autenticar usuário inexistente', async () => {
    const callAuth = getCallable(authenticateUserUseCase);

    await expect(
      callAuth({ email: 'naoexiste@test.com', password: '123456' }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('não deve permitir criar dois usuários com o mesmo email (se houver regra/unique)', async () => {
    const callCreate = getCallable(createUserUseCase);

    const email = 'dup@test.com';

    await callCreate({ name: 'U1', email, password: '123456' });

    await expect(
      callCreate({ name: 'U2', email, password: '123456' }),
    ).rejects.toBeInstanceOf(Error);

    const count = await prisma.user.count({ where: { email } });
    expect(count).toBe(1);
  });
});
