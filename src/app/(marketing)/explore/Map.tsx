import { Prisma } from '@prisma/client';
import { useMemo } from 'react';

import Yolo from 'components/maps/map/Yolo';

interface MapProps {
  // users: Pick<User, 'id' | 'name' | 'email' | 'location'>[];
  sites: Prisma.SiteGetPayload<{
    include: {
      user: {
        include: {
          naf: {
            include: {
              class: {
                include: {
                  group: {
                    include: { division: { include: { section: true } } };
                  };
                };
              };
            };
          };
        };
      };
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] };
    };
  }>[];
}

export const Map = ({ sites }: MapProps) => {
  const markers = useMemo(() => {
    return sites
      .map(site => {
        try {
          const user = site.user;

          const location = user.location as any;
          if (location?.geometry?.coordinates?.length === 2) {
            return {
              id: site.id,
              position: [...location.geometry.coordinates].reverse() as [
                number,
                number
              ],
              name: user.name || user.email
            };
          }
        } catch {
          return null;
        }
        return null;
      })
      .filter(Boolean) as {
      position: [number, number];
      id: string;
      name: string;
    }[];
  }, [sites]);

  const boundsPositions = useMemo(
    (): [number, number][] =>
      markers.length ? markers.map(m => m.position) : [[48.8566, 2.3522]],
    [markers]
  );

  return (
    <div className="flex flex-1 self-stretch">
      <Yolo boundsPositions={boundsPositions} markers={markers} />
    </div>
  );
};
