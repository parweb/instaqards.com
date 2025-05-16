import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server';

export const pagination = {
  page: parseAsInteger.withDefault(1),
  take: parseAsInteger.withDefault(6),
  search: parseAsString.withDefault('')
};

export const paginate = createLoader(pagination);
