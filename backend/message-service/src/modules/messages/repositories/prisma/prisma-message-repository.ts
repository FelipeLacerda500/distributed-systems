import { IMessageRepository } from '../../protocols';
import { Message } from '../../entities';
import { AddMessageDTO } from '../../dtos';
import { prisma } from '@/infra/db';

export class PrismaMessageRepository implements IMessageRepository {
  public async create(data: AddMessageDTO): Promise<Message> {
    const message = Message.create(
      data.senderId,
      data.receiverId,
      data.content,
      data.createdAt,
    );

    await prisma.message.create({
      data: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: message.createdAt,
      },
    });

    return message;
  }

  public async listConversations(params: {
    userId: string;
  }): Promise<{ items: Message[] }> {
    const { userId } = params;

    const rows = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'asc' },
    });

    const items: Message[] = rows.map((row) => ({
      id: row.id,
      senderId: row.senderId,
      receiverId: row.receiverId,
      content: row.content,
      createdAt: row.createdAt,
    }));

    return { items };
  }
}
