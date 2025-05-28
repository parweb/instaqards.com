import { z } from 'zod';
import { SiteSchema } from '../../../../../../prisma/generated/zod';

export const input = z.object({
  result: z.array(z.object({ id: z.string(), position: z.number() })),
  site: SiteSchema.pick({ id: true, customDomain: true, subdomain: true })
});

export type Input = z.infer<typeof input>;
