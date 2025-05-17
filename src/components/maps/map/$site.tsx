'use client';

import { Prisma } from '@prisma/client';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';

import { SiteWithBlocks } from './SiteWithBlocks';

export const $site = atomFamily(
  (params: Prisma.SiteFindUniqueArgs) =>
    atom(() =>
      fetch('/api/lake/site/findUnique', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => SiteWithBlocks.parse(data))
    ),
  isEqual
);
