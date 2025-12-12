/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IMessageUseCase<T = any> {
  execute(data: unknown): Promise<T>;
}
