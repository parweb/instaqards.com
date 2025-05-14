import { db } from 'helpers/db';
import { Map } from './Map';

export default async function ExplorePage() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      location: true
    },
    where: {
      location: {
        not: '{}'
      }
    }
  });

  // Filter users that have valid coordinates in their location data
  const usersWithCoordinates = users.filter(user => {
    try {
      const location = user.location as any;
      return location?.geometry?.coordinates?.length === 2;
    } catch {
      return false;
    }
  });

  return (
    <div className="flex flex-1 self-stretch">
      <Map users={usersWithCoordinates} />
    </div>
  );
}
