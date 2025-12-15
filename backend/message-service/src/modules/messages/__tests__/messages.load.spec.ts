import { prisma, resetDatabase } from '../../../../test/prisma-test-client';

import { PrismaMessageRepository } from '../repositories/prisma/prisma-message-repository';
import { CreateMessageUseCase } from '../use-cases/create-message-use-case';

class NullMessageEventPublisher {
  public async notifyMessageCreated(_: any): Promise<void> {
    return;
  }
}

function getCallable(useCase: any) {
  if (typeof useCase?.execute === 'function')
    return useCase.execute.bind(useCase);
  if (typeof useCase?.handle === 'function')
    return useCase.handle.bind(useCase);
  throw new Error('Use-case sem método execute/handle.');
}

describe('Messages Module - Carga/Concorrência', () => {
  let repo: any;
  let createUseCase: any;

  beforeAll(async () => {
    jest.setTimeout(60_000);
    await prisma.$connect();

    repo = new (PrismaMessageRepository as any)(prisma);
    createUseCase = new (CreateMessageUseCase as any)(
      repo,
      new NullMessageEventPublisher(),
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('deve suportar >=10 usuários simultâneos criando mensagens e persistindo tudo', async () => {
    const callCreate = getCallable(createUseCase);

    const receiverId = 'hub-user';
    const users = Array.from({ length: 10 }, (_, i) => `user-${i + 1}`);
    const messagesPerUser = 25;

    await Promise.all(
      users.map(async (senderId) => {
        for (let i = 0; i < messagesPerUser; i++) {
          await callCreate({
            senderId,
            receiverId,
            content: `msg ${i + 1} from ${senderId}`,
          });
        }
      }),
    );

    const totalExpected = users.length * messagesPerUser;

    const totalInDb = await prisma.message.count();
    expect(totalInDb).toBe(totalExpected);

    for (const senderId of users) {
      const count = await prisma.message.count({
        where: { senderId, receiverId },
      });
      expect(count).toBe(messagesPerUser);
    }
  });
});
