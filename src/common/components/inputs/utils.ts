import type data from './projectMock.json';

export function filterItems(value: string, item: typeof data[number]): boolean {
  const reg = new RegExp(value, 'ig');
  const inName = reg.test(item.name);
  const inDescription = reg.test(item.description);
  const isInTicker = reg.test(item.ticker);
  const isValid = inName || inDescription || isInTicker;
  return isValid;
}
