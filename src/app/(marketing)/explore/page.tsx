import { LuFilter } from 'react-icons/lu';
import { z } from 'zod';

import ModalButton from 'components/modal-button';
import { Input } from 'components/ui/input';
import { db } from 'helpers/db';
import { FilterModal } from './FilterModal';
import { List } from './List';
import { Map } from './Map';
import { Pagination } from './Pagination';


import './page.css';

const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  take: z.coerce.number().default(9)
});

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{
    page: string;
    take: string;
  }>;
}) {
  const { page, take } = QuerySchema.parse(await searchParams);

  console.log({ page, take, skip: (page - 1) * take });

  const where = {
    location: { not: '{}' },
    AND: [
      {
        location: {
          path: ['geometry', 'coordinates', '0'],
          gte: -180,
          lte: 180
        }
      },
      {
        location: {
          path: ['geometry', 'coordinates', '1'],
          gte: -180,
          lte: 180
        }
      }
    ]
  };

  const [users, total] = await db.$transaction([
    db.user.findMany({
      take,
      skip: (page - 1) * take,
      where
    }),
    db.user.count({
      where
    })
  ]);

  const usersWithCoordinates = users.filter(user => {
    try {
      const location = user.location as any;
      return location?.geometry?.coordinates?.length === 2;
    } catch {
      return false;
    }
  });

  return (
    <div className="flex-1 flex self-stretch gap-0">
      <div className="relative flex-3/5 flex self-stretch">
        <div className="isolate absolute inset-0 overflow-y-auto m-0 bg-stone-100">
          <div className="z-10 sticky top-0 bg-stone-100/70 drop-shadow-lg backdrop-blur-md">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1"><Input
                type="search"
                placeholder="Rechercher"
                className="rounded-full"
              /></div>

              <div>
                <ModalButton size="icon" className=" rounded-full" label={<LuFilter />}>
                  <FilterModal />
                </ModalButton>
              </div>

              <Pagination total={total} />
            </div>
          </div>

          <List users={usersWithCoordinates} />
        </div>
      </div>

      <div className="hidden sm:flex flex-2/5 self-stretch">
        <Map users={usersWithCoordinates} />
      </div>
    </div>
  );
}
