import { db } from 'helpers/db';
import { Map } from './Map';
import { Switcher } from './Switcher';
import { List } from './List';

export default async function ExplorePage() {
  const users = await db.user.findMany({
    take: 10,
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
    <Switcher className="flex flex-1 self-stretch">
      <Map users={usersWithCoordinates} />
      <List users={usersWithCoordinates} />
    </Switcher>
  );
}
