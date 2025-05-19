// 'use server';

// Overload for asynchronous function
export function trySafe<T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<[boolean, T, unknown]>;

// Overload for synchronous function
export function trySafe<T>(fn: () => T, defaultValue: T): [boolean, T, unknown];

// Implementation
export function trySafe<T>(
  fn: () => T | Promise<T>,
  defaultValue: T
): [boolean, T, unknown] | Promise<[boolean, T, unknown]> {
  try {
    const resultOrPromise = fn();

    if (resultOrPromise instanceof Promise) {
      // Handle asynchronous case
      return resultOrPromise
        .then((value: T) => [true, value, null] as [boolean, T, unknown])
        .catch(
          (error: unknown) =>
            [false, defaultValue, error] as [boolean, T, unknown]
        );
    } else {
      // Handle synchronous case
      return [true, resultOrPromise, null] as [boolean, T, unknown];
    }
  } catch (error: unknown) {
    // This catch block handles errors from the synchronous execution of fn() itself
    return [false, defaultValue, error] as [boolean, T, unknown];
  }
}
