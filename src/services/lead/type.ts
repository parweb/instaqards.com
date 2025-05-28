import { Prisma } from '@prisma/client';

export const select = {
  id: true,
  company: true,
  city: true,
  postcode: true,
  // country: true,
  // website: true,
  phone: true,
  email: true,
  address: true,
  codeNaf: true,
  activity: true
} as const;

export type UserKanban = Prisma.UserGetPayload<{
  select: typeof select;
}>;
