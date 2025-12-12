export class ResourceNotFoundError extends Error {
  constructor(user = 'Resource not found') {
    super(user);
    this.name = 'ResourceNotFoundError';
  }
}
