import { db } from 'helpers/db';

export const all = async () => {
  const cities = await db.city.findMany({
    select: {
      id: true,
      slug: true,
      codePostal: true
    },
    where: {
      population2010: {
        gte: 50000
      }
    }
  });

  return cities;
};
