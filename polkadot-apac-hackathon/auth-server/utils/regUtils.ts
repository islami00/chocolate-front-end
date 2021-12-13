export const errorHandled = async function <T>(
  prom: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const success = await prom;
    return [success, null];
  } catch (err) {
    if (!(err instanceof Error)) {
      return [null, new Error(`${err} is not an instance of Error`)];
    }
    return [null, err];
  }
};
