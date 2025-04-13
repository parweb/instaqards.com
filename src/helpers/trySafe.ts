'use server';

export const trySafe = async <T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<[boolean, T, unknown]> => {
  try {
    return [true, await fn(), null];
  } catch (error: unknown) {
    return [false, defaultValue, error];
  }
};
