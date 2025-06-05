'use client';

import { Atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { LucideLoader2 } from 'lucide-react';
import { Suspense, useEffect, useState, useTransition } from 'react';
import type { z } from 'zod';

import { ProspectsSchema } from 'components/modal/prospects-import';
import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { clamp } from 'helpers/clamp';
import { cn } from 'lib/utils';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from 'components/ui/pagination';

import { Prisma } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

const Pages = ({
  $page,
  $take,
  $prospects
}: {
  $page: PrimitiveAtom<number>;
  $take: PrimitiveAtom<number>;
  $prospects: Atom<
    Promise<
      Paginated<
        Prisma.UserGetPayload<{
          select: {
            id: true;
            name: true;
            email: true;
          };
        }>[]
      >
    >
  >;
}) => {
  const [pageAtomValue, setPage] = useAtom($page);
  const [take, setTake] = useAtom($take);
  const [, startTransition] = useTransition();
  const [pageInputValue, setPageInputValue] = useState(
    pageAtomValue.toString()
  );

  const prospects = useAtomValue($prospects);

  useEffect(() => {
    setPageInputValue(pageAtomValue.toString());
  }, [pageAtomValue]);

  const total = prospects.total;

  const pages = Math.ceil(total / take);

  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <Pagination>
        <PaginationContent className="flex gap-4">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                startTransition(() => {
                  setPage(clamp(pageAtomValue - 1, 1, pages));
                });
              }}
            />
          </PaginationItem>

          <PaginationItem className="flex items-center gap-2">
            <Input
              type="number"
              value={pageInputValue}
              min={1}
              max={pages}
              step={1}
              onChange={e => {
                const currentInput = e.target.value;
                setPageInputValue(currentInput);

                const newPage = Number(currentInput);
                if (!isNaN(newPage) && newPage >= 1 && newPage <= pages) {
                  startTransition(() => {
                    setPage(newPage);
                  });
                }
              }}
            />

            <span>/</span>

            <span>{pages}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                startTransition(() => {
                  setPage(clamp(pageAtomValue + 1, 1, pages));
                });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Select
        value={take.toString()}
        onValueChange={async value => {
          const newTake = Number(value);
          startTransition(() => {
            setTake(newTake);
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Résultats" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

type Paginated<T> = {
  data: T;
  total: number;
  take: number;
  skip: number;
};

const Tbody = ({
  $prospects,
  $selection
}: {
  $prospects: Atom<
    Promise<
      Paginated<
        Prisma.UserGetPayload<{
          select: {
            id: true;
            name: true;
            email: true;
            company: true;
            address: true;
            postcode: true;
            city: true;
            phone: true;
            activity: true;
          };
        }>[]
      >
    >
  >;
  $selection: PrimitiveAtom<
    z.infer<typeof ProspectsSchema>['data'][number]['id'][]
  >;
}) => {
  const prospects = useAtomValue($prospects);
  const [selection, setSelection] = useAtom($selection);

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {prospects.data.map(prospect => {
        return (
          <tr
            key={prospect.id}
            className={cn(
              selection?.includes(prospect.id) && 'bg-gray-200',
              'hover:bg-gray-100'
            )}
          >
            <td className="w-12 p-2 text-center">
              <Checkbox
                checked={selection?.includes(prospect.id)}
                onCheckedChange={() => {
                  setSelection(prev => {
                    if (prev?.includes(prospect.id)) {
                      return prev.filter(id => id !== prospect.id);
                    }
                    return [...(prev || []), prospect.id];
                  });
                }}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{prospect.company}</div>
              <div className="text-sm text-gray-500">{prospect.address}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{prospect.postcode}</div>
              <div className="text-sm text-gray-500">{prospect.city}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{prospect.email}</div>
              <div className="text-sm text-gray-500">{prospect.phone}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{prospect.activity}</div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

const SelectAll = ({
  $selection,
  $prospects
}: {
  $selection: PrimitiveAtom<
    z.infer<typeof ProspectsSchema>['data'][number]['id'][]
  >;
  $prospects: Atom<
    Promise<
      Paginated<
        Prisma.UserGetPayload<{
          select: {
            id: true;
            name: true;
            email: true;
          };
        }>[]
      >
    >
  >;
}) => {
  const prospects = useAtomValue($prospects);
  const [selection, setSelection] = useAtom($selection);

  return (
    <Checkbox
      checked={
        selection?.length === prospects.total
          ? true
          : selection?.length > 0
            ? 'indeterminate'
            : false
      }
      onCheckedChange={() => {
        setSelection(prev => {
          const currentPageIds = prospects.data.map(prospect => prospect.id);
          const areAllCurrentPageSelected = currentPageIds.every(id =>
            prev.includes(id)
          );
          return areAllCurrentPageSelected
            ? prev.filter(id => !currentPageIds.includes(id))
            : [...new Set([...prev, ...currentPageIds])];
        });
      }}
    />
  );
};

const Thead = ({
  $selection,
  $prospects
}: {
  $selection: PrimitiveAtom<
    z.infer<typeof ProspectsSchema>['data'][number]['id'][]
  >;
  $prospects: Atom<
    Promise<
      Paginated<
        Prisma.UserGetPayload<{
          select: {
            id: true;
            name: true;
            email: true;
          };
        }>[]
      >
    >
  >;
}) => {
  const prospects = useAtomValue($prospects);
  const selection = useAtomValue($selection);

  return (
    <thead className="sticky top-0 bg-gray-50">
      <tr>
        <th className="p-2">
          <Suspense fallback={<LucideLoader2 className="animate-spin" />}>
            <SelectAll $selection={$selection} $prospects={$prospects} />

            <div className="whitespace-nowrap">
              {selection.length} / {prospects.total}
            </div>
          </Suspense>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          <div className="flex flex-col gap-1 whitespace-nowrap">
            <span>Raison sociale</span>
            <span>Adresse</span>
          </div>
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          <div className="flex flex-col gap-1 whitespace-nowrap">
            <span>Code postal</span>
            <span>Ville</span>
          </div>
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          <div className="flex flex-col gap-1 whitespace-nowrap">
            <span>Email</span>
            <span>Téléphone</span>
          </div>
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Activité
        </th>
      </tr>
    </thead>
  );
};

interface ProspectsTableProps {
  $selection: PrimitiveAtom<
    z.infer<typeof ProspectsSchema>['data'][number]['id'][]
  >;
  $prospects: Atom<
    Promise<
      Paginated<
        Prisma.UserGetPayload<{
          select: {
            id: true;
            name: true;
            email: true;
            company: true;
            address: true;
            postcode: true;
            city: true;
            phone: true;
            activity: true;
          };
        }>[]
      >
    >
  >;
  total?: number;
  $page: PrimitiveAtom<number>;
  $take: PrimitiveAtom<number>;
  $search: PrimitiveAtom<string>;
}

export const ProspectsTable = ({
  $selection,
  $prospects,
  $page,
  $take,
  $search
}: ProspectsTableProps) => {
  const [isPending, startTransition] = useTransition();

  const setPage = useSetAtom($page);
  const [searchAtomValue, setSearchQuery] = useAtom($search);
  const [inputValue, setInputValue] = useState(searchAtomValue);

  useEffect(() => {
    setInputValue(searchAtomValue);
  }, [searchAtomValue]);

  return (
    <>
      <div className="m-2 rounded-md border border-gray-200 p-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search">Rechercher {isPending ? '...' : ''}</Label>

          <Input
            id="search"
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={inputValue}
            onChange={e => {
              const newSearch = e.target.value;
              setInputValue(newSearch);
              startTransition(() => {
                setSearchQuery(newSearch);
                setPage(1);
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Suspense fallback={<div className="h-10 animate-pulse bg-gray-400" />}>
          <Pages $page={$page} $take={$take} $prospects={$prospects} />
        </Suspense>

        <div className="flex flex-col gap-4 rounded-lg border border-gray-200">
          <div className="max-h-60 overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <Thead $selection={$selection} $prospects={$prospects} />

              <Suspense
                fallback={
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-4 text-left">
                        <div className="flex items-center justify-center p-4">
                          <LucideLoader2 className="animate-spin" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                }
              >
                <Tbody $prospects={$prospects} $selection={$selection} />
              </Suspense>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
