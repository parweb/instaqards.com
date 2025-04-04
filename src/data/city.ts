export const all = [
  { name: 'quimper', postal: '29000' },
  { name: 'brest', postal: '29200' },
  { name: 'lannion', postal: '22300' },
  { name: 'saint_brieuc', postal: '22000' },
  { name: 'saint_malo', postal: '22300' },
  { name: 'paris', postal: '75000' },
  { name: 'lyon', postal: '69000' },
  { name: 'marseille', postal: '13000' },
  { name: 'nice', postal: '06000' },
  { name: 'nantes', postal: '44000' },
  { name: 'toulouse', postal: '31000' },
  { name: 'strasbourg', postal: '67000' },
  { name: 'rennes', postal: '35000' },
  { name: 'arles', postal: '13100' },
  { name: 'nîmes', postal: '30000' },
  { name: 'toulon', postal: '83000' },
  { name: 'aix_en_provence', postal: '13100' },
  { name: 'bordeaux', postal: '33000' },
  { name: 'lille', postal: '59000' },
  { name: 'deauville', postal: '14800' },
  { name: 'dijon', postal: '21000' },
  { name: 'tours', postal: '37000' }
] as const;

export type City = (typeof all)[number];

export const get = <T extends City['name']>(
  name: T
): Extract<City, { name: T }> => {
  const city = all.find(
    (city): city is Extract<City, { name: T }> => city.name === name
  );

  if (!city) {
    throw new Error(`City with name "${name}" not found`);
  }

  return city;
};
