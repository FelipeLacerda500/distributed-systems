import { prisma, resetDatabase } from '../../../../test/prisma-test-client';

import { PrismaMessageRepository } from '../repositories/prisma/prisma-message-repository';
import { CreateMessageUseCase } from '../use-cases/create-message-use-case';
import { ListConversationUseCase } from '../use-cases/list-conversation-use-case';

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

describe('Messages Module - Integração (com persistência)', () => {
  const senderId = 'user-A';
  const receiverId = 'user-B';

  let repo: any;
  let createUseCase: any;
  let listUseCase: any;

  beforeAll(async () => {
    await prisma.$connect();

    repo = new (PrismaMessageRepository as any)(prisma);

    const publisher = new NullMessageEventPublisher();

    createUseCase = new (CreateMessageUseCase as any)(repo, publisher);
    listUseCase = new (ListConversationUseCase as any)(repo);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('deve criar mensagem e persistir no banco (messages)', async () => {
    const content = 'olá';

    const callCreate = getCallable(createUseCase);

    await callCreate({
      senderId,
      receiverId,
      content,
    });

    const saved = await prisma.message.findFirst({
      where: { senderId, receiverId, content },
    });

    expect(saved).not.toBeNull();
    expect(saved!.id).toBeTruthy();
    expect(saved!.createdAt).toBeInstanceOf(Date);
  });

  it('deve listar a conversa entre dois usuários (A<->B) com dados persistidos', async () => {
    const callCreate = getCallable(createUseCase);

    await callCreate({ senderId, receiverId, content: 'msg 1 A->B' });
    await callCreate({
      senderId: receiverId,
      receiverId: senderId,
      content: 'msg 2 B->A',
    });
    await callCreate({ senderId, receiverId, content: 'msg 3 A->B' });

    const callList = getCallable(listUseCase);

    const result = await callList({ senderId, receiverId });

    expect(result).toBeDefined();

    const inDb = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    expect(inDb).toHaveLength(3);
    expect(inDb.map((m) => m.content)).toEqual([
      'msg 1 A->B',
      'msg 2 B->A',
      'msg 3 A->B',
    ]);
  });
});
