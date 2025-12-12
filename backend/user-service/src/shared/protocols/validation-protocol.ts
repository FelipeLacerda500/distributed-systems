export interface ValidationProtocol<TInput, TOutput> {
  validateOrThrow(data: TInput): TOutput;
}
