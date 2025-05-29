'use client';

import { z } from 'zod';

import { SiteSchema, BlockSchema } from '../../../../prisma/generated/zod';

export const SiteWithBlocks = SiteSchema.merge(
  z.object({
    blocks: z.array(BlockSchema)
  })
);
