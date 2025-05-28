import { z } from 'zod';

export const input = z.object({
  priceId: z.string(),
  metadata: z.record(z.string(), z.string()).optional()
});

export type Input = z.infer<typeof input>;
