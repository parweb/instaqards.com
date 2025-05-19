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

export default async function GroupPage({
  params,
  searchParams
}: {
  params: Promise<{ group: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [group] = (await params).group.split('-');

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
      ...(searchFilter ? [searchFilter] : []),
      {
        user: {
          naf: {
            class: {
              group: {
                id: group
              }
            }
          }
        }
      }
    ]
  };

  const [sites, total] = await db.$transaction([
    db.site.findMany({
      take,
      skip: (page - 1) * take,
      where,
      include: {
        user: {
          include: {
            naf: {
              include: {
                class: {
                  include: {
                    group: {
                      include: { division: { include: { section: true } } }
                    }
                  }
                }
              }
            }
          }
        },
        blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
      }
    }),
    db.site.count({
      where
    })
  ]);

  return (
    <div className="flex-1 flex self-stretch gap-0">
      <div className="relative flex-3/5 flex self-stretch">
        <div className="isolate flex-1 self-stretch flex flex-col absolute inset-0 overflow-y-auto m-0 bg-stone-100">
          <div className="z-10 sticky top-0 bg-stone-100/70 drop-shadow-lg backdrop-blur-md">
            <div className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex-1 self-stretch flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1">
                  <InputSearch />
                </div>

                <div>
                  <ModalButton
                    size="icon"
                    className=" rounded-full"
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

      <div className="hidden sm:flex flex-2/5 self-stretch">
        <Map sites={sites} />
      </div>
    </div>
  );
}
