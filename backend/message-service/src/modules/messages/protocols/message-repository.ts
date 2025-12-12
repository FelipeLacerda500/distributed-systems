/* eslint-disable @typescript-eslint/no-explicit-any */

import { AddMessageDTO, ListConversationDTO } from '../dtos';

export interface IMessageRepository<T = any> {
  create(data: AddMessageDTO): Promise<T>;
  listConversations(data: ListConversationDTO): Promise<{ items: T[] }>;
}
