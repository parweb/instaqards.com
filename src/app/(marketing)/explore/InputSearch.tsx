'use client';

import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import { Input } from 'components/ui/input';
import { LuLoader } from 'react-icons/lu';
import { pagination } from './QuerySchema';

export const InputSearch = () => {
  const [isMutating, startTransition] = useTransition();

  const [search, setSearch] = useQueryState('search', {
    ...pagination.search,
    shallow: false,
    startTransition
  });

  const [, setPage] = useQueryState('page', {
    ...pagination.page,
    shallow: false,
    startTransition
  });

  return (
    <div className="flex items-center gap-2">
      {isMutating && (
        <div>
          <LuLoader className="animate-spin" />
        </div>
      )}
      <Input
        type="search"
        placeholder="Rechercher"
        className="rounded-full"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
    </div>
  );
};
