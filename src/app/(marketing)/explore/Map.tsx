import { User } from '@prisma/client';
import Yolo from 'components/maps/map/Yolo';
import { useMemo } from 'react';

interface MapProps {
  users: Pick<User, 'id' | 'name' | 'email' | 'location'>[];
}

export const Map = ({ users }: MapProps) => {
  const markers = useMemo(() => {
    return users
      .map(user => {
        try {
          const location = user.location as any;
          if (location?.geometry?.coordinates?.length === 2) {
            return {
              id: user.id,
              position: location.geometry.coordinates.reverse() as [number, number],
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
  }, [users]);

  return (
    <div className="flex flex-1 self-stretch aspect-video">
      <Yolo 
        position={[48.8566, 2.3522]} 
        markers={markers}
       
      />
    </div>
  );
};
