export class RetryableError extends Error {
  constructor(public retry: () => Promise<unknown>) {
    super("Retryable error.");
  }
}
