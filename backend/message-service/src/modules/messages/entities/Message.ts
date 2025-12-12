import crypto from 'crypto';

export class Message {
  private constructor(
    public id: string,
    public senderId: string,
    public receiverId: string,
    public content: string,
    public createdAt: Date,
  ) {}

  public static create(
    senderId: string,
    receiverId: string,
    content: string,
    createdAt?: Date,
    id?: string,
  ): Message {
    return new Message(
      id ?? crypto.randomUUID(),
      senderId,
      receiverId,
      content,
      createdAt ?? new Date(),
    );
  }
}
