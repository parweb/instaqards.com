'use client';

import { parseAsInteger, useQueryState } from 'nuqs';

import { Input } from 'components/ui/input';
import { clamp } from 'helpers/clamp';

import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationUI
} from 'components/ui/pagination';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

export const Pagination = ({ total }: { total: number }) => {
  const [page, setPage] = useQueryState('page', {
    ...parseAsInteger.withDefault(1),
    shallow: false
  });
  const [take, setTake] = useQueryState('take', {
    ...parseAsInteger.withDefault(9),
    shallow: false
  });

  if (!total) return null;

  const pages = Math.ceil(total / take);

  return (
    <div className="flex items-center justify-between gap-4">
      <PaginationUI>
        <PaginationContent className="flex gap-4">
          <PaginationItem>
            <PaginationPrevious
              onClick={async () => {
                await setPage(clamp(page - 1, 1, pages));
              }}
            />
          </PaginationItem>

          <PaginationItem className="flex items-center gap-2">
            <Input
              type="number"
              value={page}
              min={1}
              max={pages}
              step={1}
              className="w-fit"
              onChange={async e => {
                await setPage(Number(e.target.value));
              }}
            />

            <span>/</span>

            <span>{pages}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={async () => {
                await setPage(clamp(page + 1, 1, pages));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>

      <Select
        value={take.toString()}
        onValueChange={async value => {
          await setTake(Number(value));
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Résultats" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="9">9</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="18">18</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
