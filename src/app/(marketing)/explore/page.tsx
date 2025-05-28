import { Prisma } from '@prisma/client';
import type { SearchParams } from 'nuqs/server';
import { LuFilter } from 'react-icons/lu';

import { FilterModal } from 'app/(marketing)/explore/FilterModal';
import { InputSearch } from 'app/(marketing)/explore/InputSearch';
import { List } from 'app/(marketing)/explore/List';
import { Map } from 'app/(marketing)/explore/Map';
import { Pagination } from 'app/(marketing)/explore/Pagination';
import { paginate } from 'app/(marketing)/explore/QuerySchema';
import ModalButton from 'components/modal-button';
import { db } from 'helpers/db';

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, take, search } = paginate(await searchParams);

  const searchFilter =
    search !== ''
      ? {
          OR: [
            {
              subdomain: {
                contains: search,
                mode: Prisma.QueryMode.insensitive
              }
            },
            {
              user: {
                name: { contains: search, mode: Prisma.QueryMode.insensitive }
              }
            },
            {
              user: {
                naf: {
                  title: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive
                  }
                }
              }
            }
          ]
        }
      : undefined;

  const where: Prisma.SiteWhereInput = {
    AND: [
      // {
      //   AND: [
      //     { location: { not: '{}' } },
      //     {
      //       location: {
      //         path: ['geometry', 'coordinates', '0'],
      //         gte: -180,
      //         lte: 180
      //       }
      //     },
      //     {
      //       location: {
      //         path: ['geometry', 'coordinates', '1'],
      //         gte: -180,
      //         lte: 180
      //       }
      //     }
      //   ]
      // },
      ...(searchFilter ? [searchFilter] : [])
    ]
  };

  const [sites, total] = await db.$transaction([
    db.site.findMany({
      take,
      skip: (page - 1) * take,
      where,
      select: {
        id: true,
        background: true,
        blocks: {
          orderBy: [{ position: 'asc' }, { createdAt: 'asc' }]
        },
        user: {
          select: {
            name: true,
            email: true,
            location: true
          }
        }
      }
    }),
    db.site.count({ where })
  ]);

  return (
    <div className="flex flex-1 gap-0 self-stretch">
      <div className="relative flex flex-3/5 self-stretch">
        <div className="absolute inset-0 isolate m-0 flex flex-1 flex-col self-stretch overflow-y-auto bg-stone-100">
          <div className="sticky top-0 z-10 bg-stone-100/70 drop-shadow-lg backdrop-blur-md">
            <div className="flex flex-col items-center justify-between gap-4 p-4 lg:flex-row">
              <div className="flex flex-1 flex-wrap items-center justify-between gap-4 self-stretch">
                <div className="flex-1">
                  <InputSearch />
                </div>

                <div>
                  <ModalButton
                    size="icon"
                    className="rounded-full"
                    label={<LuFilter />}
                  >
                    <FilterModal />
                  </ModalButton>
                </div>
              </div>

              <Pagination total={total} />
            </div>
          </div>

          <List sites={sites} />
        </div>
      </div>

      <div className="hidden flex-2/5 self-stretch sm:flex">
        <Map sites={sites} />
      </div>
    </div>
  );
}
